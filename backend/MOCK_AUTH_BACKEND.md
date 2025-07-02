# Backend Mock Authentication Setup

This backend now supports mock authentication tokens for development purposes, allowing the frontend mock authentication system to work seamlessly with the backend API.

## How It Works

The backend authentication middleware has been updated to:

1. **Detect Mock Tokens**: Recognizes tokens starting with `mock-id-token-for-`
2. **Extract User ID**: Parses the user ID from the mock token format
3. **Bypass Firebase Verification**: Skips real Firebase token verification for mock tokens
4. **Maintain Security**: Still validates token format and structure

## Configuration

### Environment Variables

Add this to your `.env` file:

```bash
# Enable mock authentication for development
MOCK_AUTH_ENABLED=true

# Or disable it for production
MOCK_AUTH_ENABLED=false
```

### Automatic Detection

The backend automatically enables mock authentication when:
- `MOCK_AUTH_ENABLED=true` is set in environment variables
- `NODE_ENV=development` is set (fallback)

## Token Format

Mock tokens follow this format:
```
mock-id-token-for-{user-id}
```

Examples:
- `mock-id-token-for-mock-user-consultant-001`
- `mock-id-token-for-mock-google-user-1751482933479`
- `mock-id-token-for-mock-user-1234567890`

## API Endpoints

All protected API endpoints now work with mock authentication:

- ✅ `GET /api/profile/{userId}` - Fetch user profile
- ✅ `POST /api/profile` - Save user profile
- ✅ `GET /api/activities` - Fetch user activities
- ✅ `POST /api/activities` - Log new activity
- ✅ `POST /api/recommendations` - Generate AI recommendations

## Development Workflow

### 1. Enable Mock Authentication

```bash
# In your .env file
MOCK_AUTH_ENABLED=true
```

### 2. Start Backend Server

```bash
cd beach-activity-tracker/backend
npm start
```

### 3. Test with Frontend

- Use mock authentication in the frontend
- All API calls will work with mock tokens
- Check backend console for mock authentication logs

### 4. Switch to Real Authentication

```bash
# In your .env file
MOCK_AUTH_ENABLED=false
```

## Console Logging

When mock authentication is enabled, you'll see logs like:
```
Mock authentication successful for user: mock-user-consultant-001
Mock authentication successful for user: mock-google-user-1751482933479
```

## Security Notes

- **Development Only**: Mock authentication should only be used in development
- **Token Validation**: Mock tokens are still validated for proper format
- **User ID Extraction**: User IDs are extracted and validated from tokens
- **No Firebase Dependency**: Backend works without Firebase setup in mock mode

## Troubleshooting

### "Invalid mock token" Error
- Check that the token starts with `mock-id-token-for-`
- Verify the token contains a valid user ID
- Ensure `MOCK_AUTH_ENABLED=true` is set

### "Authorization token required" Error
- Make sure the frontend is sending the Authorization header
- Check that the token format is correct
- Verify the backend is running and accessible

### "Invalid or expired token" Error
- This means the token is not a mock token and Firebase verification failed
- Check if `MOCK_AUTH_ENABLED=true` is set
- Verify the token format matches mock token pattern

## Production Deployment

For production deployment:

1. **Disable Mock Auth**:
   ```bash
   MOCK_AUTH_ENABLED=false
   ```

2. **Set Up Real Firebase**:
   - Configure Firebase service account
   - Set up proper environment variables
   - Test with real authentication

3. **Verify Security**:
   - All tokens go through Firebase verification
   - No mock authentication bypass
   - Proper user authentication and authorization 