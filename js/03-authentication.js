// ============================================================================
// AUTHENTICATION MODULE
// ============================================================================

const Auth = {
  // Demo credentials (fallback when API is unavailable)
  demoCredentials: {
    username: 'admin',
    password: 'admin123'
  },

  async login(credentials) {
    try {
      // Validate input
      if (!Validation || !Validation.validateLoginForm) {
        throw new Error('Validation module not available');
      }
      
      const validatedCredentials = Validation.validateLoginForm(credentials);
      
      // Check if we're in offline mode or API is unavailable
      if (!ApiService || !ApiService.isOfflineMode) {
        return this.demoLogin(validatedCredentials);
      }
      
      if (ApiService.isOfflineMode()) {
        return this.demoLogin(validatedCredentials);
      }

      // Try API login first
      try {
        const response = await ApiService.login(validatedCredentials);
        
        // Update app state
        if (AppState) {
          AppState.isAuthenticated = true;
          AppState.currentUser = response.user || validatedCredentials.username;
        }
        
        return { success: true, user: response.user || validatedCredentials.username };
        
      } catch (apiError) {
        // Only log non-network errors
        if (!apiError.message.includes('Network unavailable')) {
          console.warn('API login failed, falling back to demo authentication');
        }
        
        // Fallback to demo authentication
        return this.demoLogin(validatedCredentials);
      }
      
    } catch (error) {
      throw error;
    }
  },

  // Demo authentication fallback
  demoLogin(credentials) {
    // Simulate API call with minimal delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.authenticateUser(credentials)) {
          if (AppState) {
            AppState.isAuthenticated = true;
            AppState.currentUser = credentials.username;
          }
          resolve({ success: true, user: credentials.username });
        } else {
          reject(new AuthError('Invalid username or password'));
        }
      }, 200); // Reduced from 1000ms to 200ms
    });
  },

  authenticateUser(credentials) {
    return credentials.username === this.demoCredentials.username &&
           credentials.password === this.demoCredentials.password;
  },

  async logout() {
    try {
      // Try API logout if available
      if (!ApiService.isOfflineMode()) {
        try {
          await ApiService.logout();
        } catch (apiError) {
          console.warn('API logout failed:', apiError);
        }
      }

      // Clear local state
      AppState.isAuthenticated = false;
      AppState.currentUser = null;
      AppState.currentRole = null;
      
      // Clear auth token
      ApiService.clearAuthToken();
      
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

  // Check if user session is still valid
  async validateSession() {
    try {
      if (ApiService.isOfflineMode()) {
        // In offline mode, just check local state
        return AppState.isAuthenticated;
      }

      // Try to get current user from API
      const user = await ApiService.getCurrentUser();
      if (user) {
        AppState.currentUser = user.username || user.name;
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Session validation failed:', error);
      return false;
    }
  },

  // Refresh authentication token
  async refreshToken() {
    try {
      if (ApiService.isOfflineMode()) {
        return true; // No token refresh needed in offline mode
      }

      const response = await ApiService.refreshToken();
      return response.success;
    } catch (error) {
      console.warn('Token refresh failed:', error);
      return false;
    }
  },

  // Get user profile
  async getUserProfile() {
    try {
      if (ApiService.isOfflineMode()) {
        // Return demo profile
        return {
          id: 1,
          username: 'admin',
          name: 'ICT Administrator',
          email: 'admin@hospital.com',
          role: 'ict-admin',
          department: 'Information Technology',
          lastLogin: new Date().toISOString()
        };
      }

      return await ApiService.getCurrentUser();
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      if (ApiService.isOfflineMode()) {
        // In offline mode, just update local state
        AppState.currentUser = profileData.name || AppState.currentUser;
        return { success: true, message: 'Profile updated (offline mode)' };
      }

      const response = await ApiService.updateProfile(profileData);
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // Check if user has specific permissions
  hasPermission(permission) {
    const userRole = AppState.currentRole;
    
    // Define role-based permissions
    const permissions = {
      'ict-admin': [
        'view_dashboard',
        'manage_forms',
        'manage_departments',
        'create_audits',
        'generate_reports',
        'manage_users',
        'view_analytics'
      ],
      'user': [
        'view_dashboard',
        'view_forms',
        'submit_feedback',
        'view_reports'
      ]
    };

    return permissions[userRole]?.includes(permission) || false;
  },

  // Get user's accessible departments
  getAccessibleDepartments() {
    const userRole = AppState.currentRole;
    
    if (userRole === 'ict-admin') {
      // ICT admins can access all departments
      return DataService.getCurrentData().departments;
    } else {
      // Regular users might have limited access
      // This could be expanded based on user profile
      return DataService.getCurrentData().departments.filter(dept => 
        dept.name === 'General Ward' || dept.name === 'Emergency Department'
      );
    }
  },

  // Simulate API delay (for demo purposes)
  simulateApiCall() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Export for use in other modules
window.Auth = Auth;
