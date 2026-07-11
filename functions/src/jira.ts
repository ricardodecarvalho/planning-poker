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

interface Creds {
  domain: string;
  email: string;
  token: string;
  fieldId?: string;
}

const requireCreds = (d: Partial<Creds>) => {
  if (!d.domain || !d.email || !d.token) {
    throw new HttpsError('invalid-argument', 'Missing Jira credentials.');
  }
};

const normalizeDomain = (domain: string) =>
  (domain || '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

const authHeader = (email: string, token: string) =>
  'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');

const buildContext = (domain: string, email: string, token: string) => ({
  base: `https://${normalizeDomain(domain)}`,
  headers: {
    Authorization: authHeader(email, token),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  } as Record<string, string>,
});

// Reads Jira's error body (errorMessages / errors) so we surface the real
// reason instead of a bare status. Never contains credentials.
const readJiraError = async (res: Response): Promise<string> => {
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      const msgs = [
        ...(json.errorMessages ?? []),
        ...Object.values(json.errors ?? {}),
      ];
      return (msgs.length ? msgs.join('; ') : text).slice(0, 400);
    } catch {
      return text.slice(0, 400);
    }
  } catch {
    return '';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getJson = async (
  url: string,
  headers: Record<string, string>,
  label: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const detail = await readJiraError(res);
    console.error(`${label} failed`, res.status, detail);
    throw new HttpsError(
      'permission-denied',
      `${label} failed (${res.status}): ${detail}`,
    );
  }
  return res.json();
};

const discoverStoryPointsField = async (
  base: string,
  headers: Record<string, string>,
): Promise<string | undefined> => {
  const fields = await getJson(
    `${base}/rest/api/3/field`,
    headers,
    'Jira field lookup',
  );
  const match = fields.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) =>
      STORY_POINT_NAMES.includes(f?.name) ||
      f?.schema?.custom === STORY_POINT_SCHEMA,
  );
  return match?.id;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapIssue = (issue: any, spField?: string) => ({
  jiraId: issue.id,
  key: issue.key,
  summary: issue.fields?.summary ?? '',
  type: issue.fields?.issuetype?.name ?? '',
  points: spField ? (issue.fields?.[spField] ?? null) : null,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fail = (error: any): never => {
  if (error instanceof HttpsError) throw error;
  console.error('jira proxy error:', (error as Error).message);
  throw new HttpsError('internal', 'Failed to reach Jira.');
};

/** List projects the account can access. */
export const jiraProjects = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);
  const d = request.data as Creds;
  requireCreds(d);
  const { base, headers } = buildContext(d.domain, d.email, d.token);
  try {
    const data = await getJson(
      `${base}/rest/api/3/project/search?maxResults=100&orderBy=name`,
      headers,
      'Jira projects',
    );
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projects: (data.values ?? []).map((p: any) => ({
        id: p.id,
        key: p.key,
        name: p.name,
      })),
    };
  } catch (error) {
    return fail(error);
  }
});

/** List agile boards for a project. */
export const jiraBoards = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);
  const d = request.data as Creds & { projectKeyOrId?: string };
  requireCreds(d);
  if (!d.projectKeyOrId) {
    throw new HttpsError('invalid-argument', 'Missing project.');
  }
  const { base, headers } = buildContext(d.domain, d.email, d.token);
  try {
    const data = await getJson(
      `${base}/rest/agile/1.0/board?projectKeyOrId=${encodeURIComponent(
        d.projectKeyOrId,
      )}&maxResults=50`,
      headers,
      'Jira boards',
    );
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      boards: (data.values ?? []).map((b: any) => ({
        id: b.id,
        name: b.name,
        type: b.type,
      })),
    };
  } catch (error) {
    return fail(error);
  }
});

/** List active + future sprints of a board (empty for boards without sprints). */
export const jiraSprints = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);
  const d = request.data as Creds & { boardId?: number };
  requireCreds(d);
  if (!d.boardId) {
    throw new HttpsError('invalid-argument', 'Missing board.');
  }
  const { base, headers } = buildContext(d.domain, d.email, d.token);
  try {
    // Kanban boards don't support sprints — return empty instead of failing.
    const res = await fetch(
      `${base}/rest/agile/1.0/board/${d.boardId}/sprint?state=active,future&maxResults=50`,
      { headers },
    );
    if (!res.ok) return { sprints: [] };
    const data = await res.json();
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sprints: (data.values ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        state: s.state,
      })),
    };
  } catch (error) {
    return fail(error);
  }
});

