# BCP Audit Site - Local File Storage

## Overview
This application now supports local file storage in addition to browser-based IndexedDB storage. When you save an audit record, it will be stored both in the browser database and downloaded as a local JSON file.

## Local File Storage

### How It Works
- **Save Button**: Saves the current form to both IndexedDB and downloads a local JSON file
- **File Location**: Files are downloaded to your browser's default download folder
- **File Naming**: `bcp_audit_[Unit]_[Date]_series_[Series].json`

### File Structure
Each saved file contains:
```json
{
  "version": "1.0",
  "savedAt": "2024-01-15T10:30:00.000Z",
  "record": {
    "id": 1,
    "unit": "Ward 2A",
    "auditDate": "2024-01-15",
    "series": "6",
    "signerName": "John Doe",
    "remarks": "All forms prepared",
    "signature": "data:image/png;base64,...",
    "items": [...],
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "metadata": {
    "filename": "bcp_audit_Ward_2A_2024-01-15_series_6.json",
    "totalItems": 28,
    "checkedItems": 15
  }
}
```

## Data Management Features

### 📊 Data Menu Options

#### Export Functions
- **📄 Export JSON**: Export all records as a single JSON backup file
- **📊 Export CSV**: Export summary data as CSV for analysis
- **💾 Backup All Data**: Create a complete backup with metadata

#### Import Functions
- **📥 Import JSON**: Import multiple JSON files (backup or individual records)
- **📂 Load Record File**: Load a single record file into the form for editing
- **🔄 Restore Backup**: Restore from a full backup (replaces all existing data)

#### Management Functions
- **🗑️ Clear All Data**: Remove all stored records (with confirmation)

## Usage Instructions

### Saving Records
1. Fill out the audit form
2. Click "Save" button
3. Record is saved to browser database
4. JSON file is automatically downloaded

### Loading Records
1. Click "📊 Data" → "📂 Load Record File"
2. Select a previously saved JSON file
3. Record loads into the form for editing
4. Click "Save" to update the record

### Importing Multiple Records
1. Click "📊 Data" → "📥 Import JSON"
2. Select one or more JSON files
3. Records are added to the database
4. View imported records in the History tab

### Creating Backups
1. Click "📊 Data" → "💾 Backup All Data"
2. Complete backup file is downloaded
3. Use this file for "🔄 Restore Backup" if needed

## File Organization

### Recommended Folder Structure
```
BCP Audit Site/
├── bcp_audit_single_page_demo_indexed_db_pdf.html
├── data/                           # Create this folder for organization
│   ├── bcp_audit_Ward_2A_2024-01-15_series_6.json
│   ├── bcp_audit_ICU_2024-01-16_series_7.json
│   └── backups/
│       └── bcp_audit_full_backup_2024-01-15-10-30-00.json
└── README.md
```

### Manual File Organization
Since files are downloaded to your browser's download folder, you can:
1. Move downloaded files to the `./data/` folder
2. Organize by date, unit, or series
3. Create subfolders for different types of records

## Security Notes
- All data is stored locally in your browser
- Files contain sensitive healthcare information
- Keep backup files secure and encrypted if needed
- Consider using a secure folder for sensitive data

## Browser Compatibility
- Works with all modern browsers that support IndexedDB
- File downloads work in Chrome, Firefox, Safari, Edge
- Mobile browsers may have different download behaviors

## Troubleshooting

### Files Not Downloading
- Check browser download settings
- Ensure popup blockers are disabled
- Check browser console for errors

### Import Not Working
- Verify file format is valid JSON
- Check file contains valid record data
- Try importing one file at a time

### Data Loss Prevention
- Regularly create backups using "💾 Backup All Data"
- Keep multiple copies of important records
- Test restore functionality periodically
