import classNames from "classnames";

export const Card: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        "bg-white px-4 py-5 border-b rounded border-gray-200 sm:px-6 flex-1",
        className
      )}
    >
      {children}
    </div>
  );
};
