# S3 Storage Setup Guide

Detailed instructions for setting up S3-compatible storage providers.

## Supported Providers

1. **Cloudflare R2** - Recommended for its affordability
2. **DigitalOcean Spaces** - Good for general-purpose storage
3. **Backblaze B2** - Cost-effective for large files

## 1. Cloudflare R2 Setup

### Step 1: Create R2 Account

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Login or create account
3. Navigate to **R2** in the left menu
4. Click **Create bucket**

### Step 2: Create Bucket

```
Bucket Name: heyamo-bucket (or your preferred name)
Region: Select your closest region
Object Lock: Disable (not needed)
Click "Create bucket"
```

### Step 3: Generate API Token

1. In R2 overview, click **Manage R2 API tokens**
2. Click **Create API token**
3. Select **Read and Write**
4. Copy credentials:
   - Account ID
   - Access Key ID
   - Secret Access Key

### Step 4: Setup Custom Domain (Optional but Recommended)

1. In R2 bucket settings
2. Go to **Settings** → **Custom domain**
3. Add custom domain (e.g., `cdn.yourdomain.com`)
4. Or use auto-generated URL

### Step 5: Configure Environment

```bash
# Edit .env
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=<your-access-key-id>
S3_SECRET_ACCESS_KEY=<your-secret-access-key>
S3_BUCKET_NAME=heyamo-bucket
S3_PUBLIC_URL=https://<your-custom-domain-or-r2-public-url>
```

### Step 6: Test Upload

```bash
curl -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=R2 Upload Test" \
  -F "file=@test-image.jpg"
```

### Pricing

- First 10 GB/month: Free
- After: $0.015/GB

---

## 2. DigitalOcean Spaces Setup

### Step 1: Create Space

