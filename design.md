# Patient Portal - Design Document

## Part 1: Tech Stack Choices

### Q1. What frontend framework did you use and why?

**Framework: Next.js 14+ (React)**

I chose Next.js with React for the following reasons:

1. **Full-Stack Capability**: Next.js provides both frontend and backend (API Routes) in a single framework, reducing complexity and deployment overhead.

2. **Server-Side Rendering (SSR)**: Better SEO and initial page load performance, which is important for a healthcare application that users may access on various devices.

3. **Built-in API Routes**: Next.js API routes allow me to build the REST API without setting up a separate backend server, simplifying the architecture for this assignment.

4. **React Ecosystem**: Access to a rich ecosystem of libraries (SWR for data fetching, lucide-react for icons) and excellent TypeScript support for type safety.

5. **Industry Standard**: React/Next.js is widely adopted in the healthcare industry due to its reliability, performance, and strong community support.

---

### Q2. What backend framework did you choose and why?

**Framework: Next.js API Routes**

I used Next.js API Routes as the backend for these reasons:

1. **Unified Codebase**: Frontend and backend in the same project simplifies development, deployment, and maintenance.

2. **Serverless-Ready**: API routes are designed to work as serverless functions, making them easy to scale and deploy on platforms like Vercel.

3. **TypeScript Support**: End-to-end type safety between frontend and backend reduces runtime errors.

4. **Built-in Request Handling**: Next.js provides easy access to request/response objects, form data parsing, and file handling.

**Alternative Consideration**: For a production system with more complex requirements, I would consider Express.js, Fastify, or NestJS for more granular control over middleware, authentication, and database connections.

---

### Q3. What database did you choose and why?

**Database: In-Memory Storage (Demo) / SQLite or PostgreSQL (Production)**

For this demo implementation, I used an in-memory Map-based storage to simulate database operations. This approach:

1. **Requires No Setup**: Works immediately without database installation or configuration.
2. **Demonstrates the Pattern**: Shows the exact same CRUD operations that would be used with a real database.

**For Production**, I would recommend:

- **SQLite**: For single-server deployments - lightweight, file-based, zero configuration, perfect for small to medium applications.
- **PostgreSQL**: For scalable production deployments - robust, supports concurrent connections, excellent for multi-user systems.

