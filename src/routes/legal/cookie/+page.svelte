<div class="legal-page">
    <div class="legal-inner">
        <a href="/" class="legal-back">&larr; Home</a>

        <h1>Cookie Policy</h1>
        <p class="legal-meta">EmpowerPro Labs LLC &middot; Last Updated: June 8, 2026</p>

        <section>
            <h2>What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit our website. They help us provide a functional experience.</p>
        </section>

        <section>
            <h2>Cookies We Use</h2>
            <p><strong>Essential / Authentication cookies:</strong> These cookies are required for our service to function. They keep you logged in and manage your session. You cannot opt out of these cookies while using our service.</p>
            <p><strong>That's it.</strong> We do not use analytics cookies, advertising cookies, or third-party tracking cookies. We believe in keeping things simple and respecting your privacy.</p>
        </section>

        <section>
            <h2>Third-Party Services</h2>
            <p>We use Stripe for payment processing and Google for authentication. These services may set their own cookies when you interact with them (e.g., during checkout or sign-in). These cookies are governed by the respective privacy policies of <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Stripe</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google</a>.</p>
        </section>

        <section>
            <h2>How to Control Cookies</h2>
            <p>You can manage or disable cookies through your browser settings. Please note that disabling essential cookies will prevent you from staying logged in and may affect your experience on our website.</p>
        </section>

        <section>
            <h2>Changes to this Cookie Policy</h2>
            <p>We may update this policy periodically. Please review the policy regularly. Continued use of the service after changes constitutes acceptance of the revised policy.</p>
        </section>

        <section>
            <h2>Contact Us</h2>
            <p>If you have questions about our Cookie Policy, please contact us at <a href="mailto:concierge@mockinterview.tech">concierge@mockinterview.tech</a>.</p>
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
