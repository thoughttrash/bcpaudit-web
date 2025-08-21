# CSS Modular Architecture

This directory contains the modularized CSS structure for the BCP Audit System.

## Overview

The CSS has been refactored from a single 1,793-line file into 15 modular files for better maintainability, organization, and performance.

## File Structure

```
css/
├── 01-design-system.css      # Design tokens & CSS variables
├── 02-typography.css         # Font setup & typography scale
├── 03-base-layout.css        # HTML/body & page animations
├── 04-cards.css              # Card components
├── 05-forms.css              # Form elements
├── 06-buttons.css            # Button components
├── 07-badges.css             # Badges & status indicators
├── 08-tabs.css               # Tab navigation
├── 09-utilities.css          # Utility classes
├── 10-animations.css         # Animations & transitions
├── 11-notifications.css      # Notifications & loading
├── 12-sidebar.css            # Sidebar & dashboard
├── 13-responsive.css         # Responsive design
├── 14-accessibility.css      # Accessibility features
├── 15-components.css         # Special components
├── main.css                  # Main file (imports all modules)
└── README.md                 # This file
```

## Module Descriptions

### 01-design-system.css
- CSS custom properties (variables)
- Color system
- Spacing scale
- Typography scale
- Shadow system
- Z-index scale

### 02-typography.css
- Font family setup
- Typography scale classes
- Font smoothing and rendering

### 03-base-layout.css
- HTML/body base styles
- Page load animations
- Scroll behavior

### 04-cards.css
- Base card design
- Role selection cards
- Card hover effects

### 05-forms.css
- Input styles
- Form validation
- Label styling
- Checkbox styling

### 06-buttons.css
- Button base styles
- Button variants (primary, secondary, etc.)
- Loading states
- Button animations

### 07-badges.css
- Role badges
- Status indicators
- Compliance indicators

### 08-tabs.css
- Tab navigation styles
- Active tab states

### 09-utilities.css
- Utility classes
- Loading states
- Screen reader utilities

### 10-animations.css
- Keyframe animations
- Page transitions
- Modal animations
- Hover effects

### 11-notifications.css
- Notification system
- Loading overlays
- Toast messages

### 12-sidebar.css
- Sidebar navigation
- Dashboard components
- KPI cards
- Chart cards

### 13-responsive.css
- Mobile-first responsive design
- Breakpoint-specific styles
- Responsive utilities

### 14-accessibility.css
- Focus indicators
- High contrast mode
- Reduced motion support
- Print styles

### 15-components.css
- Tables
- Feedback forms
- Emergency sections
- Enhanced card animations

## Benefits

### ✅ Maintainability
- Easier to find and modify specific styles
- Clear separation of concerns
- Reduced cognitive load

### ✅ Performance
- Better caching (only load what's needed)
- Smaller individual file sizes
- Faster development builds

### ✅ Collaboration
- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear ownership of components

### ✅ Scalability
- Easy to add new modules
- Clear dependency structure
- Consistent naming conventions

## Usage

### Development
1. Import the main CSS file: `<link rel="stylesheet" href="css/main.css">`
2. Modify individual modules as needed
3. The main.css file automatically imports all modules

### Adding New Styles
1. Identify the appropriate module for your styles
2. Add styles to the relevant module file
3. If creating a new component, consider creating a new module

### Best Practices
- Keep modules focused on a single responsibility
- Use consistent naming conventions
- Follow the established dependency order
- Document any complex CSS logic

## Migration Notes

- The original `styles.css` file has been preserved as a backup
- All existing functionality is maintained
- No breaking changes to the application
- Improved performance and maintainability

## Future Enhancements

- Consider using CSS-in-JS for dynamic styles
- Implement CSS modules for component-scoped styles
- Add PostCSS processing for advanced features
- Consider using a CSS framework like Tailwind CSS more extensively
