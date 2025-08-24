require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'BCP Audit Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Basic auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      message: 'Login successful',
      user: {
        id: 1,
        username: 'admin',
        role: 'admin'
      },
      token: 'demo-token-123'
    });
  } else {
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid username or password'
    });
  }
});

// Dashboard overview endpoint
app.get('/dashboard/overview', (req, res) => {
  res.json({
    totalForms: 31,
    totalDepartments: 28,
    complianceRate: 85.7,
    recentDowntimeEvents: 3,
    lastUpdated: new Date().toISOString(),
    kpis: {
      formsCompleted: 28,
      formsPending: 3,
      departmentsCompliant: 24,
      departmentsNonCompliant: 4
    },
    complianceScore: {
      completed: 28,
      total: 31,
      percentage: 90.3
    }
  });
});

// Forms and labels endpoint
app.get('/forms-labels', (req, res) => {
  res.json({
    data: [
      { id: 1, name: 'Admission', status: 'completed', lastUpdated: '2024-01-15T10:30:00Z' },
      { id: 2, name: 'Appointment Request', status: 'completed', lastUpdated: '2024-01-15T09:15:00Z' },
      { id: 3, name: 'Assign Bed Mark Patient Arrival', status: 'completed', lastUpdated: '2024-01-15T08:45:00Z' },
      { id: 4, name: 'Blood Donor', status: 'pending', lastUpdated: '2024-01-14T16:20:00Z' },
      { id: 5, name: 'Blood Transfusion', status: 'completed', lastUpdated: '2024-01-15T11:00:00Z' },
      { id: 6, name: 'Body Part Registration', status: 'completed', lastUpdated: '2024-01-15T07:30:00Z' },
      { id: 7, name: 'Check Out', status: 'completed', lastUpdated: '2024-01-15T12:15:00Z' },
      { id: 8, name: 'Collection', status: 'completed', lastUpdated: '2024-01-15T13:45:00Z' },
      { id: 9, name: 'Decease Registration', status: 'completed', lastUpdated: '2024-01-15T14:20:00Z' },
      { id: 10, name: 'Discharge Summary', status: 'completed', lastUpdated: '2024-01-15T15:00:00Z' },
      { id: 11, name: 'Donor Screening', status: 'pending', lastUpdated: '2024-01-14T17:30:00Z' },
      { id: 12, name: 'Downtime Encounter Sheet', status: 'completed', lastUpdated: '2024-01-15T16:15:00Z' },
      { id: 13, name: 'Inpatient Discharge', status: 'completed', lastUpdated: '2024-01-15T17:00:00Z' },
      { id: 14, name: 'Inpatient Discharge Advice', status: 'completed', lastUpdated: '2024-01-15T17:45:00Z' },
      { id: 15, name: 'Inpatient Transfer Form', status: 'completed', lastUpdated: '2024-01-15T18:30:00Z' },
      { id: 16, name: 'Inventory Request', status: 'completed', lastUpdated: '2024-01-15T19:15:00Z' },
      { id: 17, name: 'Medication Order', status: 'completed', lastUpdated: '2024-01-15T20:00:00Z' },
      { id: 18, name: 'Newborn Registration', status: 'completed', lastUpdated: '2024-01-15T20:45:00Z' },
      { id: 19, name: 'Patient Registration', status: 'completed', lastUpdated: '2024-01-15T21:30:00Z' },
      { id: 20, name: 'Lab Investigation (Per Pat)', status: 'completed', lastUpdated: '2024-01-15T22:15:00Z' },
      { id: 21, name: 'Referral Registration', status: 'pending', lastUpdated: '2024-01-14T18:45:00Z' },
      { id: 22, name: 'Register Attendance', status: 'completed', lastUpdated: '2024-01-15T23:00:00Z' },
      { id: 23, name: 'Register Visit', status: 'completed', lastUpdated: '2024-01-15T23:45:00Z' },
      { id: 24, name: 'Secondary Triage', status: 'completed', lastUpdated: '2024-01-16T00:30:00Z' },
      { id: 25, name: 'Result Reporting', status: 'completed', lastUpdated: '2024-01-16T01:15:00Z' },
      { id: 26, name: 'Generic Referral', status: 'completed', lastUpdated: '2024-01-16T02:00:00Z' },
      { id: 27, name: 'New Order', status: 'completed', lastUpdated: '2024-01-16T02:45:00Z' },
      { id: 28, name: 'Specimen Downtime Label', status: 'completed', lastUpdated: '2024-01-16T03:30:00Z' },
      { id: 29, name: 'Admission Downtime Label', status: 'completed', lastUpdated: '2024-01-16T04:15:00Z' },
      { id: 30, name: 'Freezer Tag Label', status: 'completed', lastUpdated: '2024-01-16T05:00:00Z' },
      { id: 31, name: 'Body Tag Label', status: 'completed', lastUpdated: '2024-01-16T05:45:00Z' }
    ]
  });
});

