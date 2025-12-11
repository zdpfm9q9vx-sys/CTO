import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground">
          Organize your learning materials by subject
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Subjects</CardTitle>
          <CardDescription>Create and manage your study subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subjects yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get started by creating your first subject to organize your learning materials
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
