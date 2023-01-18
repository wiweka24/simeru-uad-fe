
export default function Button({ text, Icon, linkto }) {
  return (
    <a href={linkto} className="relative mt-2 inline-flex items-center justify-center px-4 py-1.5 overflow-hidden font-medium transition duration-300 ease-out border-2 border-grey-dark rounded-lg shadow-md group">
      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-grey-dark group-hover:translate-x-0 ease">
        <Icon className="h-5"/>
      </span>
      <span className="absolute flex items-center justify-center w-full h-full text-grey transition-all duration-300 transform group-hover:translate-x-full ease">
        {text}
      </span>
      <span className="relative invisible">
        {text}
      </span>
    </a>
  )
}