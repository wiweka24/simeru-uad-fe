import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";

import { axiosInstance } from "../../atoms/config";
import Button from "../Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function ScheduleCheckbox({ time, room, availableClass }) {
  const [modalShow, setModalShow] = useState(false);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sessions = [
    "07:00 - 09:00",
    "10:00 - 12:00",
    "13:00 - 15:00",
    "16:00 - 18:00",
  ];

  return (
    <>
      <label className="relative border-b border-collapse h-40 w-full cursor-pointer bg-white">
        <input className="sr-only" onClick={() => setModalShow(true)}/>
        <div className="w-full h-full flex items-center justify-center bg-gray-200x peer-focus:ring-4 peer-focus:ring-grey-dark dark:peer-focus:ring-yellow-800  peer-checked:after:border-white after:content-[''] after:bg-white after:border-gray-300 peer-checked:bg-grey-dark">
          <PlusCircleIcon className="h-5 hover:text-green-600 hover:h-7 duration-100"/>
        </div>
      </label>

      <Modal show={modalShow} onClose={() => setModalShow(false)}>
        <Modal.Header>
          {days[Math.ceil(time.time_id / 4) - 1]},{" "}
          {sessions[(Number(time.time_id) + 3) % 4]}, Ruang{" "}
          {room[time.room_id - 1].name}
        </Modal.Header>
        <Modal.Body>
          {availableClass.map((classes) => (
            <button className="border w-full text-left rounded-lg my-1 py-2 px-4 bg-grey-light cursor-pointer">
              <b>{classes.sub_classes_name}</b>
              <br />
              {classes.lecturer_name}
            </button>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button text="Tambah" color="succes" />
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
