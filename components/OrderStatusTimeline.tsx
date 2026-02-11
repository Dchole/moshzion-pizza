import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface TimelineStep {
  status: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface OrderStatusTimelineProps {
  currentStatus: string;
}

export function OrderStatusTimeline({
  currentStatus
}: OrderStatusTimelineProps) {
  const statusOrder = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED"
  ];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const timelineSteps: TimelineStep[] = [
    {
      status: "PENDING",
      label: "Order Placed",
      icon: <AccessTimeIcon sx={{ fontSize: 24 }} />,
      completed: currentIndex >= 0,
      active: currentStatus === "PENDING"
    },
    {
      status: "CONFIRMED",
      label: "Confirmed",
      icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
      completed: currentIndex >= 1,
      active: currentStatus === "CONFIRMED"
    },
    {
      status: "PREPARING",
      label: "Preparing",
      icon: <RestaurantIcon sx={{ fontSize: 24 }} />,
      completed: currentIndex >= 2,
      active: currentStatus === "PREPARING"
    },
    {
      status: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
      icon: <LocalShippingIcon sx={{ fontSize: 24 }} />,
      completed: currentIndex >= 3,
      active: currentStatus === "OUT_FOR_DELIVERY"
    },
    {
      status: "DELIVERED",
      label: "Delivered",
      icon: <ThumbUpIcon sx={{ fontSize: 24 }} />,
      completed: currentIndex >= 4,
      active: currentStatus === "DELIVERED"
    }
  ];

  if (currentStatus === "CANCELLED") {
    return (
      <div className="bg-white rounded-lg border border-brown-dark/10 p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="font-display text-xl text-red-600 mb-2">
          Order Cancelled
        </p>
        <p className="text-gray-600 font-open-sans text-sm">
          This order has been cancelled. If you have any questions, please
          contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-brown-dark/10 p-6">
      <h2 className="font-display text-xl text-brown-dark mb-6">
        Order Progress
      </h2>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gray-200">
          <div
            className="bg-green-500 w-full transition-all duration-500"
            style={{
              height: `${(currentIndex / (timelineSteps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Timeline Steps */}
        <div className="space-y-8">
          {timelineSteps.map(step => (
            <div key={step.status} className="relative flex items-start gap-4">
              {/* Icon Circle */}
              <div
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.completed
                    ? "bg-green-500 text-white shadow-lg scale-110"
                    : step.active
                      ? "bg-orange-500 text-white shadow-lg scale-110 animate-pulse"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.icon}
              </div>

              {/* Step Label */}
              <div className="flex-1 pt-4">
                <p
                  className={`font-sans font-semibold text-lg mb-1 ${
                    step.completed || step.active
                      ? "text-brown-dark"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                {step.active && (
                  <p className="text-sm text-orange-600 font-open-sans font-medium">
                    In Progress
                  </p>
                )}
                {step.completed && !step.active && (
                  <p className="text-sm text-green-600 font-open-sans">
                    Completed
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
