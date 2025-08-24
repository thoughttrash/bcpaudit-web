# BCP Audit Backend

Backend API server for the BCP Audit System built with Node.js, Express, and SQLite.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ (you have v22.18.0 ✅)
- npm (you have v10.9.3 ✅)

### Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Create environment file**:
   Create a `.env` file in the root directory with:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_PATH=./database/bcp_audit.db
   JWT_SECRET=bcp-audit-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=debug
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
bcp-audit-backend/
├── src/
│   ├── config/
│   │   └── database.js      # SQLite database setup
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── audits.js        # Audit management routes
│   │   └── dashboard.js     # Dashboard routes
│   └── server.js            # Main server file
├── database/                # SQLite database files (auto-created)
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/health` - Auth routes health check

### Audits (Placeholder)
- `GET /api/audits` - List audit endpoints

### Dashboard (Placeholder)
- `GET /api/dashboard/overview` - Dashboard endpoints

## 🔐 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 📊 Database

- **Type**: SQLite
- **File**: `./database/bcp_audit.db` (auto-created)
- **Tables**: users, audit_info, audit_forms, audit_signatures

## 🎯 Next Steps

1. Test the server startup
2. Implement audit CRUD operations
3. Add dashboard analytics
4. Connect to frontend
5. Add data validation and error handling

## 🚀 Ready to Test?

Run `npm run dev` to start the development server!
