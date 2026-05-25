/** User-safe message when MongoDB Atlas is unreachable (e.g. IP whitelist). */
export function formatDbConnectionError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (
    msg.includes('whitelist') ||
    msg.includes('Could not connect to any servers') ||
    msg.includes('Server selection timed out')
  ) {
    return (
      'Database is temporarily unavailable. The school admin must allow network access in MongoDB Atlas (Network Access → Add IP → Allow access from anywhere 0.0.0.0/0).'
    );
  }
  return msg || 'Database connection failed';
}
