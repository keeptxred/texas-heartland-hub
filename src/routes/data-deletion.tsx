import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { SITE_URL } from "@/lib/seo";

const title = "Facebook Data Deletion | Keep TX Red";
const description = "Instructions for requesting deletion of Facebook-derived data associated with the KeepTXRed Dashboard app.";
const canonical = `${SITE_URL}/data-deletion`;

export const Route = createFileRoute("/data-deletion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: DataDeletionPage,
});

function DataDeletionPage() {
  return (
    <LegalPage
      title="Facebook Data Deletion Instructions"
      description="Use these instructions to request deletion of Facebook-derived data associated with the KeepTXRed Dashboard app."
    >
      <section>
        <h2>About This Page</h2>
        <p>
          Keep TX Red uses the KeepTXRed Dashboard Meta app to support authorized Facebook Page features. If you connected Facebook to Keep TX Red or TexasDefined through this app and want Facebook-derived data that we control deleted, you may submit a deletion request using the process below.
        </p>
      </section>

      <section>
        <h2>What Facebook-Derived Data May Be Involved</h2>
        <p>Depending on the Facebook features you used, information associated with the app may include:</p>
        <ul>
          <li>Facebook Page identifiers and Page connection information needed to identify an authorized Page.</li>
          <li>Facebook user or Page identifiers supplied by Meta as part of an authorized integration.</li>
          <li>Page posts, comments, engagement information, or related metadata that the app was authorized to access.</li>
          <li>Connection status, authorization timestamps, and technical records used to operate, secure, or troubleshoot the integration.</li>
          <li>Derived content-interest or operational signals created from data the app was authorized to access.</li>
        </ul>
        <p className="mt-3">
          We do not sell Facebook-derived personal information. Our broader information practices are described in our <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>How to Request Deletion</h2>
        <ol>
          <li>Open our <Link to="/contact">contact page</Link>.</li>
          <li>State that your request is a <strong>Facebook data deletion request</strong>.</li>
          <li>Provide the name of the Facebook Page or account involved and, if available, the Facebook Page ID or other identifier needed to locate the relevant records.</li>
          <li>Provide an email address where we can contact you about the request.</li>
          <li>Include enough information for us to reasonably verify that you are authorized to make the request. Do not send passwords, access tokens, payment-card numbers, or other unnecessary sensitive information.</li>
        </ol>
      </section>

      <section>
        <h2>What Happens After a Request</h2>
        <p>
          We will review the request, verify the information reasonably necessary to identify the relevant records, and delete Facebook-derived personal data that we control when deletion is required or appropriate. We may contact you if additional information is needed to locate the data or verify the request.
        </p>
        <p className="mt-3">
          When deletion is completed, we will remove or de-identify the applicable records from active systems within a reasonable period. Residual copies may remain temporarily in routine backups until those backups expire or are overwritten.
        </p>
      </section>

      <section>
        <h2>Information We May Need to Retain</h2>
        <p>
          We may retain limited information when reasonably necessary to comply with law, preserve security or fraud-prevention records, resolve disputes, enforce agreements, document that a deletion request was completed, or meet other legitimate legal or operational obligations. Any retained information remains subject to our <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>Disconnecting Facebook</h2>
        <p>
          You may also remove the app or revoke its permissions through your Facebook or Meta account settings. Revoking access prevents future authorized access but does not automatically delete information previously received by Keep TX Red. To request deletion of previously received data, use the deletion-request process above.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Questions about this process or the status of a deletion request may be submitted through our <Link to="/contact">contact page</Link>.
        </p>
      </section>

      <section>
        <h2>Related Policies</h2>
        <p>
          Review our <Link to="/privacy">Privacy Policy</Link> for additional information about how Keep TX Red collects, uses, retains, and protects information. You can also return to the <Link to="/">Keep TX Red home page</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
