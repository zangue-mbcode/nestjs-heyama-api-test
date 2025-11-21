# API Testing Guide

This guide will help you test all endpoints and Socket.IO functionality.

## Prerequisites

1. Application running on `http://localhost:3000`
2. MongoDB connected
3. S3 credentials configured

## Testing Tools

### Option 1: Using cURL

```bash
# Create object (with image)
curl -X POST http://localhost:3000/objects \
  -F "title=My First Object" \
  -F "description=This is a test object" \
  -F "file=@/path/to/image.jpg"

# Get all objects
curl http://localhost:3000/objects

# Get specific object (replace ID)
curl http://localhost:3000/objects/507f1f77bcf86cd799439011

# Delete object
curl -X DELETE http://localhost:3000/objects/507f1f77bcf86cd799439011
```

### Option 2: Using Postman

1. **Create Object Request**
   - Method: POST
   - URL: `http://localhost:3000/objects`
   - Tab: Body → form-data
   - Add:
     - `title` (text): "My Object"
     - `description` (text): "Test description"
     - `file` (file): Select an image

2. **Get All Objects**
   - Method: GET
   - URL: `http://localhost:3000/objects`

3. **Get Single Object**
   - Method: GET
   - URL: `http://localhost:3000/objects/{id}`

4. **Delete Object**
   - Method: DELETE
   - URL: `http://localhost:3000/objects/{id}`

### Option 3: Using Thunder Client (VS Code)

Similar to Postman, configure requests in Thunder Client extension.

## Socket.IO Testing

### Browser Console

```javascript
// Connect to server
const socket = io('http://localhost:3000');

// Listen for connections
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

// Listen for new objects
socket.on('objectCreated', (data) => {
  console.log('Object created:', data);
});

// Listen for deleted objects
socket.on('objectDeleted', (data) => {
  console.log('Object deleted:', data);
});

// Handle disconnect
socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

### Node.js Socket.IO Client Test

```javascript
const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✓ Connected to server');
});

socket.on('objectCreated', (data) => {
  console.log('✓ Received objectCreated event:', data);
});

socket.on('objectDeleted', (data) => {
  console.log('✓ Received objectDeleted event:', data);
});

socket.on('disconnect', () => {
  console.log('✓ Disconnected from server');
});
```

## Test Scenarios

### Scenario 1: Create and Retrieve Object

1. Create an object with image
2. Note the returned object ID
3. Retrieve it using GET /objects/:id
4. Verify all fields match

**Expected Results:**
- ✓ Image uploaded to S3
- ✓ Object saved to MongoDB
- ✓ Socket event "objectCreated" emitted
- ✓ Response contains imageUrl

### Scenario 2: List All Objects

1. Create multiple objects
2. Call GET /objects
3. Verify all objects are returned
4. Check if sorted by creation date (newest first)

**Expected Results:**
- ✓ All objects returned
- ✓ Sorted by createdAt descending
- ✓ Response is array

### Scenario 3: Delete Object

1. Create an object
2. Call DELETE /objects/:id
3. Verify object is gone
4. Check S3 bucket (image should be deleted)

**Expected Results:**
- ✓ Returns 204 No Content
- ✓ Socket event "objectDeleted" emitted
- ✓ Image deleted from S3
- ✓ GET /objects/:id returns 404

### Scenario 4: Validation Errors

1. POST without file → error
2. POST with missing title → error
3. POST with oversized file → error
4. POST with invalid file type → error

**Expected Results:**
- ✓ 400 Bad Request
- ✓ Clear error messages

### Scenario 5: Real-time Updates

1. Open two browser tabs
2. In tab 1: Socket.IO listener console
3. In tab 2: Create/delete objects
4. Verify tab 1 receives events in real-time

**Expected Results:**
- ✓ Events received immediately
- ✓ Data is correct

## Performance Testing

### Load Testing with Apache Bench

```bash
# Simulate 100 concurrent requests
ab -n 100 -c 10 http://localhost:3000/objects
```

### Stress Testing with Load Generator

```bash
npm install -g artillery

# Create artillery-load.yml
echo 'config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Get Objects"
    flow:
      - get:
          url: /objects' > artillery-load.yml

# Run load test
artillery run artillery-load.yml
```

## Error Response Examples

### Missing File

```bash
curl -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=Test"
```

Response:
```json
{
  "statusCode": 400,
  "timestamp": "2024-11-21T10:30:00.000Z",
  "path": "/objects",
  "method": "POST",
  "message": "No file provided"
}
```

### Invalid File Type

```bash
curl -X POST http://localhost:3000/objects \
  -F "title=Test" \
  -F "description=Test" \
  -F "file=@document.pdf"
```

Response:
```json
{
  "statusCode": 400,
  "timestamp": "2024-11-21T10:30:00.000Z",
  "path": "/objects",
  "method": "POST",
  "message": "Invalid file type. Allowed types: image/jpeg, image/png, image/gif, image/webp"
}
```

### Object Not Found

```bash
curl http://localhost:3000/objects/invalid-id
```

Response:
```json
{
  "statusCode": 404,
  "timestamp": "2024-11-21T10:30:00.000Z",
  "path": "/objects/invalid-id",
  "method": "GET",
  "message": "Object with ID invalid-id not found"
}
```

## Debugging

### Enable Debug Logs

```bash
# Set debug environment variable
DEBUG=* npm run start:dev
```

### Monitor MongoDB

```bash
# Connect to MongoDB
mongosh

# List databases
show dbs

# Switch to heyamo database
use heyamo

# View objects
db.objects.find().pretty()

# Check indexes
db.objects.getIndexes()
```

### Check S3 Bucket

```bash
# Using AWS CLI for S3-compatible storage
aws s3 ls s3://your-bucket-name --recursive \
  --endpoint-url https://your-s3-endpoint.com
```

## Common Issues and Solutions

### Connection Refused

**Problem**: Cannot connect to MongoDB
**Solution**: Ensure MongoDB is running and connection string is correct

### S3 Upload Fails

**Problem**: 403 Forbidden error
**Solution**: Check S3 credentials and bucket permissions

### Socket.IO Not Connecting

**Problem**: WebSocket connection fails
**Solution**: Check CORS settings and firewall

### File Size Limit Exceeded

**Problem**: 413 Request Entity Too Large
**Solution**: Image must be under 5MB

## Next Steps

1. Once all scenarios pass ✓
2. Deploy to staging environment
3. Run integration tests
4. Deploy to production
