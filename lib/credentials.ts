/** Apply username/password/loginEnabled updates for student/staff portal accounts. */
export function applyPortalCredentials(
  record: { password?: string; loginEnabled?: boolean },
  input: { username?: string; password?: string; loginEnabled?: boolean }
): void {
  if (input.username) {
    record.username = input.username;
  }

  if (input.password) {
    record.password = input.password;
    // Auto-enable login when a password is assigned (unless explicitly disabled)
    if (input.loginEnabled !== false) {
      record.loginEnabled = true;
    }
  }

  if (input.loginEnabled !== undefined) {
    record.loginEnabled = input.loginEnabled;
  }
}
