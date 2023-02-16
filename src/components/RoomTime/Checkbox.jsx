import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";

export default function Checkbox({ value, onChange, acyear }) {
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    value.is_possible === "0" ? setIsCheck(false) : setIsCheck(true);
  }, [value]);

  const handleChange = (obj) => {
    // const roomId = obj.room_id;
    // const timeId = obj.time_id;
    // const academicYearId = obj.academic_year_id;
    // console.log(roomId, timeId, academicYearId, obj);
    if (obj.is_possible === "0") {
      (async () => {
        try {
          const res = await axiosInstance.post(
            "https://dev.bekisar.net/api/v1/room_time",
            {
              data: [
                {
                  room_id: obj.room_id,
                  time_id: obj.time_id,
                  academic_year_id: obj.academic_year_id,
                },
              ],
            }
          );
          setIsCheck(true);
          onChange();
        } catch (err) {
          console.log(err);
        }
      })();
    } else {
      (async () => {
        try {
          const res = await axiosInstance.delete(
            "https://dev.bekisar.net/api/v1/room_time",
            {
              data: {
                data: [
                  {
                    room_id: obj.room_id,
                    time_id: obj.time_id,
                    academic_year_id: obj.academic_year_id,
                  },
                ],
              },
            }
          );
          setIsCheck(false);
          onChange();
        } catch (err) {
          console.log(err);
        }
      })();
    }
  };

  return (
    <>
      <div class="flex items-center mr-4">
        <input
          checked={isCheck}
          type="checkbox"
          onChange={() => handleChange(value)}
          className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        ></input>
      </div>
    </>
  );
}
