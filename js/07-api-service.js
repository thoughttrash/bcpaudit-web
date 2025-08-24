// ============================================================================
// API SERVICE - BACKEND INTEGRATION
// ============================================================================

// Fallback AuthError class if not available yet
if (typeof AuthError === 'undefined') {
  window.AuthError = class AuthError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AuthError';
    }
  };
}

const ApiService = {
  // Base configuration
  config: {
    baseURL: 'http://localhost:3001',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Authentication token management
  getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  },

  setAuthToken(token, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  },

  clearAuthToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  // HTTP request helper with retry logic
  async makeRequest(endpoint, options = {}) {
    const url = `${this.config.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      timeout: this.config.timeout
    };

    const requestOptions = { ...defaultOptions, ...options };

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            this.clearAuthToken();
            throw new AuthError('Authentication required');
          }
          if (response.status === 403) {
            throw new AuthError('Access denied');
          }
          if (response.status === 404) {
            throw new Error('Resource not found');
          }
          if (response.status >= 500) {
            throw new Error('Server error');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        if (attempt === this.config.retryAttempts) {
          // Don't log network errors to console as they're expected in offline mode
          if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
            throw new Error('Network unavailable - using offline mode');
          }
          throw error;
        }
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
      }
    }
  },

  // Authentication endpoints
  async login(credentials) {
    try {
      const response = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.token) {
        this.setAuthToken(response.token, credentials.rememberMe);
      }

      return response;
    } catch (error) {
      throw new AuthError(error.message);
    }
  },

  async logout() {
    try {
      await this.makeRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuthToken();
    }
  },

  async refreshToken() {
    try {
      const response = await this.makeRequest('/auth/refresh', { method: 'POST' });
      if (response.token) {
        this.setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      this.clearAuthToken();
      throw new AuthError('Token refresh failed');
    }
  },

  // Dashboard data endpoints
  async getDashboardData() {
    try {
      const response = await this.makeRequest('/dashboard/overview');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  },

  async getFormsAndLabels() {
    try {
      const response = await this.makeRequest('/forms-labels');
      return response.data || [];
    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.error('Failed to fetch forms and labels:', error);
      }
      throw error;
    }
  },

  async getDepartments() {
    try {
      const response = await this.makeRequest('/departments');
      return response.data || [];
    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.error('Failed to fetch departments:', error);
      }
      throw error;
    }
  },

  async getDowntimeEvents() {
    try {
      const response = await this.makeRequest('/downtime-events');
      return response.data || [];
    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.error('Failed to fetch downtime events:', error);
      }
      throw error;
    }
  },

  async getComplianceData() {
    try {
      const response = await this.makeRequest('/compliance/overview');
      return response.data || {};
    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.error('Failed to fetch compliance data:', error);
      }
      throw error;
    }
  },

  async getDowntimeTrend(months = 6) {
    try {
      const response = await this.makeRequest(`/downtime-events/trend?months=${months}`);
      return response.data || [];
    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.error('Failed to fetch downtime trend:', error);
      }
      throw error;
    }
  },

  // Form management endpoints
  async createForm(formData) {
    try {
      const response = await this.makeRequest('/forms', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create form:', error);
      throw error;
    }
  },

  async updateForm(formId, formData) {
    try {
      const response = await this.makeRequest(`/forms/${formId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update form:', error);
      throw error;
    }
  },

  async deleteForm(formId) {
    try {
      await this.makeRequest(`/forms/${formId}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      console.error('Failed to delete form:', error);
      throw error;
    }
  },

  // Department management endpoints
  async updateDepartmentPreparedness(departmentId, prepared) {
    try {
      const response = await this.makeRequest(`/departments/${departmentId}/preparedness`, {
        method: 'PATCH',
        body: JSON.stringify({ prepared })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update department preparedness:', error);
      throw error;
    }
  },

  // Downtime event management endpoints
  async createDowntimeEvent(eventData) {
    try {
      const response = await this.makeRequest('/downtime-events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create downtime event:', error);
      throw error;
    }
  },

  async updateDowntimeEvent(eventId, eventData) {
    try {
      const response = await this.makeRequest(`/downtime-events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(eventData)
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update downtime event:', error);
      throw error;
    }
  },

  async deleteDowntimeEvent(eventId) {
    try {
      await this.makeRequest(`/downtime-events/${eventId}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      console.error('Failed to delete downtime event:', error);
      throw error;
    }
  },

  // Audit management endpoints
  async createAudit(auditData) {
    try {
      const response = await this.makeRequest('/audits', {
        method: 'POST',
        body: JSON.stringify(auditData)
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create audit:', error);
      throw error;
    }
  },

  async getAudits(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.makeRequest(`/audits?${queryParams}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch audits:', error);
      throw error;
    }
  },

  async getAuditById(auditId) {
    try {
      const response = await this.makeRequest(`/audits/${auditId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch audit:', error);
      throw error;
    }
  },

  // Report generation endpoints
  async generateReport(reportType, filters = {}) {
    try {
      const response = await this.makeRequest('/reports/generate', {
        method: 'POST',
        body: JSON.stringify({ type: reportType, filters })
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  },

  async downloadReport(reportId) {
    try {
      const response = await this.makeRequest(`/reports/${reportId}/download`);
      return response.data;
    } catch (error) {
      console.error('Failed to download report:', error);
      throw error;
    }
  },

  // User management endpoints
  async getCurrentUser() {
    try {
      const response = await this.makeRequest('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await this.makeRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Offline mode support
  isOfflineMode() {
    // Force online mode since we have a working backend
    return false;
  },

  setOfflineMode(enabled) {
    if (enabled) {
      localStorage.setItem('offlineMode', 'true');
    } else {
      localStorage.removeItem('offlineMode');
    }
  },

  // Cache management
  async getCachedData(key) {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        if (cacheAge < maxAge) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  },

  async setCachedData(key, data) {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Failed to set cached data:', error);
    }
  },

  clearCache() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
};

// Export for use in other modules
window.ApiService = ApiService;

