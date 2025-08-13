"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Circle, Square, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="font-mono text-5xl text-gray-600 mb-12 tracking-tight">DeeepThink</h1>
          <div className="space-y-8 mb-16">
            <p className="text-lg text-gray-600 leading-relaxed">Let's organize your thoughts.</p>
            <p className="text-lg text-gray-600 leading-relaxed">Write down what's currently in your mind.</p>
            <p className="text-lg text-gray-600 leading-relaxed">Let's organize them into three categories.</p>
            <p className="text-lg text-gray-600 leading-relaxed">How is your current situation?</p>
          </div>

          <Link href="/auth">
            <Button className="bg-gray-600 hover:bg-gray-600 text-white px-8 py-3 text-lg font-medium">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-8 mb-20">
          <Card className="border border-gray-200 shadow-none hover:shadow-none">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <Circle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Ideas</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Record sudden inspirations and thoughts that haven't taken shape yet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-none hover:shadow-none">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <Square className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Tasks</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Clarify and manage what needs to be done and what you want to achieve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-none hover:shadow-none">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Notes</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Save important information and learnings in a reviewable format.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-8">
          <p className="text-lg text-gray-600 leading-relaxed">Delete them when they're no longer needed.</p>
          <p className="text-lg text-gray-600 leading-relaxed">Simply, a place to reflect on your current self.</p>
          <div className="pt-8">
            <p className="text-lg text-gray-600 mb-8">Would you like to organize your thoughts together?</p>
            <Link href="/auth">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white bg-transparent text-lg px-8 py-3"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-lg text-gray-600 mb-2">
            Created by{" "}
            <a href="https://kokororesearch.org" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Kokoro Research
            </a>
          </p>
          <p className="text-lg text-gray-600 mb-4">Contact: ryuzo@kokororesearch.org</p>
          <div className="space-x-6">
            <Link href="/terms" className="text-lg text-gray-600 hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-lg text-gray-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
