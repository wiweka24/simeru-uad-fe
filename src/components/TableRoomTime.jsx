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
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);

  const [rooms, setRooms] = useState([]);
  const [roomtimes, setRoomTimes] = useState([]);

  const indexOfLastSubClass = currentPage * postsPerPage;
  const indexOfFirstSubClass = indexOfLastSubClass - postsPerPage;
  const currentRooms = rooms.slice(indexOfFirstSubClass, indexOfLastSubClass);
  const totalPages = Math.ceil(rooms.length / postsPerPage);

  const pageNumber = ["10", "25", "50", "100"];

  const daysDivider = [
    {
      start: 0,
      end: 4,
    },
    {
      start: 4,
      end: 8,
    },
    {
      start: 8,
      end: 12,
    },
    {
      start: 12,
      end: 16,
    },
    {
      start: 16,
      end: 20,
    },
    {
      start: 20,
      end: 24,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("dummy_data/room.json");
        setRooms(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("dummy_data/roomtime.json");
        setRoomTimes(assignRoom(res.data.data));
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  function assignRoom(roomTime) {
    // console.log(roomTime.filter((item) => item.room_id === 1));
    const arrRooms = [];
    for (let i = 0; i < rooms.length(); i++) {
      arrRooms[i] = roomTime.filter((item) => item.room_id === i + 1);
    }
    return arrRooms;
  }

  function changePage(value) {
    if (value === "increment" && currentPage < totalPages) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage + 1);
    } else if (value === "decrement" && currentPage > 1) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage - 1);
    }
  }

  // roomtimes.map((item) => {
  // roomtimes[0].map((item2) => {
  //   console.log(item2.room_id);
  // });
  // });

  return (
    <div className="relative">
      {/* Search */}
      <nav className="mx-8 flex mb-3 items-center justify-between">
        <Dropdown
          label={postsPerPage}
          color="dark"
          outline="true"
          className="bg-grey-light"
        >
          {pageNumber.map((number) => (
            <Dropdown.Item onClick={() => setPostPerPage(number)}>
              {number}
            </Dropdown.Item>
          ))}
        </Dropdown>

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
          {roomtimes.map((room) => (
            <tr className="bg-white border-b">
              <td className="pl-5 pr-5 py-4 font-medium text-gray-900 whitespace-nowrap"></td>
              <td className="px-5 py-4">
                <div className="flex items-start flex-col space-y-4">
                  <TimePlaceholder text="07:00-09:00" number="1" />
                  <TimePlaceholder text="09:00-12:00" number="2" />
                  <TimePlaceholder text="12:00-15:00" number="3" />
                  <TimePlaceholder text="15:00-18:00" number="4" />
                </div>
              </td>
              {daysDivider.map((divider) => (
                <td className="px-6 py-5 ">
                  <div className="mt-1 flex items-start flex-col space-y-11">
                    {room
                      .slice(divider.start, divider.end)
                      .map((time) =>
                        time.time_id === 1 ? (
                          <Checkbox
                            isChecked={true}
                            classid={room.room_id}
                            value={0}
                          />
                        ) : time.time_id === 2 ? (
                          <Checkbox
                            classid={room.room_id}
                            value={1}
                            isChecked={true}
                          />
                        ) : time.time_id === 3 ? (
                          <Checkbox
                            classid={room.room_id}
                            value={2}
                            isChecked={true}
                          />
                        ) : time.time_id === 4 ? (
                          <Checkbox
                            classid={room.room_id}
                            value={3}
                            isChecked={true}
                          />
                        ) : (
                          <Checkbox classid={room.room_id} value={4} />
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
      >
        <span className="text-sm font-normal text-gray-500">
          Data
          <span className="font-semibold text-gray-900">
            {" "}
            {indexOfFirstSubClass + 1} - {indexOfLastSubClass}{" "}
          </span>
          dari
          <span className="font-semibold text-gray-900"> {rooms.length} </span>
        </span>

        <ul className="inline-flex items-center -space-x-px">
          <li>
            <a
              className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => changePage("decrement")}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5" />
            </a>
          </li>

          {/* Page Number - Stil Confused */}
          {/* <li>
            <a className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
          </li> */}

          <li>
            <a
              className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => changePage("increment")}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
