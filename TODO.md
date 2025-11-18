# TODO: Fix Branding, Authentication, Admin Pages, and Colors

## Branding Updates

- [ ] Update README.md to replace "ALLIVA" with "SenseAid"
- [ ] Update PROJECT_SUMMARY.md to replace "ALLIVA" with "SenseAid"
- [ ] Update QUICK_START.md to replace "ALLIVA" with "SenseAid"
- [ ] Update THEME_UPDATES.md to replace "ALLIVA" with "SenseAid"
- [ ] Update src/app/blog/page.tsx to use "SenseAid" instead of "ALLIVA"
- [ ] Standardize Navigation.tsx to use "SenseAid" (no space)

## Authentication Redirects

- [x] Fix courses page to redirect to login instead of showing message
- [x] Add auth check and redirect to messages page
- [x] Add auth check and redirect to services page
- [x] Add auth check and redirect to mutism page
- [x] Add auth check and redirect to deafness page
- [x] Add auth check and redirect to blindness page

## Admin Pages Styling

- [ ] Style admin login page (src/app/admin/login/page.tsx) with Navigation and theme support
- [ ] Style admin dashboard page (src/app/admin/page.tsx) with Navigation and theme support

## Color Changes

- [ ] Update theme store (src/store/themeStore.ts) to change black/dark backgrounds to white/light

## Testing

- [ ] Test all authentication redirects work properly
- [ ] Verify admin pages are styled and functional
- [ ] Check that color changes work across all themes
- [ ] Run application to ensure no errors
