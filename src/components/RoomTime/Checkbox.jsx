import { useState, useEffect } from "react";

import { axiosInstance } from "../../atoms/config";
import { notifyError } from "../../atoms/notification";

export default function Checkbox({ value, onChange, setLoading }) {
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    value.is_possible == "0" ? setIsCheck(false) : setIsCheck(true);
  }, [value]);

  async function handleChange(obj) {
    if (obj.is_possible == "0") {
      try {
        await axiosInstance.post("room_time", {
          data: [
            {
              room_id: obj.room_id,
              time_id: obj.time_id,
              academic_year_id: obj.academic_year_id,
            },
          ],
        });
        setIsCheck(true);
        onChange();
      } catch (err) {
        notifyError(err);
      }
    } else {
      try {
        await axiosInstance.delete("room_time", {
          data: {
            data: [
              {
                room_id: obj.room_id,
                time_id: obj.time_id,
                academic_year_id: obj.academic_year_id,
              },
            ],
          },
        });
        setIsCheck(false);
        onChange();
      } catch (err) {
        notifyError(err);
      }
    }
  }

  return (
    <>
      <div class="flex items-center mr-4">
        <input
          checked={isCheck}
          type="checkbox"
          onChange={() => handleChange(value, setLoading)}
          className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        ></input>
      </div>
    </>
  );
}
