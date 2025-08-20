// Global variables
let currentRole = null;
let currentUser = null;

// Enhanced Feedback Functions
function showLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.add('show');
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('show');
}

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('btn-loading');
    button.disabled = true;
  } else {
    button.classList.remove('btn-loading');
    button.disabled = false;
  }
}

function addInputValidation(input, isValid) {
  input.classList.remove('error', 'success');
  if (isValid === true) {
    input.classList.add('success');
  } else if (isValid === false) {
    input.classList.add('error');
  }
}

// Enhanced Role Selection with Loading
function selectRole(role) {
  if (role === 'ict-admin') {
    // Show login modal for ICT admin with animation
    const modal = document.getElementById('ictLoginModal');
    modal.style.display = 'flex';
    modal.classList.add('modal-enter');
    document.body.classList.add('modal-open');
    
    // Focus on username input
    setTimeout(() => {
      document.getElementById('ictUsername').focus();
    }, 300);
  } else {
    // Show loading for direct access
    showLoadingOverlay();
    
    // Simulate loading time for better UX
    setTimeout(() => {
      hideLoadingOverlay();
      initializeRole(role);
    }, 800);
  }
}

// Enhanced Modal Close
function closeICTLogin() {
  const modal = document.getElementById('ictLoginModal');
  modal.classList.remove('modal-enter');
  modal.classList.add('modal-exit');
  
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('modal-exit');
    document.body.classList.remove('modal-open');
    document.getElementById('ictLoginForm').reset();
    
    // Clear any validation states
    document.querySelectorAll('#ictLoginForm .input').forEach(input => {
      addInputValidation(input, null);
    });
  }, 200);
}

// Enhanced Role Initialization with Smooth Transitions
function initializeRole(role) {
  currentRole = role;
  currentUser = role === 'ict-admin' ? 'ICT Administrator' : 'User';
  
  // Add page transition effect
  const roleSelection = document.getElementById('roleSelection');
  const mainApp = document.getElementById('mainApp');
  
  roleSelection.classList.add('page-exit');
  
  setTimeout(() => {
    roleSelection.style.display = 'none';
    mainApp.style.display = 'block';
    mainApp.classList.add('page-enter');
    
    // Update header info
    updateHeaderInfo();
    
    // Show role-specific navigation
    showRoleNavigation();
    
    setTimeout(() => {
      mainApp.classList.remove('page-enter');
    }, 400);
  }, 200);
}

// Update header information
function updateHeaderInfo() {
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
  
  const config = roleConfig[currentRole];
  
  // Update role badge
  if (roleElement) {
    roleElement.textContent = config.name;
    roleElement.className = `inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-sm role-badge-enhanced`;
  }
  
  // Update breadcrumb
  if (breadcrumbElement) {
    breadcrumbElement.textContent = config.breadcrumb;
  }
}

// Show role-specific navigation
function showRoleNavigation() {
  // Hide all content sections
  document.querySelectorAll('#ict-content, #user-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // Show the current role's content
  const contentId = currentRole === 'ict-admin' ? 'ict-content' : 'user-content';
  const roleContent = document.getElementById(contentId);
  
  if (roleContent) {
    roleContent.style.display = 'block';
  }
}

// Switch tabs
function switchTab(tabId) {
  // Hide all sections in the current role's content
  const contentId = currentRole === 'ict-admin' ? 'ict-content' : 'user-content';
  const currentContent = document.getElementById(contentId);
  if (currentContent) {
    currentContent.querySelectorAll('section').forEach(section => {
      section.classList.add('hidden');
    });
  }
  
  // Show the selected tab
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.remove('hidden');
  }
  
  // Update navigation buttons
  const navId = currentRole === 'ict-admin' ? 'ict-nav' : 'user-nav';
  const currentNav = document.getElementById(navId);
  if (currentNav) {
    currentNav.querySelectorAll('[data-tab]').forEach(btn => {
      btn.classList.remove('tab-active');
    });
    
    const activeBtn = currentNav.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('tab-active');
    }
  }
}

