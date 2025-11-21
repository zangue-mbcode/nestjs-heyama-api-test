# Useful Scripts & Commands

Collection of helpful commands for development and testing.

## NPM Scripts

All these are configured in `package.json`:

```bash
# Development
npm run start:dev          # Start with auto-reload
npm run start:debug        # Start with debugger
npm run start              # Start application

# Production
npm run build              # Compile TypeScript
npm run start:prod         # Run production build

# Code Quality
npm run lint               # Run ESLint with auto-fix

# Testing (ready to add)
npm test                   # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate coverage report
```

## Development Commands

### Start Application
```bash
# Development (watch mode)
npm run start:dev

# Debug mode (with inspector)
npm run start:debug
# Then attach debugger to port 9229

# Production mode
npm run build
npm run start:prod
```

### Build & Deploy
```bash
# Build for production
npm run build

# Check build output
ls -la dist/

# Run production build locally
npm run start:prod
```

### Code Quality
```bash
# Fix linting issues
npm run lint

# Check TypeScript
npx tsc --noEmit

# Check for unused dependencies
npm run lint
```

## Docker Commands

### Local Development with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# View MongoDB logs
docker-compose logs -f mongodb

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild images
docker-compose up -d --build

# Access MongoDB in container
docker-compose exec mongodb mongosh
```

### Docker Image Management

```bash
# Build image manually
docker build -t heyamo:latest .

# Run container manually
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://localhost:27017/heyamo \
  -e S3_ENDPOINT=https://... \
  heyamo:latest

# Remove unused images
docker image prune
```

## MongoDB Commands

### Local MongoDB

```bash
# Connect to MongoDB
mongosh localhost:27017/heyamo

# List all databases
show dbs

# Use specific database
use heyamo

# List collections
show collections

# View all objects
db.objects.find().pretty()

# Count objects
db.objects.countDocuments()

# View specific object
db.objects.findOne({ _id: ObjectId("...") })

# Get indexes
db.objects.getIndexes()

# Delete all objects
db.objects.deleteMany({})

# Drop collection
db.objects.drop()

# Check database size
db.stats()
```

### MongoDB Atlas (Cloud)

```bash
# Connect with connection string
mongosh "mongodb+srv://username:password@cluster.mongodb.net/heyamo"
```

## S3 Testing Commands

### Using AWS CLI

```bash
# List bucket contents
aws s3 ls s3://bucket-name --recursive \
  --endpoint-url https://your-endpoint.com

# Upload file
aws s3 cp image.jpg s3://bucket-name/ \
  --endpoint-url https://your-endpoint.com

# Download file
aws s3 cp s3://bucket-name/image.jpg . \
  --endpoint-url https://your-endpoint.com

# Delete file
aws s3 rm s3://bucket-name/image.jpg \
  --endpoint-url https://your-endpoint.com

# Sync directory
aws s3 sync ./local-folder s3://bucket-name/ \
  --endpoint-url https://your-endpoint.com
```

### Configure AWS CLI for Cloudflare R2

```bash
# Add R2 profile to AWS credentials
aws configure --profile r2

# Enter:
# - Access Key ID
# - Secret Access Key
# - Region: auto

# Use with commands
aws s3 ls s3://bucket --profile r2 \
  --endpoint-url https://r2-endpoint.com
```

## cURL API Testing

### Create Object

```bash
# With image file
curl -X POST http://localhost:3000/objects \
  -F "title=My Object" \
  -F "description=Test object" \
  -F "file=@/path/to/image.jpg"

# Save response to variable
RESPONSE=$(curl -s -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=Test" \
  -F "file=@image.jpg")

# Extract object ID
OBJECT_ID=$(echo $RESPONSE | jq -r '._id')
```

### Get Objects

```bash
# List all
curl http://localhost:3000/objects

# Pretty print
curl http://localhost:3000/objects | jq '.'

# Get specific object
curl http://localhost:3000/objects/{id} | jq '.'

# Count objects
curl -s http://localhost:3000/objects | jq 'length'
```

### Delete Object

```bash
# Delete object
curl -X DELETE http://localhost:3000/objects/{id}

# Check deletion (should return 404)
curl http://localhost:3000/objects/{id}
```

### Error Testing

```bash
# Missing file
curl -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=Test"

# Invalid file type
curl -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=Test" \
  -F "file=@document.pdf"

# Missing fields
curl -X POST http://localhost:3000/objects \
  -F "file=@image.jpg"

# Invalid ID
curl http://localhost:3000/objects/invalid-id
```

## JavaScript Testing Scripts

### Node.js Socket.IO Client Test

Create file `test-socket.js`:

```javascript
const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✓ Connected:', socket.id);
});

socket.on('objectCreated', (data) => {
  console.log('✓ Object Created:', data);
});

socket.on('objectDeleted', (data) => {
  console.log('✓ Object Deleted:', data);
});

socket.on('disconnect', () => {
  console.log('✓ Disconnected');
});

socket.on('error', (error) => {
  console.error('✗ Error:', error);
  process.exit(1);
});

// Test timeout
setTimeout(() => {
  console.log('✓ Test completed');
  process.exit(0);
}, 5000);
```

Run it:
```bash
node test-socket.js
```

### Browser Console Testing

Open browser console at `http://localhost:3000`:

```javascript
// Connect
const socket = io('http://localhost:3000');

// Listen
socket.on('objectCreated', (data) => console.log('Created:', data));
socket.on('objectDeleted', (data) => console.log('Deleted:', data));

// Test
console.log('Socket ID:', socket.id);
console.log('Connected:', socket.connected);
```

## Git Commands

### Initialize Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete NestJS backend for object management"

