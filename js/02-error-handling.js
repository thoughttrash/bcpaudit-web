// ============================================================================
// ERROR HANDLING & VALIDATION
// ============================================================================

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