// Enhanced Role Selection with Smooth Transitions
function showRoleSelection() {
  // Reset current role and user
  currentRole = null;
  currentUser = null;
  
  // Add page transition effect
  const roleSelection = document.getElementById('roleSelection');
  const mainApp = document.getElementById('mainApp');
  
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

// Logout function
function logout() {
  showRoleSelection();
}

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 4000) {
  const container = document.getElementById('notification-container');
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
}

// Enhanced Form Validation
function validateLoginForm() {
  const username = document.getElementById('ictUsername');
  const password = document.getElementById('ictPassword');
  let isValid = true;
  
  // Username validation
  if (!username.value.trim()) {
    addInputValidation(username, false);
    isValid = false;
  } else {
    addInputValidation(username, true);
  }
  
  // Password validation
  if (!password.value.trim()) {
    addInputValidation(password, false);
    isValid = false;
  } else {
    addInputValidation(password, true);
  }
  
  return isValid;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Add animation complete class after page load animation
  setTimeout(() => {
    document.body.classList.add('animation-complete');
    document.documentElement.classList.add('animation-complete');
  }, 600); // Match the animation duration
  
  // Enhanced ICT login form
  document.getElementById('ictLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const loginBtn = document.getElementById('loginBtn');
    const username = document.getElementById('ictUsername').value;
    const password = document.getElementById('ictPassword').value;
    
    // Validate form
    if (!validateLoginForm()) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Set button loading state
    setButtonLoading(loginBtn, true);
    
    // Simulate authentication delay for better UX
    setTimeout(() => {
      // Simple demo authentication
      if (username === 'admin' && password === 'admin123') {
        closeICTLogin();
        
        // Show loading overlay during transition
        showLoadingOverlay();
        
        setTimeout(() => {
          hideLoadingOverlay();
          initializeRole('ict-admin');
          showNotification('Login successful! Welcome back.', 'success');
        }, 500);
             } else {
         // Clear password and show error
         document.getElementById('ictPassword').value = '';
         document.getElementById('ictPassword').focus();
         addInputValidation(document.getElementById('ictPassword'), false);
       }
      
      // Reset button state
      setButtonLoading(loginBtn, false);
    }, 1000); // Simulate network delay
  });

  // Real-time input validation
  document.getElementById('ictUsername').addEventListener('input', function() {
    if (this.value.trim()) {
      addInputValidation(this, true);
    } else {
      addInputValidation(this, null);
    }
  });
  
  document.getElementById('ictPassword').addEventListener('input', function() {
    if (this.value.trim()) {
      addInputValidation(this, true);
    } else {
      addInputValidation(this, null);
    }
  });

  // Navigation event listeners
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });

  // Enhanced logout button
  document.getElementById('btnLogout').addEventListener('click', function() {
    // Show loading during logout
    showLoadingOverlay();
    
    setTimeout(() => {
      hideLoadingOverlay();
      logout();
      showNotification('Logged out successfully', 'info');
    }, 500);
  });
  
  // Close modal when clicking outside
  document.getElementById('ictLoginModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeICTLogin();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('ictLoginModal');
      if (modal.style.display === 'flex') {
        closeICTLogin();
      }
    }
  });
  
  // Enhanced keyboard navigation for role cards
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const role = this.getAttribute('onclick')?.match(/selectRole\('([^']+)'\)/)?.[1];
        if (role) {
          selectRole(role);
        }
      }
    });
  });
  
  // Focus management for better accessibility
  function manageFocus() {
    // Focus the first focusable element when modal opens
    const modal = document.getElementById('ictLoginModal');
    if (modal.style.display === 'flex') {
      const firstInput = document.getElementById('ictUsername');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }
  
  // Trap focus within modal for better accessibility
  function trapFocus(e) {
    const modal = document.getElementById('ictLoginModal');
    if (modal.style.display !== 'flex') return;
    
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
  
  // Add focus trap to modal
  document.getElementById('ictLoginModal').addEventListener('keydown', trapFocus);
});