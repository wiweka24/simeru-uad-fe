import { useState, useEffect } from "react";

import { axiosInstance } from "../atoms/config";
import TableHeader from "../components/InputData/TableHeader";
import ScheduleCheckbox from "../components/Schedule/ScheduleCheckbox";
import TimePlaceholder from "../components/RoomTime/TimePlaceholder";

export default function Schedule() {
  const [roomTimeHelper, setRoomTimeHelper] = useState([]);
  const [normalRoomTimeHelper, setNormalRoomTimeHelper] = useState([]);
  const [roomTime, setRoomTime] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules, setSchedules] = useState([]);

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
        setNormalRoomTimeHelper(res1.data.data);
        // setRoomTimeHelper(assignRoom(res1.data.data));

        const res2 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/lecturer_plot/1"
        );
        setSubClass(res2.data.data);
        // console.log(res2.data.data);

        const res3 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/room_time"
        );
        setRoomTime(res3.data.data);
        const res4 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/schedule/1"
        );
        setSchedules(res4.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    const mergeData = normalRoomTimeHelper.map((item) => ({
      ...item,
      ...roomTime.find(
        (item2) =>
          item2.time_id === item.time_id &&
          item2.room_id === item.room_id &&
          item2.academic_year_id === item.academic_year_id
      ),
    }));

    setRoomTimeHelper(assignRoom(mergeData));
  }, [normalRoomTimeHelper, roomTime]);

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
      let arrRooms = [];
      // For setting the data into 8 rooms, 4 session each
      for (let j = 0; j < arrDays.length; j = j + 4) {
        arrRooms.push(arrDays.slice(j, j + 4));
      }
      //Push to make final array
      finalArrRooms.push(arrRooms);
    }
    return finalArrRooms;
  }

  useEffect(() => {
    setCurrentSubClass(
      subClass.filter((item) =>
        item.sub_classes_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [subClass, searchQuery]);

  return (
    <div className="relative">
      <div className="h-10 border-b bg-white" />
      <div className="m-10 py-7 border-2 rounded-lg bg-white h-auto">
        <p className="px-7 mb-5 text-xl font-bold">
          Jadwal Kuliah Terselenggara
        </p>
        {/* Dropdown & Search */}
        <TableHeader />

        {/* Table */}
        <table className="border-collapse w-full text-sm text-gray-500 overflow-x-auto">
          <thead className="text-gray-700/50 bg-gray-50 sticky top-0">
            <tr>
              <th className="bg-gray-50 w-20 border py-3 ">Hari</th>
              <th className="bg-gray-50 w-0 border py-3 ">Sesi</th>
              {rooms.map((room) => (
                <th className="bg-gray-50 w-40 border px-6 py-3 ">
                  {room.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roomTimeHelper.map((day, index) => (
              <tr className="bg-white">
                <td className="border w-20 pt-6 text-center align-top font-medium text-gray-900">
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
                  <td className="border w-40 font-medium text-gray-900 bg-grey-light">
                    <div className="flex flex-col">
                      {dayRoom.map((session) =>
                        session.is_possible === "1" ? (
                          <ScheduleCheckbox
                            time={session}
                            room={rooms}
                            availableClass={currentSubClass}
                            setSearchQuery={setSearchQuery}
                            availableSchedule={schedules.find(
                              (item) =>
                                item.time_id === session.time_id &&
                                item.room_id === session.room_id &&
                                item.academic_year_id ===
                                  session.academic_year_id
                            )}
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
