// ============================================================================
// DASHBOARD DATA & CHART INSTANCES
// ============================================================================

// Demo data as fallback when API is unavailable
const demoData = {
  // Forms and Labels data (27 forms + 4 labels = 31 total)
  formsAndLabels: [
    // Forms (27 items)
    { id: 1, name: 'Admission Form', department: 'Emergency Department', type: 'Form', status: 'active' },
    { id: 2, name: 'Patient Transfer Form', department: 'ICU', type: 'Form', status: 'active' },
    { id: 3, name: 'Discharge Summary Form', department: 'General Ward', type: 'Form', status: 'active' },
    { id: 4, name: 'Medication Order Form', department: 'Pharmacy', type: 'Form', status: 'active' },
    { id: 5, name: 'Lab Request Form', department: 'Laboratory', type: 'Form', status: 'active' },
    { id: 6, name: 'Radiology Request Form', department: 'Radiology', type: 'Form', status: 'active' },
    { id: 7, name: 'Surgery Consent Form', department: 'Surgery', type: 'Form', status: 'active' },
    { id: 8, name: 'Anesthesia Form', department: 'Anesthesiology', type: 'Form', status: 'active' },
    { id: 9, name: 'Nursing Assessment Form', department: 'Nursing', type: 'Form', status: 'active' },
    { id: 10, name: 'Vital Signs Form', department: 'General Ward', type: 'Form', status: 'active' },
    { id: 11, name: 'Medication Administration Form', department: 'Pharmacy', type: 'Form', status: 'active' },
    { id: 12, name: 'Blood Transfusion Form', department: 'Laboratory', type: 'Form', status: 'active' },
    { id: 13, name: 'Infection Control Form', department: 'Infection Control', type: 'Form', status: 'active' },
    { id: 14, name: 'Quality Assurance Form', department: 'Quality Management', type: 'Form', status: 'active' },
    { id: 15, name: 'Incident Report Form', department: 'Risk Management', type: 'Form', status: 'active' },
    { id: 16, name: 'Patient Complaint Form', department: 'Patient Relations', type: 'Form', status: 'active' },
    { id: 17, name: 'Staff Training Form', department: 'Human Resources', type: 'Form', status: 'active' },
    { id: 18, name: 'Equipment Maintenance Form', department: 'Biomedical Engineering', type: 'Form', status: 'active' },
    { id: 19, name: 'Supply Request Form', department: 'Materials Management', type: 'Form', status: 'active' },
    { id: 20, name: 'Food Service Form', department: 'Nutrition Services', type: 'Form', status: 'active' },
    { id: 21, name: 'Housekeeping Form', department: 'Environmental Services', type: 'Form', status: 'active' },
    { id: 22, name: 'Security Incident Form', department: 'Security', type: 'Form', status: 'active' },
    { id: 23, name: 'IT Support Form', department: 'Information Technology', type: 'Form', status: 'active' },
    { id: 24, name: 'Finance Form', department: 'Finance', type: 'Form', status: 'active' },
    { id: 25, name: 'Legal Document Form', department: 'Legal Services', type: 'Form', status: 'active' },
    { id: 26, name: 'Research Protocol Form', department: 'Research', type: 'Form', status: 'active' },
    { id: 27, name: 'Education Form', department: 'Education', type: 'Form', status: 'active' },
    { id: 28, name: 'Volunteer Form', department: 'Volunteer Services', type: 'Form', status: 'active' },
    // Labels (4 items)
    { id: 29, name: 'Specimen Downtime Label', department: 'Laboratory', type: 'Label', status: 'active' },
    { id: 30, name: 'Medication Downtime Label', department: 'Pharmacy', type: 'Label', status: 'active' },
    { id: 31, name: 'Patient Downtime Label', department: 'General Ward', type: 'Label', status: 'active' },
    { id: 32, name: 'Equipment Downtime Label', department: 'Biomedical Engineering', type: 'Label', status: 'active' }
  ],

  // Departments data (28 departments: 20 prepared, 8 unprepared)
  departments: [
    { id: 1, name: 'Emergency Department', prepared: true, lastUpdated: '2024-02-15T10:30:00Z' },
    { id: 2, name: 'Laboratory', prepared: true, lastUpdated: '2024-02-14T15:45:00Z' },
    { id: 3, name: 'ICU', prepared: true, lastUpdated: '2024-02-13T09:20:00Z' },
    { id: 4, name: 'Pharmacy', prepared: true, lastUpdated: '2024-02-12T14:15:00Z' },
    { id: 5, name: 'General Ward', prepared: true, lastUpdated: '2024-02-11T11:30:00Z' },
    { id: 6, name: 'Radiology', prepared: true, lastUpdated: '2024-02-10T16:45:00Z' },
    { id: 7, name: 'Surgery', prepared: true, lastUpdated: '2024-02-09T08:20:00Z' },
    { id: 8, name: 'Anesthesiology', prepared: true, lastUpdated: '2024-02-08T13:15:00Z' },
    { id: 9, name: 'Nursing', prepared: true, lastUpdated: '2024-02-07T10:30:00Z' },
    { id: 10, name: 'Infection Control', prepared: true, lastUpdated: '2024-02-06T15:45:00Z' },
    { id: 11, name: 'Quality Management', prepared: true, lastUpdated: '2024-02-05T09:20:00Z' },
    { id: 12, name: 'Risk Management', prepared: true, lastUpdated: '2024-02-04T14:15:00Z' },
    { id: 13, name: 'Patient Relations', prepared: true, lastUpdated: '2024-02-03T11:30:00Z' },
    { id: 14, name: 'Human Resources', prepared: true, lastUpdated: '2024-02-02T16:45:00Z' },
    { id: 15, name: 'Biomedical Engineering', prepared: true, lastUpdated: '2024-02-01T08:20:00Z' },
    { id: 16, name: 'Materials Management', prepared: true, lastUpdated: '2024-01-31T13:15:00Z' },
    { id: 17, name: 'Nutrition Services', prepared: true, lastUpdated: '2024-01-30T10:30:00Z' },
    { id: 18, name: 'Environmental Services', prepared: true, lastUpdated: '2024-01-29T15:45:00Z' },
    { id: 19, name: 'Security', prepared: true, lastUpdated: '2024-01-28T09:20:00Z' },
    { id: 20, name: 'Information Technology', prepared: true, lastUpdated: '2024-01-27T14:15:00Z' },
    { id: 21, name: 'Finance', prepared: false, lastUpdated: '2024-01-26T11:30:00Z' },
    { id: 22, name: 'Legal Services', prepared: false, lastUpdated: '2024-01-25T16:45:00Z' },
    { id: 23, name: 'Research', prepared: false, lastUpdated: '2024-01-24T08:20:00Z' },
    { id: 24, name: 'Education', prepared: false, lastUpdated: '2024-01-23T13:15:00Z' },
    { id: 25, name: 'Volunteer Services', prepared: false, lastUpdated: '2024-01-22T10:30:00Z' },
    { id: 26, name: 'Cardiology', prepared: false, lastUpdated: '2024-01-21T15:45:00Z' },
    { id: 27, name: 'Neurology', prepared: false, lastUpdated: '2024-01-20T09:20:00Z' },
    { id: 28, name: 'Oncology', prepared: false, lastUpdated: '2024-01-19T14:15:00Z' },
    { id: 29, name: 'Pediatrics', prepared: false, lastUpdated: '2024-01-18T11:30:00Z' }
  ],

  // Downtime events data (2 events)
  downtimeEvents: [
    { id: 1, date: '2024-01-15', department: 'Laboratory', duration: '2 hours', severity: 'Medium', description: 'Scheduled maintenance' },
    { id: 2, date: '2024-02-03', department: 'Pharmacy', duration: '1.5 hours', severity: 'Low', description: 'System upgrade' }
  ],

  // Compliance data
  compliance: {
    score: 32,
    maxScore: 40,
    status: 'Good',
    lastUpdated: '2024-02-15T12:00:00Z'
  }
};

