// ============================================================================
// BCP AUDIT SYSTEM - MAIN APPLICATION
// ============================================================================

// Global state management
const AppState = {
  currentRole: null,
  currentUser: null,
  isAuthenticated: false,
  isLoading: false
};

// ============================================================================
// ERROR HANDLING & VALIDATION
// ============================================================================

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

// Input validation utilities
const Validation = {
  // Username validation
  validateUsername(username) {
    if (!username || typeof username !== 'string') {
      throw new ValidationError('Username is required', 'username');
    }
    
    const trimmed = username.trim();
    if (trimmed.length === 0) {
      throw new ValidationError('Username cannot be empty', 'username');
    }
    
    if (trimmed.length < 3) {
      throw new ValidationError('Username must be at least 3 characters', 'username');
    }
    
    if (trimmed.length > 50) {
      throw new ValidationError('Username must be less than 50 characters', 'username');
    }
    
    // More permissive - allow letters, numbers, spaces, and common symbols
    if (!/^[a-zA-Z0-9\s._-]+$/.test(trimmed)) {
      throw new ValidationError('Username contains invalid characters', 'username');
    }
    
    return trimmed;
  },

  // Password validation
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      throw new ValidationError('Password is required', 'password');
    }
    
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters', 'password');
    }
    
    if (password.length > 128) {
      throw new ValidationError('Password must be less than 128 characters', 'password');
    }
    
    return password;
  },

  // Role validation
  validateRole(role) {
    const validRoles = ['ict-admin', 'user'];
    if (!validRoles.includes(role)) {
      throw new ValidationError('Invalid role selected', 'role');
    }
    return role;
  },

  // Form validation
  validateLoginForm(formData) {
    const errors = [];
    
    try {
      formData.username = this.validateUsername(formData.username);
    } catch (error) {
      errors.push({ field: 'username', message: error.message });
    }
    
    try {
      formData.password = this.validatePassword(formData.password);
    } catch (error) {
      errors.push({ field: 'password', message: error.message });
    }
    
    if (errors.length > 0) {
      throw new ValidationError('Form validation failed', errors);
    }
    
    return formData;
  }
};

// Error handling utilities
const ErrorHandler = {
  handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    if (error instanceof ValidationError) {
      this.handleValidationError(error);
    } else if (error instanceof AuthError) {
      this.handleAuthError(error);
    } else {
      this.handleGenericError(error);
    }
  },

  handleValidationError(error) {
    if (error.field) {
      // Single field error
      UI.showFieldError(error.field, error.message);
    } else if (error.field && Array.isArray(error.field)) {
      // Multiple field errors
      error.field.forEach(fieldError => {
        UI.showFieldError(fieldError.field, fieldError.message);
      });
    } else {
      // General validation error - only show if in dashboard
      if (document.getElementById('mainApp').style.display !== 'none') {
        UI.showNotification(error.message, 'error');
      }
    }
  },

  handleAuthError(error) {
    UI.showNotification(error.message, 'error');
  },

  handleGenericError(error) {
    UI.showNotification('An unexpected error occurred. Please try again.', 'error');
  }
};

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

// ============================================================================
// ICT DASHBOARD DATA & FUNCTIONS
// ============================================================================

