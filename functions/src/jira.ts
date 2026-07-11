import {
  onCall,
  HttpsError,
  CallableRequest,
} from 'firebase-functions/v2/https';

const REGION = 'us-central1';

/**
 * Jira Cloud proxy functions.
 *
 * The browser cannot call the Jira Cloud REST API directly (no CORS for
 * API-token auth), so the client sends the owner's credentials here per
 * request. The token is used only to build the Authorization header for the
 * upstream call and is NEVER persisted or logged — it lives only in the
 * owner's browser (localStorage) and transits this function in memory.
 */

// Story-point field names/schema across team- and company-managed projects.
const STORY_POINT_NAMES = ['Story point estimate', 'Story Points'];
const STORY_POINT_SCHEMA = 'com.pyxis.greenhopper.jira:jsw-story-points';

const requireAppCheck = (request: CallableRequest) => {
  if (!request.app) {
    throw new HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.',
    );
  }
};

const normalizeDomain = (domain: string) =>
  (domain || '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

const authHeader = (email: string, token: string) =>
  'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');

interface JiraSearchData {
  domain: string;
  email: string;
  token: string;
  jql?: string;
  fieldId?: string;
}

interface JiraSetEstimateData {
  domain: string;
  email: string;
  token: string;
  issueId: string;
  points: number;
  fieldId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const discoverStoryPointsField = async (
  base: string,
  headers: Record<string, string>,
): Promise<string | undefined> => {
  const res = await fetch(`${base}/rest/api/3/field`, { headers });
  if (!res.ok) {
    throw new HttpsError(
      'permission-denied',
      `Jira field lookup failed (${res.status})`,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = (await res.json()) as any[];
  const match = fields.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) =>
      STORY_POINT_NAMES.includes(f?.name) ||
      f?.schema?.custom === STORY_POINT_SCHEMA,
  );
  return match?.id;
};

export const jiraSearch = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);

  const { domain, email, token, jql, fieldId } = request.data as JiraSearchData;

  if (!domain || !email || !token) {
    throw new HttpsError('invalid-argument', 'Missing Jira credentials.');
  }

  const base = `https://${normalizeDomain(domain)}`;
  const headers = {
    Authorization: authHeader(email, token),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const storyPointsFieldId =
      fieldId || (await discoverStoryPointsField(base, headers));

    const searchRes = await fetch(`${base}/rest/api/3/search/jql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jql: jql?.trim() || 'order by created DESC',
        maxResults: 50,
        fields: [
          'summary',
          'issuetype',
          ...(storyPointsFieldId ? [storyPointsFieldId] : []),
        ],
      }),
    });

    if (!searchRes.ok) {
      throw new HttpsError(
        'permission-denied',
        `Jira search failed (${searchRes.status})`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await searchRes.json()) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const issues = (data.issues ?? []).map((issue: any) => ({
      jiraId: issue.id,
      key: issue.key,
      summary: issue.fields?.summary ?? '',
      type: issue.fields?.issuetype?.name ?? '',
      points: storyPointsFieldId
        ? (issue.fields?.[storyPointsFieldId] ?? null)
        : null,
    }));

    return { issues, storyPointsFieldId: storyPointsFieldId ?? null };
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    // Log the message only — never the credentials/headers.
    console.error('jiraSearch error:', (error as Error).message);
    throw new HttpsError('internal', 'Failed to reach Jira.');
  }
});

export const jiraSetEstimate = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);

  const { domain, email, token, issueId, points, fieldId } =
    request.data as JiraSetEstimateData;

  if (!domain || !email || !token || !issueId || !fieldId) {
    throw new HttpsError('invalid-argument', 'Missing Jira parameters.');
  }

  const base = `https://${normalizeDomain(domain)}`;

  try {
    const res = await fetch(`${base}/rest/api/3/issue/${issueId}`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader(email, token),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: { [fieldId]: Number(points) } }),
    });

    if (!res.ok) {
      throw new HttpsError(
        'permission-denied',
        `Jira update failed (${res.status})`,
      );
    }

    return { ok: true };
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.error('jiraSetEstimate error:', (error as Error).message);
    throw new HttpsError('internal', 'Failed to update Jira.');
  }
});
