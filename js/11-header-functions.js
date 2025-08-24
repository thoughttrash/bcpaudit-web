// ============================================================================
// ENHANCED HEADER FUNCTIONS - MODERN NAVIGATION WITH NOTIFICATIONS
// ============================================================================

// ============================================================================
// ENHANCED NOTIFICATION SYSTEM
// ============================================================================

// Create notification container if it doesn't exist
function ensureNotificationContainer() {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  return container;
}

// Enhanced notification function
function showNotification(type, title, message, duration = 5000) {
  const container = ensureNotificationContainer();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  notification.innerHTML = `
    <div class="notification-icon ${type}">
      <span>${iconMap[type] || 'ℹ'}</span>
    </div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `;
  
  container.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }
  
  return notification;
}

// Convenience functions
function showSuccess(title, message, duration) {
  return showNotification('success', title, message, duration);
}

function showError(title, message, duration) {
  return showNotification('error', title, message, duration);
}

function showWarning(title, message, duration) {
  return showNotification('warning', title, message, duration);
}

function showInfo(title, message, duration) {
  return showNotification('info', title, message, duration);
}

// ============================================================================
// ENHANCED LOADING SYSTEM
// ============================================================================

// Enhanced loading overlay with progress
function showLoadingOverlay(message = 'Loading...', showProgress = true) {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  
  const textElement = overlay.querySelector('.loading-text');
  const progressElement = overlay.querySelector('.loading-progress');
  
  if (textElement) {
    textElement.textContent = message;
  }
  
  if (progressElement) {
    progressElement.style.display = showProgress ? 'block' : 'none';
  }
  
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
  
  // Reset after animation
  setTimeout(() => {
    const textElement = overlay.querySelector('.loading-text');
    if (textElement) {
      textElement.textContent = 'Loading BCP System...';
    }
  }, 500);
}

// Progress loading with percentage
function updateLoadingProgress(percentage, message) {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  
  const textElement = overlay.querySelector('.loading-text');
  const progressBar = overlay.querySelector('.loading-progress-bar');
  
  if (textElement && message) {
    textElement.textContent = message;
  }
  
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  }
}

// Header functionality namespace
const HeaderManager = {
  // Initialize header functionality
  init() {
    console.log('HeaderManager.init() called');
    console.log('Header element found:', !!document.getElementById('mainHeader'));
    
    this.setupScrollEffects();
    this.setupNavigation();
    this.setupMobileMenu();
    
    // Debug: Check header positioning
    this.debugHeaderPosition();
  },

  // Debug header positioning
  debugHeaderPosition() {
    const header = document.getElementById('mainHeader');
    if (header) {
      const computedStyle = window.getComputedStyle(header);
      console.log('Header positioning debug:', {
        position: computedStyle.position,
        top: computedStyle.top,
        left: computedStyle.left,
        right: computedStyle.right,
        zIndex: computedStyle.zIndex,
        width: computedStyle.width,
        height: computedStyle.height
      });
    } else {
      console.error('Header element not found for debugging');
    }
  },

  // Setup scroll effects for sticky header
  setupScrollEffects() {
    const header = document.getElementById('mainHeader');
    if (!header) {
      console.error('Header element not found in setupScrollEffects');
      return;
    }

    console.log('Setting up scroll effects for header');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class for styling (optional enhancement)
      if (scrollTop > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  // Setup navigation functionality
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
      });
    });
  },

  // Setup mobile menu functionality
  setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    console.log('Mobile menu setup:', { mobileMenuBtn, mobileMenu });
    
    if (!mobileMenuBtn || !mobileMenu) {
      console.log('Mobile menu elements not found');
      return;
    }
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Mobile menu button clicked');
      this.toggleMobileMenu();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        setTimeout(() => {
          if (mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
          }
        }, 100);
      }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  },

  // Toggle mobile menu
  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) {
      console.log('Mobile menu not found in toggleMobileMenu');
      return;
    }
    
    const isActive = mobileMenu.classList.contains('active');
    console.log('Toggle mobile menu, current state:', isActive);
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  // Open mobile menu
  openMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) return;
    
    console.log('Opening mobile menu');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  },

  // Close mobile menu
  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) return;
    
    console.log('Closing mobile menu');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  },

  // Update active navigation item
  updateActiveNavItem(activeId) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current item
    const activeItem = document.querySelector(`[onclick*="${activeId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  },

  // Handle navigation item clicks
  handleNavClick(action, closeMenu = true) {
    // Update active state
    this.updateActiveNavItem(action);
    
    // Close mobile menu if needed
    if (closeMenu) {
      this.closeMobileMenu();
    }
    
    // Execute the action
    if (typeof window[action] === 'function') {
      window[action]();
    }
  }
};

// Global functions for HTML onclick handlers
window.toggleMobileMenu = () => {
  console.log('Global toggleMobileMenu called');
  if (window.HeaderManager) {
    HeaderManager.toggleMobileMenu();
  } else {
    console.error('HeaderManager not found');
  }
};

window.closeMobileMenu = () => {
  if (window.HeaderManager) {
    HeaderManager.closeMobileMenu();
  } else {
    console.error('HeaderManager not found');
  }
};

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('HeaderManager initializing...');
  console.log('HeaderManager object:', HeaderManager);
  HeaderManager.init();
  console.log('HeaderManager initialized');
  console.log('Global functions available:', {
    toggleMobileMenu: typeof window.toggleMobileMenu,
    closeMobileMenu: typeof window.closeMobileMenu,
    showDashboard: typeof window.showDashboard,
    showDigitalAuditSystem: typeof window.showDigitalAuditSystem
  });
});

// Export for use in other modules
window.HeaderManager = HeaderManager;
