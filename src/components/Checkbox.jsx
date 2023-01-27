export default function Checkbox() {
  return (
    <>
      <div class="flex items-center mr-4">
        <input
          id="green-checkbox"
          type="checkbox"
          value=""
          class="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        ></input>
      </div>
    </>
  );
}
