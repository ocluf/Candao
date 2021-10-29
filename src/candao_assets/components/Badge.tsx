type Color = "red" | "green" | "indigo" | "blue";

export const Badge: React.FC<{
  text: string;
  color: Color;
  className?: string;
}> = ({ text, color, className }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 ${
        className || ""
      }`}
    >
      {text}
    </span>
  );
};
