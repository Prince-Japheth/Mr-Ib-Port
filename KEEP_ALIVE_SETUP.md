# Supabase Keep-Alive Setup Guide

This guide explains how to keep your Supabase database active even after extended periods of inactivity.

## 🚀 Quick Start

### 1. Run the SQL Migration

Execute the SQL in `db/keep-alive.sql` on your Supabase database:

```sql
-- Copy and paste the entire contents of db/keep-alive.sql into your Supabase SQL Editor
```

**Or run it via Supabase CLI:**
```bash
supabase db execute -f db/keep-alive.sql
```

### 2. Test the Keep-Alive Endpoint

Once deployed, test the endpoint:
```bash
curl https://your-domain.com/api/keep-alive
```

## 📋 SQL to Run

The SQL file `db/keep-alive.sql` contains:
- Table creation for `keep_alive`
- Initial data insertion
- Helper function `update_keep_alive_ping()`
- Proper permissions

**Run this SQL on your Supabase database now!**

## 🔄 Keep-Alive Mechanisms

### 1. API Endpoints

Two endpoints are available:

#### `/api/keep-alive` (Public)
- **GET**: Queries and updates the keep_alive table
- **POST**: Same as GET
- No authentication required (for easy cron setup)

#### `/api/keep-alive/cron` (Protected)
- **GET**: Performs multiple database queries to ensure activity
- Requires `Authorization: Bearer <CRON_SECRET>` header
- More comprehensive keep-alive mechanism

### 2. GitHub Actions Workflow

A GitHub Actions workflow (`.github/workflows/keep-alive.yml`) runs:
- Every 6 hours
- Daily at midnight UTC
- Every Monday at 9 AM UTC
- Can be manually triggered

**Setup GitHub Secrets:**
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `KEEP_ALIVE_URL`: Your deployed app's keep-alive endpoint URL
- `CRON_URL`: Your deployed app's cron keep-alive endpoint URL
- `CRON_SECRET`: A secret key for cron endpoint authentication

### 3. External Cron Services

You can use external services to ping your endpoints:

#### Option A: cron-job.org
1. Go to https://cron-job.org
2. Create a new job
3. Set URL: `https://your-domain.com/api/keep-alive`
4. Set schedule: Every 6 hours
5. Save

#### Option B: EasyCron
1. Go to https://www.easycron.com
2. Create a new cron job
3. Set URL: `https://your-domain.com/api/keep-alive`
4. Set schedule: `0 */6 * * *` (every 6 hours)
5. Save

#### Option C: UptimeRobot (Free)
1. Go to https://uptimerobot.com
2. Create a new monitor
3. Type: HTTP(s)
4. URL: `https://your-domain.com/api/keep-alive`
5. Interval: 5 minutes (free tier)
6. Save

### 4. Vercel Cron Jobs (if deployed on Vercel)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## 🔍 Monitoring

Check if keep-alive is working:

```bash
# Query the keep_alive table
curl https://your-domain.com/api/keep-alive

# Expected response:
{
  "success": true,
  "message": "Supabase keep-alive ping successful",
  "data": {
    "id": 1,
    "status": "active",
    "last_ping": "2024-01-15T10:30:00.000Z",
    "ping_count": 42,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🛡️ Security Notes

1. The `/api/keep-alive` endpoint is public by design for easy cron setup
2. The `/api/keep-alive/cron` endpoint requires authentication
3. Consider adding rate limiting if needed
4. The GitHub Actions workflow uses secrets for sensitive data

## 📊 Best Practices

1. **Multiple Mechanisms**: Use at least 2-3 different keep-alive methods
2. **Regular Intervals**: Ping every 6 hours minimum
3. **Monitor**: Check logs regularly to ensure pings are working
4. **Backup Plan**: If one method fails, others will continue

## 🐛 Troubleshooting

### Endpoint returns 500 error
- Check if the `keep_alive` table exists in Supabase
- Run the SQL migration again
- Check Supabase connection credentials

### GitHub Actions not running
- Ensure workflow file is in `.github/workflows/`
- Check GitHub Actions permissions
- Verify secrets are set correctly

### Database still going inactive
- Increase ping frequency
- Add more keep-alive mechanisms
- Check Supabase project settings for inactivity timeout

## 📝 Next Steps

1. ✅ Run the SQL migration (`db/keep-alive.sql`)
2. ✅ Deploy your application
3. ✅ Set up GitHub Actions secrets
4. ✅ Configure external cron service (optional but recommended)
5. ✅ Test the endpoints
6. ✅ Monitor for a few days to ensure it's working

---

**Remember**: The more keep-alive mechanisms you have, the more reliable your database will stay active!

