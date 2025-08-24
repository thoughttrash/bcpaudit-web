// ============================================================================
// ROLE MANAGEMENT MODULE
// ============================================================================

const RoleManager = {
  async selectRole(role) {
    try {
      const validatedRole = Validation.validateRole(role);
      
      if (validatedRole === 'ict-admin') {
        await this.handleICTAdminRole();
      } else {
        await this.handleUserRole();
      }
      
      AppState.currentRole = validatedRole;
      return { success: true, role: validatedRole };
    } catch (error) {
      ErrorHandler.handleError(error, 'RoleManager.selectRole');
      throw error;
    }
  },

  async handleICTAdminRole() {
    try {
      // Show login modal for ICT admin
      UI.showLoginModal();
      return { success: true };
    } catch (error) {
      ErrorHandler.handleError(error, 'RoleManager.handleICTAdminRole');
      throw error;
    }
  },

  async handleUserRole() {
    try {
      // Direct access for regular users
      UI.showLoadingOverlay();
      await this.simulateLoading();
      UI.hideLoadingOverlay();
      
      await this.initializeRole('user');
      return { success: true };
    } catch (error) {
      ErrorHandler.handleError(error, 'RoleManager.handleUserRole');
      throw error;
    }
  },

  async initializeRole(role) {
    try {
      AppState.currentRole = role;
      AppState.currentUser = role === 'ict-admin' ? 'ICT Administrator' : 'User';
      
      await UI.transitionToDashboard();
      UI.updateHeaderInfo();
      UI.showRoleContent();
      
      return { success: true };
    } catch (error) {
      ErrorHandler.handleError(error, 'RoleManager.initializeRole');
      throw error;
    }
  },

  getCurrentRole() {
    return AppState.currentRole;
  },

  // Simulate loading delay
  simulateLoading() {
    return new Promise(resolve => setTimeout(resolve, 800));
  }
};

// Export for use in other modules
window.RoleManager = RoleManager;

