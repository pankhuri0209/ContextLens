# Authentication System - PhD Reader

## Overview
Complete authentication system with sign up, login, password reset, email verification, and onboarding flow for the PhD paper reading assistant.

## Features Implemented

### 1. Public Pages
- **Landing Page** (`/`) - Hero section with features, testimonials, and CTAs
- **Sign Up** (`/signup`) - Email/password registration with social login options
- **Login** (`/login`) - Secure login with demo credentials shown
- **Forgot Password** (`/forgot-password`) - Password reset flow
- **Email Verification** (`/email-verification`) - Verify email after sign up

### 2. Protected Pages (Require Login)
- **Onboarding** (`/onboarding`) - 4-step wizard for first-time users
- **Projects Dashboard** (`/projects`) - Main app with user menu
- **Account Settings** (`/settings`) - Profile, security, integrations, preferences
- All other app screens (reading, workspace, etc.)

### 3. Authentication Features
- ✅ Email/password authentication with validation
- ✅ Social login (Google Scholar, ORCID, Institution SSO)
- ✅ Password strength meter
- ✅ Email verification flow
- ✅ Password reset flow
- ✅ Session management (localStorage-based mock)
- ✅ Protected routes
- ✅ Login rate limiting (5 attempts)
- ✅ Remember me functionality
- ✅ User menu with logout

### 4. Form Components
- `FormInput` - Reusable input with validation states
- `PasswordStrengthMeter` - Visual password strength indicator
- `SocialLoginButton` - OAuth provider buttons
- `UserMenu` - Dropdown menu with user avatar

### 5. Onboarding Flow
1. Welcome screen
2. Research profile (field, area, topics, stage)
3. First project setup (name, question, goal)
4. Upload papers (optional)

## Mock Authentication

The system uses mock authentication with localStorage for demo purposes:

### Demo Credentials
- Email: `demo@stanford.edu`
- Password: `password`

### Mock User Data
```typescript
{
  id: '1',
  email: 'demo@stanford.edu',
  fullName: 'Sarah Chen',
  role: 'phd_candidate',
  researchField: 'Computer Science',
  researchArea: 'Machine Learning',
  researchTopics: ['deep learning', 'transformers', 'NLP'],
  verified: true,
  orcidId: '0000-0002-1825-0097',
  googleScholarConnected: true,
}
```

## Routing Structure

```
/ (Landing - Public)
├── /signup (Public)
├── /login (Public)
├── /forgot-password (Public)
├── /email-verification (Public)
└── Protected Routes (Requires Auth)
    ├── /onboarding
    ├── /projects (Dashboard with User Menu)
    ├── /settings
    ├── /project/:id
    └── ... (all other app screens)
```

## User Experience Flow

### New User Journey
1. Land on `/` → Click "Start Free"
2. `/signup` → Create account
3. `/email-verification` → Verify email (or skip)
4. `/onboarding` → Complete 4-step wizard
5. `/projects` → Main dashboard

### Returning User Journey
1. Land on `/` → Click "Login"
2. `/login` → Enter credentials
3. `/projects` → Main dashboard

### Password Reset Journey
1. `/login` → Click "Forgot password?"
2. `/forgot-password` → Enter email
3. Check email → Click reset link
4. `/forgot-password?token=xxx` → Set new password
5. `/login` → Login with new password

## Design System

### Colors
- Primary: `#2563EB` (Blue)
- Success: Green (`text-green-600`)
- Error: Red (`text-red-600`)
- Warning: Yellow (`text-yellow-600`)
- Background: `#FAFAFA`, `#F9FAFB`

### Typography
- Headings: Default theme (no custom font sizes)
- Body: Default theme
- Academic feel: Clean, professional

### Components
- Cards: White background, rounded-xl, border
- Buttons: Solid primary, outline secondary
- Inputs: With validation states (default, focus, error, success)
- Toasts: Using sonner library

## Security Features (Mock)

- Password requirements: 8+ characters, uppercase, lowercase, number
- Rate limiting: 5 failed login attempts
- Account lockout: 15 minutes after 5 failed attempts
- Email verification required (can be skipped for demo)
- Session timeout: 24 hours
- Remember me: 30 days

## Mobile Responsive

All screens are responsive with breakpoints:
- Desktop: 1440px+
- Tablet: 768px - 1439px
- Mobile: < 768px

Mobile optimizations:
- Full-width forms with padding
- Larger touch targets (44px minimum)
- Simplified navigation
- Stacked layouts

## Integration with Existing App

### Updated Components
1. **ProjectsDashboard** - Added header with UserMenu
2. **App.tsx** - Wrapped with AuthProvider, added all routes
3. All existing screens - Wrapped in ProtectedRoute

### Context API
`AuthContext` provides:
- `user` - Current user object
- `isAuthenticated` - Boolean auth state
- `login()` - Login function
- `signup()` - Registration function
- `logout()` - Logout function
- `updateProfile()` - Update user data
- And more...

## Next Steps for Production

To make this production-ready:

1. **Backend Integration**
   - Replace mock auth with real API calls
   - Implement JWT token refresh
   - Add httpOnly cookies for tokens
   - Real email sending service

2. **Security Enhancements**
   - Two-factor authentication
   - CAPTCHA on login/signup
   - Session management on backend
   - Rate limiting on server
   - CSRF protection

3. **Additional Features**
   - OAuth implementation for real providers
   - Email change flow
   - Account deletion
   - Privacy settings
   - Activity log

4. **Testing**
   - Unit tests for auth functions
   - Integration tests for flows
   - E2E tests for user journeys

## File Structure

```
/src
├── /contexts
│   └── AuthContext.tsx (Auth state management)
├── /app
│   ├── /components
│   │   ├── /auth
│   │   │   ├── FormInput.tsx
│   │   │   ├── PasswordStrengthMeter.tsx
│   │   │   └── SocialLoginButton.tsx
│   │   ├── UserMenu.tsx
│   │   └── ProtectedRoute.tsx
│   └── /screens
│       ├── LandingPage.tsx
│       ├── SignUpPage.tsx
│       ├── LoginPage.tsx
│       ├── EmailVerificationPage.tsx
│       ├── ForgotPasswordPage.tsx
│       ├── OnboardingPage.tsx
│       ├── AccountSettingsPage.tsx
│       └── ProjectsDashboard.tsx (updated)
└── App.tsx (updated with routing)
```

## Notes

- All auth flows are fully functional with mock data
- No real backend required for demo
- Toast notifications for user feedback
- Animations with Motion for smooth transitions
- Fully integrated with existing app screens
- Production-ready UI/UX design
