import { useState, useEffect } from "react";

import Spinner from "../atoms/Spinner";
import TimePlaceholder from "../components/RoomTime/TimePlaceholder";
import ScheduleCheckbox from "../components/Schedule/ScheduleCheckbox";
import { Dropdown } from "flowbite-react";
import { axiosInstance } from "../atoms/config";


export default function Schedule({ acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [roomTimeHelper, setRoomTimeHelper] = useState([]);
  const [normalRoomTimeHelper, setNormalRoomTimeHelper] = useState([]);
  const [roomTime, setRoomTime] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [update, setUpdate] = useState("");
  const [currentDays, setCurrentDays] = useState([]);
  const [currentLabel, setCurrentLabel] = useState({
    day: "All",
    start: 1,
    end: 24,
  });
  const dateList = [
    {
      day: "All",
      start: 1,
      end: 24,
    },
    {
      day: "Senin",
      start: 1,
      end: 4,
    },
    {
      day: "Selasa",
      start: 5,
      end: 8,
    },
    {
      day: "Rabu",
      start: 9,
      end: 12,
    },
    {
      day: "Kamis",
      start: 13,
      end: 16,
    },
    {
      day: "Jumat",
      start: 17,
      end: 20,
    },
    {
      day: "Sabtu",
      start: 21,
      end: 24,
    },
  ];

  const [loading, setLoading] = useState(true);

  const rerender = () => {
    setUpdate(`update ${Math.random()}`);
  };

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
        setLoading(true);
        const res = await axiosInstance.get(`${URL}room`);
        setRooms(res.data.data);

        const res1 = await axiosInstance.get(`${URL}room_time_helper`);
        setNormalRoomTimeHelper(res1.data.data);
        // setRoomTimeHelper(assignRoom(res1.data.data));

        const res2 = await axiosInstance.get(`${URL}lecturer_plot/${acyear}`);
        setSubClass(res2.data.data);
        // console.log(res2.data.data);

        const res3 = await axiosInstance.get(`${URL}room_time`);
        setRoomTime(res3.data.data);

        const res4 = await axiosInstance.get(`${URL}schedule/${acyear}`);
        setSchedules(res4.data.data);

        // setLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [update, acyear]);

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

    const splitData = mergeData.filter(
      (item) =>
        item.time_id >= currentLabel.start && item.time_id <= currentLabel.end
    );

    if (currentLabel.day === "All") {
      setCurrentDays(days);
    } else {
      setCurrentDays([currentLabel.day]);
    }

    setRoomTimeHelper(
      assignRoom(splitData, currentLabel.start - 1, currentLabel.end)
    );
  }, [normalRoomTimeHelper, roomTime, currentLabel]);

  // Formating roomtimes data to manageable array
  function assignRoom(roomdata, start, end) {
    let finalArrRooms = [];
    // todo : make i to min value of room_id, and i to length + max value
    // todo : what if the room sparse, ex. 1,4,17,19 => how to handle? => save the each room id to array
    // For dividing data to 6 days
    for (let i = start; i < end; i = i + 4) {
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

  // useEffect(() => {
  //   const lolo = [roomTimeHelper[0]];
  //   console.log(
  //     lolo.map((day) => (
  //       day
  //     ))
  //   );
  //   setCurrentRoomTimeHelper([roomTimeHelper[0]])
  // }, [roomTimeHelper, currentLabel]);

  // console.log(currentDays);

  return (
    <div className="relative">
      <div className="h-10 border-b bg-white" />
      <div className="m-10 py-7 border-2 rounded-lg bg-white h-auto">
        <p className="px-7 mb-5 text-xl font-bold">
          Jadwal Kuliah Terselenggara
        </p>
        {/* Dropdown & Search */}
        <nav className="mx-8 flex mb-3 items-center justify-between">
          <Dropdown
            label={currentLabel.day}
            color="dark"
            outline="true"
            className="bg-grey-light"
            size="sm"
          >
            {dateList.map((date) => (
              <Dropdown.Item onClick={() => setCurrentLabel(date)}>
                {date.day}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </nav>

        <Spinner isLoading={loading} />

        {/* Table */}
        <table className="border-collapse w-full text-sm text-gray-500 overflow-x-auto">
          <thead className="text-gray-700/50 bg-gray-50 sticky top-0 z-40">
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
                  {currentDays[index]}
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
                            occupiedSchedule={schedules.find(
                              (item) =>
                                item.time_id === session.time_id &&
                                item.room_id === session.room_id &&
                                item.academic_year_id ===
                                  session.academic_year_id
                            )}
                            onChange={rerender}
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
