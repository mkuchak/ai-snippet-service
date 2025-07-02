# AI Snippet Service

A modern web application for managing code snippets with AI-powered summaries, built with React Router v7 and Express.js.

https://github.com/user-attachments/assets/01731d26-b9b1-462e-b974-c7f0e064553e

## Backend (Express.js + TypeScript)

- **Hexagonal Architecture**: Built using Ports and Adapters pattern for maximum flexibility and testability
- **REST API**: Clean endpoints for snippet management
- **AI Integration**: Automatic summary generation using Gemini AI - For this, I used a library I created myself [llm-factory](https://www.npmjs.com/package/llm-factory)
- **MongoDB Storage**: Persistent data storage
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test suite with Vitest

### 🏗️ Architecture Benefits

The backend follows **Hexagonal Architecture** (also known as Ports and Adapters), which provides several key advantages:

- **Technology Independence**: Core business logic is isolated from external dependencies (databases, AI services, HTTP frameworks)
- **Enhanced Testability**: Easy to mock external services and test business logic in isolation
- **Flexibility**: Swap implementations without changing core logic (e.g., switch from MongoDB to PostgreSQL, or from Gemini to OpenAI)
- **Maintainability**: Clear separation of concerns makes the codebase easier to understand and modify
- **Future-Proof**: New adapters can be added without touching existing code

### 🛠 API Endpoints

| Method | Endpoint                                | Description                     |
| ------ | --------------------------------------- | ------------------------------- |
| `POST` | `/api/v1/snippets`                      | Create snippet with AI summary  |
| `GET`  | `/api/v1/snippets`                      | List all snippets               |
| `GET`  | `/api/v1/snippets/:id`                  | Get single snippet              |
| `POST` | `/api/v1/snippets/only-create`          | Create snippet without summary  |
| `GET`  | `/api/v1/snippets/:id/generate-summary` | Generate summary with streaming |
| `GET`  | `/api/health`                           | Health check endpoint           |

### 📝 cURL Examples

```bash
# Create a snippet with immediate AI summary (slower but complete in one call)
curl -X POST http://localhost:3000/api/v1/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial Intelligence has revolutionized the way we approach problem-solving in modern technology... Place here more content."
  }'

# List all snippets stored in the system
curl -X GET http://localhost:3000/api/v1/snippets \
  -H "Content-Type: application/json"

# Get a single snippet by its unique ID
curl -X GET http://localhost:3000/api/v1/snippets/YOUR_SNIPPET_ID \
  -H "Content-Type: application/json"
```

<details>
<summary>Other endpoints</summary>

```bash
# Create a snippet without AI summary (stores content only)
curl -X POST http://localhost:3000/api/v1/snippets/only-create \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial Intelligence has revolutionized the way we approach problem-solving in modern technology... Place here more content."
  }'

# Generate AI summary with real-time streaming (Server-Sent Events)
curl -X GET http://localhost:3000/api/v1/snippets/YOUR_SNIPPET_ID/generate-summary \
  -H "Accept: text/event-stream" \
  -N

# Check API health status
curl -X GET http://localhost:3000/api/health \
  -H "Content-Type: application/json"
```

</details>

## Frontend ([The latest version of Remix is now React Router v7](https://remix.run/docs/en/main))

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Server-side Rendering**: Optimized data loading with React Router v7's `loader` functions
- **Card-based Layout**: Modern snippet display with hover effects
- **Toast Notifications**: User-friendly feedback with react-hot-toast
- **Navigation**: Seamless routing between sections
- **Reserved Authentication**: Placeholder routes for future login/register/logout

### 📱 Routes & Pages

**Public Routes**

- `/` - Landing page with feature overview
- `/snippets` - Main snippets management page (list all + create form)
- `/snippets/:id` - Individual snippet detail view

**Authentication Routes (Reserved)**

- `/auth/login` - Login page (placeholder)
- `/auth/register` - Registration page (placeholder)
- `/auth/logout` - Logout page (placeholder)

### 🏗 Project Structure

The project follows a clean architecture pattern with clear separation between frontend and backend concerns, using modern TypeScript practices throughout.

<details>
<summary>See structure</summary>

**Frontend Structure (React Router v7, Remix)**

```
front-end/
├── app/
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── loading.tsx
│   │   │   └── toast.tsx
│   │   ├── snippets/                # Snippet-specific components
│   │   │   ├── snippet-card.tsx
│   │   │   ├── snippet-form.tsx
│   │   │   ├── snippet-list.tsx
│   │   │   └── streaming-summary.tsx
│   │   └── navigation.tsx           # Main navigation
│   ├── hooks/
│   │   └── use-streaming-summary.ts # Custom React hooks
│   ├── lib/
│   │   ├── api.ts                   # Backend API integration
│   │   ├── types.ts                 # TypeScript interfaces
│   │   └── utils.ts                 # Utility functions
│   ├── routes/
│   │   ├── snippets/
│   │   │   ├── index.tsx            # Main snippets page
│   │   │   └── $id.tsx              # Individual snippet
│   │   ├── auth/                    # Authentication routes
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── logout.tsx
│   │   └── home.tsx                 # Landing page
│   ├── app.css                      # Global styles
│   ├── routes.ts                    # Route configuration
│   └── root.tsx                     # App root with navigation
├── server/
│   └── app.ts                       # Server configuration
├── public/
│   └── favicon.ico                  # Static assets
└── server.js                        # Server entry point
```

**Backend Structure (Hexagonal Architecture)**

```
back-end/
├── src/
│   ├── adapters/
│   │   ├── ai/                      # AI service implementations
│   │   │   ├── gemini-gateway.ts
│   │   │   ├── mock-ai-gateway.ts
│   │   │   └── *.unit.test.ts
│   │   ├── database/                # Data access layer
│   │   │   ├── mongodb-snippet-dao.ts
│   │   │   ├── in-memory-snippet-dao.ts
│   │   │   └── *.integration.test.ts
│   │   └── http/                    # HTTP controllers & routes
│   │       ├── snippet-controllers.ts
│   │       └── snippet-routes.ts
│   ├── core/
│   │   ├── services/                # Business logic
│   │   │   ├── snippet-service.ts
│   │   │   └── *.integration.test.ts
│   │   ├── ports/                   # Interface definitions
│   │   │   ├── ai-service.ts
│   │   │   └── snippet-dao.ts
│   │   └── types/                   # Domain types
│   │       └── snippet.ts
│   ├── config/
│   │   └── env.ts                   # Environment configuration
│   ├── app.ts                       # Express app setup
│   └── app.e2e.test.ts              # End-to-end tests
└── dist/                            # Build output
```

</details>

## 🔧 Development Setup

### Prerequisites

- Node.js 20+
- MongoDB
- pnpm package manager

### Complete Setup Instructions

1. **Backend Setup & Environment**

   ```bash
   # Navigate to backend and install dependencies
   cd back-end
   pnpm install

   # Copy environment template and configure
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ai-snippet-service
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Get your Gemini API Key:**

   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Click the **"Create API key"** button
   - Select your default Google Cloud project
   - Copy the generated API key and paste it in your backend `.env` file

3. **Frontend Setup & Environment**

   ```bash
   # Navigate to frontend and install dependencies
   cd ../front-end
   pnpm install

   # Copy environment template and configure
   cp .env.example .env
   ```

   The frontend `.env` file typically contains:

   ```env
   # Frontend runs on port 3030 by default
   # Backend API calls go to http://localhost:3000
   VITE_API_URL=http://localhost:3000
   ```

4. **Start Development Servers**

   **Terminal 1 - Backend:**

   ```bash
   cd back-end
   pnpm run dev
   ```

   **Terminal 2 - Frontend:**

   ```bash
   cd front-end
   pnpm run dev
   ```

   The application will be available at:

   - **Frontend**: http://localhost:3030
   - **Backend API**: http://localhost:3000

## 🧪 Testing

### Backend

```bash
cd back-end
pnpm test
```

### Frontend Type Checking

```bash
cd front-end
pnpm run typecheck
```

## 🐳 Running with Docker

### Development Environment

Run the complete development stack with automatic testing:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This command will:

- Build and start all services (backend, frontend, MongoDB, mongo-express)
- Run backend tests automatically before starting the application
- Enable hot-reload for both frontend and backend
- Set up development database

**Check test results:**

```bash
docker logs -f ai-snippet-backend
```

### Service URLs

| Service           | URL                    | Description              |
| ----------------- | ---------------------- | ------------------------ |
| **Frontend**      | http://localhost:3030  | Main web application     |
| **Backend API**   | http://localhost:3000  | REST API endpoints       |
| **Mongo Express** | http://localhost:8081  | Database admin interface |
| **MongoDB**       | http://localhost:27017 | Database connection      |

### Production Environment

For production deployment:

```bash
docker-compose up
```

This uses the default `docker-compose.yml` configuration with:

- Optimized production builds
- No development tools or hot-reload
- Production-ready environment variables
- Restart policies for high availability

## 🎯 Post-Challenge Reflection

This project was built as a demonstration of modern full-stack development practices using hexagonal architecture. While functional and well-structured, there are several areas that could be enhanced with additional development time.

### 🔧 Backend Architecture Improvements

**Code Organization & Dependency Management**

- **Separate Services and Controllers Methods**: Currently, methods are organized within the same files. For better scalability, I would separate them into dedicated files, especially as the project grows in complexity.
- **Enhanced Testing Strategy**: While the current tests use mocking and dependency injection principles, I would implement a more sophisticated DI container (like `inversify` or `awilix`) to better control dependency injection and make testing more granular.

**Security & Performance**

- **Rate Limiting**: Implement API rate limiting using `express-rate-limit` to protect against brute force attacks and ensure fair usage or some API Gateway as Cloudflare offers to control it.
- **Advanced Authentication System** _(I have previously built exactly this type of authentication system)_:
  - Use `bcrypt` with salt and hash for secure password encryption
  - Implement JWT-based authentication with refresh token mechanism
  - Store refresh tokens in Redis for improved security and session management
  - Add email confirmation and password recovery using `Resend` service
  - **Role-Based Access Control (RBAC)**: Implement a comprehensive permission system where roles have different access levels, with the ability to assign permissions to both roles and individual users
- **Monitoring & Logging**: Integrate `Sentry` for error tracking and implement structured logging to monitor API usage patterns and performance metrics.

**Data Management**

- **Pagination Strategy**: For large datasets, implement cursor-based pagination instead of offset-based pagination to ensure consistent performance and avoid common pagination pitfalls.

### 🎨 Frontend Architecture Improvements

**Code Organization**

- **Feature-Based Architecture**: Reorganize components into feature-based folders rather than type-based organization ([see diagram here](https://camo.githubusercontent.com/5750782aede7c6a18b5b435d89a4c5586b9bc4cbb9e6c956bb58056e478742b8/68747470733a2f2f692e736e6970626f6172642e696f2f567a396444612e6a7067)) for better scalability.
- **Comprehensive Testing**: Add unit tests, integration tests, and end-to-end tests using `Vitest`, `Testing Library`, and `Cypress`.

**User Experience & Analytics**

- **User Behavior Analytics**: Implement `Google Analytics` to track user interactions and application usage patterns.
- **User Experience Monitoring**: Integrate `Hotjar` or similar tools to understand user behavior through heatmaps and session recordings.

### ⚖️ Key Tradeoffs Made

**Development Speed vs. Feature Completeness**

- **Authentication**: Chose to implement placeholder routes rather than a full authentication system to focus on core functionality demonstration
- **Testing Coverage**: Prioritized backend testing with integration and unit tests, but frontend testing was deferred
- **Error Handling**: Implemented basic error handling but could be more comprehensive with user-friendly error messages and retry mechanisms

**Architecture vs. Simplicity**

- **Hexagonal Architecture**: While this adds complexity, it provides excellent testability and maintainability for future enhancements
- **TypeScript**: Full TypeScript implementation adds development overhead but provides runtime safety and better developer experience

**Performance vs. Development Time**

- **Real-time Features**: Implemented Server-Sent Events for AI streaming but could optimize with WebSocket connections for bidirectional communication
- **Caching**: No caching layer implemented - Redis could be added for improved performance

## 📋 Project Requirements Overview

Below is a comprehensive overview of the technical requirements that were successfully implemented:

### Completed Requirements

- **✅ Backend API Development**: Built a separate Express.js backend with TypeScript, implementing complete endpoints for snippet management (create, read single, and list all snippets)

- **✅ Frontend Application**: Developed a separate frontend application using React Router v7 (Remix) with modern UI components and server-side rendering capabilities

- **✅ Comprehensive Testing Suite**: Implemented robust testing using Vitest and Supertest for unit, integration, and end-to-end testing with high coverage

- **✅ AI Integration**: Successfully integrated Google Gemini AI for automatic snippet summarization using a custom library ([llm-factory](https://www.npmjs.com/package/llm-factory))

- **✅ Database Implementation**: Implemented dual database support with MongoDB for production and in-memory storage for testing environments

- **✅ Data Access Layer**: Applied the DAO (Data Access Object) pattern for clean separation of data persistence and retrieval logic, following hexagonal architecture principles

- **✅ Documentation & Deployment**: Provided comprehensive documentation for local development, Docker deployment, testing procedures, and API usage with cURL examples

- **✅ Complete Source Code**: Delivered fully functional application source code with production-ready Dockerfile and docker-compose configurations

- **✅ Real-time Streaming**: Implemented AI summary streaming functionality using Server-Sent Events (SSE) for enhanced user experience

- **✅ CI Pipeline**: Established GitHub Actions workflow that automatically runs linting, executes test suites, and builds Docker images on code changes

### Missing Requirements

- **⚠️ Authentication System**: JWT-based login system was not implemented in this version, but comprehensive implementation strategy was documented, including detailed explanation of previous successful implementations of similar authentication systems

This project demonstrates a complete full-stack application with modern architecture patterns, comprehensive testing, AI integration, and production-ready deployment capabilities.
