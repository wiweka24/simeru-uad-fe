import { useState, useEffect } from "react";

import { axiosInstance } from "../atoms/config";
import TableHeader from "../components/InputData/TableHeader";
import ScheduleCheckbox from "../components/Schedule/ScheduleCheckbox";
import TimePlaceholder from "../components/RoomTime/TimePlaceholder";

export default function Schedule() {
  const [roomtimes, setRoomtimes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subClass, setSubClass] = useState([]);

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sessions = [
    ["07:00", 1],
    ["08:00", 2],
    ["09:00", 3],
    ["10:00", 4],
    ["11:00", 5],
    ["12:00", 6],
    ["13:00", 7],
    ["14:00", 8],
    ["15:00", 9],
    ["16:00", 10],
    ["17:00", 11],
    ["18:00", 12],
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/room"
        );
        setRooms(res.data.data);

        const res1 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/room_time_helper"
        );
        setRoomtimes(assignRoom(res1.data.data));

        const res2 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/lecturer_plot/1"
        );
        setSubClass(res2.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  console.log(subClass);

  // Formating roomtimes data to manageable array
  function assignRoom(roomdata) {
    let finalArrRooms = [];
    // todo : make i to min value of room_id, and i to length + max value
    // todo : what if the room sparse, ex. 1,4,17,19 => how to handle? => save the each room id to array
    // For dividing data to 6 days
    for (let i = 0; i < 24; i = i + 4) {
      let arrDays = roomdata.filter(
        (item) => item.time_id > i && item.time_id <= i + 4
      );
      // console.log(arrDays);
      // console.log(arrDays.length);
      let arrRooms = [];
      // For setting the data into 8 rooms, 4 session each
      for (let j = 0; j < arrDays.length; j = j + 4) {
        arrRooms.push(arrDays.slice(j, j + 4));
      }
      //Push to make final array
      finalArrRooms.push(arrRooms);
      // console.log(arrRooms);
    }
    console.log(finalArrRooms);
    return finalArrRooms;
  }

  return (
    <div className="m-10 py-7 border-2 rounded-lg bg-white h-auto overflow-x-auto">
      <div className=" overflow-x-auto">
        {/* Dropdown & Search */}
        <TableHeader />

        {/* Table */}
        <table className="border-collapse w-full text-sm text-gray-500 dark:text-gray-400 ">
          <thead className=" text-gray-700/50 bg-gray-50">
            <tr>
              <th className="border py-3">Hari</th>
              <th className="border py-3">Sesi</th>
              {rooms.map((room) => (
                <th className="border px-6 py-3">{room.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roomtimes.map((day, index) => (
              <tr className="bg-white">
                <td className="border pt-6 text-center align-top font-medium text-gray-900">
                  {days[index]}
                </td>

                <td className="border w-0 font-medium text-gray-900">
                  {sessions.map((session) => (
                    <div className="p-1 w-fit text-center flex flex-col">
                      <TimePlaceholder text={session[0]} number={session[1]} />
                    </div>
                  ))}
                </td>

                {day.map((dayRoom) => (
                  <td className="border font-medium text-gray-900 bg-grey-light">
                    <div className="flex flex-col">
                      {dayRoom.map((session) =>
                        session.is_possible === "1" ? (
                          <ScheduleCheckbox
                            time={session}
                            room={rooms}
                            availableClass={subClass}
                          />
                        ) : (
                          <label className="relative border-b h-40 items-center w-full cursor-not-allowed"></label>
                        )
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
