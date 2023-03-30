import { useState, useEffect } from "react";

import Error from "./Error";
import Spinner from "../atoms/Spinner";
import TimePlaceholder from "../components/RoomTime/TimePlaceholder";
import ScheduleCheckbox from "../components/Schedule/ScheduleCheckbox";
import Button from "../components/Button";
import { axiosInstance } from "../atoms/config";

import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { Dropdown } from "flowbite-react";
import { notifyError } from "../atoms/notification";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

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
  const [formattedSchedules, setFormattedSchedules] = useState([]);
  const [update, setUpdate] = useState("");
  const [currentDays, setCurrentDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooLongReq, setTooLongReq] = useState(false);
  const [currentLabel, setCurrentLabel] = useState({
    day: "All",
    start: 1,
    end: 72,
  });
  const dateList = [
    {
      day: "All",
      start: 1,
      end: 72,
    },
    {
      day: "Senin",
      start: 1,
      end: 12,
    },
    {
      day: "Selasa",
      start: 13,
      end: 24,
    },
    {
      day: "Rabu",
      start: 25,
      end: 36,
    },
    {
      day: "Kamis",
      start: 37,
      end: 48,
    },
    {
      day: "Jumat",
      start: 49,
      end: 60,
    },
    {
      day: "Sabtu",
      start: 61,
      end: 72,
    },
  ];

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

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

  //Getting the data
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
          axiosInstance.get(`${URL}room`),
          axiosInstance.get(`${URL}room_time_helper/${acyear}`),
          axiosInstance.get(`${URL}lecturer_plot/${acyear}`),
          axiosInstance.get(`${URL}room_time/${acyear}`),
          axiosInstance.get(`${URL}schedule/${acyear}`),
          axiosInstance.get(`${URL}schedule/formatted/${acyear}`),
        ]);
        setRooms(roomResponse.data.data);
        setNormalRoomTimeHelper(helperResponse.data.data);
        setSubClass(plotResponse.data.data);
        setRoomTime(timeResponse.data.data);
        setSchedules(scheduleResponse.data.data);
        setFormattedSchedules(formattedSchedulesResponse.data.data);
      } catch (err) {
        notifyError(err);
        setTooLongReq(true);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    })();
  }, [update, acyear, URL]);

  //Merging and filtering data
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

  //Export data ke Excel format
  function handleExport(jsonData) {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(data, "data.xlsx");
  }

  // Formating roomtimes data to manageable array
  function assignRoom(roomdata, start, end) {
    let finalArrRooms = [];
    //TODO : This code just blindly take range of data, then assign it to the
    //       coresponding array.
    //TODO : Make checking for each id.
    // For dividing data to 6 days
    for (let i = start; i < end; i = i + 12) {
      let arrDays = roomdata.filter(
        (item) => item.time_id > i && item.time_id <= i + 12
      );
      let arrRooms = [];
      // For setting the data into 8 rooms, 12 session each
      for (let j = 0; j < arrDays.length; j = j + 12) {
        arrRooms.push(arrDays.slice(j, j + 12));
      }
      //Push to make final array
      if (arrRooms.length != 0) {
        finalArrRooms.push(arrRooms);
      }
    }
    return finalArrRooms;
  }

  //Search Logic
  useEffect(() => {
    setCurrentSubClass(
      subClass.filter((item) =>
        item.sub_classes_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [subClass, searchQuery]);

  //Mapping schedule by filterring the data to be addedd to the checkbox.
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
        item.time_id === session.time_id &&
        item.room_id === session.room_id &&
        item.academic_year_id === session.academic_year_id
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
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(data, "data.xlsx");
  }

  if (tooLongReq) {
    return <Error type="reload" message="Too long request. Please try again" />;
  } else {
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

          {/* Table */}
          <table className="relative border-collapse w-full text-sm text-gray-500 overflow-x-auto">
            <thead className="text-gray-700/50 bg-gray-50">
              <tr className="sticky top-0">
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
                  <td className="border-b border-r w-20 pt-6 text-center align-top font-medium text-gray-900">
                    {currentDays[index]}
                  </td>

                  {/* Time Column */}
                  <td className="border-b font-medium text-gray-900 w-max flex flex-col">
                    {sessions.map((session) => (
                      <div className="px-1 h-20 py-4 text-center">
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
        </div>
      </div>
    );
  }
}
