# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Project Overview

Planning Poker Agile is a real-time collaborative estimation tool built with React, TypeScript, and Firebase. Users authenticate via Google, create poker planning sessions, and vote on story points in real-time. The application includes a ChatGPT-powered assistant that provides humorous commentary on voting results.

## Development Commands

### Frontend Development

```bash
# Install dependencies
yarn

# Start development server (http://localhost:5173)
yarn dev

# Build for production
yarn build

# Lint code
yarn lint

# Preview production build
yarn preview
```

### Firebase Functions

```bash
# Navigate to functions directory and build
cd functions && npm run build

# Build with watch mode
npm run build:watch

# Deploy functions
npm run deploy

# View function logs
npm run logs
```

### Firebase Emulators

```bash
# Start all emulators
firebase emulators:start

# Serve functions only
cd functions && npm run serve
```

## Architecture

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Bootstrap 5, Styled Components
- **Backend**: Firebase (Auth, Firestore, Realtime Database, Functions, Storage)
- **i18n**: react-i18n-lite (supports pt-BR and en-US)
- **Routing**: react-router-dom

### Firebase Services Usage

**Firestore** (Document Database):

- `rooms` collection: stores room metadata (id, createdBy, createdAt, participants[], showVotes)
- `rooms/{roomId}/votes` subcollection: stores individual votes
- `users` collection: stores user profiles with state and colorScheme

**Realtime Database**:

- `presence/{roomId}/{userId}`: tracks online/offline status for real-time presence
- Used for ephemeral connection status that needs instant updates

**Firebase Functions**:

- `onUserUpdate`: Database trigger that updates Firestore user state when presence changes
- `chatAssistant`: HTTPS callable function that sends votes to OpenAI and returns humorous commentary

### Core Data Flow

1. **Authentication**: Google OAuth via Firebase Auth
2. **Room Creation**: User creates room → stored in Firestore with participants array
3. **Real-time Updates**:
   - Presence tracked in Realtime Database
   - Room data and votes synced via Firestore listeners (onSnapshot)
4. **Voting**:
   - Votes stored in `rooms/{roomId}/votes/{userId}` subcollection
   - `showVotes` flag in room doc controls visibility
5. **AI Assistant**: Triggered when votes are shown, sends vote array to OpenAI function

### Context Architecture

**UserContext** (`src/context/UserContext.tsx`):

- Stores current user data (Participant object)
- Persisted to localStorage
- Used for managing user profile across components

**ThemeContext** (`src/context/ThemeContext.tsx`):

- Manages light/dark theme with system preference detection
- Persisted to localStorage
- Syncs with Bootstrap's data-bs-theme attribute

### Key Custom Hooks

**useParticipants** (`src/hooks/useParticipants.ts`):

- Manages room participants list
- Handles Firestore's 10-item limit for `in` queries by chunking participant arrays
- Fetches presence status from Realtime Database
- Enforces room capacity limits

**useVotes** (`src/hooks/useVotes.ts`):

- Real-time vote synchronization via Firestore listeners
- Handles vote toggling (clicking same value removes vote)
- Manages showVotes flag for revealing/hiding votes
- Clear votes functionality

**useRoom** (`src/hooks/useRoom.ts`):

- Room existence validation
- Room deletion (owner only)
- Fetch rooms by user ID

**useAuth** (`src/hooks/useAuth.ts`):

- Google authentication flow
- User presence management in Realtime Database

### Environment Configuration

Copy `.env.dist` to `.env.local` and configure:

- Firebase project settings (API key, project ID, etc.)
- `VITE_RECAPTCHA_SITE_KEY` for production App Check
- OpenAI API key in `functions/.env` for ChatGPT assistant

### Development vs Production

**Development mode** (`import.meta.env.DEV`):

- Firebase emulators connected at localhost
- Auth: 127.0.0.1:5005
- Firestore: localhost:8080
- Realtime Database: localhost:9000
- Storage: localhost:9199
- Functions: localhost:5001

**Production mode**:

- Uses Firebase App Check with reCAPTCHA v3
- Functions deployed to us-central1 region

## Code Patterns

### Firebase Listeners

Always clean up Firestore listeners in useEffect:

```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    // handle data
  });
  return () => unsubscribe();
}, [deps]);
```

### Firestore Queries with >10 Items

Use chunking pattern from `useParticipants.fetchUsersByParticipants` when querying with `in` operator on arrays >10 items.

### i18n Usage

```typescript
const { t } = useTranslation();
t('votes.errorClearingVotes'); // Keys defined in src/locales/
```

### Styled Components

Component-specific styles in `.styles.ts` files (e.g., `PokerRoom.styles.ts`)

## Important Notes

- **Node Version**: Functions require Node 22 (see `functions/package.json`)
- **Yarn**: Project uses Yarn package manager (not npm) for frontend
- **Firebase Region**: All functions must use `us-central1` region
- **Translation Files**: Located in `src/locales/` (pt-BR.json, en-US.json)
- **SVG Support**: Project uses `vite-plugin-svgr` for SVG imports as React components
