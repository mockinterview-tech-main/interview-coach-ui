<script lang="ts">
    const VITE_COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME
    const VITE_CONTACT_INFO = import.meta.env.VITE_CONTACT_INFO
</script>

<div class="legal">
    <h1>Cookie Policy:</h1>

    <div>
    {VITE_COMPANY_NAME} Cookie Policy<br/>
    Last Updated: September 15, 2023
    </div>

    <div>
    <b>What Are Cookies</b><br/>

    Cookies are small text files that are stored on your device when you visit our website. They help us improve your online experience.
    </div>

    <div>
    <b>Types of Cookies</b><br/>
    <i>Essential Cookies:</i> These cookies are necessary for the functioning of our website.<br/>
    <i>Analytics Cookies:</i> We use these cookies to collect data about your usage of our website.<br/>
    <i>Advertising Cookies:</i> These cookies track your online activities to provide you with personalized ads.
    </div>

    <div>
    <b>How to Control Cookies</b><br/>
    You can manage or disable cookies through your browser settings. Please note that disabling cookies may affect your experience on our website.
    </div>

    <div>
    <b>Third-Party Cookies</b><br/>
    We may allow third-party cookies on our website for advertising and analytics purposes. These cookies are subject to the privacy policies of the respective third parties.
    </div>

    <div>
    <b>Changes to this Cookie Policy</b><br/>
    We may update this policy periodically. Please review the policy regularly.
    </div>

    <div>
    <b>Contact Us</b><br/>
    If you have questions or concerns about our Cookie Policy, please contact us at {VITE_CONTACT_INFO}.
    </div>
</div>

<style lang="scss">
    .legal {
        margin: 20px;
    }
    div {
        padding: 20px 0px;
    }
</style>