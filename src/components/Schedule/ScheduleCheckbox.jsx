import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";

import { axiosInstance } from "../../atoms/config";
import Button from "../Button";
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function ScheduleCheckbox({ time, room, availableClass }) {
  const [modalShow, setModalShow] = useState(false);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sessions = [
    "07:00 - 09:00",
    "10:00 - 12:00",
    "13:00 - 15:00",
    "16:00 - 18:00",
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [subClass, setSubClass] = useState([]);

  // console.log(time);

  const postData = (obj) => {
    (async () => {
      // try {
      //   const res = await axiosInstance.post(
      //     "https://dev.bekisar.net/api/v1/schedule",
      //     {
      //       data: [
      //         {
      //           lecturer_plot_id: obj.lecturer_plot_id,
      //           room_time_id: 13,
      //           academic_year_id: 1,
      //         },
      //       ],
      //     }
      //   );
      // } catch (err) {
      //   console.log(err);
      // }
    })();
  };

  return (
    <>
      <label className="z-0 relative border-b border-collapse h-40 w-full cursor-pointer bg-white">
        {/* <input className="sr-only" onClick={() => setModalShow(true)} />
        <div className="w-full h-full flex items-center justify-center bg-gray-200x peer-focus:ring-4 peer-focus:ring-grey-dark dark:peer-focus:ring-yellow-800  peer-checked:after:border-white after:content-[''] after:bg-white after:border-gray-300 peer-checked:bg-grey-dark">
          <PlusCircleIcon className="h-5 hover:text-green-600 hover:h-7 duration-100" />
        </div> */}
      </label>

      <Modal
        className="h-96"
        show={modalShow}
        onClose={() => setModalShow(false)}
      >
        <Modal.Header>
          {days[Math.ceil(time.time_id / 4) - 1]},{" "}
          {sessions[(Number(time.time_id) + 3) % 4]}, Ruang{" "}
          {room[time.room_id - 1].name}
        </Modal.Header>

        <Modal.Body className=" ">
          <div className="mb-4">
            <b>
              <h3>Mata Kuliah</h3>
            </b>
            {subClass.toString() !== [].toString() ? (
              <div className="flex border w-full text-left rounded-lg my-1 py-2 px-4 bg-grey-light justify-between">
                <div>
                  <b>{subClass.sub_classes_name}</b>
                  <br />
                  {subClass.lecturer_name}
                </div>
                <Button
                  text="x"
                  color="danger"
                  onClick={() => setSubClass([])}
                />
              </div>
            ) : (
              <p className="text-red-600">* Pilih Mata Kuliah</p>
            )}
          </div>

          <b className="">
            <h3 className="pb-2">Pilih / Ganti Matkul</h3>
          </b>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5" />
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2 pl-10 text-sm border-2 rounded-lg w-full bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
              placeholder="Cari Item"
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
          </div>

          {/* Class Input */}
          <div className="border-2 rounded-lg p-2 h-64 overflow-y-scroll">
            {availableClass.map((classes) => (
              <button
                onClick={() => setSubClass(classes)}
                className="border w-full text-left rounded-lg my-1 py-2 px-4 bg-grey-light cursor-pointer "
              >
                <b>{classes.sub_classes_name}</b>
                <br />
                {classes.lecturer_name}
              </button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            text="Tambah"
            color="succes"
            onClick={() => postData(subClass)}
          />
          <Button
            text="Tutup"
            color="danger"
            onClick={() => setModalShow(false)}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}