// Demo data for dashboard
const dashboardData = {
  // Forms and Labels data (27 forms + 4 labels = 31 total)
  formsAndLabels: [
    // Forms (27 items)
    { name: 'Admission Form', department: 'Emergency Department', type: 'Form' },
    { name: 'Patient Transfer Form', department: 'ICU', type: 'Form' },
    { name: 'Discharge Summary Form', department: 'General Ward', type: 'Form' },
    { name: 'Medication Order Form', department: 'Pharmacy', type: 'Form' },
    { name: 'Lab Request Form', department: 'Laboratory', type: 'Form' },
    { name: 'Radiology Request Form', department: 'Radiology', type: 'Form' },
    { name: 'Surgery Consent Form', department: 'Surgery', type: 'Form' },
    { name: 'Anesthesia Form', department: 'Anesthesiology', type: 'Form' },
    { name: 'Nursing Assessment Form', department: 'Nursing', type: 'Form' },
    { name: 'Vital Signs Form', department: 'General Ward', type: 'Form' },
    { name: 'Medication Administration Form', department: 'Pharmacy', type: 'Form' },
    { name: 'Blood Transfusion Form', department: 'Laboratory', type: 'Form' },
    { name: 'Infection Control Form', department: 'Infection Control', type: 'Form' },
    { name: 'Quality Assurance Form', department: 'Quality Management', type: 'Form' },
    { name: 'Incident Report Form', department: 'Risk Management', type: 'Form' },
    { name: 'Patient Complaint Form', department: 'Patient Relations', type: 'Form' },
    { name: 'Staff Training Form', department: 'Human Resources', type: 'Form' },
    { name: 'Equipment Maintenance Form', department: 'Biomedical Engineering', type: 'Form' },
    { name: 'Supply Request Form', department: 'Materials Management', type: 'Form' },
    { name: 'Food Service Form', department: 'Nutrition Services', type: 'Form' },
    { name: 'Housekeeping Form', department: 'Environmental Services', type: 'Form' },
    { name: 'Security Incident Form', department: 'Security', type: 'Form' },
    { name: 'IT Support Form', department: 'Information Technology', type: 'Form' },
    { name: 'Finance Form', department: 'Finance', type: 'Form' },
    { name: 'Legal Document Form', department: 'Legal Services', type: 'Form' },
    { name: 'Research Protocol Form', department: 'Research', type: 'Form' },
    { name: 'Education Form', department: 'Education', type: 'Form' },
    { name: 'Volunteer Form', department: 'Volunteer Services', type: 'Form' },
    // Labels (4 items)
    { name: 'Specimen Downtime Label', department: 'Laboratory', type: 'Label' },
    { name: 'Medication Downtime Label', department: 'Pharmacy', type: 'Label' },
    { name: 'Patient Downtime Label', department: 'General Ward', type: 'Label' },
    { name: 'Equipment Downtime Label', department: 'Biomedical Engineering', type: 'Label' }
  ],

  // Departments data (28 departments: 20 prepared, 8 unprepared)
  departments: [
    { name: 'Emergency Department', prepared: true },
    { name: 'Laboratory', prepared: true },
    { name: 'ICU', prepared: true },
    { name: 'Pharmacy', prepared: true },
    { name: 'General Ward', prepared: true },
    { name: 'Radiology', prepared: true },
    { name: 'Surgery', prepared: true },
    { name: 'Anesthesiology', prepared: true },
    { name: 'Nursing', prepared: true },
    { name: 'Infection Control', prepared: true },
    { name: 'Quality Management', prepared: true },
    { name: 'Risk Management', prepared: true },
    { name: 'Patient Relations', prepared: true },
    { name: 'Human Resources', prepared: true },
    { name: 'Biomedical Engineering', prepared: true },
    { name: 'Materials Management', prepared: true },
    { name: 'Nutrition Services', prepared: true },
    { name: 'Environmental Services', prepared: true },
    { name: 'Security', prepared: true },
    { name: 'Information Technology', prepared: true },
    { name: 'Finance', prepared: false },
    { name: 'Legal Services', prepared: false },
    { name: 'Research', prepared: false },
    { name: 'Education', prepared: false },
    { name: 'Volunteer Services', prepared: false },
    { name: 'Cardiology', prepared: false },
    { name: 'Neurology', prepared: false },
    { name: 'Oncology', prepared: false },
    { name: 'Pediatrics', prepared: false }
  ],

  // Downtime events data (2 events)
  downtimeEvents: [
    { date: '2024-01-15', department: 'Laboratory', duration: '2 hours', severity: 'Medium' },
    { date: '2024-02-03', department: 'Pharmacy', duration: '1.5 hours', severity: 'Low' }
  ],

  // Compliance data
  compliance: {
    score: 32,
    maxScore: 40,
    status: 'Good'
  }
};

// Chart instances
let preparednessChart = null;
let downtimeTrendChart = null;

