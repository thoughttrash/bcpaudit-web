// ============================================================================
// APP INITIALIZATION
// ============================================================================

const App = {
  async init() {
    try {
      // Add animation complete class after page load
      setTimeout(() => {
        document.body.classList.add('animation-complete');
        document.documentElement.classList.add('animation-complete');
      }, 600);
      
      // Initialize event listeners
      this.initializeEventListeners();
      
      // Show role selection initially
      UI.showRoleSelection();
      
      // Set initial navigation active state (Dashboard should be active by default)
      this.setInitialActiveState();
      
    } catch (error) {
      ErrorHandler.handleError(error, 'App.init');
    }
  },

  initializeEventListeners() {
    try {
      // Login form
      const loginForm = document.getElementById('ictLoginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', EventHandlers.handleLoginForm.bind(this));
      }

      // Input validation - use blur for better UX
      const usernameInput = document.getElementById('ictUsername');
      const passwordInput = document.getElementById('ictPassword');
      
      if (usernameInput) {
        // Debounced validation for better UX
        const debouncedUsernameValidation = debounce(EventHandlers.handleInputValidation.bind(this), 500);
        usernameInput.addEventListener('blur', EventHandlers.handleInputValidation.bind(this));
        usernameInput.addEventListener('input', (e) => {
          // Only validate on input if user has typed at least 3 characters
          if (e.target.value.length >= 3) {
            debouncedUsernameValidation(e);
          } else if (e.target.value.length === 0) {
            UI.addInputValidation(e.target, null); // Clear validation
          }
        });
      }
      
      if (passwordInput) {
        // Debounced validation for better UX
        const debouncedPasswordValidation = debounce(EventHandlers.handleInputValidation.bind(this), 500);
        passwordInput.addEventListener('blur', EventHandlers.handleInputValidation.bind(this));
        passwordInput.addEventListener('input', (e) => {
          // Only validate on input if user has typed at least 6 characters
          if (e.target.value.length >= 6) {
            debouncedPasswordValidation(e);
          } else if (e.target.value.length === 0) {
            UI.addInputValidation(e.target, null); // Clear validation
          }
        });
      }

      // Logout button
      const logoutBtn = document.getElementById('btnLogout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', EventHandlers.handleLogout.bind(this));
      }

      // Modal close on outside click
      const loginModal = document.getElementById('ictLoginModal');
      if (loginModal) {
        loginModal.addEventListener('click', (e) => {
          if (e.target === loginModal) {
            EventHandlers.handleModalClose();
          }
        });
      }

      // Escape key to close modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const modal = document.getElementById('ictLoginModal');
          if (modal && modal.style.display === 'flex') {
            EventHandlers.handleModalClose();
          }
        }
      });

      // Role card keyboard navigation
      document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('keydown', EventHandlers.handleRoleCardKeydown.bind(this));
      });

      // Modal focus trap
      if (loginModal) {
        loginModal.addEventListener('keydown', EventHandlers.handleModalKeydown.bind(this));
      }

      // Coming soon modal close on outside click
      const comingSoonModal = document.getElementById('coming-soon-modal');
      if (comingSoonModal) {
        comingSoonModal.addEventListener('click', (e) => {
          if (e.target === comingSoonModal) {
            closeComingSoon();
          }
        });
      }

      // Escape key to close coming soon modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const comingSoonModal = document.getElementById('coming-soon-modal');
          if (comingSoonModal && comingSoonModal.style.display === 'flex') {
            closeComingSoon();
          }
        }
      });

    } catch (error) {
      ErrorHandler.handleError(error, 'App.initializeEventListeners');
    }
  },

  // Set initial navigation active state
  setInitialActiveState() {
    try {
      // Remove active class from all navigation items
      const navItems = document.querySelectorAll('.nav-item, .mobile-menu-item');
      navItems.forEach(item => item.classList.remove('active'));
      
      // Add active class to Dashboard button by default
      const dashboardBtn = document.querySelector('button[onclick="showDashboard()"]');
      if (dashboardBtn) {
        dashboardBtn.classList.add('active');
      }
      
      // Also update mobile menu item
      const mobileDashboardBtn = document.querySelector('.mobile-menu-item[onclick*="showDashboard"]');
      if (mobileDashboardBtn) {
        mobileDashboardBtn.classList.add('active');
      }
    } catch (error) {
      ErrorHandler.handleError(error, 'App.setInitialActiveState');
    }
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export for use in other modules
window.App = App;

