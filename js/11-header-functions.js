// ============================================================================
// MODERN HEADER FUNCTIONS - CLEAN, MINIMALIST NAVIGATION
// ============================================================================

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
