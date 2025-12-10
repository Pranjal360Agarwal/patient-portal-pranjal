# Patient Portal - Medical Document Management

A full-stack web application for patients to upload, view, download, and delete medical PDF documents.

## Project Overview

This patient portal allows users to manage their medical documents (prescriptions, test results, referral notes) through a clean, secure web interface. The application features:

- **PDF Upload** with drag-and-drop support
- **Document List** showing all uploaded files with metadata
- **Download** capability for any stored document
- **Delete** functionality to remove documents
- **Real-time feedback** with success/error messages

## Tech Stack

| Layer         | Technology                                     |
| ------------- | ---------------------------------------------- |
| Frontend      | Next.js 14, React, TypeScript                  |
| Styling       | Tailwind CSS, shadcn/ui                        |
| Backend       | Next.js API Routes                             |
| Database      | In-memory storage (demo) / SQLite (production) |
| Data Fetching | SWR                                            |

## Project Structure

\`\`\`
├── app/
│ ├── api/
│ │ └── documents/
│ │ ├── route.ts # GET /documents - List all
│ │ ├── upload/
│ │ │ └── route.ts # POST /documents/upload
│ │ └── [id]/
│ │ └── route.ts # GET/DELETE /documents/:id
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── components/
│ ├── document-list.tsx # Document list with actions
│ ├── document-upload.tsx # Upload form component
│ ├── header.tsx # App header
│ └── ui/ # shadcn/ui components
├── lib/
│ ├── db.ts # Database layer
│ └── utils.ts
├── design.md # Design document
└── README.md
\`\`\`

---

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Git installed

### Step-by-Step Installation

\`\`\`bash

# 1. Clone the repository

git clone https://github.com/your-username/patient-portal.git

# 2. Navigate to project directory

cd patient-portal

# 3. Install dependencies

npm install

# 4. Start the development server

npm run dev

# 5. Open http://localhost:3000 in your browser

\`\`\`

---

## API Documentation

### Base URL

- Local: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

### Endpoints

#### 1. Upload Document

\`\`\`bash
POST /api/documents/upload
Content-Type: multipart/form-data

curl -X POST http://localhost:3000/api/documents/upload \
 -F "file=@/path/to/document.pdf"
\`\`\`

**Response (201):**
\`\`\`json
{
"message": "File uploaded successfully",
"document": {
"id": "abc123",
"filename": "document.pdf",
"filepath": "uploads/1702345678901-document.pdf",
"filesize": 245678,
"created_at": "2024-12-11T10:30:00.000Z"
}
}
\`\`\`

#### 2. List Documents

\`\`\`bash
GET /api/documents

curl http://localhost:3000/api/documents
\`\`\`

**Response (200):**
\`\`\`json
{
"documents": [
{
"id": "abc123",
"filename": "prescription.pdf",
"filesize": 245678,
"created_at": "2024-12-11T10:30:00.000Z"
}
]
}
\`\`\`

#### 3. Download Document

\`\`\`bash
GET /api/documents/:id

curl http://localhost:3000/api/documents/abc123 --output document.pdf
\`\`\`

#### 4. Delete Document

\`\`\`bash
DELETE /api/documents/:id

curl -X DELETE http://localhost:3000/api/documents/abc123
\`\`\`

**Response (200):**
\`\`\`json
{
"message": "Document deleted successfully"
}
\`\`\`

---

## Testing with Postman

1. Import the collection or create requests manually
2. **Upload**: POST to `/api/documents/upload` with form-data, key: `file`
3. **List**: GET to `/api/documents`
4. **Download**: GET to `/api/documents/{id}`, save response as file
5. **Delete**: DELETE to `/api/documents/{id}`

---

## Environment Variables (Optional)

For production with real storage, add these to Vercel:

| Variable                | Description                         |
| ----------------------- | ----------------------------------- |
| `DATABASE_URL`          | PostgreSQL/SQLite connection string |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token           |

---

## Limitations

- Uses in-memory storage (data resets on restart)
- Single user (no authentication)
- 10MB max file size
- PDF files only

# Made with ❤ by [Pranjal Agarwal](https://github.com/Pranjal360Agarwal).
