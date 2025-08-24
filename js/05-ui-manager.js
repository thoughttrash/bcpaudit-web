// ============================================================================
// UI MANAGEMENT MODULE
// ============================================================================

const UI = {
  // Loading overlay management
  showLoadingOverlay() {
    try {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) {
        overlay.classList.add('show');
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.showLoadingOverlay');
    }
  },

  hideLoadingOverlay() {
    try {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) {
        overlay.classList.remove('show');
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.hideLoadingOverlay');
    }
  },

  // Button loading states
  setButtonLoading(button, isLoading) {
    try {
      if (!button) return;
      
      if (isLoading) {
        button.classList.add('btn-loading');
        button.disabled = true;
      } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.setButtonLoading');
    }
  },

  // Input validation feedback
  showFieldError(fieldName, message) {
    try {
      const field = document.getElementById(fieldName);
      if (field) {
        this.addInputValidation(field, false);
        // Only show notification if we're in the dashboard (not on role selection page)
        if (document.getElementById('mainApp').style.display !== 'none') {
          this.showNotification(message, 'error');
        }
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.showFieldError');
    }
  },

  clearFieldError(fieldName) {
    try {
      const field = document.getElementById(fieldName);
      if (field) {
        this.addInputValidation(field, true);
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.clearFieldError');
    }
  },

  addInputValidation(input, isValid) {
    try {
      if (!input) return;
      
      input.classList.remove('error', 'success');
      if (isValid === true) {
        input.classList.add('success');
      } else if (isValid === false) {
        input.classList.add('error');
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.addInputValidation');
    }
  },

  // Modal management
  showLoginModal() {
    try {
      const modal = document.getElementById('ictLoginModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('modal-enter');
        document.body.classList.add('modal-open');
        
        // Clear any existing notifications to prevent spam
        const notificationContainer = document.getElementById('notification-container');
        if (notificationContainer) {
          notificationContainer.innerHTML = '';
        }
        
        // Focus on username input
        setTimeout(() => {
          const usernameInput = document.getElementById('ictUsername');
          if (usernameInput) {
            usernameInput.focus();
          }
        }, 300);
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.showLoginModal');
    }
  },

  closeLoginModal() {
    try {
      const modal = document.getElementById('ictLoginModal');
      if (modal) {
        modal.classList.remove('modal-enter');
        modal.classList.add('modal-exit');
        
        setTimeout(() => {
          modal.style.display = 'none';
          modal.classList.remove('modal-exit');
          document.body.classList.remove('modal-open');
          
          // Reset form
          const form = document.getElementById('ictLoginForm');
          if (form) {
            form.reset();
          }
          
          // Clear validation states
          document.querySelectorAll('#ictLoginForm .input').forEach(input => {
            this.addInputValidation(input, null);
          });
        }, 200);
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.closeLoginModal');
    }
  },

  // Page transitions
  async transitionToDashboard() {
    try {
      const roleSelection = document.getElementById('roleSelection');
      const mainApp = document.getElementById('mainApp');
      
      if (roleSelection && mainApp) {
        roleSelection.classList.add('page-exit');
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        roleSelection.style.display = 'none';
        mainApp.style.display = 'block';
        mainApp.classList.add('page-enter');
        
        await new Promise(resolve => setTimeout(resolve, 400));
        mainApp.classList.remove('page-enter');
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.transitionToDashboard');
    }
  },

  showRoleSelection() {
    try {
      const roleSelection = document.getElementById('roleSelection');
      const mainApp = document.getElementById('mainApp');
      
      if (roleSelection && mainApp) {
        mainApp.classList.add('page-exit');
        
        setTimeout(() => {
          mainApp.style.display = 'none';
          roleSelection.style.display = 'flex';
          roleSelection.classList.add('page-enter');
          
          setTimeout(() => {
            roleSelection.classList.remove('page-enter');
          }, 400);
        }, 200);
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.showRoleSelection');
    }
  },

  // Header management
  updateHeaderInfo() {
    try {
      const roleElement = document.getElementById('currentRole');
      const breadcrumbElement = document.getElementById('breadcrumbCurrent');
      
      const roleConfig = {
        'ict-admin': { 
          name: 'ICT Administrator', 
          badge: 'ict',
          breadcrumb: 'ICT Admin Dashboard'
        },
        'user': { 
          name: 'User', 
          badge: 'user',
          breadcrumb: 'User Dashboard'
        }
      };
      
      const config = roleConfig[AppState.currentRole];
      if (!config) return;
      
      if (roleElement) {
        roleElement.textContent = config.name;
        roleElement.className = `inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-sm role-badge-enhanced`;
      }
      
      if (breadcrumbElement) {
        breadcrumbElement.textContent = config.breadcrumb;
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.updateHeaderInfo');
    }
  },

  // Content management
  showRoleContent() {
    try {
      // Hide all content sections
      document.querySelectorAll('#ict-content, #user-content').forEach(content => {
        content.style.display = 'none';
      });
      
      // Show the current role's content
      const contentId = AppState.currentRole === 'ict-admin' ? 'ict-content' : 'user-content';
      const roleContent = document.getElementById(contentId);
      
      if (roleContent) {
        roleContent.style.display = 'block';
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.showRoleContent');
    }
  },

  // Notification system
  showNotification(message, type = 'info', duration = 4000) {
    try {
      const container = document.getElementById('notification-container');
      if (!container) return;
      
      const notification = document.createElement('div');
      
      const colors = {
        success: 'notification success',
        error: 'notification error', 
        warning: 'notification warning',
        info: 'notification info'
      };
      
      notification.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300`;
      notification.innerHTML = `
        <div class="flex items-center justify-between">
          <span>${message}</span>
          <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200 transition-colors">×</button>
        </div>
      `;
      
      container.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      // Auto remove
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    } catch (error) {
      ErrorHandler.handleError(error, 'UI.showNotification');
    }
  }
};

// Export for use in other modules
window.UI = UI;
