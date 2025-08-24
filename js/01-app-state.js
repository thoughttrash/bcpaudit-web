// ============================================================================
// APP STATE MANAGEMENT
// ============================================================================

// Global state management
const AppState = {
  currentRole: null,
  currentUser: null,
  isAuthenticated: false,
  isLoading: false
};

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

// Export for use in other modules
window.AppState = AppState;
window.debounce = debounce;

