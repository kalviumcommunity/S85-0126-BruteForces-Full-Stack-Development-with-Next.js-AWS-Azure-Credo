# Testing & Debugging Guide

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run specific test file
npm test -- validation.test.ts

# Watch mode (auto-rerun on changes)
npm test:watch

# Coverage report
npm test:coverage
```

## Running Tests

### All Tests
```bash
npm test
```

Expected output:
```
 PASS  test/validation.test.ts
  Input Validation Tests
    Auth Schema - Signup
      ✓ should validate correct signup data
      ✓ should reject name shorter than 2 characters
      ✓ should reject name longer than 100 characters
      ✓ should reject invalid email format
      ✓ should reject password shorter than 8 characters
      ✓ should reject password without uppercase letter
      ✓ should reject password without lowercase letter
      ✓ should reject password without number
      ✓ should reject password without special character
      ✓ should trim whitespace from name and email
      ✓ should convert email to lowercase
    Auth Schema - Login
      ✓ should validate correct login data
      ✓ should reject invalid email format
      ✓ should reject empty password
      ✓ should trim and lowercase email
    Project Schema
      ... (6 tests)
    Task Schema
      ... (5 tests)
    User Create Schema
      ... (5 tests)
    User Query Schema
      ... (7 tests)
    Edge Cases and Security
      ... (5 tests)

Test Suites: 1 passed, 1 total
Tests:       43 passed, 43 total
```

### Watch Mode
```bash
npm test:watch
```
- Re-runs tests when files change
- Press 'q' to quit
- Press 'a' to run all tests
- Press 'p' to filter by filename
- Press 't' to filter by test name

### Coverage Report
```bash
npm test:coverage
```

Shows:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Testing Validation Manually

### Testing Signup Endpoint

#### Valid Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Expected Response (201):
```json
{
  "success": true,
  "message": "Signup successful",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "$2b$10$..."
  }
}
```

#### Invalid Password (Too Weak)
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "weak123"
  }'
```

Expected Response (400):
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

#### Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "password": "SecurePass123!"
  }'
```

Expected Response (400):
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Testing Tasks Endpoint

#### Valid Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish validation implementation",
    "completed": false
  }'
```

Expected Response (201):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1705765800000,
    "title": "Complete project",
    "description": "Finish validation implementation",
    "completed": false
  }
}
```

#### Invalid Title (Too Short)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AB"
  }'
```

Expected Response (400):
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 3 characters long"
      }
    ]
  }
}
```

### Testing Users Endpoint

#### Valid Query Parameters
```bash
curl "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected Response (200):
```json
{
  "page": 1,
  "limit": 10,
  "data": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ]
}
```

#### Invalid Query Parameters (Limit Too High)
```bash
curl "http://localhost:3000/api/users?page=1&limit=999" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected Response (400):
```json
{
  "error": "Validation Error",
  "issues": [
    {
      "field": "limit",
      "message": "Limit must not exceed 100"
    }
  ]
}
```

#### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com"
  }'
```

Expected Response (201):
```json
{
  "message": "User created",
  "data": {
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

## Debugging Validation Issues

### Issue: Password Validation Failing

**Problem:** Password appears correct but validation fails

**Solution:** Check all requirements:
```typescript
// Must have:
✓ 8+ characters
✓ At least one UPPERCASE (A-Z)
✓ At least one lowercase (a-z)
✓ At least one number (0-9)
✓ At least one special character (!@#$%^&*, etc.)

// Examples:
Valid:     "SecurePass123!"    ✓
Invalid:   "SecurePass123"     ✗ (no special char)
Invalid:   "secure_pass_123!"  ✗ (no uppercase)
Invalid:   "SECURE_PASS_123!"  ✗ (no lowercase)
```

### Issue: Email Validation Failing

**Problem:** Email looks valid but rejected

**Solution:** Verify email format and length:
```typescript
// Valid email format: localpart@domain
"user@example.com"       ✓
"user.name@example.com"  ✓
"user+tag@example.co.uk" ✓

// Invalid formats:
"userexample.com"        ✗ (missing @)
"user@"                  ✗ (missing domain)
"@example.com"           ✗ (missing localpart)
"user @example.com"      ✗ (space not allowed)
```

### Issue: String Length Validation

**Problem:** Input rejected due to length

**Solution:** Check field-specific limits:
```typescript
// Auth Fields
name:              2-100 characters
email:             valid format (usually < 254)
password:          8-128 characters (only on signup)

// Project Fields
title:             3-200 characters
description:       0-2000 characters

// Task Fields
title:             3-200 characters
description:       0-1000 characters

// User Fields
name:              2-100 characters
email:             valid format (optional)

// Query Parameters
page:              >= 1
limit:             1-100
```

### Issue: Type Coercion Not Working

**Problem:** Query parameters not converted to numbers

**Solution:** Ensure parameters are sent as strings:
```bash
# Correct (query params sent as strings)
?page=1&limit=10

# Result: { page: 1, limit: 10 } (numbers)

# Avoid (don't send as JSON)
{ "page": "1", "limit": "10" }
```

## Test-Driven Debugging

### Run Specific Test Suite
```bash
npm test -- --testNamePattern="Auth Schema"
```

### Run Specific Test
```bash
npm test -- --testNamePattern="should validate correct signup data"
```

### Debugging with Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools

## Common Test Failures & Solutions

### "Cannot find module 'zod'"
```bash
npm install
npm install zod
```

### "Jest configuration not found"
```bash
# Ensure jest.config.js exists
ls jest.config.js

# If missing, create it (see SETUP section)
```

### "Test timeout"
```bash
# Increase timeout in jest.config.js
module.exports = {
  testTimeout: 10000, // 10 seconds
};
```

### "Node version incompatible"
```bash
# Ensure Node 18+
node --version

# Update if needed
nvm use 18
```

## Adding New Validation Tests

### Template
```typescript
describe("New Schema Tests", () => {
  it("should validate correct data", () => {
    const validData = {
      field: "value",
    };
    const result = newSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid data", () => {
    const invalidData = {
      field: "",
    };
    const result = newSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should provide helpful error message", () => {
    const invalidData = {
      field: "invalid",
    };
    const result = newSchema.safeParse(invalidData);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("expected message");
    }
  });
});
```

## Performance Testing

### Check Validation Speed
```bash
npm test:coverage
```

Look for timing information in output

### Manual Performance Test
```typescript
const start = performance.now();
for (let i = 0; i < 1000; i++) {
  signupSchema.safeParse(validData);
}
const end = performance.now();
console.log(`1000 validations took ${end - start}ms`);
```

Expected: < 5ms for all 1000 validations

## Continuous Integration

### GitHub Actions Example
```yaml
name: Validation Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm test:coverage
```

## Troubleshooting Checklist

- [ ] Node version 18+: `node --version`
- [ ] Dependencies installed: `npm install`
- [ ] jest.config.js exists: `ls jest.config.js`
- [ ] jest.setup.js exists: `ls jest.setup.js`
- [ ] Test file exists: `ls test/validation.test.ts`
- [ ] Schemas are exported: Check `src/lib/schemas/*.ts`
- [ ] No typos in imports
- [ ] Port 3000 available (for manual testing)
- [ ] No other processes using port 3000
- [ ] Database connection works (for integration tests)

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Testing Library](https://testing-library.com/docs/)

---

For more information, see:
- [VALIDATION_IMPLEMENTATION.md](VALIDATION_IMPLEMENTATION.md)
- [VALIDATION_REFERENCE.md](VALIDATION_REFERENCE.md)
- [VALIDATION_ARCHITECTURE.md](VALIDATION_ARCHITECTURE.md)
