"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Lightbulb, CheckSquare, Brain, Trash2, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"

interface ThoughtItem {
  id: string
  type: "idea" | "task" | "note"
  title: string
  content: string
  completed?: boolean
}

export default function DeeepThink() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([])
  const [newThought, setNewThought] = useState({ title: "", content: "", type: "idea" as const })
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadThoughts()
      const channel = supabase
        .channel("thoughts_changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "thoughts",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newThought = {
              id: payload.new.id,
              type: payload.new.category as "idea" | "task" | "note",
              title: payload.new.title,
              content: payload.new.content || "",
              completed: payload.new.completed,
            }
            setThoughts((prev) => [newThought, ...prev])
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "thoughts",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setThoughts((prev) =>
              prev.map((thought) =>
                thought.id === payload.new.id
                  ? {
                      ...thought,
                      title: payload.new.title,
                      content: payload.new.content || "",
                      completed: payload.new.completed,
                    }
                  : thought,
              ),
            )
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "thoughts",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setThoughts((prev) => prev.filter((thought) => thought.id !== payload.old.id))
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const loadThoughts = async () => {
    try {
      const { data, error } = await supabase
        .from("thoughts")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading thoughts:", error)
        return
      }

      const formattedThoughts = data.map((thought) => ({
        id: thought.id,
        type: thought.category as "idea" | "task" | "note",
        title: thought.title,
        content: thought.content || "",
        completed: thought.completed,
      }))

      setThoughts(formattedThoughts)
    } catch (error) {
      console.error("Error loading thoughts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addThought = async () => {
    if (newThought.title.trim() && user) {
      try {
        const { data, error } = await supabase
          .from("thoughts")
          .insert({
            user_id: user.id,
            title: newThought.title,
            content: newThought.content,
            category: newThought.type,
            completed: newThought.type === "task" ? false : null,
          })
          .select()
          .single()

        if (error) {
          console.error("Error adding thought:", error)
          return
        }

        const newThoughtItem: ThoughtItem = {
          id: data.id,
          type: newThought.type,
          title: newThought.title,
          content: newThought.content,
          completed: newThought.type === "task" ? false : undefined,
        }

        setThoughts((prev) => [newThoughtItem, ...prev])
        setNewThought({ title: "", content: "", type: "idea" })
        setIsAdding(false)
      } catch (error) {
        console.error("Error adding thought:", error)
      }
    }
  }

  const deleteThought = async (id: string) => {
    setThoughts((prev) => prev.filter((t) => t.id !== id))

    try {
      const { error } = await supabase.from("thoughts").delete().eq("id", id)

      if (error) {
        loadThoughts()
        console.error("Error deleting thought:", error)
        return
      }
    } catch (error) {
      loadThoughts()
      console.error("Error deleting thought:", error)
    }
  }

  const toggleTask = async (id: string) => {
    const thought = thoughts.find((t) => t.id === id)
    if (!thought) return

    const newCompleted = !thought.completed

    setThoughts((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)))

    try {
      const { error } = await supabase.from("thoughts").update({ completed: newCompleted }).eq("id", id)

      if (error) {
        setThoughts((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t)))
        console.error("Error updating thought:", error)
        return
      }
    } catch (error) {
      setThoughts((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t)))
      console.error("Error updating thought:", error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "idea":
        return <Lightbulb className="w-5 h-5" />
      case "task":
        return <CheckSquare className="w-5 h-5" />
      case "note":
        return <Brain className="w-5 h-5" />
      default:
        return <Lightbulb className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "idea":
        return "Ideas"
      case "task":
        return "Tasks"
      case "note":
        return "Thoughts"
      default:
        return "Ideas"
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-end items-center mb-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-lg text-gray-600">
              <User className="w-5 h-5" />
              {user.email}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2 text-lg text-gray-600 border-gray-600 bg-transparent hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>

        <header className="text-center mb-16">
          <h1 className="text-5xl text-gray-600 mb-6">DeeepThink</h1>
          <div className="space-y-2">
            <p className="text-lg text-gray-600">Organize your thoughts into three simple categories.</p>
            <p className="text-lg text-gray-600">Write them down. Clear them out when done.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white border border-gray-600">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-lg text-gray-600">{thoughts.filter((t) => t.type === "idea").length}</span>
              </div>
              <p className="text-lg text-gray-600">Ideas</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-600">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckSquare className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-lg text-gray-600">
                  {thoughts.filter((t) => t.type === "task" && !t.completed).length}
                </span>
              </div>
              <p className="text-lg text-gray-600">Pending Tasks</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-600">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-lg text-gray-600">{thoughts.filter((t) => t.type === "note").length}</span>
              </div>
              <p className="text-lg text-gray-600">Thoughts</p>
            </CardContent>
          </Card>
        </div>

        {!isAdding && (
          <div className="text-center mb-12">
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Thought
            </Button>
          </div>
        )}

        {isAdding && (
          <Card className="mb-12 bg-white border border-gray-600">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg text-gray-600">Add New Thought</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                {["idea", "task", "note"].map((type) => (
                  <Button
                    key={type}
                    variant={newThought.type === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewThought({ ...newThought, type: type as any })}
                    className={
                      newThought.type === type
                        ? "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
                        : "text-gray-600 border-gray-600 px-4 py-2"
                    }
                  >
                    {getIcon(type)}
                    <span className="ml-2 text-lg">{getTypeLabel(type)}</span>
                  </Button>
                ))}
              </div>

              <Input
                placeholder="Enter title..."
                value={newThought.title}
                onChange={(e) => setNewThought({ ...newThought, title: e.target.value })}
                className="border-gray-600 text-lg text-gray-600 py-3"
              />

              <Textarea
                placeholder="Enter details..."
                value={newThought.content}
                onChange={(e) => setNewThought({ ...newThought, content: e.target.value })}
                className="border-gray-600 min-h-[120px] text-lg text-gray-600 p-4"
              />

              <div className="flex gap-3">
                <Button onClick={addThought} className="bg-gray-600 hover:bg-gray-700 text-lg px-6 py-3">
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="text-gray-600 border-gray-600 text-lg px-6 py-3"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thoughts.map((thought) => (
            <Card
              key={thought.id}
              className={`bg-white border border-gray-600 ${thought.completed ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getIcon(thought.type)}
                    <Badge variant="secondary" className="text-lg text-gray-600 px-3 py-1">
                      {getTypeLabel(thought.type)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteThought(thought.id)}
                    className="text-gray-600 hover:text-gray-800 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <CardTitle
                  className={`text-lg text-gray-600 leading-relaxed ${thought.completed ? "line-through" : ""}`}
                >
                  {thought.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">{thought.content}</p>
                {thought.type === "task" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTask(thought.id)}
                    className="w-full text-lg text-gray-600 border-gray-600 py-3"
                  >
                    {thought.completed ? "Completed" : "Mark Complete"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {thoughts.length === 0 && !isAdding && (
          <div className="text-center py-20">
            <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-lg text-gray-600 mb-3">No thoughts yet</h3>
            <p className="text-lg text-gray-600">Add your first idea, task, or thought to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
