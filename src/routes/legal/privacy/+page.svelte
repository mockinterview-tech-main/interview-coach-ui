<div class="legal-page">
    <div class="legal-inner">
        <a href="/" class="legal-back">&larr; Home</a>

        <h1>Privacy Policy</h1>
        <p class="legal-meta">EmpowerPro Labs LLC &middot; Last Updated: June 8, 2026</p>

        <div class="legal-summary">
            <h2>In Summary</h2>
            <ul>
                <li>We collect your name and email address (via Google sign-in) to identify you and communicate important updates.</li>
                <li>We store your coaching session data (stories, talking points, strength signals) so you can access them in your Story Bank.</li>
                <li>We log session metadata (duration, status) to support auto-refunds and service quality.</li>
                <li>Payments are processed by Stripe — we never see or store your card details.</li>
                <li>We use cookies for authentication. That's it — no tracking cookies, no ad cookies.</li>
                <li>We will not sell your data. If we ever need to share data with a third party, we will notify you and let you opt in.</li>
            </ul>
        </div>

        <section>
            <h2>Introduction</h2>
            <p>Welcome to EmpowerPro Labs LLC ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data. By using our services, you consent to the practices described in this policy.</p>
        </section>

        <section>
            <h2>Information We Collect</h2>
            <p><strong>Account information:</strong> When you sign in with Google, we receive your name and email address. We use this to identify your account and communicate with you.</p>
            <p><strong>Session and story data:</strong> We store the content you create during coaching sessions, including your polished stories, talking points, and strength signal evaluations. This data is tied to your account so you can access it in your Story Bank.</p>
            <p><strong>Session logs:</strong> We record session metadata such as start time, duration, completion status, and API usage. This supports our auto-refund system and helps us improve service quality.</p>
            <p><strong>Payment information:</strong> Payments are processed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Stripe</a>. We never see, store, or have access to your credit card details. We only receive confirmation of payment status and subscription state from Stripe.</p>
            <p><strong>Usage information:</strong> We may collect information about your interactions with our services, such as pages visited, IP address, browser type, and operating system, primarily for maintaining and improving the site.</p>
        </section>

        <section>
            <h2>How We Use Your Information</h2>
            <p>We use your information to provide and improve our coaching services, manage your account and subscriptions, process refund requests, communicate important updates, and ensure the security of our platform. We do <strong>not</strong> use your data for advertising or marketing purposes.</p>
        </section>

        <section>
            <h2>Sharing Your Information</h2>
            <p>We do not sell your personal data. We may share limited information with trusted third-party service providers (such as Stripe for payments and Supabase for data storage) solely to operate our service. These providers are bound by their own privacy policies. If we ever need to share data beyond this scope, we will notify you and obtain your consent.</p>
        </section>

        <section>
            <h2>Cookies</h2>
            <p>We use essential cookies for authentication (keeping you logged in). We do not use advertising cookies or third-party tracking cookies. For more details, see our <a href="/legal/cookie">Cookie Policy</a>.</p>
        </section>

        <section>
            <h2>Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may request deletion of your account and associated data by contacting us. We will process your request in accordance with applicable law.</p>
        </section>

        <section>
            <h2>Data Security</h2>
            <p>We take reasonable measures to protect your information, including encryption in transit and at rest. However, no data transmission over the internet is completely secure. Please take steps to protect your own data as well.</p>
        </section>

        <section>
            <h2>Changes to this Privacy Policy</h2>
            <p>We may update this policy periodically to reflect changes in our practices. Please review the policy regularly. Continued use of the service after changes constitutes acceptance of the revised policy.</p>
        </section>

        <section>
            <h2>Contact Us</h2>
            <p>If you have questions or concerns about our Privacy Policy, please contact us at <a href="mailto:concierge@mockinterview.tech">concierge@mockinterview.tech</a>.</p>
        </section>
    </div>
</div>

<style lang="scss">
    @import '$lib/styles/colors.scss';

    .legal-page {
        min-height: 100vh;
        background: $bg-warm;
        padding-top: 56px;
    }

    .legal-inner {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 24px 80px;
    }

    .legal-back {
        display: inline-block;
        padding: 8px 20px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #c96442;
        text-decoration: none;
        border: 1px solid #c96442;
        border-radius: 24px;
        transition: all 0.2s;
        margin-bottom: 32px;
        &:hover {
            background: #c96442;
            color: white;
        }
    }

    h1 {
        font-size: 1.8rem;
        font-weight: 700;
        color: $text-dark;
        margin: 0 0 8px;
    }

    .legal-meta {
        font-size: 0.85rem;
        color: $text-light;
        margin: 0 0 32px;
    }

    .legal-summary {
        background: white;
        border-radius: 14px;
        padding: 24px 28px;
        box-shadow: $card-shadow;
        margin-bottom: 36px;

        h2 {
            font-size: 1rem;
            font-weight: 700;
            color: $text-dark;
            margin: 0 0 12px;
        }

        ul {
            margin: 0;
            padding-left: 20px;
        }

        li {
            font-size: 0.88rem;
            color: $text-medium;
            line-height: 1.6;
            margin-bottom: 6px;
            list-style-type: disc;
        }
    }

    section {
        margin-bottom: 28px;
    }

    h2 {
        font-size: 1.05rem;
        font-weight: 700;
        color: $text-dark;
        margin: 0 0 10px;
    }

    p {
        font-size: 0.9rem;
        color: $text-medium;
        line-height: 1.7;
        margin: 0 0 10px;
    }

    a {
        color: #c96442;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 600px) {
        h1 { font-size: 1.5rem; }
        .legal-inner { padding: 32px 16px 60px; }
    }
</style>