/**
 * Fetch the issues to estimate from a board: a specific sprint, the scrum
 * backlog, or (Kanban / no backlog) all board issues. Defaults to excluding
 * Done items ("statusCategory != Done") so only work still to estimate shows.
 */
export const jiraBoardIssues = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);
  const d = request.data as Creds & {
    boardId?: number;
    sprintId?: number;
    jql?: string;
  };
  requireCreds(d);
  if (!d.boardId) {
    throw new HttpsError('invalid-argument', 'Missing board.');
  }
  const { base, headers } = buildContext(d.domain, d.email, d.token);
  try {
    const spField =
      d.fieldId || (await discoverStoryPointsField(base, headers));
    const fieldsParam = [
      'summary',
      'issuetype',
      ...(spField ? [spField] : []),
    ].join(',');
    const jql = d.jql?.trim() || 'statusCategory != Done';
    const query =
      `maxResults=50&fields=${encodeURIComponent(fieldsParam)}` +
      `&jql=${encodeURIComponent(jql)}`;

    const boardUrl = `${base}/rest/agile/1.0/board/${d.boardId}`;
    let res: Response;
    if (d.sprintId) {
      res = await fetch(`${boardUrl}/sprint/${d.sprintId}/issue?${query}`, {
        headers,
      });
    } else {
      // Scrum boards have a backlog; Kanban/other boards don't — fall back to
      // all board issues so any board type works.
      res = await fetch(`${boardUrl}/backlog?${query}`, { headers });
      if (!res.ok) {
        res = await fetch(`${boardUrl}/issue?${query}`, { headers });
      }
    }
    if (!res.ok) {
      const detail = await readJiraError(res);
      console.error('jira board issues failed', res.status, detail);
      throw new HttpsError(
        'permission-denied',
        `Jira issues failed (${res.status}): ${detail}`,
      );
    }
    const data = await res.json();
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      issues: (data.issues ?? []).map((i: any) => mapIssue(i, spField)),
      storyPointsFieldId: spField ?? null,
    };
  } catch (error) {
    return fail(error);
  }
});

/** Fetch issues via JQL (project-scoped or manual/advanced). */
export const jiraSearch = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);
  const d = request.data as Creds & { jql?: string };
  requireCreds(d);
  const { base, headers } = buildContext(d.domain, d.email, d.token);
  try {
    const spField =
      d.fieldId || (await discoverStoryPointsField(base, headers));

    const searchRes = await fetch(`${base}/rest/api/3/search/jql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        // Jira Cloud rejects unbounded queries ("add a search restriction"),
        // so the fallback is time-bounded.
        jql: d.jql?.trim() || 'updated >= -30d ORDER BY updated DESC',
        maxResults: 50,
        fields: ['summary', 'issuetype', ...(spField ? [spField] : [])],
      }),
    });

    if (!searchRes.ok) {
      const detail = await readJiraError(searchRes);
      console.error('jira search failed', searchRes.status, detail);
      throw new HttpsError(
        'permission-denied',
        `Jira search failed (${searchRes.status}): ${detail}`,
      );
    }

    const data = await searchRes.json();
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      issues: (data.issues ?? []).map((i: any) => mapIssue(i, spField)),
      storyPointsFieldId: spField ?? null,
    };
  } catch (error) {
    return fail(error);
  }
});

/** Write a story-point estimate back to a Jira issue. */
export const jiraSetEstimate = onCall({ region: REGION }, async (request) => {
  requireAppCheck(request);
  const d = request.data as Creds & {
    issueId: string;
    points: number;
    fieldId: string;
  };
  requireCreds(d);
  if (!d.issueId || !d.fieldId) {
    throw new HttpsError('invalid-argument', 'Missing Jira parameters.');
  }
  const { base, headers } = buildContext(d.domain, d.email, d.token);
  try {
    const res = await fetch(`${base}/rest/api/3/issue/${d.issueId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ fields: { [d.fieldId]: Number(d.points) } }),
    });
    if (!res.ok) {
      const detail = await readJiraError(res);
      console.error('jira update failed', res.status, detail);
      throw new HttpsError(
        'permission-denied',
        `Jira update failed (${res.status}): ${detail}`,
      );
    }
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
});