// Departments endpoint
app.get('/departments', (req, res) => {
  res.json({
    data: [
      // Inpatient Wards
      { id: 1, name: 'Ward 4A', prepared: true, formsCount: 25, lastAudit: '2024-01-15T10:00:00Z' },
      { id: 2, name: 'Ward 4B', prepared: true, formsCount: 28, lastAudit: '2024-01-15T11:30:00Z' },
      { id: 3, name: 'Ward 3A', prepared: false, formsCount: 18, lastAudit: '2024-01-14T09:15:00Z' },
      { id: 4, name: 'Ward 3B', prepared: true, formsCount: 22, lastAudit: '2024-01-15T12:45:00Z' },
      { id: 5, name: 'Ward 2A', prepared: true, formsCount: 30, lastAudit: '2024-01-15T14:20:00Z' },
      { id: 6, name: 'Ward 2B', prepared: true, formsCount: 27, lastAudit: '2024-01-15T15:30:00Z' },
      { id: 7, name: 'Ward 2C', prepared: false, formsCount: 20, lastAudit: '2024-01-14T16:45:00Z' },
      { id: 8, name: 'High Dependency Ward (HDW)', prepared: true, formsCount: 31, lastAudit: '2024-01-15T16:00:00Z' },
      { id: 9, name: 'Intensive Care Unit (ICU)', prepared: true, formsCount: 31, lastAudit: '2024-01-15T17:15:00Z' },
      
      // Outpatient Clinics
      { id: 10, name: 'O&G Clinic', prepared: true, formsCount: 15, lastAudit: '2024-01-15T08:30:00Z' },
      { id: 11, name: 'Eye Clinic', prepared: true, formsCount: 12, lastAudit: '2024-01-15T09:45:00Z' },
      { id: 12, name: 'Dental Clinic', prepared: false, formsCount: 8, lastAudit: '2024-01-14T10:20:00Z' },
      { id: 13, name: 'ORL Clinic', prepared: true, formsCount: 14, lastAudit: '2024-01-15T10:15:00Z' },
      { id: 14, name: 'Specialist Counter', prepared: true, formsCount: 10, lastAudit: '2024-01-15T11:00:00Z' },
      { id: 15, name: 'Psychiatric Clinic', prepared: true, formsCount: 16, lastAudit: '2024-01-15T12:30:00Z' },
      
      // Obstetrics & Gynecology
      { id: 16, name: 'Nurses Home', prepared: true, formsCount: 5, lastAudit: '2024-01-15T13:45:00Z' },
      { id: 17, name: 'O&G SCN', prepared: true, formsCount: 20, lastAudit: '2024-01-15T14:30:00Z' },
      { id: 18, name: 'O&G Labour Room', prepared: true, formsCount: 25, lastAudit: '2024-01-15T15:15:00Z' },
      { id: 19, name: 'O&G PAC', prepared: false, formsCount: 12, lastAudit: '2024-01-14T16:00:00Z' },
      
      // Pharmacy
      { id: 20, name: 'Inpatient Pharmacy', prepared: true, formsCount: 8, lastAudit: '2024-01-15T16:45:00Z' },
      { id: 21, name: 'Outpatient Pharmacy', prepared: true, formsCount: 6, lastAudit: '2024-01-15T17:30:00Z' },
      
      // Laboratory
      { id: 22, name: 'Laboratory', prepared: true, formsCount: 18, lastAudit: '2024-01-15T18:15:00Z' },
      { id: 23, name: 'Outpatient Laboratory', prepared: true, formsCount: 15, lastAudit: '2024-01-15T19:00:00Z' },
      
      // Others
      { id: 24, name: 'Hemodialysis Unit', prepared: true, formsCount: 12, lastAudit: '2024-01-15T19:45:00Z' },
      { id: 25, name: 'Rehabilitation', prepared: false, formsCount: 10, lastAudit: '2024-01-14T20:30:00Z' },
      { id: 26, name: 'Forensic Unit', prepared: true, formsCount: 8, lastAudit: '2024-01-15T20:15:00Z' },
      { id: 27, name: 'Revenue Unit', prepared: true, formsCount: 5, lastAudit: '2024-01-15T21:00:00Z' },
      { id: 28, name: 'Accident & Emergency', prepared: true, formsCount: 31, lastAudit: '2024-01-15T21:45:00Z' }
    ]
  });
});

// Downtime events endpoint
app.get('/downtime-events', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        department: 'Emergency Department',
        type: 'System Maintenance',
        duration: '2 hours',
        date: '2024-01-15T08:00:00Z',
        status: 'resolved'
      },
      {
        id: 2,
        department: 'ICU',
        type: 'Power Outage',
        duration: '45 minutes',
        date: '2024-01-14T22:30:00Z',
        status: 'resolved'
      },
      {
        id: 3,
        department: 'General Ward',
        type: 'Network Issue',
        duration: '1.5 hours',
        date: '2024-01-13T14:15:00Z',
        status: 'resolved'
      }
    ]
  });
});

// Compliance overview endpoint
app.get('/compliance/overview', (req, res) => {
  res.json({
    data: {
      overallCompliance: 85.7,
      departmentsCompliant: 24,
      totalDepartments: 28,
      formsCompleted: 28,
      totalForms: 31,
      lastAuditDate: '2024-01-15T10:00:00Z',
      nextAuditDate: '2024-02-15T10:00:00Z'
    }
  });
});

// Downtime trend endpoint
app.get('/downtime-events/trend', (req, res) => {
  const months = parseInt(req.query.months) || 6;
  res.json({
    data: [
      { month: 'August', events: 2, avgDuration: 1.5, count: 2 },
      { month: 'September', events: 1, avgDuration: 0.75, count: 1 },
      { month: 'October', events: 3, avgDuration: 2.0, count: 3 },
      { month: 'November', events: 2, avgDuration: 1.25, count: 2 },
      { month: 'December', events: 1, avgDuration: 0.5, count: 1 },
      { month: 'January', events: 3, avgDuration: 1.33, count: 3 }
    ]
  });
});

// Current user endpoint
app.get('/users/me', (req, res) => {
  res.json({
    data: {
      id: 1,
      username: 'admin',
      name: 'ICT Administrator',
      email: 'admin@hospital.com',
      role: 'ict-admin',
      department: 'Information Technology',
      lastLogin: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('BCP Audit Backend Server Started');
  console.log('Server running on port ' + PORT);
  console.log('Health check: http://localhost:' + PORT + '/health');
  console.log('Login endpoint: http://localhost:' + PORT + '/api/auth/login');
});