**Schema Design**:
\`\`\`sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  filesize INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

### Q4. If you were to support 1,000 users, what changes would you consider?

To scale from a single-user demo to 1,000 users, I would implement:

#### 1. User Authentication & Authorization
- Add user registration/login (JWT or session-based)
- Implement user_id foreign key in documents table
- Add Row Level Security to ensure users only access their own documents

#### 2. Database Scaling
- Migrate to PostgreSQL with connection pooling
- Add indexes on frequently queried columns (user_id, created_at)
- Implement database replicas for read scaling

#### 3. File Storage
- Move from local storage to cloud object storage (AWS S3, Google Cloud Storage, or Vercel Blob)
- Implement signed URLs for secure file access
- Add CDN for faster file downloads

#### 4. Performance Optimizations
- Implement caching layer (Redis) for frequently accessed metadata
- Add pagination for document lists
- Implement file compression and thumbnail generation

#### 5. Infrastructure
- Containerize application (Docker)
- Deploy on Kubernetes or serverless platform
- Add load balancing and auto-scaling
- Implement rate limiting to prevent abuse

#### 6. Security Enhancements
- Add virus scanning for uploaded files
- Implement file encryption at rest
- Add audit logging for compliance (HIPAA)
- Implement CORS and CSP headers

---

## Part 2: Architecture Overview

### System Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Next.js Frontend                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │   Upload    │  │  Document   │  │     Header      │  │   │
│  │  │   Form      │  │    List     │  │   Component     │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────────┘  │   │
│  │         │                │                               │   │
│  │         └────────┬───────┘                               │   │
│  │                  │                                        │   │
│  │         ┌────────▼────────┐                               │   │
│  │         │    SWR Cache    │                               │   │
│  │         └────────┬────────┘                               │   │
│  └──────────────────┼───────────────────────────────────────┘   │
│                     │ HTTP Requests                              │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Routes                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │    │
│  │  │ POST        │  │ GET         │  │ GET/DELETE      │   │    │
│  │  │ /upload     │  │ /documents  │  │ /documents/:id  │   │    │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │    │
│  │         └─────────────────┼─────────────────┘            │    │
│  │                           │                               │    │
│  │                  ┌────────▼────────┐                      │    │
│  │                  │  Database Layer │                      │    │
│  │                  │    (lib/db.ts)  │                      │    │
│  │                  └────────┬────────┘                      │    │
│  └───────────────────────────┼──────────────────────────────┘    │
│                              │                                    │
│           ┌──────────────────┴──────────────────┐                │
│           ▼                                      ▼                │
│  ┌─────────────────┐                   ┌─────────────────┐       │
│  │    Documents    │                   │   File Storage  │       │
│  │   (Metadata)    │                   │  (Base64 Data)  │       │
│  │                 │                   │                 │       │
│  │ • id            │                   │ • id → content  │       │
│  │ • filename      │                   │                 │       │
│  │ • filepath      │                   │                 │       │
│  │ • filesize      │                   │                 │       │
│  │ • created_at    │                   │                 │       │
│  └─────────────────┘                   └─────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### Data Flow Summary

1. **Frontend** renders React components and manages UI state
2. **SWR** handles data fetching, caching, and revalidation
3. **API Routes** process HTTP requests and validate input
4. **Database Layer** abstracts storage operations
5. **Storage** holds both metadata and file content

---

## Part 3: API Specification

### Endpoint 1: Upload a PDF

| Property | Value |
|----------|-------|
| **URL** | `/api/documents/upload` |
| **Method** | `POST` |
| **Content-Type** | `multipart/form-data` |
| **Description** | Uploads a PDF file and stores its metadata |

**Request:**
\`\`\`bash
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@prescription.pdf"
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "message": "File uploaded successfully",
  "document": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "prescription.pdf",
    "filepath": "uploads/1702345678901-prescription.pdf",
    "filesize": 245678,
    "created_at": "2024-12-11T10:30:00.000Z"
  }
}
\`\`\`

**Error Response (400):**
\`\`\`json
{
  "error": "Only PDF files are allowed"
}
\`\`\`

---

### Endpoint 2: List All Documents

| Property | Value |
|----------|-------|
| **URL** | `/api/documents` |
| **Method** | `GET` |
| **Description** | Retrieves all uploaded documents sorted by date (newest first) |

**Request:**
\`\`\`bash
curl http://localhost:3000/api/documents
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "documents": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "prescription.pdf",
      "filepath": "uploads/1702345678901-prescription.pdf",
      "filesize": 245678,
      "created_at": "2024-12-11T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "filename": "blood_test_results.pdf",
      "filepath": "uploads/1702345678902-blood_test_results.pdf",
      "filesize": 128456,
      "created_at": "2024-12-10T14:20:00.000Z"
    }
  ]
}
\`\`\`

---

### Endpoint 3: Download a File

| Property | Value |
|----------|-------|
| **URL** | `/api/documents/:id` |
| **Method** | `GET` |
| **Description** | Downloads a specific document by ID |

**Request:**
\`\`\`bash
curl http://localhost:3000/api/documents/550e8400-e29b-41d4-a716-446655440000 \
  --output downloaded_file.pdf
\`\`\`

**Success Response (200):**
- Returns the PDF file as binary data
- Headers include:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="prescription.pdf"`

