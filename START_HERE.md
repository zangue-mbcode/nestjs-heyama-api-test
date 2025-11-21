# 🚀 Welcome to Heyamo Backend

A complete, production-ready NestJS API for object management with image uploads and real-time updates.

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your S3 credentials and MongoDB URI

# 3. Run the application
npm run start:dev

# 4. Visit http://localhost:3000
# 5. Test the API using the commands in QUICKSTART.md
```

---

## 📚 Documentation Guide

Choose your path based on what you need:

### 🏃 I'm in a hurry
→ **[QUICKSTART.md](./QUICKSTART.md)** (5 minutes)
- Setup in minutes
- Basic configuration
- Simple testing

### 🔧 I need to implement this
→ **[README.md](./README.md)** (Complete guide)
- Full API documentation
- Socket.IO guide
- Error handling
- Project structure

### 🏛️ I want to understand the architecture
→ **[ARCHITECTURE.md](./ARCHITECTURE.md)** (Technical deep dive)
- Module architecture
- Data flows
- Design patterns
- Security architecture

### 💾 I need to setup S3 storage
→ **[SETUP_S3.md](./SETUP_S3.md)** (Provider setup)
- Cloudflare R2
- DigitalOcean Spaces
- Backblaze B2

### 🧪 I want to test the API
→ **[TESTING.md](./TESTING.md)** (Testing guide)
- cURL examples
- Postman setup
- Socket.IO testing
- Test scenarios

### 💻 I need useful commands
→ **[SCRIPTS.md](./SCRIPTS.md)** (Commands reference)
- Docker commands
- MongoDB commands
- S3 commands
- Testing scripts

### 📊 Project Overview
→ **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** (Status report)
- What's included
- Features list
- Statistics
- Next steps

### ✅ What's completed?
→ **[COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md)** (Verification)
- All features checked
- Quality metrics
- Requirements verified

---

## 🎯 What You Get

### ✅ Complete REST API
```
POST   /objects         → Create object with image
GET    /objects         → Get all objects (sorted)
GET    /objects/:id     → Get specific object
DELETE /objects/:id     → Delete object & image
```

### ✅ Real-time Updates
```
objectCreated  → When new object created
objectDeleted  → When object deleted
```

### ✅ S3-Compatible Storage
- Cloudflare R2
- DigitalOcean Spaces
- Backblaze B2

### ✅ MongoDB Integration
- Automatic timestamps
- Database indexing
- Schema validation

### ✅ Professional Code
- Modular NestJS structure
- TypeScript strict mode
- Global error handling
- Input validation
- CORS support

---

## 📦 What's Included

```
heyamo/
├── src/                        # Source code (13 files)
│   ├── objects/               # API endpoints & business logic
│   ├── upload/                # S3 integration
│   ├── config/                # Database & S3 config
│   ├── common/                # Shared utilities
│   └── shared/                # Constants
│
├── Documentation/              # 8 markdown files
│   ├── README.md              # Full documentation
│   ├── QUICKSTART.md          # 5-minute setup
│   ├── ARCHITECTURE.md        # Technical design
│   ├── SETUP_S3.md            # S3 setup guide
│   ├── TESTING.md             # Testing guide
│   ├── SCRIPTS.md             # Command reference
│   └── PROJECT_SUMMARY.md     # Project overview
│
├── Configuration/              # 5 files
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── .eslintrc.js           # Code quality
│   ├── .env.example           # Environment template
│   └── .gitignore             # Git config
│
├── Docker/                      # 2 files
│   ├── Dockerfile             # Container image
│   └── docker-compose.yml     # Development setup
│
Total: 28 files created ✅
```

---

## 🔄 3-Step Setup

### Step 1: Environment Setup
```bash
cp .env.example .env
```

Edit `.env`:
```env
# MongoDB (choose one)
MONGODB_URI=mongodb://localhost:27017/heyamo
# OR
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/heyamo

# S3 Configuration (choose provider)
S3_ENDPOINT=your-endpoint
S3_REGION=auto
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=your-bucket
S3_PUBLIC_URL=https://your-public-url
```

See [SETUP_S3.md](./SETUP_S3.md) for detailed provider setup.

### Step 2: Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Application runs at http://localhost:3000
```

### Step 3: Test
```bash
# Create an object
curl -X POST http://localhost:3000/objects \
  -F "title=My Object" \
  -F "description=Test" \
  -F "file=@image.jpg"

# Get all objects
curl http://localhost:3000/objects
```

