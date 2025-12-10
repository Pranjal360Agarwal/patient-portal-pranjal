// In-memory database for demo purposes
// In production, this would be SQLite, PostgreSQL, or similar

export interface Document {
  id: string
  filename: string
  filepath: string
  filesize: number
  created_at: string
}

// Simulated database storage
const documents: Map<string, Document> = new Map()

// Simulated file storage (base64 encoded content)
const fileStorage: Map<string, string> = new Map()

export const db = {
  documents: {
    create: (data: Omit<Document, "id" | "created_at">, fileContent: string): Document => {
      const id = crypto.randomUUID()
      const doc: Document = {
        id,
        ...data,
        created_at: new Date().toISOString(),
      }
      documents.set(id, doc)
      fileStorage.set(id, fileContent)
      return doc
    },

    findAll: (): Document[] => {
      return Array.from(documents.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    },

    findById: (id: string): Document | undefined => {
      return documents.get(id)
    },

    delete: (id: string): boolean => {
      fileStorage.delete(id)
      return documents.delete(id)
    },

    getFileContent: (id: string): string | undefined => {
      return fileStorage.get(id)
    },
  },
}
