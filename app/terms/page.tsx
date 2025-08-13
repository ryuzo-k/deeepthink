import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-6 border-b border-gray-200">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-mono text-5xl text-gray-600 mb-12 text-center">Terms of Service</h1>

        <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using DeeepThink, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily use DeeepThink for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">3. User Account</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current
              at all times. You are responsible for safeguarding the password and for all activities that occur under
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">4. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
              Service, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">5. User Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text,
              graphics, or other material. You are responsible for the content that you post to the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">6. Prohibited Uses</h2>
            <p>
              You may not use our Service for any unlawful purpose or to solicit others to perform unlawful acts, to
              violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">7. Service Availability</h2>
            <p>
              We reserve the right to withdraw or amend our Service, and any service or material we provide via Service,
              in our sole discretion without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">8. Limitation of Liability</h2>
            <p>
              In no case shall DeeepThink, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, punitive, consequential, or similar damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-600 mb-4">10. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at ryuzo@kokororesearch.org</p>
          </section>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-center">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-center mt-2">© 2025 Kokoro Research. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