// Initialize dashboard charts
function initDashboardCharts() {
  try {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet, retrying in 500ms...');
      setTimeout(initDashboardCharts, 500);
      return;
    }

    // Check if canvas elements exist
    const preparednessCtx = document.getElementById('preparednessChart');
    const downtimeCtx = document.getElementById('downtimeTrendChart');
    
    if (!preparednessCtx || !downtimeCtx) {
      console.warn('Chart canvas elements not found, retrying in 500ms...');
      setTimeout(initDashboardCharts, 500);
      return;
    }

    // Show fallback while charts are loading
    showChartFallback();

    // Prepare data for charts
    const preparedCount = dashboardData.departments.filter(dept => dept.prepared).length;
    const unpreparedCount = dashboardData.departments.filter(dept => !dept.prepared).length;

    // Pie Chart - Department Preparedness
    if (preparednessCtx) {
      // Destroy existing chart if it exists
      if (preparednessChart) {
        preparednessChart.destroy();
      }
      
      preparednessChart = new Chart(preparednessCtx, {
        type: 'doughnut',
        data: {
          labels: ['Prepared', 'Unprepared'],
          datasets: [{
            data: [preparedCount, unpreparedCount],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      });
    }

    // Line Chart - Downtime Events Trend (past 6 months)
    if (downtimeCtx) {
      // Destroy existing chart if it exists
      if (downtimeTrendChart) {
        downtimeTrendChart.destroy();
      }

      const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
      const eventCounts = [0, 0, 0, 0, 1, 1]; // Demo data for past 6 months

      downtimeTrendChart = new Chart(downtimeCtx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Downtime Events',
            data: eventCounts,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error initializing dashboard charts:', error);
    // Don't show error notification for chart initialization issues
    // Just log the error to console
  }
}

// Update KPI cards with demo data
function updateKPICards() {
  try {
    // Total Forms & Labels
    const totalFormsLabels = document.getElementById('totalFormsLabels');
    if (totalFormsLabels) {
      totalFormsLabels.textContent = dashboardData.formsAndLabels.length;
    }

    // Prepared Departments Percentage
    const preparedDepartments = document.getElementById('preparedDepartments');
    if (preparedDepartments) {
      const preparedCount = dashboardData.departments.filter(dept => dept.prepared).length;
      const percentage = Math.round((preparedCount / dashboardData.departments.length) * 100);
      preparedDepartments.textContent = `${percentage}%`;
    }

    // Downtime Events
    const downtimeEvents = document.getElementById('downtimeEvents');
    if (downtimeEvents) {
      downtimeEvents.textContent = dashboardData.downtimeEvents.length;
    }

    // Compliance Score
    const complianceScore = document.getElementById('complianceScore');
    if (complianceScore) {
      complianceScore.textContent = `${dashboardData.compliance.score}/${dashboardData.compliance.maxScore}`;
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'updateKPICards');
  }
}

// Show coming soon modal
function showComingSoon(featureName) {
  try {
    const modal = document.getElementById('coming-soon-modal');
    const title = document.getElementById('coming-soon-title');
    const message = document.getElementById('coming-soon-message');
    
    if (modal && title && message) {
      title.textContent = `${featureName} - Coming Soon`;
      
      // Custom messages for each feature
      const messages = {
        'Dashboard Overview': 'The Dashboard Overview provides a comprehensive summary of BCP status, KPIs, and recent activity across all departments.',
        'Form & Label Repository': 'The Form & Label Repository allows you to manage all manual forms and downtime labels organized by department.',
        'Preparedness Tracker': 'The Preparedness Tracker helps monitor department readiness and form availability status.',
        'Downtime Event Log': 'The Downtime Event Log enables logging of both planned and unplanned HIS downtime events.',
        'Digital Audit Checklist': 'The Digital Audit Checklist provides tools to conduct and store comprehensive audit assessments.',
        'Compliance Analytics': 'The Compliance Analytics module offers detailed compliance scores, trends, and performance insights.',
        'Recognition & Awards': 'The Recognition & Awards system tracks and showcases top-performing departments and teams.'
      };
      
      message.textContent = messages[featureName] || `The ${featureName} module is currently under development and will be available in a future update.`;
      modal.style.display = 'flex';
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'showComingSoon');
  }
}

// Close coming soon modal
function closeComingSoon() {
  try {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'closeComingSoon');
  }
}

// Initialize ICT Dashboard
function initICTDashboard() {
  try {
    updateKPICards();
    
    // Initialize charts with a small delay to ensure Chart.js is loaded
    setTimeout(() => {
      initDashboardCharts();
    }, 100);
  } catch (error) {
    console.error('Error initializing ICT dashboard:', error);
    // Don't show error notification for dashboard initialization issues
    // Just log the error to console
  }
}

// Fallback function if Chart.js fails to load
function showChartFallback() {
  try {
    const preparednessCtx = document.getElementById('preparednessChart');
    const downtimeCtx = document.getElementById('downtimeTrendChart');
    
    if (preparednessCtx) {
      preparednessCtx.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Chart loading...</div>';
    }
    
    if (downtimeCtx) {
      downtimeCtx.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Chart loading...</div>';
    }
  } catch (error) {
    console.error('Error showing chart fallback:', error);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

const App = {
  async init() {
    try {
      console.log('BCP Audit System initializing...');
      
      // Add animation complete class after page load
      setTimeout(() => {
        document.body.classList.add('animation-complete');
        document.documentElement.classList.add('animation-complete');
      }, 600);
      
      // Initialize event listeners
      this.initializeEventListeners();
      
      console.log('BCP Audit System initialized successfully');
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
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});