// ============================================================================
// EVENT HANDLERS
// ============================================================================

const EventHandlers = {
  // Role selection handler
  async handleRoleSelection(role) {
    try {
      await RoleManager.selectRole(role);
    } catch (error) {
      ErrorHandler.handleError(error, 'EventHandlers.handleRoleSelection');
    }
  },

  // Login form handler
  async handleLoginForm(event) {
    event.preventDefault();
    
    try {
      const loginBtn = document.getElementById('loginBtn');
      const username = document.getElementById('ictUsername')?.value || '';
      const password = document.getElementById('ictPassword')?.value || '';
      
      // Set button loading state
      UI.setButtonLoading(loginBtn, true);
      
      // Attempt login
      const result = await Auth.login({ username, password });
      
      if (result.success) {
        UI.closeLoginModal();
        UI.showLoadingOverlay();
        
        setTimeout(() => {
          UI.hideLoadingOverlay();
          RoleManager.initializeRole('ict-admin');
          initICTDashboard(); // Initialize the ICT dashboard with charts and KPI cards
          UI.showNotification('Login successful! Welcome back.', 'success');
        }, 500);
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'EventHandlers.handleLoginForm');
    } finally {
      const loginBtn = document.getElementById('loginBtn');
      UI.setButtonLoading(loginBtn, false);
    }
  },

  // Logout handler
  async handleLogout() {
    try {
      UI.showLoadingOverlay();
      
      setTimeout(() => {
        Auth.logout();
        UI.hideLoadingOverlay();
        UI.showRoleSelection();
        UI.showNotification('Logged out successfully', 'info');
      }, 500);
    } catch (error) {
      ErrorHandler.handleError(error, 'EventHandlers.handleLogout');
    }
  },

  // Modal close handler
  handleModalClose() {
    try {
      UI.closeLoginModal();
    } catch (error) {
      ErrorHandler.handleError(error, 'EventHandlers.handleModalClose');
    }
  },

  // Input validation handlers
  handleInputValidation(event) {
    try {
      const input = event.target;
      const fieldName = input.id;
      const value = input.value.trim();
      
      // Only validate if user has actually entered something
      if (value.length === 0) {
        UI.addInputValidation(input, null); // Clear any existing validation
        return;
      }
      
      if (fieldName === 'ictUsername') {
        try {
          Validation.validateUsername(value);
          UI.clearFieldError(fieldName);
        } catch (error) {
          UI.showFieldError(fieldName, error.message);
        }
      } else if (fieldName === 'ictPassword') {
        try {
          Validation.validatePassword(value);
          UI.clearFieldError(fieldName);
        } catch (error) {
          UI.showFieldError(fieldName, error.message);
        }
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'EventHandlers.handleInputValidation');
    }
  },

  // Keyboard navigation handlers
  handleRoleCardKeydown(event) {
    try {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const role = event.currentTarget.getAttribute('onclick')?.match(/selectRole\('([^']+)'\)/)?.[1];
        if (role) {
          EventHandlers.handleRoleSelection(role);
        }
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'EventHandlers.handleRoleCardKeydown');
    }
  },

  // Focus trap for modal
  handleModalKeydown(event) {
    try {
      const modal = document.getElementById('ictLoginModal');
      if (modal.style.display !== 'flex') return;
      
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'EventHandlers.handleModalKeydown');
    }
  }
};

// ============================================================================
// GLOBAL FUNCTIONS (for HTML onclick handlers)
// ============================================================================

// Role selection function
async function selectRole(role) {
  await EventHandlers.handleRoleSelection(role);
}

// Modal close function
function closeICTLogin() {
  EventHandlers.handleModalClose();
}

// Export for use in other modules
window.EventHandlers = EventHandlers;
window.selectRole = selectRole;
window.closeICTLogin = closeICTLogin;
