import { useState, useEffect } from "react";
import { axiosInstance } from "../../atoms/config";
import { Modal } from "flowbite-react";
import Button from "../Button";

export default function ScheduleCheckbox({ value }) {
  const [isCheck, setIsCheck] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <label className="relative h-[10rem] border items-center w-full cursor-pointer">
        <input
          value=""
          className="sr-only peer"
          onClick={() => setModalShow(true)}
        ></input>
        <div className="w-full h-full bg-gray-200x peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800  peer-checked:after:border-white after:content-[''] after:bg-white after:border-gray-300 peer-checked:bg-yellow-400"></div>
      </label>

      <Modal show={modalShow} onClose={() => setModalShow(false)}>
        <Modal.Header>Isi Jadwal</Modal.Header>
        <Modal.Body></Modal.Body>
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
