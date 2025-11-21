# Architecture Documentation

Comprehensive guide to the Heyamo backend architecture and design patterns.

## Overview

Heyamo is a professional NestJS backend API built following enterprise architectural patterns with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Requests                         │
│                   Socket.IO Clients                      │
└────────────────┬──────────────────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │    Controller     │  (HTTP Request Handling)
        │  (ObjectsCtrl)    │
        └────────┬──────────┘
                 │
        ┌────────▼─────────────────┐
        │       Service Layer       │
        ├──────────────────────────┤
        │  ObjectsService          │
        │  UploadService           │
        │  ObjectsGateway          │
        └────────┬──────────────────┘
                 │
        ┌────────┴──────────────────┐
        │                           │
   ┌────▼──────┐             ┌─────▼──────┐
   │  MongoDB   │             │ S3-Compatible
   │            │             │ Storage
   └────────────┘             └────────────┘
```

## Module Architecture

### 1. Objects Module (`src/objects/`)

Handles all object-related operations including CRUD, image management, and real-time updates.

**Components:**

- **Controller** (`objects.controller.ts`)
  - Handles HTTP requests
  - Manages file uploads via Multer
  - Triggers Socket.IO events
  - Returns structured responses

- **Service** (`objects.service.ts`)
  - Core business logic
  - Object CRUD operations
  - Integrates with UploadService
  - Handles transaction-like behavior

- **Gateway** (`objects.gateway.ts`)
  - WebSocket connection management
  - Real-time event broadcasting
  - Client tracking

- **Schema** (`schemas/object.schema.ts`)
  - MongoDB schema definition
  - Database indexes
  - Timestamps

- **DTO** (`dto/create-object.dto.ts`)
  - Input validation
  - Type safety

- **Module** (`objects.module.ts`)
  - Module assembly
  - Dependency injection
  - Module exports

### 2. Upload Module (`src/upload/`)

Handles S3-compatible storage operations.

**Components:**

- **Service** (`upload.service.ts`)
  - S3 client initialization
  - File validation
  - Upload/Delete operations
  - Error handling
  - File naming strategy

- **Module** (`upload.module.ts`)
  - Service export for other modules

### 3. Config Module (`src/config/`)

Environment and service configuration.

**Files:**

- `database.config.ts` - MongoDB connection settings
- `s3.config.ts` - S3-compatible storage settings

### 4. Common Module (`src/common/`)

Shared utilities and filters.

**Files:**

- `filters/all-exceptions.filter.ts` - Global error handling

### 5. Shared Module (`src/shared/`)

Application-wide constants.

**Files:**

- `constants.ts` - Error/success messages and validation rules

## Data Flow

### Create Object Flow

```
Client Request
    │
    ▼
POST /objects (multipart/form-data)
    │
    ▼
ObjectsController.create()
    │
    ▼
ObjectsService.create()
    │
    ├─▶ UploadService.uploadImage()
    │   │
    │   ├─▶ Validate file type and size
    │   │
    │   ├─▶ Generate unique filename
    │   │
    │   └─▶ Upload to S3
    │       Returns: imageUrl
    │
    ├─▶ Create object in MongoDB
    │   Returns: savedObject
    │
    └─▶ Handle errors (rollback S3 if DB fails)

ObjectsController emits Socket.IO event
    │
    ▼
ObjectsGateway.emitObjectCreated()
    │
    ▼
All connected clients receive "objectCreated" event
    │
    ▼
Return 201 with object data
```

### Delete Object Flow

```
Client Request
    │
    ▼
DELETE /objects/:id
    │
    ▼
ObjectsController.delete()
    │
    ▼
ObjectsService.delete()
    │
    ├─▶ Verify object exists
    │
    ├─▶ Delete from MongoDB
    │
    ├─▶ Delete from S3 (fire & forget)
    │
    └─▶ Handle errors appropriately

ObjectsController emits Socket.IO event
    │
    ▼
ObjectsGateway.emitObjectDeleted()
    │
    ▼
All connected clients receive "objectDeleted" event
    │
    ▼
Return 204 No Content
```

### Real-time Update Flow

```
Client A                    Server                    Client B
   │                          │                          │
   ├─ Creates object ────────▶│                          │
   │                          ├─ Saves to DB             │
   │                          ├─ Uploads to S3           │
   │                          ├─ Broadcasts via Socket   │
   │                          │────────────────────────▶ │ Receives event
   │                      (Response 201)                 │
   └─ Receives 201            │                          │
                               │                      (Auto-update)
                               │
```

## Design Patterns Used

### 1. Dependency Injection (DI)
- NestJS constructor-based injection
- Modules control service lifecycle
- Easy testing and mocking

```typescript
constructor(
  @InjectModel(Object.name) private objectModel,
  private uploadService: UploadService,
) {}
```

### 2. DTO (Data Transfer Object)
- Input validation
- Type safety
- Clear API contracts

```typescript
export class CreateObjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
```

### 3. Service Layer Pattern
- Business logic separation
- Reusability across controllers
- Testability

### 4. Gateway Pattern
- WebSocket abstraction
- Event broadcasting
- Connection management

### 5. Exception Filter Pattern
- Centralized error handling
- Consistent error responses
- Logging

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Centralized error handling
  }
}
```

## Security Architecture

### Input Validation
```
User Input → DTO Validation → Sanitized Data → Database/Storage
```

### File Validation
```
Uploaded File
    │
    ├─ MIME Type Check
    ├─ File Size Check
    └─ File Content Validation
```

### S3 Integration
```
S3 Credentials → AWS SDK Client → Presigned URLs (future)
```

### CORS Configuration
```
Request with Origin Header
    │
    ▼
CORS Middleware
    │
    ├─ Check against CORS_ORIGIN
    └─ Allow/Reject with headers
```

