# HIS Business Continuity Plan (BCP) Compliance Management System

A web-based application for managing Business Continuity Plan compliance audits in healthcare settings.

## Overview

This system provides a streamlined interface for different user roles to manage BCP compliance:

- **ICT Administrators**: Conduct audits, track compliance, generate reports (requires password)
- **Non-ICT Users**: View compliance status, download forms, submit feedback (direct access)

## Features

### Role-Based Access
- **ICT Administrator**: Full access to audit functionality, dashboard, and reports
- **Non-ICT User**: View-only access to compliance data and form downloads

### ICT Administrator Features
- Dashboard with compliance metrics
- Audit conduction tools
- Audit history tracking
- Compliance reports generation

### Non-ICT User Features
- View unit compliance status
- Download BCP manual forms
- Submit feedback and suggestions
- View audit history for their unit

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. The application will load immediately

### Usage

#### Accessing the System
1. Open `index.html` in your browser
2. You'll see the role selection screen with two options:
   - **ICT Administrator** (requires password)
   - **Non-ICT User** (direct access)

#### ICT Administrator Login
- Click on "ICT Administrator" card
- Enter credentials in the login modal:
  - **Username**: `admin`
  - **Password**: `admin123`
- Click "Login" to access the system

#### Non-ICT User Access
- Click on "Non-ICT User" card
- Direct access to the user interface (no password required)

#### Navigation
- Use the tab navigation to switch between different sections
- Click "Switch Role" to return to role selection
- Click "Logout" to return to role selection

## File Structure

```
online-audit-bcp-demo/
├── index.html          # Main application file
├── styles.css          # Custom styling
└── README.md           # This file
```

## Technical Details

### Frontend Technologies
- **HTML5**: Structure and content
- **CSS3**: Styling and layout
- **TailwindCSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Client-side functionality

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Role-Based Access Control**: Different interfaces for different user types
- **Modal Authentication**: Secure login for ICT administrators
- **Tab Navigation**: Clean, organized interface
- **Notification System**: User feedback for actions

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- This is a demo application with hardcoded credentials
- In production, implement proper authentication and authorization
- Store sensitive data securely
- Use HTTPS in production environments

## Demo Credentials

### ICT Administrator
- **Username**: `admin`
- **Password**: `admin123`

### Non-ICT User
- No credentials required - direct access

## Development

### Local Development
1. Download the project files
2. Open `index.html` in your browser
3. Make changes to HTML, CSS, or JavaScript as needed
4. Refresh the browser to see changes

### Customization
- Modify `styles.css` for styling changes
- Update the JavaScript in `index.html` for functionality changes
- Add new roles by extending the role selection interface

## Future Enhancements

- Database integration for persistent data storage
- Real authentication system
- PDF generation for reports
- Email notifications
- Mobile app version
- Advanced audit forms
- Real-time collaboration features

## License

This project is for demonstration purposes. Please ensure compliance with your organization's security policies before deployment.

## Support

For questions or issues, please refer to the code comments or create an issue in the project repository.
