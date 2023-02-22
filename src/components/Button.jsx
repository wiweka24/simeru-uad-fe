import { Link } from "react-router-dom";

export default function Button({ text, linkto, color, ...buttonProps }) {
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
    <Link
      to={linkto}
      // className={`relative inline-flex items-center justify-start px-4 py-1.5 overflow-hidden font-medium transition-all border-2 ${border[color]} bg-white rounded-lg hover:bg-white group`}
    >
      {/* <button {...buttonProps}>
        <span
          className={`w-48 h-48 rotate-[-40deg] ${bg[color]} absolute bottom-0 left-0 -translate-x-full ease-out duration-600 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0`}
        />
        <span
          className={`relative w-full text-left ${txt[color]} transition-colors duration-300 ease-in-out group-hover:text-white`}
        >
          {text}
        </span>
      </button> */}
      
      <button
        {...buttonProps}
        class={`rounded-md px-4 py-1.5 overflow-hidden relative group cursor-pointer border-2 font-medium ${border[color]} ${txt[color]}`}
      >
        <span
          class={`absolute w-64 h-0 transition-all duration-100 ${bg[color]} top-1/2 origin-center rotate-45 -translate-x-20 group-hover:h-64 group-hover:-translate-y-32 ease`}
        />
        <span
          class={`relative ${txt[color]} transition duration-300 group-hover:text-white ease`}
        >
          {text}
        </span>
      </button>
    </Link>
  );
}
