// Production-safe session storage using Supabase
// Sessions persist across server restarts and work with multiple instances
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SESSION_EXPIRY_HOURS = 7 * 24; // 7 days

export async function createAdminSession(): Promise<string> {
  // Generate a cryptographically secure random token
  const timestamp = Date.now().toString(36);
  const randomPart1 = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  const randomPart3 = Math.random().toString(36).substring(2, 15);
  const token = `${timestamp}-${randomPart1}-${randomPart2}-${randomPart3}`;
  
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();
  
  // Store session in Supabase
  const { error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({
      token: token,
      expires_at: expiresAt,
    } as any);
  
  if (error) {
    console.error('Failed to create admin session:', error);
    throw new Error('Failed to create session');
  }
  
  return token;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('expires_at')
      .eq('token', token)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    // Check if session is expired
    const expiresAt = new Date((data as any).expires_at).getTime();
    if (expiresAt < Date.now()) {
      // Clean up expired session
      await invalidateAdminToken(token);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return false;
  }
}

export async function invalidateAdminToken(token: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('token', token);
    
    if (error) {
      console.error('Failed to invalidate admin token:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error invalidating admin token:', error);
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env['ADMIN_PASSWORD'];
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable not set");
    return false;
  }
  return password === adminPassword;
}

// Clean up expired sessions periodically (called by a scheduled job)
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) {
      console.error('Failed to cleanup expired sessions:', error);
    }
  } catch (error) {
    console.error('Error in session cleanup:', error);
  }
}
