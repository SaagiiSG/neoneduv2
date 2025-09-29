import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { AuthContext } from './types';
import type { Session, User } from '@supabase/supabase-js';

export async function authenticateRequest(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res: response });
    
    // Check for Authorization header first
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Verify the token and get session
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError) {
        console.error('Token validation error:', userError);
        return { error: 'Invalid token', status: 401 };
      }
      
      if (!user) {
        return { error: 'Invalid user', status: 401 };
      }

      // Get the session with the token
      const { data: { session: tokenSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !tokenSession) {
        return { error: 'Invalid session', status: 401 };
      }
      
      return { session: tokenSession, user, response };
    }
    
    // Fallback to session-based auth
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth error:', error);
      return { error: 'Authentication failed', status: 401 };
    }

    if (!session) {
      return { error: 'No session found', status: 401 };
    }

    // Check if session is expired (optional additional check)
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      return { error: 'Session expired', status: 401 };
    }

    return { session, user: session.user, response };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Internal server error', status: 500 };
  }
}

export function createAuthenticatedHandler(
  handler: (request: NextRequest, context: { session: Session; user: User }) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authenticateRequest(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    return handler(request, { 
      session: authResult.session!, 
      user: authResult.user! 
    });
  };
}
