import classNames from "classnames";

type Color = "red" | "green" | "indigo" | "blue";

export const Badge: React.FC<{
  text: string;
  color: Color;
  className?: string;
}> = ({ text, color, className }) => {
  return (
    <>
      {color === "green" && (
        <span
          className={
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 " +
            className
          }
        >
          {text}
        </span>
      )}
      {color === "red" && (
        <span
          className={
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 " +
            className
          }
        >
          {text}
        </span>
      )}
      {color === "blue" && (
        <span
          className={
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 " +
            className
          }
        >
          {text}
        </span>
      )}
      {color === "indigo" && (
        <span
          className={
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 " +
            className
          }
        >
          {text}
        </span>
      )}
    </>
  );
};
