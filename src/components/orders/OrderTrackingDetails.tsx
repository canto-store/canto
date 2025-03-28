import { TrackingInfo } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

type OrderTrackingDetailsProps = {
  trackingInfo: TrackingInfo;
};

export function OrderTrackingDetails({
  trackingInfo,
}: OrderTrackingDetailsProps) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
            Carrier
          </span>
          <p className="text-sm font-medium">{trackingInfo.carrier}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
            Tracking #
          </span>
          <p className="font-mono text-sm">{trackingInfo.trackingNumber}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
            Est. Delivery
          </span>
          <p className="text-sm font-medium">
            {trackingInfo.estimatedDelivery}
          </p>
        </div>
        {trackingInfo.currentLocation && (
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Current Location
            </span>
            <p className="text-sm">{trackingInfo.currentLocation}</p>
          </div>
        )}
      </div>

      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tracking History
        </h4>
      </div>

      <ScrollArea className="h-36 overflow-hidden rounded border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4 px-2">
          {trackingInfo.updates.map((update, index) => (
            <div
              key={index}
              className="relative border-l-2 border-gray-300 pl-4 dark:border-gray-600"
            >
              <div className="absolute top-1 -left-[5px] h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {update.status}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {update.location}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {update.timestamp}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
