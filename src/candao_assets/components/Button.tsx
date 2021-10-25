import classNames from "classnames";
import { ButtonHTMLAttributes, MouseEventHandler } from "react";
import { FiLoader } from "react-icons/fi";
import { unreachable } from "../utils/unreachable";

type Variant = "outline" | "primary";
type Color = "indigo" | "green" | "red";

export const Button: React.FC<{
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
  disabled?: boolean;
  working?: boolean;
  variant?: Variant;
  color?: Color;
  as?: "button" | "a";
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
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
  onClick,
}) => {
  const classes: Record<Variant, Record<Color, string>> = {
    primary: {
      indigo:
        "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-gray-400 disabled:hover:bg-gray-400",
      green:
        "border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-400 disabled:hover:bg-gray-400",
      red: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400 disabled:hover:bg-gray-400",
    },
    outline: {
      indigo:
        "border border-gray-300 shadow-sm text-gray-700 bg-transparent hover:bg-gray-50",
      green:
        "border border-gray-300 shadow-sm text-gray-700 bg-transparent hover:bg-gray-50",
      red: "border border-gray-300 shadow-sm text-gray-700 bg-transparent hover:bg-gray-50",
    },
  };

  const commonProps = {
    className: classNames(
      "inline-flex items-center px-3 py-2 border  text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
      classes[variant][color],
      className
    ),
    children: (
      <>
        {working && <FiLoader className="animate-spin mr-3"></FiLoader>}
        {children}
      </>
    ),
  };

  switch (as) {
    case "a":
      return <a href={href} {...commonProps}></a>;
    case "button":
      return (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled || working}
          {...commonProps}
        ></button>
      );
    default:
      unreachable(as);
  }
};
