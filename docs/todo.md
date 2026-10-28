# OS performance

- [ ] Route-level skeletons (`loading.tsx`) for Dashboard, Kontakte, Kontakt, Zeiterfassung
- [ ] Root layout streams the header's user section instead of blocking the whole shell on the session lookup
- [ ] Zeiterfassung week switching: instant week label + table/total skeleton while the new week loads
- [ ] better-auth: load session + user in one joined query (`advanced.database.joins`)
- [ ] Client router cache for dynamic pages (`staleTimes.dynamic`) so back-and-forth navigation reuses data
- [ ] Lazy-load the sync date picker (react-day-picker) on first open
- [ ] Lazy-load the better-auth client on click (sign-in, sign-out, calendar connect)
- [ ] Login: don't download the paint background for the inactive theme
- [ ] Measure before/after (route JS, TTFB, DB round trips)
- [ ] Thermos review + fixes
