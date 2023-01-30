import { useState, useEffect } from "react";
export default function Checkbox({ value, classid, isChecked }) {
  // const [isChecked, setIsChecked] = useState(false);

  // if(value)

  // for(let i=0;i<seats.length-1;i++){
  //   if(seats[i].is_reserved !== 'available/green'){
  //     document.getElementById(seats[i].name).setAttribute("disabled", true)
  //   }
  // }

  // console.log(value);
  return (
    <>
      <div class="flex items-center mr-4">
        <input
          id={classid}
          checked={isChecked}
          type="checkbox"
          value={value}
          className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        ></input>
      </div>
    </>
  );
}
