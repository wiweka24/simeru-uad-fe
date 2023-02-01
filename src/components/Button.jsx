import { Link } from "react-router-dom";

export default function Button({ text, linkto, color }) {
  const code = {
    dark: "grey-dark",
    danger: "red-500",
  };

  return (
    <Link
      to={linkto}
      class={`relative mt-2 inline-flex items-center justify-start px-4 py-1.5 overflow-hidden font-medium transition-all border-2 border-${code[color]} bg-white rounded hover:bg-white group`}
    >
      <span class="w-48 h-48 rounded rotate-[-40deg] bg-grey-dark absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0" />
      <span class="relative w-full text-left text-gray-dark transition-colors duration-300 ease-in-out group-hover:text-white">
        {text}
      </span>
    </Link>
  );
}
