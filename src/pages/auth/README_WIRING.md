# Wiring the auth flow into App.js

1. Add to `.env` (and `.env.production` with the real URL):
   ```
   REACT_APP_API_BASE_URL=https://api.vanrangfoundation.org/api/v1
   ```

2. Wrap the whole app in `AuthProvider` (App.js):
   ```jsx
   import { AuthProvider } from './context/AuthContext'
   import Login from './pages/auth/Login'
   import Register from './pages/auth/Register'
   import ForgotPassword from './pages/auth/ForgotPassword'
   import ResetPassword from './pages/auth/ResetPassword'
   import AdminLogin from './pages/auth/AdminLogin'

   const App = () => {
     return (
       <AuthProvider>
         <Router>
           <Navbar />
           <Routes>
             {/* ...existing routes... */}
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/reset-password" element={<ResetPassword />} />
             <Route path="/admin/login" element={<AdminLogin />} />
           </Routes>
           <Footer />
         </Router>
       </AuthProvider>
     )
   }
   ```

3. Dashboard and Admin routes (built in later phases) get wrapped like:
   ```jsx
   <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
   <Route path="/admin" element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
   ```

## Not yet wired (intentionally)
- Navbar doesn't show login/logout state yet — next phase touches NavBar.js.
- No route currently redirects an already-logged-in user away from /login —
  can add if you want that behavior.
