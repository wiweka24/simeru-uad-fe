export default function TimePlaceholder({ text, number }) {
  return (
    <div className="overflow-hidden flex space-x-3 font-medium text-gray-600 border border-gray-200 rounded-lg">
      <div className="bg-gray-100 items-center flex justify-center w-11 rounded-lg border border-gray-200">
        {number}
      </div>
      <span className=" py-3 pr-4">{text}</span>
    </div>
  );
}
