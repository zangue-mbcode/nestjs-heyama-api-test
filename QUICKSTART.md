# Quick Start Guide

Get the Heyamo backend running in 5 minutes.

## 1. Prerequisites

- Node.js 18+ installed
- MongoDB running locally OR MongoDB Atlas account
- S3-compatible storage account (Cloudflare R2, DigitalOcean Spaces, or Backblaze B2)

## 2. Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# - MongoDB URI
# - S3 endpoint, credentials, and bucket info
```

## 3. Configure Environment Variables

Edit `.env` file with your credentials:

### MongoDB (Local)
```env
MONGODB_URI=mongodb://localhost:27017/heyamo
```

### MongoDB (Atlas)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heyamo?retryWrites=true&w=majority
```

### S3 Example (Cloudflare R2)
```env
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=my-bucket
S3_PUBLIC_URL=https://my-bucket.your-domain.com
```

## 4. Run the Application

### Option A: Development Mode
```bash
npm run start:dev
```

### Option B: Docker Compose
```bash
docker-compose up
```

Server runs at: `http://localhost:3000`

## 5. Test the API

### Create an Object
```bash
curl -X POST http://localhost:3000/objects \
  -F "title=My First Object" \
  -F "description=This is a test" \
  -F "file=@/path/to/image.jpg"
```

### Get All Objects
```bash
curl http://localhost:3000/objects
```

### Delete an Object (replace ID)
```bash
curl -X DELETE http://localhost:3000/objects/OBJECT_ID
```

## 6. Real-time Testing

Open browser console at `http://localhost:3000` and run:

```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => console.log('Connected'));
socket.on('objectCreated', (data) => console.log('Created:', data));
socket.on('objectDeleted', (data) => console.log('Deleted:', data));
```

## 7. Build for Production

```bash
npm run build
npm run start:prod
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongosh`
- Check MONGODB_URI in .env

### S3 Upload Error
- Verify all S3 credentials in .env
- Check bucket exists and is accessible
- Test with a small image file (< 1MB)

### Port Already in Use
```bash
# Change PORT in .env or run on different port
PORT=3001 npm run start:dev
```

## Next Steps

1. Read the full [README.md](./README.md)
2. Check [TESTING.md](./TESTING.md) for comprehensive testing
3. Review the project structure in [README.md](./README.md#project-structure)

## Architecture Questions Answered

### 1. NestJS Project Structure
- **Modular Design**: Separate modules for Objects and Upload
- **Service Layer**: Business logic in services
- **Controller Layer**: HTTP request handling
- **Gateway**: Socket.IO integration
- **DTO**: Input validation

### 2. Socket.IO Configuration
- Configured in `objects.gateway.ts`
- CORS-enabled for cross-origin connections
- Events: `objectCreated` and `objectDeleted`
- Automatic client tracking

### 3. S3 Upload with Rollback
- Upload to S3 first
- Save to MongoDB second
- If MongoDB fails, S3 file is deleted
- Unique file names prevent collisions

### 4. S3 Deletion Safety
- Delete from MongoDB first
- Delete from S3 second (errors are logged, not thrown)
- Object is removed even if S3 deletion fails
- Prevents orphaned files

## File Structure
```
heyamo/
├── src/
│   ├── objects/          # Object management
│   ├── upload/           # S3 integration
│   ├── config/           # Configuration
│   ├── common/           # Shared utilities
│   ├── shared/           # Constants
│   ├── app.module.ts     # Root module
│   └── main.ts           # Entry point
├── .env.example          # Environment template
├── docker-compose.yml    # Docker setup
├── Dockerfile            # Container image
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── README.md             # Full documentation
├── TESTING.md            # Testing guide
└── QUICKSTART.md         # This file
```

## Support

- Full documentation: [README.md](./README.md)
- API testing guide: [TESTING.md](./TESTING.md)
- Issues? Check the troubleshooting section above

Happy coding! 🚀
