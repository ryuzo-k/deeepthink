"use client"
import { useState, useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { signIn, signUp } from "@/lib/actions"

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg py-3">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isLogin ? (
        "Sign In"
      ) : (
        "Create Account"
      )}
    </Button>
  )
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  const [loginState, loginAction] = useActionState(signIn, null)
  const [signUpState, signUpAction] = useActionState(signUp, null)

  const currentState = isLogin ? loginState : signUpState
  const currentAction = isLogin ? loginAction : signUpAction

  useEffect(() => {
    if (currentState?.success) {
      if (isLogin) {
        router.push("/app")
      }
    }
  }, [currentState, isLogin, router])

  const handleFormAction = (formData: FormData) => {
    if (!isLogin && !acceptTerms) {
      return
    }
    currentAction(formData)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-start items-center mb-8">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-gray-600 mb-2">DeeepThink</CardTitle>
            <p className="text-lg text-gray-600">{isLogin ? "Login" : "Sign Up"}</p>
          </CardHeader>
          <CardContent>
            {currentState?.error && (
              <Alert className="mb-4 border-gray-300 bg-gray-50">
                <AlertDescription className="text-gray-600">{currentState.error}</AlertDescription>
              </Alert>
            )}

            {currentState?.success && typeof currentState.success === "string" && (
              <Alert className="mb-4 border-gray-300 bg-gray-50">
                <AlertDescription className="text-gray-600">{currentState.success}</AlertDescription>
              </Alert>
            )}

            {!isLogin && !acceptTerms && (
              <Alert className="mb-4 border-gray-300 bg-gray-50">
                <AlertDescription className="text-gray-600">You must agree to the Terms of Service</AlertDescription>
              </Alert>
            )}

            <form action={handleFormAction} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-lg text-gray-600">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="mt-1 border-gray-300 focus:border-gray-400 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-lg text-gray-600">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                  className="mt-1 border-gray-300 focus:border-gray-400 text-lg"
                />
              </div>

              {!isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="terms" className="text-lg text-gray-600 cursor-pointer">
                    <Link href="/terms" target="_blank" className="hover:underline">
                      I agree to the Terms of Service
                    </Link>
                  </Label>
                </div>
              )}

              <SubmitButton isLogin={isLogin} />
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 hover:text-gray-700 text-lg underline"
              >
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