// Live dashboard data (will be populated from API)
let dashboardData = {
  formsAndLabels: [],
  departments: [],
  downtimeEvents: [],
  compliance: {},
  isLoading: false,
  lastUpdated: null,
  isOffline: false
};

// Chart instances
let preparednessChart = null;
let downtimeTrendChart = null;

// Data loading functions
const DataService = {
  // Load all dashboard data
  async loadDashboardData() {
    try {
      dashboardData.isLoading = true;
      
      // Check if we're in offline mode
      if (ApiService.isOfflineMode()) {
        console.log('BCP Audit System running in offline mode with demo data');
        dashboardData = { ...demoData, isOffline: true, lastUpdated: new Date().toISOString() };
        return dashboardData;
      }

      // Try to load from cache first
      const cachedData = await ApiService.getCachedData('dashboard');
      if (cachedData) {
        console.log('Using cached dashboard data');
        dashboardData = { ...cachedData, isLoading: false, lastUpdated: new Date().toISOString() };
        return dashboardData;
      }

      // Load fresh data from API
      console.log('Attempting to load data from API...');
      const [formsAndLabels, departments, downtimeEvents, compliance] = await Promise.all([
        ApiService.getFormsAndLabels(),
        ApiService.getDepartments(),
        ApiService.getDowntimeEvents(),
        ApiService.getComplianceData()
      ]);

      dashboardData = {
        formsAndLabels,
        departments,
        downtimeEvents,
        compliance,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
        isOffline: false
      };

      // Cache the data
      await ApiService.setCachedData('dashboard', dashboardData);

      return dashboardData;

    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.warn('Failed to load dashboard data from API, using demo data:', error);
      }
      
      // Fallback to demo data
      dashboardData = { 
        ...demoData, 
        isLoading: false, 
        lastUpdated: new Date().toISOString(),
        isOffline: true 
      };
      
      // Show offline notification only once
      if (window.UI && !localStorage.getItem('offlineNotificationShown')) {
        window.UI.showNotification('Using offline demo data. Some features may be limited.', 'info');
        localStorage.setItem('offlineNotificationShown', 'true');
      }
      
      return dashboardData;
    }
  },

  // Load specific data types
  async loadFormsAndLabels() {
    try {
      if (ApiService.isOfflineMode()) {
        return demoData.formsAndLabels;
      }

      const cached = await ApiService.getCachedData('formsAndLabels');
      if (cached) {
        return cached;
      }

      const data = await ApiService.getFormsAndLabels();
      await ApiService.setCachedData('formsAndLabels', data);
      return data;

    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.warn('Failed to load forms and labels, using demo data:', error);
      }
      return demoData.formsAndLabels;
    }
  },

  async loadDepartments() {
    try {
      if (ApiService.isOfflineMode()) {
        return demoData.departments;
      }

      const cached = await ApiService.getCachedData('departments');
      if (cached) {
        return cached;
      }

      const data = await ApiService.getDepartments();
      await ApiService.setCachedData('departments', data);
      return data;

    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.warn('Failed to load departments, using demo data:', error);
      }
      return demoData.departments;
    }
  },

  async loadDowntimeEvents() {
    try {
      if (ApiService.isOfflineMode()) {
        return demoData.downtimeEvents;
      }

      const cached = await ApiService.getCachedData('downtimeEvents');
      if (cached) {
        return cached;
      }

      const data = await ApiService.getDowntimeEvents();
      await ApiService.setCachedData('downtimeEvents', data);
      return data;

    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.warn('Failed to load downtime events, using demo data:', error);
      }
      return demoData.downtimeEvents;
    }
  },

  async loadComplianceData() {
    try {
      if (ApiService.isOfflineMode()) {
        return demoData.compliance;
      }

      const cached = await ApiService.getCachedData('compliance');
      if (cached) {
        return cached;
      }

      const data = await ApiService.getComplianceData();
      await ApiService.setCachedData('compliance', data);
      return data;

    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.warn('Failed to load compliance data, using demo data:', error);
      }
      return demoData.compliance;
    }
  },

  async loadDowntimeTrend(months = 6) {
    try {
      if (ApiService.isOfflineMode()) {
        // Generate demo trend data
        const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
        return months.map((month, index) => ({
          month,
          count: index < 4 ? 0 : 1
        }));
      }

      const data = await ApiService.getDowntimeTrend(months);
      return data;

    } catch (error) {
      // Only log non-network errors
      if (!error.message.includes('Network unavailable')) {
        console.warn('Failed to load downtime trend, using demo data:', error);
      }
      const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
      return months.map((month, index) => ({
        month,
        count: index < 4 ? 0 : 1
      }));
    }
  },

  // Update specific data
  async updateDepartmentPreparedness(departmentId, prepared) {
    try {
      if (ApiService.isOfflineMode()) {
        // Update local demo data
        const dept = dashboardData.departments.find(d => d.id === departmentId);
        if (dept) {
          dept.prepared = prepared;
          dept.lastUpdated = new Date().toISOString();
        }
        return dept;
      }

      const updatedDept = await ApiService.updateDepartmentPreparedness(departmentId, prepared);
      
      // Update local data
      const index = dashboardData.departments.findIndex(d => d.id === departmentId);
      if (index !== -1) {
        dashboardData.departments[index] = updatedDept;
      }

      // Clear cache to force refresh
      await ApiService.setCachedData('departments', dashboardData.departments);
      
      return updatedDept;

    } catch (error) {
      console.error('Failed to update department preparedness:', error);
      throw error;
    }
  },

  async createDowntimeEvent(eventData) {
    try {
      if (ApiService.isOfflineMode()) {
        // Add to local demo data
        const newEvent = {
          id: Date.now(),
          ...eventData,
          date: eventData.date || new Date().toISOString().split('T')[0]
        };
        dashboardData.downtimeEvents.push(newEvent);
        return newEvent;
      }

      const newEvent = await ApiService.createDowntimeEvent(eventData);
      dashboardData.downtimeEvents.push(newEvent);
      
      // Clear cache to force refresh
      await ApiService.setCachedData('downtimeEvents', dashboardData.downtimeEvents);
      
      return newEvent;

    } catch (error) {
      console.error('Failed to create downtime event:', error);
      throw error;
    }
  },

  // Refresh data
  async refreshData() {
    try {
      // Clear cache
      ApiService.clearCache();
      
      // Reload data
      await this.loadDashboardData();
      
      // Update UI
      if (window.updateKPICards) {
        window.updateKPICards();
      }
      if (window.initDashboardCharts) {
        window.initDashboardCharts();
      }
      
      return dashboardData;

    } catch (error) {
      console.error('Failed to refresh data:', error);
      throw error;
    }
  },

  // Get current data
  getCurrentData() {
    return dashboardData;
  },

  // Check if data is stale (older than 5 minutes)
  isDataStale() {
    if (!dashboardData.lastUpdated) return true;
    
    const lastUpdated = new Date(dashboardData.lastUpdated);
    const now = new Date();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes
    
    return (now - lastUpdated) > staleThreshold;
  }
};

// Initialize with demo data initially
dashboardData = { ...demoData, isLoading: false, lastUpdated: new Date().toISOString(), isOffline: true };

// Export for use in other modules
window.dashboardData = dashboardData;
window.preparednessChart = preparednessChart;
window.downtimeTrendChart = downtimeTrendChart;
window.DataService = DataService;
