// Simple session storage that works with serverless environments
// In production, this should be replaced with a proper database or Redis

interface SessionData {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  expiresAt: number;
  createdAt: number;
}

// In-memory store for development
// In production, this should be replaced with a database
const sessionStore = new Map<string, SessionData>();

export const SessionStore = {
  // Create a new session
  create: (userId: string, email: string, role: 'user' | 'admin'): string => {
    const sessionId = generateSessionId();
    const sessionData: SessionData = {
      userId,
      email,
      role,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: Date.now()
    };
    
    sessionStore.set(sessionId, sessionData);
    console.log('🔍 Session created:', sessionId, 'for user:', email, 'role:', role);
    return sessionId;
  },

  // Get session data
  get: (sessionId: string): SessionData | null => {
    const session = sessionStore.get(sessionId);
    
    if (!session) {
      console.log('🔍 Session not found:', sessionId);
      return null;
    }
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      console.log('🔍 Session expired:', sessionId);
      sessionStore.delete(sessionId);
      return null;
    }
    
    console.log('🔍 Session found:', sessionId, 'for user:', session.email, 'role:', session.role);
    return session;
  },

  // Delete session
  delete: (sessionId: string): boolean => {
    const deleted = sessionStore.delete(sessionId);
    console.log('🔍 Session deleted:', sessionId, 'success:', deleted);
    return deleted;
  },

  // Clean up expired sessions
  cleanup: (): void => {
    const now = Date.now();
    for (const [sessionId, session] of sessionStore.entries()) {
      if (now > session.expiresAt) {
        sessionStore.delete(sessionId);
      }
    }
  },

  // Get all sessions (for debugging)
  getAll: (): Array<[string, SessionData]> => {
    return Array.from(sessionStore.entries());
  }
};

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
