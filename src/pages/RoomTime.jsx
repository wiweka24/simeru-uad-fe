import { useState, useEffect } from "react";

import { Dropdown } from "flowbite-react";

import Spinner from "../atoms/Spinner";
import Button from "../components/Button";
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
  const [currentLabel, setCurrentLabel] = useState({
    name: "All",
    room_id: 0,
  });
  const [loading, setLoading] = useState(true);

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`${URL}room`);
        setRooms(res.data.data);

        const res1 = await axiosInstance.get(
          `${URL}room_time_helper/${acyear}`
        );
        setRoomtimes(res1.data.data);

        setTimeout(() => {
          setLoading(false);
        }, 500);
        
      } catch (err) {
        notifyError(err);
      }
    })();
  }, [URL, update]);

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

  console.log(currentRoomtimes);

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
    // console.log(finalArrRooms);
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

  async function checkAllSession(obj) {
    // console.log(obj);
    let sendData = [];
    for (let rooms of obj) {
      for (let days of rooms) {
        for (let session of days) {
          // console.log(session);
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

  async function unCheckAllSession(obj) {
    // console.log(obj);
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
              text='Pilih Semua'
              color='dark'
              color1='succes'
              onClick={() => checkAllSession(currentRoomtimes)}
            />
            <Button
              text='Batalkan Semua'
              color='dark'
              color1='danger'
              onClick={() => unCheckAllSession(currentRoomtimes)}
            />
          </div>
        </nav>

        {/* Table */}
        <table className='relative w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className=''>
            <tr className='border-y text-gray-700/50 '>
              <th className='sticky top-0 text-center py-3 bg-gray-50'>
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
              <tr className='bg-white border-b'>
                <td className='text-center font-medium text-gray-900 whitespace-nowrap'>
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
