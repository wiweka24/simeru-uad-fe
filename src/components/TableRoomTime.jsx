import React, { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../atoms/config";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Dropdown } from "flowbite-react";
import TimePlaceholder from "./TimePlaceholder";
import Checkbox from "./Checkbox";

export default function TableSubClassTime() {
  const [rooms, setRooms] = useState([]);
  const [roomtimes, setRoomTimes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("dummy_data/room.json");
        const res1 = await axiosInstance.get("dummy_data/roomtime.json");
        setRooms(res.data.data);
        setRoomTimes(assignRoom(res.data.data.length, res1.data.data));
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  // Formating roomtimes data to manageable array
  function assignRoom(length, roomdata) {
    let finalArrRooms = [];
    // todo : make i to min value of room_id, and i to length + max value
    // todo : what if the room sparse, ex. 1,4,17,19 => how to handle?
    for (let i = 0; i < length; i++) {
      let tempArrRooms = roomdata.filter((item) => item.room_id === i + 1);
      let rdTempArrRooms = [];
      for (let j = 0; j < tempArrRooms.length; j = j + 4) {
        rdTempArrRooms.push(tempArrRooms.slice(j, j + 4));
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

  return (
    <div className="relative">
      {/* Search */}
      <nav className="mx-8 flex mb-3 items-center justify-between">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5" />
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 text-sm border-2 rounded-lg w-60 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
            placeholder="Search for items"
          />
        </div>
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
          {roomtimes.map((room, index) => (
            <tr className="bg-white border-b">
              <td className="pl-5 pr-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                {rooms[index].name}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-start flex-col space-y-4">
                  <TimePlaceholder text="07:00-09:00" number="1" />
                  <TimePlaceholder text="09:00-12:00" number="2" />
                  <TimePlaceholder text="12:00-15:00" number="3" />
                  <TimePlaceholder text="15:00-18:00" number="4" />
                </div>
              </td>
              {room.map((session) => (
                <td className="px-6 py-5 ">
                  <div className="mt-1 flex items-start flex-col space-y-11">
                    {session.map((time) =>
                      time.is_occupied === 0 ? (
                        <Checkbox
                          roomTimeId={time.room_time_id}
                          value={time.time_id}
                        />
                      ) : (
                        <Checkbox
                          isChecked={true}
                          roomTimeId={time.room_time_id}
                          value={time.time_id}
                        />
                      )
                    )}
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
  );
}
