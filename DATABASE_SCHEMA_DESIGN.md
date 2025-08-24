# Database Schema Design for BCP Audit System

## 📊 **Data Structure Analysis**

Based on your Excel data, we have a well-structured audit system with three main entities:

### **Current Excel Structure → Proposed Database Tables**

| Excel Sheet | Database Table | Purpose |
|-------------|----------------|---------|
| Audit Form (Single Sheet) | `audit_info` | Core audit metadata |
| - | `audit_forms` | BCP forms checklist |
| - | `audit_signatures` | User signatures and approvals |

## 🗃️ **Database Schema Design**

### **1. Core Tables**

#### **`audit_info` Table**
```sql
CREATE TABLE audit_info (
    audit_id SERIAL PRIMARY KEY,
    area_section_unit VARCHAR(255) NOT NULL,
    date_of_audit DATE NOT NULL,
    series VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **`audit_forms` Table**
```sql
CREATE TABLE audit_forms (
    form_id SERIAL PRIMARY KEY,
    audit_id INTEGER NOT NULL REFERENCES audit_info(audit_id) ON DELETE CASCADE,
    form_name VARCHAR(255) NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    date_of_usage DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(audit_id, form_name) -- Prevent duplicate forms per audit
);
```

#### **`audit_signatures` Table**
```sql
CREATE TABLE audit_signatures (
    id SERIAL PRIMARY KEY,
    audit_id INTEGER NOT NULL REFERENCES audit_info(audit_id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL CHECK (role IN ('User', 'Auditor (DCT)', 'Project Manager (DCT)', 'HOD (ICT)')),
    name VARCHAR(255) NOT NULL,
    signature TEXT, -- Digital signature or file path
    date_signed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2. Supporting Tables**

#### **`form_categories` Table** (Predefined BCP Forms)
```sql
CREATE TABLE form_categories (
    id SERIAL PRIMARY KEY,
    form_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **`users` Table** (For Authentication)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    full_name VARCHAR(255),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **`departments` Table** (For Organization)
```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    area_section_unit VARCHAR(255),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **3. Audit History & Analytics Tables**

#### **`audit_history` Table** (For Trend Analysis)
```sql
CREATE TABLE audit_history (
    id SERIAL PRIMARY KEY,
    audit_id INTEGER REFERENCES audit_info(audit_id),
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'completed'
    changes JSONB, -- Store what changed
    performed_by INTEGER REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **`compliance_metrics` Table** (For Dashboard)
```sql
CREATE TABLE compliance_metrics (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    audit_date DATE NOT NULL,
    total_forms INTEGER DEFAULT 0,
    checked_forms INTEGER DEFAULT 0,
    compliance_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔗 **Relationships & Constraints**

### **Primary Relationships**
```sql
-- One audit can have many forms
audit_info (1) ←→ (N) audit_forms

-- One audit can have many signatures
audit_info (1) ←→ (N) audit_signatures

-- One department can have many audits
departments (1) ←→ (N) audit_info

-- One user can perform many audits
users (1) ←→ (N) audit_info
```

### **Business Rules Implementation**
```sql
-- Ensure valid dates
ALTER TABLE audit_info ADD CONSTRAINT valid_audit_date 
    CHECK (date_of_usage <= CURRENT_DATE);

-- Ensure unique form names per audit
ALTER TABLE audit_forms ADD CONSTRAINT unique_form_per_audit 
    UNIQUE (audit_id, form_name);

-- Ensure valid roles
ALTER TABLE audit_signatures ADD CONSTRAINT valid_roles 
    CHECK (role IN ('User', 'Auditor (DCT)', 'Project Manager (DCT)', 'HOD (ICT)'));
```

## 📊 **Sample Data Structure**

### **Predefined BCP Forms**
```sql
INSERT INTO form_categories (form_name, description, category) VALUES
('Admission', 'Patient admission forms and procedures', 'Patient Care'),
('Appointment Request', 'Appointment scheduling and management', 'Patient Care'),
('Body Tag Label', 'Patient identification and labeling', 'Patient Care'),
('Discharge Summary', 'Patient discharge documentation', 'Patient Care'),
('Medication Chart', 'Medication administration records', 'Patient Care'),
('Nursing Care Plan', 'Nursing assessment and care planning', 'Patient Care'),
('Vital Signs Chart', 'Patient vital signs monitoring', 'Patient Care'),
('Consent Form', 'Patient consent documentation', 'Legal'),
('Incident Report', 'Adverse event reporting', 'Safety'),
('Equipment Checklist', 'Medical equipment verification', 'Safety');
```

### **Sample Audit Data**
```sql
-- Sample audit
INSERT INTO audit_info (area_section_unit, date_of_audit, series, remarks) VALUES
('Emergency Department - Triage', '2024-01-15', 'Q1-2024', 'Routine BCP compliance audit');

-- Sample forms for this audit
INSERT INTO audit_forms (audit_id, form_name, is_checked, date_of_usage) VALUES
(1, 'Admission', TRUE, '2024-01-15'),
(1, 'Appointment Request', TRUE, '2024-01-15'),
(1, 'Body Tag Label', FALSE, NULL),
(1, 'Discharge Summary', TRUE, '2024-01-15');

-- Sample signatures
INSERT INTO audit_signatures (audit_id, role, name, date_signed) VALUES
(1, 'User', 'Dr. Sarah Johnson', '2024-01-15 10:30:00'),
(1, 'Auditor (DCT)', 'Dr. Michael Chen', '2024-01-15 11:00:00'),
(1, 'HOD (ICT)', 'Prof. David Smith', '2024-01-15 11:15:00');
```

## 🚀 **API Endpoints Design**

### **Audit Management**
```
GET    /api/audits                    # List all audits
POST   /api/audits                    # Create new audit
GET    /api/audits/:id                # Get specific audit
PUT    /api/audits/:id                # Update audit
DELETE /api/audits/:id                # Delete audit

GET    /api/audits/:id/forms          # Get forms for audit
POST   /api/audits/:id/forms          # Add form to audit
PUT    /api/audits/:id/forms/:formId  # Update form status

GET    /api/audits/:id/signatures     # Get signatures for audit
POST   /api/audits/:id/signatures     # Add signature to audit
```

### **Dashboard & Analytics**
```
GET    /api/dashboard/overview        # Dashboard summary
GET    /api/dashboard/compliance      # Compliance metrics
GET    /api/dashboard/trends          # Trend analysis
GET    /api/reports/audit/:id         # Generate audit report
```

### **Form Management**
```
GET    /api/forms                     # List all BCP forms
POST   /api/forms                     # Add new form category
PUT    /api/forms/:id                 # Update form category
DELETE /api/forms/:id                 # Delete form category
```

## 📋 **Data Migration Strategy**

### **Phase 1: Excel to Database**
1. **Extract** data from Excel file
2. **Transform** single sheet into normalized tables
3. **Load** data into database with proper relationships
4. **Validate** data integrity and constraints

### **Phase 2: Data Enhancement**
1. **Add** user authentication system
2. **Create** department hierarchy
3. **Implement** audit history tracking
4. **Build** compliance analytics

### **Phase 3: API Development**
1. **Develop** RESTful API endpoints
2. **Implement** authentication middleware
3. **Add** data validation and error handling
4. **Create** comprehensive testing suite

## 🎯 **Next Steps**

1. **Choose Technology Stack** (Node.js/Python/.NET)
2. **Set Up Development Environment**
3. **Create Database Migration Scripts**
4. **Build Excel Data Import Tool**
5. **Develop API Endpoints**
6. **Integrate with Frontend**

This schema design provides a solid foundation for your BCP audit system with proper normalization, relationships, and business rules enforcement.
