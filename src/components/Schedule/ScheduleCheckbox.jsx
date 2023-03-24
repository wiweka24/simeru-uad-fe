import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";

import Button from "../Button";
import Spinner from "../../atoms/Spinner";
import { axiosInstance } from "../../atoms/config";
import { notifySucces, scheduleError } from "../../atoms/notification";

import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

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
  const [colorPalette, setColorPalette] = useState();
  const [loading, setLoading] = useState(false);

  const colorList = [
    "red-400",
    "green-400",
    "indigo-400",
    "cyan-400",
    "lime-400",
    "pink-400",
  ];
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sessions = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Setting up cursor click able checkbox
  useEffect(() => {
    setSubClass(occupiedSchedule);

    if (occupiedSchedule) {
      setCursorMode("cursor-not-allowed pointer-events-none");
      setColorPalette(occupiedSchedule.color_data);
    } else {
      setCursorMode("cursor-pointer");
    }
  }, [occupiedSchedule]);

  // Add Data
  async function postData(obj) {
    try {
      const res = await axiosInstance.post(
        "https://dev.bekisar.net/api/v1/schedule",
        {
          data: [
            {
              lecturer_plot_id: Number(obj.lecturer_plot_id),
              room_time_id: obj.room_time_id,
              academic_year_id: Number(obj.academic_year_id),
              color_data: colorPalette || "white",
            },
          ],
        }
      );
      setModalShow(false);
      onChange();
      notifySucces("Dosen Pengampu Berhasil Ditambahkan");
    } catch (err) {
      scheduleError(err);
    } finally {
      setLoading(false);
    }
  }

  // Delete data
  async function deleteBtAction(obj) {
    if (occupiedSchedule) {
      try {
        await axiosInstance.delete("https://dev.bekisar.net/api/v1/schedule", {
          data: {
            data: [
              {
                lecturer_plot_id: Number(obj.lecturer_plot_id),
                room_time_id: obj.room_time_id,
                academic_year_id: Number(obj.academic_year_id),
              },
            ],
          },
        });

        setColorPalette();
        onChange();
        notifySucces("Dosen Pengampu Berhasil Dihapus");
      } catch (err) {
        scheduleError(err);
      } finally {
        setLoading(false);
      }
    } else {
      // if data not id db yet, reset state
      setSubClass();
    }
  }

  //Resetting State when modal get closed
  function closeModal() {
    if (occupiedSchedule) {
      setSubClass(occupiedSchedule);
      setColorPalette(occupiedSchedule.color_data);
    } else {
      setSubClass();
      setColorPalette();
    }
    setModalShow(false);
  }

  function getTimeRoomName(time_id) {
    const matchingRoom = room.find((item) => item.room_id == time_id);
    return matchingRoom ? matchingRoom.name : null;
  }

  return (
    <>
      {/* Checkbox shape and content */}
      <label
        className={`relative w-full border-b border-collapse h-20 cursor-pointer bg-${
          occupiedSchedule ? occupiedSchedule.color_data : "grey"
        } overflow-hidden`}
      >
        <input
          className="sr-only"
          onClick={() => {
            setModalShow(true);
          }}
        />
        <div className="m-0 p-0 w-full h-full flex items-center justify-center bg-gray-200x">
          {occupiedSchedule ? (
            <div className="p-1 text-center break-all text-xs">
              <b>
                <p className="mb-1">{occupiedSchedule.sub_class_name}</p>
              </b>
              <p className="mb-1">{occupiedSchedule.lecturer_name}</p>
              <p className="mb-1">
                Semester {occupiedSchedule.sub_class_credit}
              </p>
            </div>
          ) : (
            <PlusCircleIcon className="h-5 hover:text-green-600 hover:h-7 duration-100" />
          )}
        </div>
      </label>

      {/* PopUp Modal */}
      <Modal className="h-96" show={modalShow} onClose={closeModal}>
        <Modal.Header>
          {days[Math.ceil(time.time_id / 12) - 1]},{" "}
          {sessions[(Number(time.time_id) + 11) % 12]}, Ruang{" "}
          {getTimeRoomName(time.room_id)}
        </Modal.Header>

        <Modal.Body className=" ">
          <div className="mb-4">
            {/* Loading Screen */}
            <Spinner isLoading={loading} />
            <b>
              <h3>Mata Kuliah</h3>
            </b>
            {subClass ? (
              <>
                <div
                  className={`flex border w-full rounded-lg my-1 py-2 px-4 justify-between align-middle bg-${
                    colorPalette || "white"
                  }`}
                >
                  <div>
                    <b>
                      {subClass.sub_classes_name || subClass.sub_class_name}
                    </b>
                    <br />
                    {subClass.lecturer_name}
                  </div>
                  <Button
                    text="❌"
                    color="danger"
                    onClick={() => {
                      if (occupiedSchedule) {
                        setLoading(true);
                        deleteBtAction(Object.assign(subClass, time));
                      } else {
                        setSubClass();
                      }
                      setColorPalette();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  {colorList.map((color) => (
                    <button
                      className={`border mr-1 rounded-full h-8 w-8 bg-${color}`}
                      onClick={() => setColorPalette(color)}
                    />
                  ))}
                </div>
              </>
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
          <Button text="Tutup" color="danger" onClick={closeModal} />
        </Modal.Footer>
      </Modal>
    </>
  );
}
