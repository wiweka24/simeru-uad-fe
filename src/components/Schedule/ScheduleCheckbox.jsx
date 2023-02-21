import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";

import { axiosInstance } from "../../atoms/config";
import Button from "../Button";
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { notifyError, notifySucces } from "../../atoms/notification";
import Spinner from "../../atoms/Spinner";

export default function ScheduleCheckbox({
  time,
  room,
  availableClass,
  setSearchQuery,
  occupiedSchedule,
  onChange,
}) {
  const [modalShow, setModalShow] = useState(false);
  const [subClass, setSubClass] = useState();
  const [cursorMode, setCursorMode] = useState("cursor-pointer");

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sessions = [
    "07:00 - 09:00",
    "10:00 - 12:00",
    "13:00 - 15:00",
    "16:00 - 18:00",
  ];

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSubClass(occupiedSchedule);

    occupiedSchedule
      ? setCursorMode("pointer-events-none cursor-not-allowed ")
      : setCursorMode("cursor-pointer");
  }, [occupiedSchedule]);

  // Add Data
  async function postData(obj) {
    try {
      console.log(obj);
      const res = await axiosInstance.post(
        "https://dev.bekisar.net/api/v1/schedule",
        {
          data: [
            {
              lecturer_plot_id: Number(obj.lecturer_plot_id),
              room_time_id: obj.room_time_id,
              academic_year_id: Number(obj.academic_year_id),
            },
          ],
        }
      );
      setModalShow(false);
      setLoading(false);
      onChange();
      notifySucces("Dosen Pengampu Berhasil Ditambahkan");
    } catch (err) {
      notifyError(err);
    }
  }

  // Delete data
  async function deleteBtAction(obj) {
    if (occupiedSchedule) {
      try {
        const res = await axiosInstance.delete(
          "https://dev.bekisar.net/api/v1/schedule",
          {
            data: {
              data: [
                {
                  lecturer_plot_id: Number(obj.lecturer_plot_id),
                  room_time_id: obj.room_time_id,
                  academic_year_id: Number(obj.academic_year_id),
                },
              ],
            },
          }
        );
        // setModalShow(false);
        setLoading(false);
        onChange();
        notifySucces("Dosen Pengampu Berhasil Dihapus");
      } catch (err) {
        notifyError(err);
      }
    } else {
      setSubClass();
    }
  }

  return (
    <>
      <label className="relative w-full border-b border-collapse h-40 cursor-pointer bg-white">
        <input className="sr-only" onClick={() => setModalShow(true)} />
        <div className="m-0 p-0 w-full h-full flex items-center justify-center bg-gray-200x peer-focus:ring-4 peer-focus:ring-grey-dark  peer-checked:after:border-white after:content-[''] after:bg-white after:border-gray-300 peer-checked:bg-grey-dark">
          {occupiedSchedule ? (
            <div className="p-1 text-center break-all text-xs">
              <b>
                <p className="mb-2">{occupiedSchedule.sub_class_name}</p>
              </b>
              <p className="mb-2">{occupiedSchedule.lecturer_name}</p>
              <p className="mb-2">
                Semester {occupiedSchedule.sub_class_credit}
              </p>
            </div>
          ) : (
            <PlusCircleIcon className="h-5 hover:text-green-600 hover:h-7 duration-100" />
          )}
        </div>
      </label>

      <Modal
        className="h-96"
        show={modalShow}
        onClose={() => {
          occupiedSchedule ? setSubClass(occupiedSchedule) : setSubClass();
          setModalShow(false);
        }}
      >
        <Modal.Header>
          {days[Math.ceil(time.time_id / 4) - 1]},{" "}
          {sessions[(Number(time.time_id) + 3) % 4]}, Ruang{" "}
          {room[time.room_id - 1].name}
        </Modal.Header>

        <Modal.Body className=" ">
          <div className="mb-4">
            {/* Loading Screen */}
            <Spinner isLoading={loading} />
            <b>
              <h3>Mata Kuliah</h3>
            </b>
            {subClass ? (
              <div className="flex border w-full text-left rounded-lg my-1 py-2 px-4 bg-grey-light justify-between">
                <div>
                  <b>{subClass.sub_classes_name || subClass.sub_class_name}</b>
                  <br />
                  {subClass.lecturer_name}
                </div>
                <Button
                  text="❌"
                  color="danger"
                  onClick={() => {
                    setLoading(true);
                    deleteBtAction(Object.assign(subClass, time));
                  }}
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
            {availableClass.map((classes) =>
              classes.is_held === "0" ? (
                <button
                  onClick={() => setSubClass(classes)}
                  className={`border w-full text-left rounded-lg my-1 py-2 px-4 bg-grey-light ${cursorMode}`}
                >
                  <b>{classes.sub_classes_name}</b>
                  <br />
                  {classes.lecturer_name}
                </button>
              ) : (
                <></>
              )
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            text="Tambah"
            color="succes"
            onClick={() => {
              setLoading(true);
              postData(Object.assign(subClass, time));
            }}
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
