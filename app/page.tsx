import { Header } from "@/components/header"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentList } from "@/components/document-list"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2 text-balance">Medical Documents</h1>
          <p className="text-muted-foreground text-balance">
            Securely upload and manage your prescriptions, test results, and referral notes.
          </p>
        </div>

        <div className="grid gap-8">
          <DocumentUpload />
          <DocumentList />
        </div>
      </main>
    </div>
  )
}
