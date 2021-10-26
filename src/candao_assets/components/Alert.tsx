import classNames from "classnames";
import { ReactElement } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";

type AlertVariant = "success" | "warning" | "info" | "danger";

const variants: Record<
  AlertVariant,
  {
    icon: ReactElement;
    titleColor: string;
    bodyColor: string;
    bgColor: string;
  }
> = {
  warning: {
    icon: (
      <FiAlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
    ),
    titleColor: "text-yellow-800",
    bodyColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  success: {
    icon: (
      <FiCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
    ),
    titleColor: "text-green-800",
    bodyColor: "text-green-700",
    bgColor: "bg-green-50",
  },
  info: {
    icon: <FiInfo className="h-5 w-5 text-blue-400" aria-hidden="true" />,
    titleColor: "text-blue-800",
    bodyColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  danger: {
    icon: <FiXCircle className="h-5 w-5 text-red-400" aria-hidden="true" />,
    titleColor: "text-red-800",
    bodyColor: "text-red-700",
    bgColor: "bg-red-50",
  },
};

export const Alert: React.FC<{
  title: string;
  variant: AlertVariant;
}> = ({ children, title, variant }) => {
  return (
    <div className={classNames("rounded-md-50 p-4", variants[variant].bgColor)}>
      <div className="flex">
        <div className="flex-shrink-0">{variants[variant].icon}</div>
        <div className="ml-3">
          <h3
            className={classNames(
              "text-sm font-medium",
              variants[variant].titleColor
            )}
          >
            {title}
          </h3>
          <div
            className={classNames("mt-2 text-sm", variants[variant].bodyColor)}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
