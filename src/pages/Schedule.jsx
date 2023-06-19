import { useState, useEffect } from "react";

import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { Dropdown } from "flowbite-react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import Error from "./Error";
import Spinner from "../atoms/Spinner";
import TimePlaceholder from "../components/RoomTime/TimePlaceholder";
import ScheduleCheckbox from "../components/Schedule/ScheduleCheckbox";
import Button from "../components/Button";
import { axiosInstance } from "../atoms/config";

export default function Schedule({ acyear, formattedAcyear }) {
  const [roomTimeHelper, setRoomTimeHelper] = useState([]);
  const [normalRoomTimeHelper, setNormalRoomTimeHelper] = useState([]);
  const [roomTime, setRoomTime] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subClass, setSubClass] = useState([]);
  const [currentSubClass, setCurrentSubClass] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [formattedSchedules, setFormattedSchedules] = useState([]);
  const [update, setUpdate] = useState("");
  const [currentDays, setCurrentDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [error, setError] = useState([]);
  const [roomid, setRoomid] = useState([]);
  const [currentLabel, setCurrentLabel] = useState({
    day: "All",
    start: 1,
    end: 72,
  });
  const dateList = [
    { day: "All", start: 1, end: 72 },
    { day: "Senin", start: 1, end: 12 },
    { day: "Selasa", start: 13, end: 24 },
    { day: "Rabu", start: 25, end: 36 },
    { day: "Kamis", start: 37, end: 48 },
    { day: "Jumat", start: 49, end: 60 },
    { day: "Sabtu", start: 61, end: 72 },
  ];

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sessions = [
    ["07.00 - 07.50", 1],
    ["07.50 - 08.40", 2],
    ["08.45 - 09.35", 3],
    ["09.35 - 10.25", 4],
    ["10.30 - 11.20", 5],
    ["11.20 - 12.10", 6],
    ["12.30 - 13.20", 7],
    ["13.20 - 14.10", 8],
    ["14.15 - 15.05", 9],
    ["15.15 - 16.05", 10],
    ["16.10 - 17.00", 11],
    ["17.00 - 17.50", 12],
  ];

  // Getting the data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [
          roomResponse,
          helperResponse,
          plotResponse,
          timeResponse,
          scheduleResponse,
          formattedSchedulesResponse,
        ] = await Promise.all([
          axiosInstance.get(`room`),
          axiosInstance.get(`room_time_helper/${acyear}`),
          axiosInstance.get(`lecturer_plot/${acyear}`),
          axiosInstance.get(`room_time/${acyear}`),
          axiosInstance.get(`schedule/${acyear}`),
          axiosInstance.get(`schedule/formatted/${acyear}`),
        ]);
        setRooms(roomResponse.data.data);
        setNormalRoomTimeHelper(helperResponse.data.data);
        setSubClass(plotResponse.data.data);
        setRoomTime(timeResponse.data.data);
        setSchedules(scheduleResponse.data.data);
        setFormattedSchedules(sortJSON(formattedSchedulesResponse.data.data));
      } catch (err) {
        setError(err.response);
        setFetchFailed(true);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    })();
  }, [update, acyear]);

  // Merging and filtering data
  useEffect(() => {
    const mergeData = normalRoomTimeHelper.map((item) => ({
      ...item,
      ...roomTime.find(
        (item2) =>
          item2.time_id == item.time_id &&
          item2.room_id == item.room_id &&
          item2.academic_year_id == item.academic_year_id
      ),
    }));

    const splitData = mergeData.filter(
      (item) =>
        item.time_id >= currentLabel.start && item.time_id <= currentLabel.end
    );

    setCurrentDays(currentLabel.day === "All" ? days : [currentLabel.day]);
    setRoomTimeHelper(
      assignRoom(splitData, currentLabel.start - 1, currentLabel.end)
    );
  }, [normalRoomTimeHelper, roomTime, currentLabel]);

  function assignRoom(roomdata, start, end) {
    let finalArrRooms = [];
    let distinctRoomIds = new Set();

    // Divide into 6 days
    for (let i = start; i < end; i += 12) {
      // Filter roomdata based on the time range
      const arrDays = roomdata.filter(
        (item) => item.time_id > i && item.time_id <= i + 12
      );

      if (arrDays.length > 0) {
        const roomSessions = {};

        // Group roomdata by room_id into roomSessions object
        arrDays.forEach((day) => {
          if (!roomSessions[day.room_id]) {
            roomSessions[day.room_id] = [];
          }
          roomSessions[day.room_id].push(day);
        });

        // Convert roomSessions object to array of room arrays
        const arrRooms = Object.values(roomSessions);
        finalArrRooms.push(arrRooms);

        // Check each room array for rooms with is_possible === "1" and add corresponding room_id to distinctRoomIds
        Object.keys(roomSessions).forEach((roomId) => {
          if (roomSessions[roomId].some((room) => room.is_possible === "1")) {
            distinctRoomIds.add(roomId);
          }
        });
      }
    }

    // Set distinct room IDs in the respective states
    setRoomid(Array.from(distinctRoomIds));

    // Filter semua data dan slice yang room id nya ada di distinctRoomIds
    const filteredData = finalArrRooms.map((nestedArray) =>
      nestedArray.filter((roomArray) =>
        roomArray.some((room) => Array.from(distinctRoomIds).includes(room.room_id))
      )
    );

    return filteredData;
  }

  // Search Logic
  useEffect(() => {
    setCurrentSubClass(
      subClass.filter((item) =>
        item.sub_classes_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [subClass, searchQuery]);

  // Mapping schedule by filterring the data to be addedd to the checkbox.
  function scheduleMapping(
    session,
    rooms,
    currentSubClass,
    setSearchQuery,
    schedules,
    rerender
  ) {
    const occupiedSchedule = schedules.find(
      (item) =>
        item.time_id == session.time_id &&
        item.room_id == session.room_id &&
        item.academic_year_id == session.academic_year_id
    );

    if (session.is_possible === "1") {
      return (
        <ScheduleCheckbox
          time={session}
          room={rooms}
          availableClass={currentSubClass}
          setSearchQuery={setSearchQuery}
          occupiedSchedule={occupiedSchedule}
          onChange={rerender}
        />
      );
    } else {
      return (
        <label className="relative border-b h-20 items-center w-full cursor-not-allowed"></label>
      );
    }
  }

  function handleExport(jsonData) {
    for (let data of jsonData) {
      data.Sesi = data.Sesi.toString();
    }
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(
      data,
      `Jadwal-Kuliah-Terselenggara-${formattedAcyear}.xlsx`
    );
  }

  function sortJSON(data) {
    data.sort((a, b) => {
      if (a["Mata Kuliah"] !== b["Mata Kuliah"]) {
        return a["Mata Kuliah"].localeCompare(b["Mata Kuliah"]);
      } else {
        return a["Kelas"].localeCompare(b["Kelas"]);
      }
    });

    return data;
  }

  console.log(roomid);

  return (
    <div className="relative h-screen">
      <div className="p-10">
        <div className="py-7 border-2 rounded-lg bg-white h-auto">
          <p className="px-7 mb-5 text-xl font-bold">
            Jadwal Kuliah Terselenggara
          </p>
          {/* Dropdown & Search */}
          <nav className="relative mx-8 flex mb-3 items-center justify-between">
            <Dropdown
              label={currentLabel.day}
              color="dark"
              outline="true"
              size="sm"
            >
              <Dropdown.Header>
                <span className="block text-sm h-5"></span>
              </Dropdown.Header>
              {dateList.map((date) => (
                <Dropdown.Item onClick={() => setCurrentLabel(date)}>
                  {date.day}
                </Dropdown.Item>
              ))}
            </Dropdown>

            <Button
              text={
                <div className="flex items-center">
                  <ArrowUpTrayIcon className="h-5 mr-1" />
                  Export Excel
                </div>
              }
              color="dark"
              onClick={() => handleExport(formattedSchedules)}
            />
          </nav>

          <Spinner isLoading={loading} />

          {/* If Dont Get Data Display Error Instead Of Table */}
          {fetchFailed ? (
            <Error
              type="reload"
              status={error.status}
              message={error.data.message}
            />
          ) : (
            <table className="relative border-collapse w-full text-sm text-gray-500 overflow-x-auto">
              <thead className="text-gray-700/50 bg-gray-50">
                <tr className="sticky top-0 z-10">
                  <th className="bg-gray-50 w-20 border-t py-3 ">Hari</th>
                  <th className="bg-gray-50 w-0 border py-3 ">Sesi</th>
                  {rooms.map((room) =>
                    // Find Related room corespond for acadyear
                    roomid.find((item) => item == room.room_id) ? (
                      <th className="bg-gray-50 w-40 border px-6 py-3 ">
                        {room.name}
                      </th>
                    ) : (
                      <></>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {roomTimeHelper.map((day, index) => (
                  <tr className="bg-white">
                    <td className="border-b border-r w-20 pt-6 text-center align-top font-medium text-gray-900">
                      {currentDays[index]}
                    </td>

                    {/* Time Column */}
                    <td className="border-b font-medium text-gray-900 w-full flex flex-col">
                      {sessions.map((session) => (
                        <div className="flex items-center justify-center h-20 w-full px-1 py-4 border-r">
                          <TimePlaceholder
                            text={session[0]}
                            number={session[1]}
                          />
                        </div>
                      ))}
                    </td>

                    {/* Shape of the schedule box */}
                    {day.map((dayRoom) => (
                      <td className="border w-40 font-medium text-gray-900 bg-grey-light">
                        <div className="relative flex flex-col">
                          {dayRoom.map((session) =>
                            scheduleMapping(
                              session,
                              rooms,
                              currentSubClass,
                              setSearchQuery,
                              schedules,
                              rerender
                            )
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
