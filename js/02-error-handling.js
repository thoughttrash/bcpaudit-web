// ============================================================================
// ENHANCED ERROR HANDLING & USER FEEDBACK SYSTEM
// ============================================================================

// Global error handler
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  
  // Show user-friendly error message
  if (typeof showError === 'function') {
    showError(
      'System Error',
      'An unexpected error occurred. Please refresh the page or contact support if the problem persists.',
      8000
    );
  }
  
  // Log error details for debugging
  logError({
    type: 'global_error',
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (typeof showError === 'function') {
    showError(
      'Network Error',
      'A network request failed. Please check your connection and try again.',
      6000
    );
  }
  
  logError({
    type: 'unhandled_rejection',
    reason: event.reason?.toString(),
    timestamp: new Date().toISOString(),
    url: window.location.href
  });
});

// Enhanced error logging
function logError(errorData) {
  // In production, this would send to a logging service
  console.group('Error Logged');
  console.log('Error Data:', errorData);
  console.log('Timestamp:', new Date().toLocaleString());
  console.log('User Agent:', navigator.userAgent);
  console.log('URL:', window.location.href);
  console.groupEnd();
  
  // Store in localStorage for debugging
  try {
    const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errorLog.push({
      ...errorData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 errors
    if (errorLog.length > 50) {
      errorLog.splice(0, errorLog.length - 50);
    }
    
    localStorage.setItem('errorLog', JSON.stringify(errorLog));
  } catch (e) {
    console.error('Failed to log error:', e);
  }
}

// Enhanced API error handling
function handleApiError(error, context = '') {
  console.error(`API Error in ${context}:`, error);
  
  let userMessage = 'An error occurred while processing your request.';
  let title = 'Request Failed';
  
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    title = 'Connection Error';
    userMessage = 'Unable to connect to the server. Please check your internet connection.';
  } else if (error.status === 401) {
    title = 'Authentication Required';
    userMessage = 'Please log in again to continue.';
    // Redirect to login
    setTimeout(() => {
      if (typeof showLoginModal === 'function') {
        showLoginModal();
      }
    }, 2000);
  } else if (error.status === 403) {
    title = 'Access Denied';
    userMessage = 'You do not have permission to perform this action.';
  } else if (error.status === 404) {
    title = 'Not Found';
    userMessage = 'The requested resource was not found.';
  } else if (error.status === 500) {
    title = 'Server Error';
    userMessage = 'The server encountered an error. Please try again later.';
  } else if (error.status >= 400 && error.status < 500) {
    title = 'Request Error';
    userMessage = 'There was an issue with your request. Please check your input and try again.';
  }
  
  if (typeof showError === 'function') {
    showError(title, userMessage, 6000);
  }
  
  // Log detailed error
  logError({
    type: 'api_error',
    context,
    status: error.status,
    statusText: error.statusText,
    message: error.message,
    url: error.url || window.location.href,
    timestamp: new Date().toISOString()
  });
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

// Export for use in other modules
window.ValidationError = ValidationError;
window.AuthError = AuthError;
window.Validation = Validation;
window.ErrorHandler = ErrorHandler;
