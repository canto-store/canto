function ContactUsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="mx-auto my-10 max-w-2xl">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Contact Us
          </h1>

          <p className="text-gray-600">
            We&apos;d love to hear from you! Whether you have questions about
            our products, need help with an order, or want to partner with us,
            don&apos;t hesitate to reach out.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">
                  <a
                    href="mailto:contact@canto-store.com"
                    className="transition-colors hover:text-gray-900"
                  >
                    contact@canto-store.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              We typically respond within 24 hours during business days. Thank
              you for choosing u.
            </p>
            <strong>Canto — Egypt&apos;s brands, one destination</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUsPage;
