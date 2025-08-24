// ============================================================================
// HEADER FUNCTIONS - MODERN HEADER NAVIGATION & MOBILE MENU
// ============================================================================

// Header functionality namespace
const HeaderManager = {
  // Initialize header functionality
  init() {
    this.setupScrollEffects();
    this.setupDropdowns();
    this.setupMobileMenu();
    this.setupChartToggles();
  },

  // Setup scroll effects for sticky header
  setupScrollEffects() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class for styling
      if (scrollTop > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollTop = scrollTop;
    });
  },

  // Setup dropdown navigation menus
  setupDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      const menu = dropdown.querySelector('.nav-dropdown-menu');
      
      if (!toggle || !menu) return;
      
      // Toggle dropdown on click
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        dropdowns.forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
      
      // Close dropdown on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdown.classList.remove('active');
        }
      });
    });
  },

  // Setup mobile menu functionality
  setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    console.log('Mobile menu setup:', { mobileMenuBtn, mobileMenu });
    console.log('Mobile menu content:', mobileMenu?.innerHTML);
    console.log('Mobile menu computed style:', mobileMenu ? window.getComputedStyle(mobileMenu) : 'No mobile menu');
    
    if (!mobileMenuBtn || !mobileMenu) {
      console.log('Mobile menu elements not found');
      return;
    }
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      console.log('Mobile menu button clicked');
      this.toggleMobileMenu();
    });
    
    // Close mobile menu when clicking outside (with delay to prevent immediate closing)
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        // Add a small delay to prevent immediate closing
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
    console.log('Mobile menu element:', mobileMenu);
    console.log('Mobile menu classes before:', mobileMenu.className);
    mobileMenu.classList.add('active');
    console.log('Mobile menu classes after:', mobileMenu.className);
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

  // Setup chart toggle functionality for mobile
  setupChartToggles() {
    const chartToggles = document.querySelectorAll('.chart-toggle');
    
    chartToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const chartId = toggle.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (chartId) {
          this.toggleChart(chartId);
        }
      });
    });
  },

  // Toggle chart visibility on mobile
  toggleChart(chartId) {
    const container = document.getElementById(chartId + 'Container');
    const toggle = document.querySelector(`[onclick="toggleChart('${chartId}')"]`);
    
    if (!container || !toggle) return;
    
    const isExpanded = container.classList.contains('expanded');
    
    if (isExpanded) {
      container.classList.remove('expanded');
      toggle.classList.remove('active');
    } else {
      container.classList.add('expanded');
      toggle.classList.add('active');
    }
  },

  // Update active navigation item
  updateActiveNavItem(activeId) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item, .mobile-menu-item');
    navItems.forEach(item => item.classList.remove('active'));
    
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
window.toggleDropdown = (dropdownId) => {
  console.log('toggleDropdown called with:', dropdownId);
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) {
    console.log('Dropdown not found:', dropdownId);
    return;
  }
  
  // Close other dropdowns
  document.querySelectorAll('.nav-dropdown').forEach(other => {
    if (other.id !== dropdownId) {
      other.classList.remove('active');
    }
  });
  
  // Toggle current dropdown
  dropdown.classList.toggle('active');
  console.log('Dropdown toggled:', dropdownId, 'Active:', dropdown.classList.contains('active'));
};

// Alternative function for direct dropdown toggle
function toggleNavDropdown(dropdownId) {
  const dropdown = document.querySelector(`.nav-dropdown:has(#${dropdownId})`);
  if (!dropdown) return;
  
  // Close other dropdowns
  document.querySelectorAll('.nav-dropdown').forEach(other => {
    if (other !== dropdown) {
      other.classList.remove('active');
    }
  });
  
  // Toggle current dropdown
  dropdown.classList.toggle('active');
}

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

window.toggleChart = (chartId) => {
  if (window.HeaderManager) {
    HeaderManager.toggleChart(chartId);
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
    toggleDropdown: typeof window.toggleDropdown,
    showDashboard: typeof window.showDashboard,
    showDigitalAuditSystem: typeof window.showDigitalAuditSystem
  });
  
  // Test dashboard button
  const dashboardBtn = document.querySelector('button[onclick="showDashboard()"]');
  console.log('Dashboard button found:', dashboardBtn);
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', (e) => {
      console.log('Dashboard button clicked via event listener');
    });
  }
  
  // Test Digital Audit Tool button
  const digitalAuditBtn = document.querySelector('button[onclick="showDigitalAuditSystem()"]');
  console.log('Digital Audit Tool button found:', digitalAuditBtn);
  if (digitalAuditBtn) {
    digitalAuditBtn.addEventListener('click', (e) => {
      console.log('Digital Audit Tool button clicked via event listener');
    });
  }
});

// Export for use in other modules
window.HeaderManager = HeaderManager;
