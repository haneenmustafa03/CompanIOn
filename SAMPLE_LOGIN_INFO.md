# Sample Login Information

This document contains sample login credentials for testing the CompanIOn application.

## 📋 Sample Accounts

### 👨‍👩 Parent Account

- **Email:** `parent@companion.test`
- **Password:** `parent123`
- **Name:** Parent User
- **Account Type:** Parent

### 👶 Child Account

- **Email:** `child@companion.test`
- **Password:** `child123`
- **Name:** Child User
- **Age:** 10
- **Account Type:** Child
- **Parent Email:** `parent@companion.test` (linked to parent account)

## 🚀 How to Create These Accounts

### Option 1: Use the Seed Script (Recommended)

1. Make sure your MongoDB is running and `MONGO_URI` is set in your `.env` file
2. Run the seed script:

```bash
cd server
node scripts/seedUsers.js
```

This will automatically create both accounts in your database.

### Option 2: Sign Up Manually

You can also create these accounts manually through the signup screen:

#### For Parent Account:

1. Go to the signup screen
2. Select "Parent" account type
3. Enter:
   - Name: `Parent User`
   - Email: `parent@companion.test`
   - Password: `parent123`

#### For Child Account:

1. Go to the signup screen
2. Select "Child" account type
3. Enter:
   - Name: `Child User`
   - Email: `child@companion.test`
   - Password: `child123`
   - Age: `10`
   - Parent Email: `parent@companion.test`

**Note:** The child account must be created AFTER the parent account for the linking to work properly.

## 🔐 Testing

You can use these credentials to:

- Test login functionality
- Test parent and child account features
- Verify account linking between parent and child
- Test protected routes and authentication

## ⚠️ Important Notes

- These are **test accounts only** - do not use in production
- The passwords are intentionally simple for testing
- These accounts will be cleared if you run the seed script again
- Make sure your MongoDB connection is working before running the seed script
