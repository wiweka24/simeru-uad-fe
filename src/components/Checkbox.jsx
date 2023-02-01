import { useState, useEffect } from "react";
import { axiosInstance } from "../atoms/config";

export default function Checkbox({ value, roomTimeId, isChecked }) {
  const handleChange = (e) => {
    const roomTimeId = e.target.id;
    const timeId = e.target.value;

    (async () => {
      try {
        const res = await axiosInstance.put("dummy_data/room.json", {
          room_time_id: roomTimeId,
          time_id: timeId,
        });
      } catch (err) {
        // catch here
      }
    })();
  };

  return (
    <>
      <div class="flex items-center mr-4">
        <input
          id={roomTimeId}
          checked={isChecked}
          type="checkbox"
          value={value}
          onChange={handleChange}
          className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        ></input>
      </div>
    </>
  );
}
