import { useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

const TermsOfService = () => {
  const navigate = useNavigate()
  usePageTitle('Terms of Service - Vibely')

  return (
    <div className="min-h-screen bg-bg text-text-primary sm:ml-[72px] lg:ml-[240px]">
      <div className="sticky top-0 z-10 bg-bg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-text-primary text-2xl cursor-pointer hover:scale-110 transition-transform"
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="text-text-primary text-xl font-semibold">Terms of Service</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <p className="text-text-secondary mb-8">Last updated: September 2026</p>

        <section className="space-y-8 text-text-secondary leading-7">
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>By creating an account or using Vibely, you agree to these Terms of Service. If you do not agree with these terms, please do not use Vibely.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">2. About Vibely</h2>
            <p>Vibely is a social media platform that allows users to create and share posts, interact with other users, send messages, share stories, and discover content.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">3. User Accounts</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Providing accurate account information.</li>
              <li>Keeping your account credentials secure.</li>
              <li>All activity performed through your account.</li>
              <li>Not impersonating another person or creating deceptive accounts.</li>
            </ul>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">4. User Content</h2>
            <p>Users can create and share posts, comments, stories, profile information, and messages.</p>
            <p className="mt-3">You retain ownership of the content you create. However, by posting content on Vibely, you grant Vibely permission to store, display, and distribute that content as necessary to provide the platform&apos;s features.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">5. Prohibited Activities</h2>
            <p>You must not use Vibely to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Harass, threaten, or abuse other users.</li>
              <li>Share illegal or harmful content.</li>
              <li>Impersonate others.</li>
              <li>Attempt to access another user&apos;s account.</li>
              <li>Spam or manipulate the platform.</li>
              <li>Upload malicious software or harmful code.</li>
              <li>Circumvent platform security measures.</li>
            </ul>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">6. Content Moderation</h2>
            <p>Vibely may remove content or restrict accounts that violate these Terms of Service or applicable laws. Users can report inappropriate content or accounts through the reporting features provided by the platform.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">7. Account Suspension or Termination</h2>
            <p>We may suspend or terminate accounts that violate these Terms or misuse the platform. You may stop using Vibely and request deletion of your account according to the available account settings.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">8. Changes to These Terms</h2>
            <p>These Terms may be updated from time to time. Continued use of Vibely after changes are published means you accept the updated Terms.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">9. Contact</h2>
            <p>If you have questions about these Terms, you can contact the Vibely team through the contact method provided within the application.</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default TermsOfService
