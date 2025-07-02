# Mock Authentication System

This application includes a comprehensive mock authentication system for development purposes. This allows you to test the app functionality without setting up Firebase Authentication.

## How It Works

The mock authentication system:

1. **Bypasses Firebase Authentication** - No need to configure Firebase Auth
2. **Simulates Real Authentication** - Provides the same user experience
3. **Predefined Mock Users** - Includes realistic Thoughtworks user accounts
4. **Dynamic User Creation** - Can create new mock users during testing
5. **User Information Display** - Shows user details in the dashboard

## Predefined Mock Users

The system includes these predefined accounts for easy testing:

### Thoughtworks Team Members

| Email | Password | Display Name | Role |
|-------|----------|--------------|------|
| `consultant@thoughtworks.com` | `consultant123` | Sarah Johnson | Senior Consultant |
| `developer@thoughtworks.com` | `developer123` | Alex Chen | Software Developer |
| `manager@thoughtworks.com` | `manager123` | Michael Rodriguez | Delivery Manager |
| `demo@thoughtworks.com` | `demo123` | Demo User | Demo Account |

### Test Accounts

| Email | Password | Display Name | Role |
|-------|----------|--------------|------|
| `test@example.com` | `test123` | Test User | Tester |

## Features

### ✅ Email/Password Registration
- Create new accounts with any email and password (minimum 6 characters)
- Duplicate email prevention
- Password confirmation validation
- Automatic display name generation from email

### ✅ Email/Password Login
- Sign in with predefined mock users
- Sign in with newly created accounts
- Invalid credentials handling
- Error messages for failed attempts

### ✅ Google SSO
- One-click Google sign-in simulation
- Generates mock Google user profile
- No actual Google authentication required

### ✅ User Information Display
- Shows user name and role in dashboard header
- Displays user details in welcome section
- Personalized experience for each mock user

### ✅ Sign Out
- Proper sign-out functionality
- Clears authentication state
- Redirects to login page

## Usage

### Quick Start with Predefined Users

1. **Click "Show Mock Users"** on the authentication form
2. **Select a user** from the list (e.g., Sarah Johnson - Senior Consultant)
3. **Click "Use"** to auto-fill the form
4. **Click "Sign In"** to authenticate

### Manual Authentication

1. **Register a New Account**:
   - Click "Sign up" on the auth form
   - Enter any email (e.g., `newuser@example.com`)
   - Enter any password (minimum 6 characters)
   - Click "Create Account"

2. **Sign In with Existing Account**:
   - Click "Sign in" on the auth form
   - Use one of the predefined credentials above
   - Click "Sign In"

3. **Use Google Sign-In**:
   - Click "Continue with Google"
   - Instantly signs you in with a mock Google account

4. **Sign Out**:
   - Click "Sign Out" in the header of any page
   - Returns you to the authentication form

### User Experience Features

- **Mock Users Panel**: Click "Show Mock Users" to see all available accounts
- **Auto-fill**: Click "Use" next to any mock user to auto-fill the form
- **User Display**: See your name and role in the dashboard header
- **Personalized Welcome**: Dashboard shows your specific user information

## Configuration

### Enable/Disable Mock Auth

To switch between mock and real Firebase authentication:

1. Open `src/services/firebase.ts`
2. Find the line: `const MOCK_AUTH_ENABLED = true;`
3. Change to `false` to use real Firebase Authentication
4. Set up Firebase Authentication in Firebase Console

### Development Notice

When mock authentication is enabled, you'll see:
- Yellow notice at the top of the authentication form
- "Show Mock Users" button to display available accounts
- User information displayed in the dashboard

## Switching to Real Authentication

When you're ready to use real Firebase Authentication:

1. **Set up Firebase Authentication**:
   - Follow the instructions in `AUTH_SETUP.md`
   - Enable Email/Password and Google authentication
   - Configure authorized domains

2. **Disable Mock Auth**:
   - Set `MOCK_AUTH_ENABLED = false` in `firebase.ts`
   - Restart your development server

3. **Test Real Authentication**:
   - Try registering and signing in with real accounts
   - Test Google SSO with actual Google accounts

## Benefits

- **Quick Development**: No Firebase setup required
- **Realistic Testing**: Predefined Thoughtworks user personas
- **Full Functionality**: Test all app features immediately
- **Easy Switching**: Simple toggle between mock and real auth
- **User Experience**: Personalized interface for different user types
- **No External Dependencies**: Works offline and without Firebase

## Limitations

- **Session Only**: User accounts are lost when you refresh the page
- **No Persistence**: No permanent user storage
- **Development Only**: Not suitable for production use
- **No Real Security**: No actual authentication validation

## Troubleshooting

### "User accounts are lost on refresh"
This is expected behavior. Mock users are stored in memory and reset when the page refreshes.

### "Can't sign in with previously registered account"
Try registering again with the same email. Mock authentication doesn't persist across page refreshes.

### "Want to test with real authentication"
Follow the setup instructions in `AUTH_SETUP.md` and set `MOCK_AUTH_ENABLED = false`.

### "Mock users not showing"
Make sure you're in development mode and click "Show Mock Users" on the authentication form.

## Console Logging

When mock authentication is enabled, you'll see helpful console logs:
- Available mock users listed on app initialization
- Successful authentication messages with user details
- Mock user creation and sign-in events 