import { useState, useEffect, useRef } from "react";
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
  const [room, setRoom] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(10);

  const [scrollClass, setScrollClass] = useState("");
  const elementRef = useRef("");

  const indexOfLastSubClass = currentPage * postsPerPage;
  const indexOfFirstSubClass = indexOfLastSubClass - postsPerPage;
  const currentRooms = room.slice(indexOfFirstSubClass, indexOfLastSubClass);
  const totalPages = Math.ceil(room.length / postsPerPage);

  const pageNumber = ["10", "25", "50", "100"];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setScrollClass("fixed ");
      } else {
        setScrollClass("");
      }
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("dummy_data/room.json");
        setRoom(res.data.data);
      } catch (err) {
        // catch here
      }
    })();
  }, []);

  function changePage(value) {
    if (value === "increment" && currentPage < totalPages) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage + 1);
    } else if (value === "decrement" && currentPage > 1) {
      setCurrentPage((previousCurrentPage) => previousCurrentPage - 1);
    }
  }

  return (
    <div className="relative overflow-x-auto">
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
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          ref={elementRef}
          className={`border-y text-gray-700/50 bg-gray-50 ${scrollClass}`}
        >
          <tr>
            <th scope="col" className="pl-8 pr-6 py-3">
              Ruang Kelas
            </th>
            <th scope="col" className="px-6 py-3">
              Jam
            </th>
            <th scope="col" className="px-6 py-3">
              Senin
            </th>
            <th scope="col" className="px-6 py-3">
              Selasa
            </th>
            <th scope="col" className="px-6 py-3">
              Rabu
            </th>
            <th scope="col" className="px-6 py-3">
              Kamis
            </th>
            <th scope="col" className="px-6 py-3">
              Jumat
            </th>
            <th scope="col" className="px-6 py-3">
              Sabtu
            </th>
          </tr>
        </thead>
        <tbody className="">
          {currentRooms.map((room) => (
            <tr key={room.room_id} className="bg-white border-b">
              <td className="pl-6 pr-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                {room.name}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-start flex-col space-y-4 divide-y">
                  <TimePlaceholder text="07:00-09:00" />
                  <TimePlaceholder text="09:00-12:00" />
                  <TimePlaceholder text="12:00-15:00" />
                  <TimePlaceholder text="15:00-18:00" />
                </div>
              </td>
              <td className="px-6 py-5 ">
                <div className="mt-1 flex items-start flex-col space-y-11">
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                </div>
              </td>
              <td className="px-6 py-5 ">
                <div className="mt-1 flex items-start flex-col space-y-11">
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                </div>
              </td>
              <td className="px-6 py-5 ">
                <div className="mt-1 flex items-start flex-col space-y-11">
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                </div>
              </td>
              <td className="px-6 py-5 ">
                <div className="mt-1 flex items-start flex-col space-y-11">
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                </div>
              </td>
              <td className="px-6 py-5 ">
                <div className="mt-1 flex items-start flex-col space-y-11">
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                </div>
              </td>
              <td className="px-6 py-5 ">
                <div className="mt-1 flex items-start flex-col space-y-11">
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                </div>
              </td>
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
          <span className="font-semibold text-gray-900"> {room.length} </span>
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
