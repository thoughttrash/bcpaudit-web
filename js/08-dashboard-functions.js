// ============================================================================
// DASHBOARD FUNCTIONS
// ============================================================================

// Initialize dashboard charts
async function initDashboardCharts() {
  try {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet');
      showChartFallback();
      return;
    }

    // Check if canvas elements exist
    const preparednessCtx = document.getElementById('preparednessChart');
    const downtimeCtx = document.getElementById('downtimeTrendChart');
    
    if (!preparednessCtx || !downtimeCtx) {
      console.warn('Chart canvas elements not found');
      return;
    }

    // Remove any existing loading indicators
    document.querySelectorAll('.chart-loading').forEach(el => el.remove());
    
    // Load data from service
    const currentData = DataService.getCurrentData();
    
    // Prepare data for charts
    const preparedCount = currentData.departments.filter(dept => dept.prepared).length;
    const unpreparedCount = currentData.departments.filter(dept => !dept.prepared).length;

    // Pie Chart - Department Preparedness
    if (preparednessCtx) {
      // Destroy existing chart if it exists
      if (window.preparednessChart) {
        window.preparednessChart.destroy();
      }
      
      window.preparednessChart = new Chart(preparednessCtx, {
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
      if (window.downtimeTrendChart) {
        window.downtimeTrendChart.destroy();
      }

      // Load trend data from service
      const trendData = await DataService.loadDowntimeTrend(6);
      const months = trendData.map(item => item.month);
      const eventCounts = trendData.map(item => item.count);

      window.downtimeTrendChart = new Chart(downtimeCtx, {
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

// Update KPI cards with data from service
async function updateKPICards() {
  try {
    const currentData = DataService.getCurrentData();
    
    // Total Forms & Labels
    const totalFormsLabels = document.getElementById('totalFormsLabels');
    if (totalFormsLabels) {
      totalFormsLabels.textContent = currentData.formsAndLabels.length;
    }

    // Prepared Departments Percentage
    const preparedDepartments = document.getElementById('preparedDepartments');
    if (preparedDepartments) {
      const preparedCount = currentData.departments.filter(dept => dept.prepared).length;
      const percentage = Math.round((preparedCount / currentData.departments.length) * 100);
      preparedDepartments.textContent = `${percentage}%`;
    }

    // Downtime Events
    const downtimeEvents = document.getElementById('downtimeEvents');
    if (downtimeEvents) {
      downtimeEvents.textContent = currentData.downtimeEvents.length;
    }

    // Compliance Score
    const complianceScore = document.getElementById('complianceScore');
    if (complianceScore) {
      complianceScore.textContent = `${currentData.compliance.score}/${currentData.compliance.maxScore}`;
    }

    // Update last updated timestamp if available
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement && currentData.lastUpdated) {
      const lastUpdated = new Date(currentData.lastUpdated);
      lastUpdatedElement.textContent = `Last updated: ${lastUpdated.toLocaleString()}`;
    }

    // Show offline indicator if in offline mode
    const offlineIndicator = document.getElementById('offlineIndicator');
    if (offlineIndicator) {
      if (currentData.isOffline) {
        offlineIndicator.style.display = 'block';
        offlineIndicator.textContent = 'Offline Mode - Demo Data';
      } else {
        offlineIndicator.style.display = 'none';
      }
    }
  } catch (error) {
    ErrorHandler.handleError(error, 'updateKPICards');
  }
}

// Load and refresh dashboard data
async function loadDashboardData() {
  try {
    UI.showLoadingOverlay();
    
    await DataService.loadDashboardData();
    
    // Update UI with fresh data
    await updateKPICards();
    await initDashboardCharts();
    
    UI.hideLoadingOverlay();
    
    // Show success notification
    if (!DataService.getCurrentData().isOffline) {
      UI.showNotification('Dashboard data loaded successfully', 'success');
    }
    
  } catch (error) {
    UI.hideLoadingOverlay();
    ErrorHandler.handleError(error, 'loadDashboardData');
  }
}

// Refresh dashboard data
async function refreshDashboardData() {
  try {
    UI.showLoadingOverlay();
    
    await DataService.refreshData();
    
    UI.hideLoadingOverlay();
    UI.showNotification('Dashboard refreshed successfully', 'success');
    
  } catch (error) {
    UI.hideLoadingOverlay();
    ErrorHandler.handleError(error, 'refreshDashboardData');
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

// Initialize ICT Dashboard with data loading
async function initICTDashboard() {
  try {
    // Load dashboard data (this already calls updateKPICards and initDashboardCharts)
    await loadDashboardData();
    
  } catch (error) {
    console.error('Error initializing ICT dashboard:', error);
    // Fallback - try to initialize with existing data
    try {
      await updateKPICards();
      await initDashboardCharts();
    } catch (fallbackError) {
      console.error('Fallback initialization also failed:', fallbackError);
    }
  }
}

// Fallback function if Chart.js fails to load
function showChartFallback() {
  try {
    const preparednessContainer = document.getElementById('preparednessChart')?.parentElement;
    const downtimeContainer = document.getElementById('downtimeTrendChart')?.parentElement;
    
    if (preparednessContainer && !preparednessContainer.querySelector('.chart-loading')) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'chart-loading flex items-center justify-center h-full text-gray-500 absolute inset-0 bg-white bg-opacity-90';
      loadingDiv.textContent = 'Chart loading...';
      preparednessContainer.style.position = 'relative';
      preparednessContainer.appendChild(loadingDiv);
    }
    
    if (downtimeContainer && !downtimeContainer.querySelector('.chart-loading')) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'chart-loading flex items-center justify-center h-full text-gray-500 absolute inset-0 bg-white bg-opacity-90';
      loadingDiv.textContent = 'Chart loading...';
      downtimeContainer.style.position = 'relative';
      downtimeContainer.appendChild(loadingDiv);
    }
  } catch (error) {
    console.error('Error showing chart fallback:', error);
  }
}



// Export for use in other modules
window.initDashboardCharts = initDashboardCharts;
window.updateKPICards = updateKPICards;
window.loadDashboardData = loadDashboardData;
window.refreshDashboardData = refreshDashboardData;
window.showComingSoon = showComingSoon;
window.closeComingSoon = closeComingSoon;
window.initICTDashboard = initICTDashboard;
window.showChartFallback = showChartFallback;

