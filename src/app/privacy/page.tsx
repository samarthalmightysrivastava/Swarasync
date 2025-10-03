import Link from 'next/link'
import { ArrowLeft, Lock, Database, Shield, Eye } from 'lucide-react'

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        
        <div className="w-[44px]"></div> {/* Spacer for balance */}
      </header>

      {/* Privacy Overview */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-central-50 rounded-2xl p-6 border border-central-200 mb-8">
            <div className="flex items-start gap-4">
              <Lock className="text-central-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h2 className="font-heading text-lg font-semibold text-central-900 mb-2">
                  Privacy-First Design
                </h2>
                <p className="text-sm text-central-700 leading-relaxed">
                  Swarasync is designed with your privacy as a core principle. Most functionality 
                  works entirely offline, with your data stored locally on your device. 
                  We believe your breath practice should be personal and private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-central-600" size={28} />
            <h2 className="font-heading text-2xl font-semibold text-central-900">
              What Data We Collect
            </h2>
          </div>

          <div className="space-y-6">
            {/* Local Data */}
            <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-4">
                Data Stored Locally (On Your Device)
              </h3>
              <div className="space-y-3 text-sm text-central-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-2"></div>
                  <p><strong>User Preferences:</strong> Haptic feedback settings, sound preferences, accessibility options</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Game Progress:</strong> Sessions completed, harmony scores, achievement unlocks, streak data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Calibration Data:</strong> Your personal breath timing (inhale/exhale duration)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Created Art:</strong> Mandala patterns generated from your sessions (stored as local image files)</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-800">
                  <strong>✓ Privacy Safe:</strong> This data never leaves your device unless you explicitly export it.
                </p>
              </div>
            </div>

            {/* No Data Collection */}
            <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-4">
                Data We Do NOT Collect
              </h3>
              <div className="space-y-3 text-sm text-central-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Personal Information:</strong> No names, emails, phone numbers, or addresses</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Health Data:</strong> No medical information, health records, or biometric data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Location Data:</strong> No GPS, location tracking, or geographic information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Usage Analytics:</strong> No tracking of how you use the app, session duration, or behavior patterns</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                  <p><strong>Device Information:</strong> No device fingerprinting, unique identifiers, or technical specifications</p>
                </div>
              </div>
            </div>

            {/* Optional Features */}
            <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-4">
                Optional Feature Data (When Enabled)
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-central-800 mb-2">LLM Explanations (Optional)</h4>
                  <p className="text-sm text-central-700 mb-2">
                    If you enable AI explanations in Swara Advisor, anonymous, minimal context 
                    is sent to OpenAI to generate guidance text. No personal data is included.
                  </p>
                  <div className="text-xs text-central-600 bg-central-50 p-2 rounded">
                    Default: <strong>Disabled</strong> • You control this in app settings
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-central-800 mb-2">Pro License Verification (Optional)</h4>
                  <p className="text-sm text-central-700 mb-2">
                    If you purchase Pro features, minimal license verification data is cached 
                    locally for offline functionality, with 7-day offline grace period.
                  </p>
                  <div className="text-xs text-central-600 bg-central-50 p-2 rounded">
                    Default: <strong>Not Available</strong> • Only if you purchase Pro features
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Storage & Security */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-central-600" size={28} />
            <h2 className="font-heading text-2xl font-semibold text-central-900">
              Data Storage & Security
            </h2>
          </div>

          <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                  Local Storage
                </h3>
                <p className="text-sm text-central-700 leading-relaxed mb-3">
                  All your data is stored using your browser's local storage mechanisms 
                  (localStorage and IndexedDB). This data:
                </p>
                <div className="space-y-2 text-sm text-central-700 ml-4">
                  <p>• Remains on your device and is not transmitted to our servers</p>
                  <p>• Is isolated to the Swarasync app domain</p>
                  <p>• Can be cleared by you at any time through browser settings</p>
                  <p>• Is automatically cleared if you uninstall the app</p>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                  Data Portability
                </h3>
                <p className="text-sm text-central-700 leading-relaxed">
                  You can export your mandala art and achievement data at any time. 
                  Your settings and progress can be backed up through your browser's 
                  standard data export features.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                  Data Deletion
                </h3>
                <p className="text-sm text-central-700 leading-relaxed">
                  To delete all your data, simply clear your browser's storage for the 
                  Swarasync domain or use the "Reset All Data" option in app settings. 
                  This action is immediate and irreversible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third-Party Services */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="text-central-600" size={28} />
            <h2 className="font-heading text-2xl font-semibold text-central-900">
              Third-Party Services
            </h2>
          </div>

          <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                  Core App: No Third Parties
                </h3>
                <p className="text-sm text-central-700 leading-relaxed">
                  The core Swarasync experience works entirely offline without any 
                  third-party analytics, advertising networks, or tracking services.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                  Optional Integrations
                </h3>
                <div className="space-y-3">
                  <div className="bg-central-50 p-4 rounded-lg border border-central-200">
                    <h4 className="font-medium text-central-800 mb-2">OpenAI (Optional)</h4>
                    <p className="text-sm text-central-700 leading-relaxed">
                      If you enable LLM explanations, anonymous guidance requests are sent to OpenAI. 
                      No personal data or usage patterns are shared. You can disable this anytime.
                    </p>
                  </div>
                  
                  <div className="bg-central-50 p-4 rounded-lg border border-central-200">
                    <h4 className="font-medium text-central-800 mb-2">Gumroad (Optional)</h4>
                    <p className="text-sm text-central-700 leading-relaxed">
                      If you purchase Pro features, Gumroad handles payment processing. 
                      Their privacy policy applies to payment data. We only receive 
                      anonymous license verification tokens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-semibold text-central-900 mb-6">
            Your Rights & Control
          </h2>

          <div className="bg-white/70 rounded-2xl p-6 border border-central-200">
            <div className="space-y-4 text-sm text-central-700">
              <div>
                <h3 className="font-medium text-central-800 mb-2">Complete Control</h3>
                <p>You have complete control over your data since it's stored locally on your device.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-central-800 mb-2">Access & Export</h3>
                <p>Access your data anytime through the app. Export mandala art and achievements when desired.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-central-800 mb-2">Deletion</h3>
                <p>Delete all data instantly through app settings or browser storage management.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-central-800 mb-2">Opt-Out</h3>
                <p>All optional features (LLM, Pro) are disabled by default. You choose what to enable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Updates */}
      <section className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl font-semibold text-central-900 mb-6 text-center">
            Contact & Updates
          </h2>

          <div className="space-y-6">
            <div className="bg-white/70 rounded-2xl p-6 border border-central-200 text-center">
              <h3 className="font-heading text-lg font-semibold text-central-900 mb-3">
                Questions About Privacy?
              </h3>
              <p className="text-sm text-central-700 leading-relaxed mb-4">
                If you have questions about this privacy policy or how your data is handled, 
                please refer to our documentation or contact us through appropriate channels.
              </p>
              <p className="text-xs text-central-600">
                We're committed to transparency and will respond to privacy concerns promptly.
              </p>
            </div>

            <div className="bg-central-50 rounded-xl p-4 border border-central-200 text-center">
              <p className="text-xs text-central-600 leading-relaxed">
                <strong>Last Updated:</strong> September 2024<br />
                <strong>Effective Date:</strong> September 2024<br />
                We may update this privacy policy periodically. Any changes will be reflected 
                in the "Last Updated" date above. Continued use constitutes acceptance of updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <footer className="safe-area-padding p-4">
        <div className="flex justify-center gap-6">
          <Link 
            href="/safety"
            className="text-central-600 hover:text-central-700 font-medium transition-colors min-h-[44px] flex items-center"
          >
            Safety & Terms
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