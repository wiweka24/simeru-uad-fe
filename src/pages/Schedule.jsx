import { useState, useEffect } from "react";
import TableHeader from "../components/InputData/TableHeader";
import { axiosInstance } from "../atoms/config";

export default function Schedule() {
  const sessions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const hours = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const [roomtimes, setRoomtimes] = useState([]);
  const [rooms, setRooms] = useState([]);

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
        // console.log(update);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  // Formating roomtimes data to manageable array
  function assignRoom(roomdata) {
    let finalArrRooms = [];
    // todo : make i to min value of room_id, and i to length + max value
    // todo : what if the room sparse, ex. 1,4,17,19 => how to handle? => save the each room id to array
    for (let i = 0; i < roomdata.length; i++) {
      let tempArrRooms = roomdata.filter((item) => item.room_id == i + 1);
      let rdTempArrRooms = [];
      for (let j = 0; j < tempArrRooms.length; j = j + 4) {
        rdTempArrRooms.push(tempArrRooms.slice(j, j + 4));
      }
      finalArrRooms.push(rdTempArrRooms);
    }
    // console.log(finalArrRooms);
    return finalArrRooms;
  }

  return (
    <div className="m-10 py-7 border-2 rounded-lg bg-white h-auto">
      <div className=" overflow-x-auto">
        {/* Dropdown & Search */}
        <TableHeader />

        {/* Table */}
        <table className="border-collapse border w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className=" text-gray-700/50 bg-gray-50">
            <tr className="">
              <th className="border pl-8 pr-6 py-3">Hari</th>
              <th className="border px-6 py-3">Sesi</th>
              <th className="border px-6 py-3">Jam</th>
              {rooms.map((room) => (
                <th className="border px-6 py-3">{room.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr className="bg-white border-collapse">
                <td className="border text-center font-medium text-gray-900">
                  {day}
                </td>

                <td className="border border-collapse font-medium text-gray-900">
                  {sessions.map((session) => (
                    <div className="border-b">
                      <p className="p-5 w-full text-center">{session}</p>
                    </div>
                  ))}
                </td>

                <td className="border border-collapse font-medium text-gray-900">
                  {hours.map((hour) => (
                    <div className="border-b">
                      <p className="p-5 w-full text-center">{hour}</p>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
