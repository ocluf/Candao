import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import { FiLoader } from "react-icons/fi";

export const Button: React.FC<{
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
  disabled?: boolean;
  working?: boolean;
  variant?: "outline" | "primary";
  color?: "indigo";
  as?: "button" | "a";
  href?: string;
}> = ({
  type,
  className,
  disabled,
  working,
  children,
  as = "button",
  color = "indigo",
  variant = "primary",
  href,
}) => {
  const colorClasses = {
    indigo:
      "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-gray-400 disabled:hover:bg-gray-400",
  }[color];

  const variantClasses = {
    primary: "border-transparent",
    outline:
      "border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50",
  }[variant];

  const Tag = as;

  return (
    <Tag
      {...(as === "button" ? { type: type } : {})}
      {...(as === "a" ? { href: href } : {})}
      className={classNames(
        "inline-flex items-center px-3 py-2 border  text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
        colorClasses,
        variantClasses,
        className
      )}
      disabled={disabled || working}
    >
      {working && <FiLoader className="animate-spin mr-3"></FiLoader>}
      {children}
    </Tag>
  );
};
