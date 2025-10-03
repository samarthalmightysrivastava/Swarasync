import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Shield, Heart, Scale } from 'lucide-react'

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-central-100 via-moon-100 to-sun-100">
      {/* Header */}
      <header className="safe-area-padding p-4 flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 text-central-700 hover:text-central-900 transition-colors min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft size={24} />
          <span className="hidden sm:inline">Home</span>
        </Link>
        
        <h1 className="font-heading text-xl font-semibold text-central-900">
          Safety & Terms
        </h1>
        
        <div className="w-[44px]"></div> {/* Spacer for balance */}
      </header>

      {/* Important Notice */}
      <section className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h2 className="font-heading text-lg font-semibold text-amber-900 mb-2">
                  Important Health Notice
                </h2>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Swarasync is <strong>not medical advice</strong> and is <strong>not a medical device</strong>. 
                  This app is designed for gentle breath awareness and educational purposes only. 
                  Always consult with a qualified healthcare provider for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-central-600" size={28} />
            <h2 className="font-heading text-2xl font-semibold text-central-900">
              Safety Guidelines
            </h2>
          </div>

          <div className="space-y-6">
            {/* Breathing Safety */}
            <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-4">
                Breathing Practices
              </h3>
              <div className="space-y-3 text-sm text-central-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>No Breath Holds:</strong> Our app never instructs breath retention. All techniques involve natural, gentle breathing only.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Stop Immediately:</strong> If you feel dizzy, lightheaded, uncomfortable, or unwell, stop the practice immediately.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Natural Rhythm:</strong> Never force your breathing. Work with your natural pace and comfort level.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Comfortable Environment:</strong> Practice in a safe, comfortable space where you can sit or stand normally.</p>
                </div>
              </div>
            </div>

            {/* Medical Considerations */}
            <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-4">
                When to Consult a Healthcare Provider
              </h3>
              <div className="space-y-3 text-sm text-central-700">
                <p className="mb-4">
                  <strong>Please consult with a qualified healthcare provider before using this app if you have:</strong>
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p>• Heart conditions or cardiac issues</p>
                    <p>• Respiratory conditions (asthma, COPD, etc.)</p>
                    <p>• High or low blood pressure</p>
                    <p>• Anxiety or panic disorders</p>
                  </div>
                  <div className="space-y-2">
                    <p>• Are pregnant or nursing</p>
                    <p>• Have any chronic medical conditions</p>
                    <p>• Take medications that affect breathing</p>
                    <p>• Have a history of fainting or dizziness</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Age Recommendations */}
            <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-4">
                Age Recommendations
              </h3>
              <div className="space-y-3 text-sm text-central-700">
                <p>
                  <strong>Recommended for ages 16+.</strong> For users under 18, we recommend 
                  parental guidance and supervision during practice.
                </p>
                <p>
                  Children and teenagers should use this app only with adult supervision 
                  and should stop immediately if they experience any discomfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Use */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="text-central-600" size={28} />
            <h2 className="font-heading text-2xl font-semibold text-central-900">
              Terms of Use
            </h2>
          </div>

          <div className="bg-white/70 rounded-2xl p-6 border border-central-200 space-y-6">
            {/* License to Use */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                License to Use
              </h3>
              <p className="text-sm text-central-700 leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to use Swarasync 
                for personal, non-commercial purposes. This license may be terminated at any time 
                if you violate these terms.
              </p>
            </div>

            {/* No Warranty */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                No Warranty
              </h3>
              <p className="text-sm text-central-700 leading-relaxed">
                Swarasync is provided "as is" without any warranties of any kind, either express or implied. 
                We do not guarantee that the app will be error-free, uninterrupted, or suitable for your particular needs.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                Limitation of Liability
              </h3>
              <p className="text-sm text-central-700 leading-relaxed">
                In no event shall we be liable for any indirect, incidental, special, consequential, 
                or punitive damages arising out of your use of Swarasync, including but not limited to 
                personal injury, health issues, or any other damages.
              </p>
            </div>

            {/* Acceptable Use */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                Acceptable Use
              </h3>
              <p className="text-sm text-central-700 leading-relaxed mb-3">
                You agree to use Swarasync only for lawful purposes and in accordance with these terms. You agree not to:
              </p>
              <div className="space-y-2 text-sm text-central-700 ml-4">
                <p>• Use the app for any medical or therapeutic purposes</p>
                <p>• Modify, reverse engineer, or create derivative works</p>
                <p>• Use the app in any way that could harm others</p>
                <p>• Share or distribute the app without permission</p>
              </div>
            </div>

            {/* Jurisdiction */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                Governing Law
              </h3>
              <p className="text-sm text-central-700 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of your jurisdiction. 
                Any disputes will be resolved through appropriate legal channels in your local jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Summary */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="text-central-600" size={28} />
            <h2 className="font-heading text-2xl font-semibold text-central-900">
              Privacy Summary
            </h2>
          </div>

          <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
            <div className="space-y-4 text-sm text-central-700">
              <p>
                <strong>Local Storage by Default:</strong> Your preferences, progress, and game data 
                are stored locally on your device. We don't collect or store personal data on our servers 
                unless you explicitly enable optional features.
              </p>
              <p>
                <strong>No Personal Data Collection:</strong> The core app functions entirely offline 
                after the first load. No personal information, health data, or usage patterns are 
                transmitted to external servers.
              </p>
              <p>
                <strong>Optional Features:</strong> If you enable Pro features (when available), 
                we may cache license verification status locally for offline functionality, 
                with a 7-day offline grace period.
              </p>
              <p>
                <strong>No Tracking:</strong> We don't use analytics, advertising trackers, 
                or any third-party tracking services in the core application.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-central-200">
              <Link 
                href="/privacy"
                className="text-central-600 hover:text-central-700 font-medium transition-colors text-sm"
              >
                View Full Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Updates */}
      <section className="px-4 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-heading text-lg font-semibold text-central-900 mb-4">
            Questions or Concerns?
          </h3>
          <p className="text-sm text-central-700 mb-6">
            If you have any questions about these terms, safety guidelines, or the app in general, 
            please review our documentation or contact us through appropriate channels.
          </p>
          
          <div className="bg-central-50 rounded-xl p-4 border border-central-200">
            <p className="text-xs text-central-600 leading-relaxed">
              <strong>Last Updated:</strong> September 2024<br />
              These terms may be updated periodically. Continued use of the app constitutes 
              acceptance of any changes.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <footer className="safe-area-padding p-4">
        <div className="flex justify-center gap-6">
          <Link 
            href="/privacy"
            className="text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px] flex items-center"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/learn"
            className="text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px] flex items-center"
          >
            Learn More
          </Link>
        </div>
      </footer>
    </main>
  )
}