# Create GitHub remote (if not exists)
git remote add origin https://github.com/username/heyamo.git

# Push to GitHub
git push -u origin main
```

### Regular Workflow

```bash
# Check status
git status

# Add changes
git add src/

# Commit changes
git commit -m "feature: Add new endpoint"

# Push changes
git push

# Pull latest
git pull

# Create feature branch
git checkout -b feature/new-feature

# Switch back to main
git checkout main

# Merge feature
git merge feature/new-feature
```

## Performance Testing

### Using Apache Bench

```bash
# Test single endpoint
ab -n 100 -c 10 http://localhost:3000/objects

# Test with data
ab -n 1000 -c 50 -p data.json -T application/json \
  http://localhost:3000/objects
```

### Using Artillery

Create `load-test.yml`:

```yaml
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: Get Objects
    flow:
      - get:
          url: /objects
  - name: Create Object
    flow:
      - post:
          url: /objects
          json:
            title: "Test"
            description: "Load test"
```

Run test:
```bash
artillery run load-test.yml
```

## Debugging

### Enable Debug Logging

```bash
# Enable all debug logs
DEBUG=* npm run start:dev

# Enable specific module
DEBUG=heyamo:* npm run start:dev

# With grep filter
DEBUG=* npm run start:dev | grep objects
```

### Debug MongoDB Queries

```bash
# Enable Mongoose debug logging
DEBUG=mongoose:* npm run start:dev
```

### Debug Socket.IO

```bash
# Enable Socket.IO debug logging
DEBUG=socket.io:* npm run start:dev
```

### Node.js Inspector

```bash
# Start with inspector
node --inspect=9229 dist/main.js

# With auto-reload (nodemon)
npm run start:debug

# Attach Chrome DevTools
# Open: chrome://inspect
```

## Environment Management

### Switch Environments

```bash
# Development
cp .env.example .env.development
source .env.development
npm run start:dev

# Production
cp .env.example .env.production
source .env.production
npm run build && npm start:prod

# Testing
cp .env.example .env.test
source .env.test
npm test
```

### Check Environment Variables

```bash
# View all
env | grep -E "(MONGODB|S3|PORT|NODE_ENV)"

# Specific variable
echo $MONGODB_URI
echo $S3_ENDPOINT
```

## Database Backup & Restore

### MongoDB Backup

```bash
# Backup database
mongodump --uri "mongodb://localhost:27017/heyamo" \
  --out ./backup/$(date +%Y%m%d)

# Backup to file
mongodump --uri "mongodb+srv://..." --archive=backup.archive

# Backup specific collection
mongodump --db heyamo --collection objects \
  --out ./objects-backup
```

### MongoDB Restore

```bash
# Restore database
mongorestore --uri "mongodb://localhost:27017" \
  ./backup/20240101/heyamo

# Restore from archive
mongorestore --archive=backup.archive

# Restore specific collection
mongorestore --db heyamo --collection objects \
  ./objects-backup/heyamo/objects.bson
```

## File Management

### Project Structure

```bash
# Show src structure
find src -type f -name "*.ts" | sort

# Count files
find src -type f | wc -l

# Count lines of code
find src -name "*.ts" -exec wc -l {} + | tail -1

# Find specific files
find src -name "*gateway*"
find src -name "*service*"
```

### Cleanup

```bash
# Remove node_modules
rm -rf node_modules
npm install

# Remove build output
rm -rf dist

# Clean everything
npm run clean
```

## Health Checks

### API Health

```bash
# Check if API is running
curl -s http://localhost:3000/objects > /dev/null && \
  echo "✓ API is running" || echo "✗ API is down"

# Check status code
curl -o /dev/null -s -w "%{http_code}" http://localhost:3000/objects
```

### Database Health

```bash
# MongoDB status
mongosh --eval "db.adminCommand('ping')"

# Check connection in app
curl -s http://localhost:3000/objects | jq '.' && \
  echo "✓ Database is connected"
```

### Docker Health

```bash
# Check container status
docker-compose ps

# Check logs for errors
docker-compose logs app | grep -i error

# Resource usage
docker stats
```

## Useful One-Liners

```bash
# Create test image
convert -size 100x100 xc:blue test.jpg

# Count objects in database
curl -s http://localhost:3000/objects | jq 'length'

# Get all image URLs
curl -s http://localhost:3000/objects | jq '.[] | .imageUrl'

# Export objects to JSON
curl -s http://localhost:3000/objects > objects.json

# Validate JSON response
curl -s http://localhost:3000/objects | jq . > /dev/null && echo "Valid JSON"

# Get last created object
curl -s http://localhost:3000/objects | jq '.[0]'

# Pretty print with colors
curl -s http://localhost:3000/objects | jq -C '.'
```

## Monitoring Scripts

### Watch Application Logs

```bash
# Tail logs with timestamps
npm run start:dev | while IFS= read -r line; do
  echo "[$(date '+%H:%M:%S')] $line"
done
```

### Monitor Database

```bash
# Watch collection size
watch -n 5 'mongosh --eval "db.objects.stats()"'

# Monitor index usage
mongosh --eval "db.objects.aggregate([{$indexStats: {}}])"
```

### Health Check Loop

```bash
# Check health every 10 seconds
while true; do
  curl -s http://localhost:3000/objects > /dev/null && \
    echo "$(date '+%H:%M:%S') ✓ OK" || \
    echo "$(date '+%H:%M:%S') ✗ FAIL"
  sleep 10
done
```

---

**Pro Tips:**
- Use `jq` for JSON parsing in terminal
- Use `watch` for monitoring commands
- Use `DEBUG=*` for comprehensive logging
- Save credentials in `.env` file, not terminal history
- Test locally before deploying to production