---

## 🐳 Docker Setup

Prefer Docker? Use our prepared setup:

```bash
# Start MongoDB + App
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop everything
docker-compose down
```

---

## 📖 Key Features Explained

### 1. File Upload (POST /objects)
- Accept JPEG, PNG, GIF, WebP
- Maximum 5MB
- Automatic S3 upload
- Unique filename generation
- Rollback on error

### 2. Real-time Updates (Socket.IO)
- Connect: `io('http://localhost:3000')`
- Listen: `socket.on('objectCreated', ...)`
- Listen: `socket.on('objectDeleted', ...)`

### 3. Error Handling
All errors return structured responses:
```json
{
  "statusCode": 400,
  "timestamp": "2024-11-21T10:30:00.000Z",
  "path": "/objects",
  "method": "POST",
  "message": "Clear error description"
}
```

### 4. Database
MongoDB with Mongoose:
```javascript
{
  title: String,           // Required
  description: String,     // Required
  imageUrl: String,        // From S3
  createdAt: Date,         // Auto
  updatedAt: Date          // Auto
}
```

---

## 🎓 Learning Path

**Beginner?**
1. Read: QUICKSTART.md (5 min)
2. Setup: Follow 3-Step Setup above
3. Test: Use TESTING.md examples

**Intermediate?**
1. Read: README.md (full documentation)
2. Review: src/objects/ code
3. Deploy: Use Docker setup

**Advanced?**
1. Study: ARCHITECTURE.md
2. Review: src/ folder structure
3. Extend: Add new features

---

## 🚀 Deployment Options

### Local Development
```bash
npm run start:dev
```

### Docker (Recommended)
```bash
docker-compose up -d
```

### Production
```bash
npm run build
npm run start:prod
```

---

## 💡 Common Commands

```bash
# Development
npm run start:dev          # Auto-reload

# Build & Deploy
npm run build              # Compile
npm run start:prod         # Run compiled

# Code Quality
npm run lint               # Check & fix

# Docker
docker-compose up -d       # Start
docker-compose down        # Stop
```

See [SCRIPTS.md](./SCRIPTS.md) for more commands.

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- See [README.md](./README.md#troubleshooting)

### "S3 upload fails"
- Verify credentials in .env
- Check bucket name
- See [SETUP_S3.md](./SETUP_S3.md) for provider setup

### "Port 3000 already in use"
- Change PORT in .env
- Or kill process: `lsof -ti:3000 | xargs kill -9`

### "Socket.IO not connecting"
- Check CORS_ORIGIN in .env
- See browser console for errors
- See [TESTING.md](./TESTING.md) for Socket.IO testing

---

## 📞 Getting Help

1. **Quick answers**: Check this file and QUICKSTART.md
2. **Full API docs**: Read README.md
3. **Technical details**: Read ARCHITECTURE.md
4. **S3 setup help**: Read SETUP_S3.md
5. **Testing issues**: Read TESTING.md
6. **Commands**: Check SCRIPTS.md

---

## ✨ What's Next?

After setup:

1. ✅ Create some objects
2. ✅ Test all endpoints
3. ✅ Try Socket.IO real-time
4. ✅ Review the code
5. ✅ Deploy to production

---

## 🎯 Project Status

✅ **COMPLETE & PRODUCTION-READY**

- ✅ 13 TypeScript files
- ✅ 8 documentation files
- ✅ 4 REST endpoints
- ✅ 2 Socket.IO events
- ✅ 3 S3 providers supported
- ✅ Docker support
- ✅ Full error handling
- ✅ Input validation
- ✅ Professional architecture

---

## 🔗 Quick Links

| Need | Link |
|------|------|
| Quick setup | [QUICKSTART.md](./QUICKSTART.md) |
| Full docs | [README.md](./README.md) |
| Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| S3 setup | [SETUP_S3.md](./SETUP_S3.md) |
| Testing | [TESTING.md](./TESTING.md) |
| Commands | [SCRIPTS.md](./SCRIPTS.md) |
| Overview | [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) |
| Checklist | [COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md) |

---

## 🎉 Ready to Get Started?

**Next Step**: Read [QUICKSTART.md](./QUICKSTART.md) (5 minutes)

Then run:
```bash
npm install
npm run start:dev
```

That's it! 🚀

---

**Questions?** Check the documentation files above.
**Issues?** See the troubleshooting sections.
**Ready?** Let's build something great!

Happy coding! 💻
