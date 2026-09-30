import { useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

const PrivacyPolicy = () => {
  const navigate = useNavigate()
  usePageTitle('Privacy Policy - Vibely')

  return (
    <div className="min-h-screen bg-bg text-text-primary sm:ml-18 lg:ml-60">
      <div className="sticky top-0 z-10 bg-bg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-text-primary text-2xl cursor-pointer hover:scale-110 transition-transform"
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="text-text-primary text-xl font-semibold">Privacy Policy</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <p className="text-text-secondary mb-8">Last updated: September 2026</p>

        <section className="space-y-8 text-text-secondary leading-7">
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">1. Information We Collect</h2>
            <p>When you use Vibely, we may collect information such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, username, and email address.</li>
              <li>Profile image, bio, and other profile information.</li>
              <li>Posts, comments, stories, and other content you create.</li>
              <li>Likes, follows, saves, and other interactions.</li>
              <li>Messages sent through the platform.</li>
              <li>Reports submitted through the platform.</li>
            </ul>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">2. How We Use Your Information</h2>
            <p>We use this information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and operate Vibely.</li>
              <li>Authenticate your account.</li>
              <li>Display your profile and content.</li>
              <li>Enable follows, likes, comments, and other social interactions.</li>
              <li>Deliver notifications and provide messaging features.</li>
              <li>Improve the platform and user experience.</li>
              <li>Detect abuse, spam, and security issues.</li>
            </ul>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">3. Authentication &amp; Security</h2>
            <p>Vibely uses authentication mechanisms such as securely stored authentication tokens to maintain your signed-in session. We take reasonable measures to protect account information from unauthorized access. However, no internet service can guarantee complete security.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">4. User-Generated Content</h2>
            <p>Content you voluntarily share on Vibely, such as posts, comments, stories, and profile information, may be visible to other users depending on the platform&apos;s functionality. Think carefully before sharing sensitive personal information publicly.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">5. Messages</h2>
            <p>Messages sent through Vibely are processed to provide the messaging functionality. Users should avoid sharing highly sensitive information through the platform.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">6. Cookies &amp; Local Storage</h2>
            <p>Vibely may use cookies and browser storage technologies to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Maintain authentication sessions.</li>
              <li>Remember user preferences.</li>
              <li>Support essential application functionality.</li>
            </ul>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">7. Third-Party Services</h2>
            <p>Vibely may use third-party services such as Cloudinary for image and media storage, hosting providers, database providers, and other APIs required by specific platform features. These services may process information according to their own privacy policies.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">8. Data Retention</h2>
            <p>We retain information for as long as necessary to provide Vibely&apos;s services, maintain security, comply with applicable requirements, or resolve disputes. When an account or content is deleted, some information may remain temporarily in backups or logs where technically necessary.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">9. Your Choices</h2>
            <p>Depending on the features available in Vibely, you may be able to update your profile, change your profile image, delete posts or comments, manage your account, log out, and request deletion of your account.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">10. Children&apos;s Privacy</h2>
            <p>Vibely is not intended for children who are below the minimum age required to use the service under applicable law.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">11. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy when our features or data practices change. The updated policy will be published on this page.</p>
          </article>
          <article>
            <h2 className="text-text-primary text-lg font-semibold mb-2">12. Contact</h2>
            <p>If you have questions regarding this Privacy Policy or your personal information, contact the Vibely team through the contact method provided within the application.</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default PrivacyPolicy