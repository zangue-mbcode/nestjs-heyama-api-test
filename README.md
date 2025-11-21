# Heyamo Backend - Object Management API

A professional NestJS backend API for managing objects with image uploads to S3-compatible storage and real-time updates via Socket.IO.

## Features

- ✅ **REST API** with full CRUD operations for objects
- ✅ **Image Upload** to S3-compatible services (Cloudflare R2, DigitalOcean Spaces, Backblaze B2)
- ✅ **Real-time Notifications** using Socket.IO
- ✅ **MongoDB** integration with Mongoose
- ✅ **Input Validation** using class-validator
- ✅ **Error Handling** with custom exception filters
- ✅ **CORS Support** for web and mobile clients
- ✅ **Docker Support** with docker-compose
- ✅ **Professional Architecture** following NestJS best practices

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: MongoDB with Mongoose
- **Storage**: S3-compatible services (AWS SDK v3)
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: class-validator & class-transformer
- **Language**: TypeScript
- **Runtime**: Node.js 22+

## Prerequisites

- Node.js 22+ and npm/yarn
- MongoDB 5.0+ (Atlas)
- S3-compatible storage account (Cloudflare R2, DigitalOcean Spaces, or Backblaze B2)
- Docker & Docker Compose (optional, for containerized setup)

## Installation

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/zangue-mbcode/nestjs-heyama-api-test.git
cd nestjs-heyama-api-test

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy the example .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<url>.mongodb.net/<cluster>

# S3 Configuration (choose your provider)
S3_ENDPOINT=https://your-s3-endpoint.com
S3_REGION=auto
S3_ACCESS_KEY_ID=your_key
S3_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=your-bucket
S3_PUBLIC_URL=https://your-public-url.com
```

### Provider-Specific Setup

#### Cloudflare R2

```env
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=<access_key>
S3_SECRET_ACCESS_KEY=<secret_key>
S3_BUCKET_NAME=<bucket-name>
S3_PUBLIC_URL=https://<custom-domain-or-public-url>
```

## Running the Application

### Development Mode

```bash
# Start with auto-reload
npm run start:dev

# Application runs on http://localhost:3000
```

### Production Mode

```bash
# Build the application
npm run build

# Start the server
npm run start:prod
```

### Using Docker Compose

```bash
# Create and start containers
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

## API Endpoints

### Create Object

```http
POST /objects
Content-Type: multipart/form-data

{
  "title": "My Object",
  "description": "Object description",
  "file": <image file>
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "2f481c82-17ec-4ac6-8151-b7cc2ead7ce2",
  "title": "My Object",
  "description": "Object description",
  "imageUrl": "https://your-public-url.com/objects/1699540000000-abc123def456.jpeg",
  "createdAt": "2024-11-21T10:30:00.000Z",
  "updatedAt": "2024-11-21T10:30:00.000Z"
}
```

### Get All Objects

```http
GET /objects
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "2f481c82-17ec-4ac6-8151-b7cc2ead7ce2",
    "title": "Object 1",
    "description": "Description 1",
    "imageUrl": "https://your-public-url.com/objects/...",
    "createdAt": "2024-11-21T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "id": "2f481c82-17ec-4ac6-8151-b7cc2ead7ce2",
    "title": "Object 2",
    "description": "Description 2",
    "imageUrl": "https://your-public-url.com/objects/...",
    "createdAt": "2024-11-21T09:30:00.000Z"
  }
]
```

### Get Single Object

```http
GET /objects/:id
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "2f481c82-17ec-4ac6-8151-b7cc2ead7ce2",
  "title": "My Object",
  "description": "Object description",
  "imageUrl": "https://your-public-url.com/objects/...",
  "createdAt": "2024-11-21T10:30:00.000Z"
}
```

### Delete Object

```http
DELETE /objects/:id
```

**Response (204 No Content)**

The corresponding image is automatically deleted from S3.

## Socket.IO Events

### Client Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

### Listen for Object Created

```javascript
socket.on('objectCreated', (data) => {
  console.log('New object created:', data);
  // {
  //   id: "507f1f77bcf86cd799439011",
  //   title: "My Object",
  //   description: "...",
  //   imageUrl: "https://...",
  //   createdAt: "2024-11-21T10:30:00.000Z"
  // }
});
```

### Listen for Object Deleted

```javascript
socket.on('objectDeleted', (data) => {
  console.log('Object deleted:', data);
  // {
  //   id: "507f1f77bcf86cd799439011",
  //   deletedAt: "2024-11-21T10:35:00.000Z"
  // }
});
```

## Error Handling

The API returns structured error responses:

```json
{
  "statusCode": 400,
  "timestamp": "2024-11-21T10:30:00.000Z",
  "path": "/objects",
  "method": "POST",
  "message": "File size must not exceed 5MB",
  "errors": null
}
```

### Common Status Codes

- **200 OK**: Successful GET request
- **201 Created**: Successful POST request
- **204 No Content**: Successful DELETE request
- **400 Bad Request**: Invalid input or validation error
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## File Validation

### Image Upload Requirements

- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Max Size**: 5MB
- **Required**: Yes, for creating objects

## Project Structure

```
src/
├── objects/
│   ├── dto/
│   │   └── create-object.dto.ts
│   ├── schemas/
│   │   └── object.schema.ts
│   ├── objects.controller.ts
│   ├── objects.gateway.ts
│   ├── objects.service.ts
│   └── objects.module.ts
├── upload/
│   ├── upload.service.ts
│   └── upload.module.ts
├── config/
│   ├── database.config.ts
│   └── s3.config.ts
├── common/
│   └── filters/
│       └── all-exceptions.filter.ts
├── app.module.ts
└── main.ts
```

## Development Workflow

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Running Tests (optional)

```bash
npm test
```

## Database Indexes

The application creates automatic indexes for optimized queries:

- `createdAt: -1` - For sorting objects by creation date

## Security Considerations

- **CORS**: Configured to allow specified origins
- **File Validation**: Type and size checks before upload
- **Error Messages**: Sanitized to prevent information leakage
- **Environment Variables**: Sensitive data stored in .env
- **S3 Permissions**: Use restricted IAM policies with bucket-specific permissions

## Troubleshooting

### MongoDB Connection Issues

```bash
# Verify MongoDB is running
mongosh localhost:27017

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/heyamo
```

### S3 Upload Failures

1. Verify S3 credentials and permissions
2. Check bucket name and region
3. Ensure file size is under 5MB
4. Verify CORS settings on S3 bucket

### Socket.IO Connection Issues

1. Check CORS_ORIGIN environment variable
2. Verify client is using correct server URL
3. Check browser console for connection errors



## License

MIT

## Support

For issues or questions, please contact the development team or create an issue in the repository.
