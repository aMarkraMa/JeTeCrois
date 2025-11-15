# Internationalization (i18n) Implementation Plan

## Overview
Add internationalization support for French and English using react-i18next in the AreYouSafe React TypeScript application.

## Steps

### 1. Install Dependencies
- [ ] Install react-i18next and i18next using pnpm

### 2. Create i18n Configuration
- [ ] Create src/i18n.ts with language detection and resource loading

### 3. Create Translation Files
- [ ] Create src/locales/en.json with English translations
- [ ] Create src/locales/fr.json with French translations

### 4. Initialize i18n
- [ ] Update src/main.tsx to import and initialize i18n

### 5. Update Components/Pages
- [ ] Update src/pages/Home/index.tsx to use translations
- [ ] Update src/pages/HelpOthers/index.tsx to use translations
- [ ] Update src/pages/FindOut/index.tsx to use translations
- [ ] Update src/pages/Login/index.tsx to use translations
- [ ] Update src/pages/Register/index.tsx to use translations
- [ ] Update src/pages/StudentDashboard/index.tsx to use translations
- [ ] Update src/pages/TeacherDashboard/index.tsx to use translations

### 6. Add Language Switcher
- [ ] Create a LanguageSwitcher component
- [ ] Add language switcher to Home page header

### 7. Testing
- [ ] Run the app and test language switching
- [ ] Ensure all text is translated and no hardcoded strings remain
- [ ] Verify functionality in both languages

## Notes
- Mixed French/English text currently exists in the app
- Use translation keys that are descriptive and consistent
- Ensure accessibility is maintained with translations