1. Go to [DigitalOcean Control Panel](https://cloud.digitalocean.com/)
2. Navigate to **Spaces**
3. Click **Create Space**

### Step 2: Configure Space

```
Space Name: heyamo-bucket
Choose Region: Select your region
Restrict File Listing: Enable (recommended)
Enable CDN: Yes (optional, for faster access)
Click "Create Space"
```

### Step 3: Generate API Key

1. Go to **Account** → **API**
2. In Spaces Keys section, click **Generate New Key**
3. Enter name: `heyamo-api-key`
4. Copy the generated credentials

### Step 4: Configure Environment

```bash
# Edit .env
S3_ENDPOINT=https://<region>.digitaloceanspaces.com
S3_REGION=<region>  # e.g., nyc3, sfo3, etc
S3_ACCESS_KEY_ID=<your-access-key>
S3_SECRET_ACCESS_KEY=<your-secret-key>
S3_BUCKET_NAME=heyamo-bucket
S3_PUBLIC_URL=https://heyamo-bucket.<region>.cdn.digitaloceanspaces.com
```

### Step 5: Test Upload

```bash
curl -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=DigitalOcean Upload Test" \
  -F "file=@test-image.jpg"
```

### Pricing

- First 250 GB/month: Free
- After: $5/month + $0.02/GB overage

---

## 3. Backblaze B2 Setup

### Step 1: Create Account

1. Go to [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
2. Create account or login
3. Navigate to **Buckets**

### Step 2: Create Bucket

```
Bucket Name: heyamo-bucket
Type: Private
Click "Create Bucket"
```

### Step 3: Generate API Key

1. Go to **Account** → **App Keys**
2. Click **Add Application Key**
3. Select your bucket
4. Choose **Read and Write**
5. Copy credentials:
   - Application Key ID
   - Application Key

### Step 4: Configure Environment

```bash
# Edit .env
S3_ENDPOINT=https://s3.<region>.backblazeb2.com
S3_REGION=<region>  # e.g., us-west-000, eu-central-001
S3_ACCESS_KEY_ID=<application-key-id>
S3_SECRET_ACCESS_KEY=<application-key>
S3_BUCKET_NAME=heyamo-bucket
S3_PUBLIC_URL=https://f000.backblazeb2.com/file/heyamo-bucket
```

### Step 5: Test Upload

```bash
curl -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=Backblaze Upload Test" \
  -F "file=@test-image.jpg"
```

### Pricing

- First 10 GB: Free
- After: $0.006/GB

---

## Comparison Table

| Provider | Endpoint Format | Free Tier | Price/GB | Best For |
|----------|-----------------|-----------|----------|----------|
| **Cloudflare R2** | `https://<account>.r2.cloudflarestorage.com` | 10 GB | $0.015 | Affordability |
| **DigitalOcean Spaces** | `https://<region>.digitaloceanspaces.com` | 250 GB | $0.02 | General use + CDN |
| **Backblaze B2** | `https://s3.<region>.backblazeb2.com` | 10 GB | $0.006 | Cost-effective |

---

## Common Issues & Solutions

### Issue: "Access Denied" Error

**Solution:**
- Verify Access Key ID and Secret are correct
- Check bucket name matches exactly
- Ensure API key has Read/Write permissions
- Test credentials with provider's CLI

```bash
# Test with AWS CLI (for S3-compatible)
aws s3 ls s3://heyamo-bucket \
  --endpoint-url https://your-endpoint.com \
  --profile heyamo
```

### Issue: Invalid Endpoint

**Solution:**
- Double-check endpoint URL in .env
- Remove trailing slashes
- Verify provider documentation for correct format

### Issue: CORS Errors

**Solution:**

Add CORS configuration to your bucket:

**Cloudflare R2:**
- Settings → CORS configuration
- Add allowed origins

**DigitalOcean Spaces:**
- Settings → CORS
- Add allowed origins

**Backblaze B2:**
- Bucket settings → CORS Rules
- Configure allowed methods and origins

### Issue: File Not Visible in Bucket

**Solution:**
- Check public URL configuration
- Verify file permissions (make public if needed)
- Check bucket listing restrictions

---

## Testing Different Providers

### Create Test Database

```bash
# Backup current data
mongodump --uri "mongodb://localhost:27017/heyamo" --out ./backup

# Keep MongoDB running
```

### Test Each Provider

```bash
# Test Cloudflare R2
S3_ENDPOINT=... npm run start:dev
# Create object, verify upload

# Switch to DigitalOcean
# Update .env
# Test again

# Switch to Backblaze B2
# Update .env
# Test again
```

---

## Production Considerations

### 1. Security

```bash
# Set restrictive IAM policies
# Cloudflare: Restrict token scope
# DigitalOcean: Use restricted API keys
# Backblaze: Set expiration dates on keys
```

### 2. Bandwidth

```
Calculate monthly bandwidth:
- Average file size: 500 KB
- Expected uploads: 10,000/month
- Total: ~5 GB/month

Choose provider accordingly
```

### 3. Redundancy

```
Option 1: Provider replication (automatic)
Option 2: Dual providers with failover
Option 3: Local backup + cloud storage
```

### 4. Monitoring

```bash
# Monitor S3 uploads
# Track storage usage
# Alert on errors
# Cost tracking
```

---

## Integration Verification

### Test Upload

```bash
# Create test object
curl -X POST http://localhost:3000/objects \
  -F "title=Production Test" \
  -F "description=Verifying S3 integration" \
  -F "file=@/path/to/image.jpg"
```

### Verify in S3 Provider

```bash
# List files in bucket via provider console
# Verify image is there
# Test public URL accessibility
```

### Test Deletion

```bash
# Get object ID from previous response
curl -X DELETE http://localhost:3000/objects/{id}

# Verify in S3 provider console
# File should be deleted
```

---

## Migrate Between Providers

### Step 1: Export Current Data

```bash
mongodump --uri "mongodb://localhost:27017/heyamo" --out ./backup
```

### Step 2: Update .env

```bash
# Switch to new provider
S3_ENDPOINT=new_endpoint
S3_ACCESS_KEY_ID=new_key
S3_SECRET_ACCESS_KEY=new_secret
```

### Step 3: Download Existing Files

```bash
# Download from old bucket
aws s3 sync s3://old-bucket /tmp/objects \
  --endpoint-url old_endpoint
```

### Step 4: Upload to New Provider

```bash
# Upload to new bucket
aws s3 sync /tmp/objects s3://new-bucket \
  --endpoint-url new_endpoint
```

### Step 5: Update Database

```javascript
// Update imageUrl in all documents
db.objects.updateMany(
  {},
  [
    {
      $set: {
        imageUrl: {
          $replaceOne: {
            input: "$imageUrl",
            find: "old-endpoint",
            replacement: "new-endpoint"
          }
        }
      }
    }
  ]
)
```

---

## Cost Optimization Tips

1. **Choose right region** - Use closest to users
2. **Enable CDN** - Faster delivery, sometimes cheaper
3. **Compress images** - 40-60% size reduction possible
4. **Delete old files** - Implement retention policies
5. **Monitor usage** - Track unexpected growth

---

## Troubleshooting Checklist

- [ ] .env file created and configured
- [ ] S3 credentials verified in provider console
- [ ] Endpoint URL correct (no trailing slash)
- [ ] Bucket name matches exactly
- [ ] API key has Read/Write permissions
- [ ] CORS configured in bucket (if needed)
- [ ] Public URL is accessible
- [ ] Test upload successful
- [ ] File visible in provider console
- [ ] File publicly accessible via URL

---

For more help, consult provider documentation:
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [DigitalOcean Spaces Docs](https://docs.digitalocean.com/products/spaces/)
- [Backblaze B2 Docs](https://www.backblaze.com/b2/docs/)
