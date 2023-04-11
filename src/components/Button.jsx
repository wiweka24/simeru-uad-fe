import { Link } from "react-router-dom";

export default function Button({
  text,
  linkto,
  color,
  color1,
  ...buttonProps
}) {
  const border = {
    dark: "border-grey-dark",
    danger: "border-red-800",
    succes: "border-green-600",
  };

  const bg = {
    dark: "bg-grey-dark",
    danger: "bg-red-800",
    succes: "bg-green-600",
  };

  const txt = {
    dark: "text-grey-dark",
    danger: "text-red-800",
    succes: "text-green-600",
  };

  return (
    <Link to={linkto} className="flex">
      <button
        {...buttonProps}
        className={`rounded-md px-4 py-1.5 overflow-hidden relative group cursor-pointer border-2 font-medium ${border[color]} ${txt[color]} bg-white`}
      >
        <span
          className={`absolute w-64 h-0 transition-all duration-100 ${
            bg[color1 || color]
          } top-1/2 origin-center rotate-45 -translate-x-20 group-hover:h-64 group-hover:-translate-y-32 ease`}
        />
        <span
          className={`relative ${txt[color]} transition duration-300 group-hover:text-white ease`}
        >
          {text}
        </span>
      </button>
    </Link>
  );
}
