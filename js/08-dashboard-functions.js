// ============================================================================
// DASHBOARD FUNCTIONS
// ============================================================================

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

      const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
      const eventCounts = [0, 0, 0, 0, 1, 1]; // Demo data for past 6 months

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

// Export for use in other modules
window.initDashboardCharts = initDashboardCharts;
window.updateKPICards = updateKPICards;
window.showComingSoon = showComingSoon;
window.closeComingSoon = closeComingSoon;
window.initICTDashboard = initICTDashboard;
window.showChartFallback = showChartFallback;
