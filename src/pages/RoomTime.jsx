import { useState, useEffect } from "react";

import { Dropdown } from "flowbite-react";

import Spinner from "../atoms/Spinner";
import Button from "../components/Button";
import Error from "./Error";
import Checkbox from "../components/RoomTime/Checkbox";
import TimePlaceholder from "../components/RoomTime/TimePlaceholder";
import { notifyError } from "../atoms/notification";
import { axiosInstance } from "../atoms/config";

export default function RoomTime({ acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const [rooms, setRooms] = useState([]);
  const [roomtimes, setRoomtimes] = useState([]);
  const [currentRoomtimes, setCurrentRoomtimes] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [roomsLabel, setRoomsLabel] = useState([]);
  const [update, setUpdate] = useState("");
  const [loading, setLoading] = useState(true);
  const [tooLongReq, setTooLongReq] = useState(false);
  const [currentLabel, setCurrentLabel] = useState({
    name: "All",
    room_id: 0,
  });

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

  //Getting the data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [roomRes, roomtimehelperRes] = await Promise.all([
          axiosInstance.get(`${URL}room`),
          axiosInstance.get(`${URL}room_time_helper/${acyear}`),
        ]);

        setRooms(roomRes.data.data);
        setRoomtimes(roomtimehelperRes.data.data);
      } catch (err) {
        // setTooLongReq(true);
        notifyError(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    })();
  }, [update, acyear]);

  //For adding "all room" mode of sorting
  useEffect(() => {
    const extraRoom = {
      room_id: 0,
      name: "All",
      quota: 1,
    };
    const newRoom = [extraRoom, ...rooms];
    setRoomList(newRoom);
  }, [rooms]);

  //For filltering the Roomtime
  useEffect(() => {
    if (currentLabel.name !== "All") {
      setCurrentRoomtimes(
        assignRoom(
          roomtimes.filter((item) => item.room_id == currentLabel.room_id)
        )
      );
      setRoomsLabel([currentLabel]);
    } else {
      setCurrentRoomtimes(assignRoom(roomtimes));
      setRoomsLabel(rooms);
    }
  }, [rooms, currentLabel, roomtimes]);

  // Formating roomtimes data to manageable array
  function assignRoom(roomdata) {
    let finalArrRooms = [];
    let fixArrRooms = [];

    for (let item of roomdata) {
      if (fixArrRooms[item.room_id]) {
        fixArrRooms[item.room_id].push(item);
      } else {
        fixArrRooms[item.room_id] = [item];
      }
    }

    for (let item of fixArrRooms) {
      if (item) {
        let rdTempArrRooms = [];
        for (let j = 0; j < item.length; j = j + 12) {
          rdTempArrRooms.push(item.slice(j, j + 12));
        }
        if (rdTempArrRooms != 0) {
          finalArrRooms.push(rdTempArrRooms);
        }
      }
    }
    return finalArrRooms;
  }

  //For checking all roomtime available session
  async function checkAllSession(obj) {
    let sendData = [];
    for (let rooms of obj) {
      for (let days of rooms) {
        for (let session of days) {
          if (session.is_possible === "0") {
            sendData.push({
              room_id: session.room_id,
              time_id: session.time_id,
              academic_year_id: session.academic_year_id,
            });
          }
        }
      }
    }
    try {
      await axiosInstance.post(URL, {
        data: sendData,
      });
      rerender();
    } catch (err) {
      notifyError(err);
    }
  }

  //For unchecking all roomtime that is checked
  async function unCheckAllSession(obj) {
    // Filter session that is checked
    let sendData = [];
    for (let rooms of obj) {
      for (let days of rooms) {
        for (let session of days) {
          // console.log(session);
          if (session.is_possible === "1") {
            sendData.push({
              room_id: session.room_id,
              time_id: session.time_id,
              academic_year_id: session.academic_year_id,
            });
          }
        }
      }
    }

    try {
      await axiosInstance.delete(URL, {
        data: {
          data: sendData,
        },
      });
      rerender();
    } catch (err) {
      notifyError(err);
    }
  }

  if (tooLongReq) {
    return <Error type="reload" message="Too long request. Please try again" />;
  } else {
    return (
      <div className="relative">
        <Spinner isLoading={loading} />
        <div className="h-10 border-b bg-white" />
        <div className=" py-7 m-10 border-2 rounded-lg bg-white">
          <p className="px-7 mb-5 text-xl font-bold">Ruang Kelas Tersedia</p>
          {/* Dropdown */}
          <nav className="mx-8 grid mb-3 grid-flow-col">
            <Dropdown
              label={currentLabel.name}
              color="dark"
              outline="true"
              className="bg-grey-light"
              size="sm"
            >
              {roomList.map((room) => (
                <Dropdown.Item onClick={() => setCurrentLabel(room)}>
                  {room.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
            <div className="justify-self-end grid grid-flow-col gap-4">
              <Button
                text="select all"
                color="dark"
                onClick={() => checkAllSession(currentRoomtimes)}
              />
              <Button
                text="unselect all"
                color="dark"
                onClick={() => unCheckAllSession(currentRoomtimes)}
              />
            </div>
          </nav>

          {/* Table */}
          <table className="relative w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="">
              <tr className="sticky top-0 border-y text-gray-700/50 ">
                <th className="text-center py-3 bg-gray-50">Ruang Kelas</th>
                <th className="pl-5 bg-gray-50">Sesi</th>
                <th className="pl-4 bg-gray-50">Senin</th>
                <th className="pl-4 bg-gray-50">Selasa</th>
                <th className="pl-4 bg-gray-50">Rabu</th>
                <th className="pl-4 bg-gray-50">Kamis</th>
                <th className="pl-4 bg-gray-50">Jumat</th>
                <th className="pl-4 bg-gray-50">Sabtu</th>
              </tr>
            </thead>
            <tbody className="">
              {currentRoomtimes.map((room, index) => (
                <tr className="bg-white border-b">
                  <td className="text-center font-medium text-gray-900 whitespace-nowrap">
                    {roomsLabel[index].name}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-start flex-col space-y-4">
                      <TimePlaceholder text="07:00" number="1" />
                      <TimePlaceholder text="08:00" number="2" />
                      <TimePlaceholder text="09:00" number="3" />
                      <TimePlaceholder text="10:00" number="4" />
                      <TimePlaceholder text="11:00" number="5" />
                      <TimePlaceholder text="12:00" number="6" />
                      <TimePlaceholder text="13:00" number="7" />
                      <TimePlaceholder text="14:00" number="8" />
                      <TimePlaceholder text="15:00" number="9" />
                      <TimePlaceholder text="16:00" number="10" />
                      <TimePlaceholder text="17:00" number="11" />
                      <TimePlaceholder text="18:00" number="12" />
                    </div>
                  </td>
                  {room.map((session) => (
                    <td className="px-6 py-5 ">
                      <div className="mt-1 flex items-start flex-col space-y-11">
                        {session.map((time) => (
                          <Checkbox
                            value={time}
                            onChange={rerender}
                            setLoading={setLoading}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav
            className="mx-8 flex mt-3 items-center justify-between"
            aria-label="Table navigation"
          ></nav>
        </div>
      </div>
    );
  }
}
