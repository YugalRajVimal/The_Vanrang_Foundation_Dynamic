# Wiring the User Dashboard into App.js

```jsx
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import ProfileOverview from './pages/dashboard/ProfileOverview'
import DonationHistory from './pages/dashboard/DonationHistory'
import CertificateRequests from './pages/dashboard/CertificateRequests'

// inside <Routes>:
<Route
  path="/dashboard"
  element={
    <ProtectedRoute role="user">
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<ProfileOverview />} />
  <Route path="donations" element={<DonationHistory />} />
  <Route path="certificate-requests" element={<CertificateRequests />} />
</Route>
```

Nested routes render into `DashboardLayout`'s `<Outlet />`, so the tab nav
stays mounted across the three pages instead of remounting on every switch.

## Notes / things to confirm with backend
- `GET /donations/me/:id/receipt` is assumed to return a PDF binary — the
  download handler fetches it directly (bypassing the JSON-envelope client)
  and opens it in a new tab. If the backend instead returns a JSON body with
  a signed URL, this needs a one-line change (open `data.url` instead of the
  blob) — let me know which it is once that endpoint exists.
- `POST /certificate-requests` — used JSON when there's no file, `multipart/
  form-data` only when `supportingDocs` is attached. Confirm backend accepts
  both, or tell me to always send multipart.
- No edit-profile form built (per spec 3.2: "no edit-profile form in v1
  unless you want one — if you do, add PUT /users/me to Section 2 first").
