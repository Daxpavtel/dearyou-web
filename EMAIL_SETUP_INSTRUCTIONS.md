# Email Notification Setup Instructions

## Current Status
✅ **Email system is configured and working in DEMO MODE**
- All form submissions are saved to MongoDB
- Email notifications are logged to backend logs
- Target email: `abhiii.webdesign@gmail.com`

## To Enable Actual Email Sending

### Step 1: Generate Gmail App Password
Since Gmail requires App Passwords for programmatic access:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Scroll down to **App passwords**
4. Click **App passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)** → Enter "DearYou Website"
7. Click **Generate**
8. **Copy the 16-character app password** (format: xxxx xxxx xxxx xxxx)

### Step 2: Update Backend Environment File

Edit `/app/backend/.env` and add the app password:

```bash
SMTP_PASSWORD="your-16-character-app-password-here"
```

**Example:**
```bash
SMTP_PASSWORD="abcd efgh ijkl mnop"
```

### Step 3: Restart Backend

```bash
sudo supervisorctl restart backend
```

## How It Works

### Form Submission Endpoint: `/api/submit-journal`
- Saves complete form data to MongoDB (`journal_submissions` collection)
- Sends detailed email notification to `abhiii.webdesign@gmail.com`
- Email includes all 7 sections of the personalization form

### Email Signup Endpoint: `/api/email-signup`
- Saves email to MongoDB (`email_signups` collection)
- Sends notification to `abhiii.webdesign@gmail.com`
- Used for "Get Early Access Updates" feature

## Email Content

### Journal Submission Email Includes:
- Customer's identity snapshot
- Goals & future self vision
- Obstacles & patterns
- Emotional anchors
- Personalization preferences
- Ritual style
- Final personal touch (name, message, beliefs)

### Email Signup Notification Includes:
- User's email address
- Timestamp

## Monitoring

### Check Email Logs (Demo Mode)
```bash
tail -f /var/log/supervisor/backend.err.log | grep -i email
```

### Check Submissions in MongoDB
```bash
mongosh test_database
db.journal_submissions.find().pretty()
db.email_signups.find().pretty()
```

## Production Considerations

1. **Rate Limiting**: Gmail has sending limits (500 emails/day for free accounts)
2. **Consider SendGrid/AWS SES** for production-level email sending
3. **Email Templates**: Current HTML emails are inline in code
4. **Error Handling**: Emails that fail to send are logged but don't block the form submission

## Troubleshooting

### If emails aren't sending after adding password:

1. Check backend logs:
   ```bash
   tail -f /var/log/supervisor/backend.err.log
   ```

2. Verify .env file updated:
   ```bash
   cat /app/backend/.env | grep SMTP
   ```

3. Test connection manually:
   ```bash
   curl -X POST https://identity-tools.preview.emergentagent.com/api/submit-journal \
     -H "Content-Type: application/json" \
     -d '{...}'
   ```

## Current Configuration

- **SMTP Host**: smtp.gmail.com
- **SMTP Port**: 587 (TLS)
- **Username**: abhiii.webdesign@gmail.com
- **Password**: (Set in .env for production)
- **Notification Email**: abhiii.webdesign@gmail.com

---

**Note**: Without the SMTP_PASSWORD set, the system operates in demo mode and only logs emails to the backend logs. This is useful for development and testing without actually sending emails.
