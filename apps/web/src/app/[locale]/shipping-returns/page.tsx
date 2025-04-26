import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy | Canto",
  description:
    "Learn about Canto's shipping and returns policies, including delivery times, fees, and return process.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shipping & Returns Policy
      </h1>

      {/* Shipping Policy Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          Shipping Policy
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              1. Delivery Time
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>
                Standard delivery time: 3 to 5 business days (depending on the
                location)
              </li>
              <li>
                Orders are processed within 24-48 hours after confirmation
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              2. Shipping Fees
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>
                Flat rate / Free shipping on orders above a certain amount
              </li>
              <li>
                Additional fees may apply for remote areas or express shipping
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              3. Order Tracking
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>
                Customers receive a tracking link via email/SMS once the order
                is shipped
              </li>
              <li>Real-time tracking available on the Canto website/app</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              4. Damaged or Missing Items
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>
                If a package arrives damaged or an item is missing, customers
                must report it within 2 days of delivery with photos as proof
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Return & Exchange Policy Section */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          Return & Exchange Policy
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              1. Eligibility for Returns & Exchanges
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>Returns/exchanges accepted within 7 days of delivery</li>
              <li>
                Items must be unused, in original packaging, with all tags
                attached
              </li>
              <li>
                Certain items (e.g., personalized, hygiene-related, or
                final-sale items) are non-returnable
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              2. Return Process
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>Customers initiate a return request via Application</li>
              <li>
                After approval, items must be shipped back within 5 days (return
                label provided if applicable)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              3. Refund & Store Credit
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>Refunds processed within 14 days after item inspection</li>
              <li>Option for store credit or exchange instead of a refund</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              4. Who Covers Return Shipping?
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-gray-600">
              <li>Free returns for defective/damaged items</li>
              <li>
                Customers may cover return shipping costs for size changes or
                preference-based returns
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
