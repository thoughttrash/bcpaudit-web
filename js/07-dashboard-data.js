// ============================================================================
// DASHBOARD DATA & CHART INSTANCES
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

// Export for use in other modules
window.dashboardData = dashboardData;
window.preparednessChart = preparednessChart;
window.downtimeTrendChart = downtimeTrendChart;
