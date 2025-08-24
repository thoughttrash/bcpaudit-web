// ============================================================================
// AUTHENTICATION MODULE
// ============================================================================

const Auth = {
  // Demo credentials (in real app, this would be server-side)
  validCredentials: {
    username: 'admin',
    password: 'admin123'
  },

  async login(credentials) {
    try {
      // Validate input
      const validatedCredentials = Validation.validateLoginForm(credentials);
      
      // Simulate API call delay
      await this.simulateApiCall();
      
      // Check credentials
      if (this.authenticateUser(validatedCredentials)) {
        AppState.isAuthenticated = true;
        AppState.currentUser = validatedCredentials.username;
        return { success: true, user: validatedCredentials.username };
      } else {
        throw new AuthError('Invalid username or password');
      }
    } catch (error) {
      throw error;
    }
  },

  authenticateUser(credentials) {
    return credentials.username === this.validCredentials.username &&
           credentials.password === this.validCredentials.password;
  },

  logout() {
    try {
      AppState.isAuthenticated = false;
      AppState.currentUser = null;
      AppState.currentRole = null;
      return { success: true };
    } catch (error) {
      ErrorHandler.handleError(error, 'Auth.logout');
      throw error;
    }
  },

  isAuthenticated() {
    return AppState.isAuthenticated;
  },

  getCurrentUser() {
    return AppState.currentUser;
  },

  // Simulate API delay
  simulateApiCall() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Export for use in other modules
window.Auth = Auth;
