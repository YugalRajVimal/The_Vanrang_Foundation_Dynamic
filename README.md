# The Vanrang Foundation — Frontend

Full React frontend for The Vanrang Foundation, wired to the shared REST API
contract. Built with React 18, react-router-dom v6, Tailwind CSS, and
framer-motion.

## Setup

```bash
npm install
cp .env.example .env        # then set REACT_APP_API_BASE_URL
npm start
```

For production builds, also create `.env.production` with the live API URL.

> **Note:** `npm run build` sets `DISABLE_ESLINT_PLUGIN=true` — this environment
> has a known version conflict between `eslint@8.57` and `eslint-plugin-jest@25`
> bundled with `react-scripts@5` (`Environment key "jest/globals" is unknown`)
> that fails the build otherwise. This is a CRA/eslint compatibility issue, not
> an issue with the app code — `npm start` and linting in your editor are
> unaffected. This whole project was built and verified with `npm run build`
> before delivery.

### Static assets you need to add to `/public`

The app references these but they aren't included in this delivery — add
your own:

- `logo.png` — site logo (navbar, footer)
- `threads.png` — Threads social icon
- `favicon.ico`
- `CASHFREE-QR.png`, `QR.jpeg` — donation QR codes (DonatePage)
- `assets/Img1.jpeg` … `Img6.jpeg` — fallback imagery shown before API data loads
  (homepage carousel fallback, plantation drives hero, etc.)

## Project structure

```
src/
  api/client.js              Fetch wrapper — envelope handling, auth header, ApiError
  context/AuthContext.js     JWT (localStorage) + user state, login/register/logout
  hooks/useFetch.js          Shared loading/error/retry data-fetching hook
  components/
    common/DataStates.js     Skeleton, empty, and error-state UI
    admin/AdminUI.js         Modal, confirm dialog, form field, buttons for admin pages
    auth/AuthFormBits.js     Shared field/card/button for the auth pages
    NavBar.js, Footer.js, HeroSection.js, AboutUs.js, TransparencySection.js,
    VolunteerSection.js, ContactSection.js, GalleryCarousel.js, InternshiForm.js,
    PrivacyPolicy.js, TermsAndCondition.js, ProtectedRoute.js
  pages/
    public/                  About, PlantationDrives, GalleryPage, ContactPage,
                              TeamPage, DonatePage, DonateStatus, CertificationPage,
                              CausesPage
    auth/                    Login, Register, ForgotPassword, ResetPassword, AdminLogin
    dashboard/                DashboardLayout, ProfileOverview, DonationHistory,
                              CertificateRequests   (all under /dashboard, role: user)
    admin/                    AdminLayout, AdminHome, AdminBanners, AdminGallery,
                              AdminBlogs, AdminTeam, AdminCertifications, AdminUsers,
                              AdminContactSettings, AdminCertificateRequests,
                              AdminDonations   (all under /admin, role: admin)
  App.js                     All routes wired together
```

## Auth

JWT is stored in `localStorage` (agreed tradeoff — see `pages/auth/README_WIRING.md`
for the reasoning: the contract has no `/auth/refresh` endpoint, so an
in-memory-only token would log users out on every page refresh).

`<ProtectedRoute role="user">` / `<ProtectedRoute role="admin">` guard the
dashboard and admin route trees respectively and redirect to `/login` or
`/admin/login` if there's no valid session.

## Known gaps against the API contract

These are flagged in code comments at the relevant file, and summarized here
so they're easy to track and send back to backend:

1. **Internship applications** (`components/InternshiForm.js`) — the form
   collects a resume, photo, and ID proof, but `POST /internship-applications`
   has no file fields. The richer fields are folded into `message`; the UI
   tells applicants to email the three documents separately until an upload
   endpoint exists.

2. **Volunteer applications** (`pages/public/ContactPage.js`) — no matching
   endpoint exists at all yet. The form is rendered but disabled, with a
   visible note. See `section2-addendum-volunteer.md` for the proposed
   `POST /volunteer-applications` contract addition sent to backend — the
   form will be wired once that's confirmed.

3. **Team featured roles** (`pages/public/TeamPage.js`) — `/team` has no field
   distinguishing Founder/Mentor/Inspiration from the general team. Currently
   detected by matching keywords in `designation` client-side. Recommend
   backend add a `featuredRole` enum if this proves fragile.

4. **Certifications image field** (`pages/admin/AdminCertifications.js`) —
   `POST /certifications` lists `image` as a plain JSON field, not flagged
   multipart like banners/gallery/team. Create is disabled with a note until
   backend confirms whether it expects a hosted URL or a multipart upload.

5. **Blog cover image** (`pages/admin/AdminBlogs.js`) — same ambiguity as
   above for `POST /blogs`'s `coverImage` field. Create is disabled with a
   note; Edit (which doesn't require a new image) works normally.

6. **Donation receipt format** (`pages/dashboard/DonationHistory.js`) —
   assumed `GET /donations/me/:id/receipt` returns a raw PDF; the download
   handler fetches it directly and opens it in a new tab. If it instead
   returns a JSON signed URL, swap to `window.open(data.url)`.

7. **Certificate request uploads** (`pages/dashboard/CertificateRequests.js`)
   — sends JSON normally, switches to `multipart/form-data` only when a file
   is attached to `supportingDocs`. Confirm this matches what the backend
   expects.

8. **Bug report form** (`pages/public/ContactPage.js`) — no `/bug-reports`
   endpoint in the contract; kept as the original client-side-only demo
   submission.

None of the above block the rest of the app — everything else (auth, gallery,
team, certifications view, blogs, banners, contact form, dashboard, and all
nine admin sections) is fully wired to the contract as specified.
