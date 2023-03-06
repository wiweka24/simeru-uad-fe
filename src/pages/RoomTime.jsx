import { useState, useEffect } from "react";

import { Dropdown } from "flowbite-react";

import Spinner from "../atoms/Spinner";
import Checkbox from "../components/RoomTime/Checkbox";
import TimePlaceholder from "../components/RoomTime/TimePlaceholder";
import { notifyError } from "../atoms/notification";
import { axiosInstance } from "../atoms/config";

export default function RoomTime() {
  const [rooms, setRooms] = useState([]);
  const [roomtimes, setRoomtimes] = useState([]);
  const [currentRoomtimes, setCurrentRoomtimes] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [roomsLabel, setRoomsLabel] = useState([]);
  const [update, setUpdate] = useState("");
  const [currentLabel, setCurrentLabel] = useState({
    name: "All",
    room_id: 0,
  });
  const [loading, setLoading] = useState(true);

  const rerender = () => {
    setUpdate(`update ${Math.random()}`);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/room"
        );
        setRooms(res.data.data);

        const res1 = await axiosInstance.get(
          "https://dev.bekisar.net/api/v1/room_time_helper"
        );
        setRoomtimes(res1.data.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        notifyError(err);
      }
    })();
  }, [update]);

  useEffect(() => {
    const extraRoom = {
      room_id: 0,
      name: "All",
      quota: 1,
    };
    const newRoom = [extraRoom, ...rooms];
    setRoomList(newRoom);
  }, [rooms]);

  useEffect(() => {
    if (currentLabel.name !== "All") {
      setCurrentRoomtimes(
        assignRoom(
          // todo : if class not only one
          currentLabel.room_id - 1,
          currentLabel.room_id,
          roomtimes.filter((item) =>
            item.room_id.includes(currentLabel.room_id)
          )
        )
      );
      setRoomsLabel([currentLabel]);
    } else {
      setCurrentRoomtimes(assignRoom(0, rooms.length, roomtimes));
      setRoomsLabel(rooms);
    }
  }, [rooms, currentLabel, roomtimes]);

  // console.log(currentRoomtimes);

  // Formating roomtimes data to manageable array
  function assignRoom(start, length, roomdata) {
    let finalArrRooms = [];
    // todo : make i to min value of room_id, and i to length + max value
    // todo : what if the room sparse, ex. 1,4,17,19 => how to handle? => save the each room id to array
    for (let i = start; i < length; i++) {
      let tempArrRooms = roomdata.filter((item) => item.room_id == i + 1);
      let rdTempArrRooms = [];
      for (let j = 0; j < tempArrRooms.length; j = j + 12) {
        rdTempArrRooms.push(tempArrRooms.slice(j, j + 12));
      }
      finalArrRooms.push(rdTempArrRooms);
    }
    console.log(finalArrRooms);
    return finalArrRooms;
  }

  // roomtimes.map((item) => {
  //   // console.log(roomtimes);
  //   // console.log(item);
  //   item.map((item2) => {
  //     // console.log(item2);
  //     item2.map((item3) => {
  //       console.log(item3);
  //     });
  //   });
  // });

  return (
    <div className="relative">
      <Spinner isLoading={loading} />
      <div className="h-10 border-b bg-white" />
      <div className=" py-7 m-10 border-2 rounded-lg bg-white">
        <p className="px-7 mb-5 text-xl font-bold">Ruang Kelas Tersedia</p>
        {/* Dropdown */}
        <nav className="mx-8 flex mb-3 items-center justify-between">
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
        </nav>

        {/* Table */}
        <table className="relative w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="">
            <tr className="border-y text-gray-700/50 ">
              <th className="sticky top-0 pl-6 px-6 py-3 bg-gray-50">
                Ruang Kelas
              </th>
              <th className="sticky top-0 pl-5 bg-gray-50">Sesi</th>
              <th className="sticky top-0 pl-4 bg-gray-50">Senin</th>
              <th className="sticky top-0 pl-4 bg-gray-50">Selasa</th>
              <th className="sticky top-0 pl-4 bg-gray-50">Rabu</th>
              <th className="sticky top-0 pl-4 bg-gray-50">Kamis</th>
              <th className="sticky top-0 pl-4 bg-gray-50">Jumat</th>
              <th className="sticky top-0 pl-4 bg-gray-50">Sabtu</th>
            </tr>
          </thead>
          <tbody className="">
            {currentRoomtimes.map((room, index) => (
              <tr className="bg-white border-b">
                <td className="text-center pr-10 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {roomsLabel[index].name}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-start flex-col space-y-4">
                    <TimePlaceholder text="07:00-09:00" number="1" />
                    <TimePlaceholder text="09:00-12:00" number="2" />
                    <TimePlaceholder text="12:00-15:00" number="3" />
                    <TimePlaceholder text="15:00-18:00" number="4" />
                    <TimePlaceholder text="15:00-18:00" number="5" />
                    <TimePlaceholder text="15:00-18:00" number="6" />
                    <TimePlaceholder text="15:00-18:00" number="7" />
                    <TimePlaceholder text="15:00-18:00" number="8" />
                    <TimePlaceholder text="15:00-18:00" number="9" />
                    <TimePlaceholder text="15:00-18:00" number="10" />
                    <TimePlaceholder text="15:00-18:00" number="11" />
                    <TimePlaceholder text="15:00-18:00" number="12" />
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