## Error Handling Strategy

### Hierarchy
```
1. Input Validation (400 Bad Request)
   └─ DTO validation fails

2. Business Logic Errors (404 Not Found, 422 Unprocessable)
   └─ Resource not found
   └─ Business rule violated

3. Infrastructure Errors (500 Internal Server Error)
   └─ Database connection failed
   └─ S3 upload failed

4. Unexpected Errors (500 Internal Server Error)
   └─ Global exception filter catches all
```

### Recovery Strategies

**Upload Failure → Rollback**
```typescript
try {
  imageUrl = await uploadService.upload();
  object = await dbService.save();
} catch (error) {
  if (imageUrl) {
    await uploadService.delete(imageUrl); // Rollback
  }
  throw error;
}
```

**Delete Failure → Graceful Degradation**
```typescript
// Delete from DB (critical)
await db.delete();

// Try to delete from S3 (best effort)
try {
  await s3.delete();
} catch (error) {
  // Log but don't throw
  console.warn('S3 delete failed');
}
```

## Database Design

### Object Schema

```javascript
{
  _id: ObjectId,
  title: String,          // Required, indexed for search
  description: String,    // Required
  imageUrl: String,       // Optional, URL format
  createdAt: Date,        // Auto, indexed for sorting
  updatedAt: Date,        // Auto
}

// Indexes
- createdAt: -1 (for sorting)
```

### Future Enhancements
- Add `userId` for multi-tenant support
- Add `tags` array for filtering
- Add `visibility` enum for access control
- Add `version` for optimistic locking

## Performance Considerations

### Database
- Index on `createdAt` for efficient sorting
- Connection pooling via Mongoose
- Lean queries for large datasets

### File Upload
- 5MB size limit (configurable)
- Image format validation before upload
- Unique filenames to prevent collisions
- Async/parallel uploads for multiple files

### Real-time Updates
- Socket.IO connection pooling
- Broadcast instead of individual sends
- Connection lifecycle management

### Scalability Notes
- Horizontal scaling: Add load balancer
- Database: Use MongoDB replication
- Storage: S3 scales automatically
- Real-time: Use Redis adapter for Socket.IO across instances

## Configuration Management

### Environment Variables
```
.env (local development)
├── Server Settings (PORT, NODE_ENV)
├── Database Settings (MONGODB_URI)
├── S3 Settings (Endpoint, credentials, bucket)
└── CORS Settings (CORS_ORIGIN)
```

### Configuration Loading
```
process.env → config files → NestJS modules → Services
```

## Testing Architecture

### Unit Tests (Future)
```
Service Tests
  ├─ ObjectsService
  ├─ UploadService
  └─ Mocked dependencies
```

### Integration Tests (Future)
```
E2E Tests
  ├─ Controller → Service → Database
  ├─ File upload flow
  └─ Real-time events
```

### Test Data
```
MongoDB Test Database
  └─ Populated with sample objects
S3 Test Bucket
  └─ Sample images
```

## Deployment Architecture

### Development
```
npm run start:dev
    │
    ▼
Auto-reload on file changes
    │
    ▼
localhost:3000
```

### Production
```
npm run build
    │
    ▼
TypeScript → JavaScript
    │
    ▼
npm start
    │
    ▼
Optimized dist/ folder
    │
    ▼
Docker → Registry → Kubernetes/VMs
```

### Docker Architecture
```
Dockerfile
  ├─ Build Stage
  │  ├─ node:20-alpine
  │  ├─ npm ci
  │  └─ npm run build
  │
  └─ Production Stage
     ├─ node:20-alpine
     ├─ Copy dist/
     └─ npm run start:prod
```

### Docker Compose
```
docker-compose.yml
  ├─ MongoDB Service
  │  ├─ Port: 27017
  │  └─ Volume: mongo_data
  │
  └─ App Service
     ├─ Port: 3000
     ├─ Depends on: MongoDB
     └─ Environment: .env
```

## Monitoring & Logging

### Current Implementation
```
console.log() for development
console.error() for errors
  │
  ▼
Node.js stdout/stderr
```

### Future Enhancements
```
Winston Logger
  │
  ├─ File Logs
  ├─ Console Logs
  ├─ Error Tracking (Sentry)
  └─ Performance Monitoring (New Relic)
```

## API Versioning Strategy

### Current (v1)
```
/objects
/objects/:id
```

### Future Versioning
```
/v1/objects
/v2/objects (with new features)
```

## Backward Compatibility

### Current
- No versioning needed (v1 only)

### Future
- API versions in routes
- Deprecated warnings in responses
- Migration guides for clients

## Architecture Decisions

### 1. Why NestJS?
- ✅ Enterprise-grade framework
- ✅ Built-in DI container
- ✅ TypeScript first-class support
- ✅ Modular architecture
- ✅ Great ecosystem

### 2. Why MongoDB?
- ✅ Flexible schema for object variations
- ✅ Good for rapid development
- ✅ Horizontal scaling (sharding)
- ✅ Cloud-friendly (Atlas)

### 3. Why Socket.IO?
- ✅ Real-time bidirectional communication
- ✅ Fallbacks for older browsers
- ✅ Room/namespace support
- ✅ Good integration with NestJS

### 4. Why S3-Compatible?
- ✅ Vendor-agnostic (multiple providers)
- ✅ Cost-effective
- ✅ AWS SDK support
- ✅ No vendor lock-in

## Conclusion

The architecture is designed to be:
- **Scalable**: Horizontal scaling ready
- **Maintainable**: Clear separation of concerns
- **Testable**: Dependency injection
- **Secure**: Input validation, CORS, error handling
- **Professional**: Enterprise patterns and best practices

For questions or improvements, consult the README and code comments.
