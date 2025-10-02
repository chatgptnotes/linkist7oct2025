// Database-backed session storage using Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SessionData {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  expiresAt: number;
  createdAt: number;
}

export const SessionStore = {
  // Create a new session
  create: async (userId: string, email: string, role: 'user' | 'admin'): Promise<string> => {
    const sessionId = generateSessionId();
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          session_id: sessionId,
          user_id: userId,
          email: email,
          role: role,
          expires_at: new Date(expiresAt).toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      console.log('✅ Session created in DB:', sessionId, 'for user:', email);
      return sessionId;
    } catch (error) {
      console.error('Session creation failed:', error);
      throw error;
    }
  },

  // Get session data
  get: async (sessionId: string): Promise<SessionData | null> => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error || !data) {
        return null;
      }

      const expiresAt = new Date(data.expires_at).getTime();

      // Check if session has expired
      if (Date.now() > expiresAt) {
        await supabase.from('user_sessions').delete().eq('session_id', sessionId);
        return null;
      }

      return {
        userId: data.user_id,
        email: data.email,
        role: data.role,
        expiresAt: expiresAt,
        createdAt: new Date(data.created_at).getTime()
      };
    } catch (error) {
      console.error('Session retrieval failed:', error);
      return null;
    }
  },

  // Delete session
  delete: async (sessionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', sessionId);

      return !error;
    } catch (error) {
      console.error('Session deletion failed:', error);
      return false;
    }
  },

  // Clean up expired sessions
  cleanup: async (): Promise<void> => {
    try {
      await supabase
        .from('user_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Session cleanup failed:', error);
    }
  },

  // Get all sessions (for debugging)
  getAll: async (): Promise<Array<[string, SessionData]>> => {
    try {
      const { data } = await supabase.from('user_sessions').select('*');
      if (!data) return [];

      return data.map(session => [
        session.session_id,
        {
          userId: session.user_id,
          email: session.email,
          role: session.role,
          expiresAt: new Date(session.expires_at).getTime(),
          createdAt: new Date(session.created_at).getTime()
        }
      ]);
    } catch (error) {
      console.error('Get all sessions failed:', error);
      return [];
    }
  }
};

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