**Error Response (404):**
\`\`\`json
{
  "error": "Document not found"
}
\`\`\`

---

### Endpoint 4: Delete a File

| Property | Value |
|----------|-------|
| **URL** | `/api/documents/:id` |
| **Method** | `DELETE` |
| **Description** | Deletes a specific document and its file |

**Request:**
\`\`\`bash
curl -X DELETE http://localhost:3000/api/documents/550e8400-e29b-41d4-a716-446655440000
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "message": "Document deleted successfully"
}
\`\`\`

**Error Response (404):**
\`\`\`json
{
  "error": "Document not found"
}
\`\`\`

---

## Part 4: Data Flow Description

### Q5. File Upload Process

**Step-by-step flow when a file is uploaded:**

1. **User Selection**: User selects a PDF file via the drag-and-drop zone or file picker.

2. **Client-Side Validation**: 
   - JavaScript validates file type (must be `application/pdf`)
   - Checks file size (must be ≤ 10MB)
   - Displays error message if validation fails

3. **FormData Creation**: 
   - File is wrapped in a FormData object
   - UI shows "Uploading..." state

4. **HTTP Request**: 
   - Frontend sends POST request to `/api/documents/upload`
   - File is sent as multipart/form-data

5. **Server-Side Validation**:
   - API route validates file existence
   - Validates MIME type again (security)
   - Validates file size

6. **File Processing**:
   - File content is read as ArrayBuffer
   - Converted to Base64 for storage
   - Unique filename generated with timestamp

7. **Database Storage**:
   - Metadata (filename, size, path) stored in documents table
   - File content stored separately (in memory or filesystem)
   - UUID generated for document ID

8. **Response**:
   - Success response sent with document metadata
   - Frontend receives response and shows success message

9. **UI Update**:
   - SWR cache is invalidated (`mutate`)
   - Document list automatically refreshes
   - New document appears at top of list

### File Download Process

**Step-by-step flow when a file is downloaded:**

1. **User Action**: User clicks "Download" button for a document.

2. **HTTP Request**: Frontend sends GET request to `/api/documents/:id`.

3. **Database Lookup**: Server retrieves document metadata by ID.

4. **File Retrieval**: Server fetches file content from storage.

5. **Response Preparation**:
   - Sets appropriate headers (Content-Type, Content-Disposition)
   - Streams file content in response body

6. **Browser Handling**:
   - Browser receives binary data
   - Creates Blob URL from response
   - Triggers download with original filename

7. **Cleanup**: Blob URL is revoked after download starts.

---

## Part 5: Assumptions

### Q6. What assumptions did you make while building this?

#### 1. Single User System
- No authentication required (as per assignment instructions)
- All documents belong to a single implicit user
- No need for user management or access control

#### 2. File Constraints
- **Maximum file size**: 10MB per document
- **File type**: Only PDF files accepted
- **Filename**: Original filename preserved, with timestamp prefix for uniqueness
- **No file versioning**: Same file uploaded twice creates separate entries

#### 3. Storage
- **Demo mode**: Files stored in memory (lost on server restart)
- **Production assumption**: Would use persistent storage (filesystem or cloud)
- **No file compression**: Files stored as-is

#### 4. Concurrent Access
- **Single server**: No distributed caching concerns
- **Eventual consistency**: SWR handles client-side caching
- **No transaction locks**: Simple CRUD operations assumed

#### 5. Browser Compatibility
- Modern browser required (ES6+ support)
- File API and Drag-and-Drop API available
- JavaScript enabled

#### 6. Security
- **No encryption**: Files stored without encryption (demo only)
- **No virus scanning**: Trust that users upload safe files
- **No HIPAA compliance**: Production system would need additional security measures

#### 7. Performance
- **No pagination**: Assumes reasonable number of documents (<1000)
- **No lazy loading**: All documents fetched at once
- **No image thumbnails**: PDFs displayed as icons only

#### 8. Error Handling
- **Graceful degradation**: UI shows error messages on failure
- **No automatic retry**: User must manually retry failed operations
- **No offline support**: Requires active internet connection

---

## Summary

This implementation provides a clean, functional patient portal for managing medical documents. While simplified for the assignment, the architecture is designed to be easily extended for production use with proper database integration, authentication, and cloud storage.
