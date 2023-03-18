import { useState } from "react";

import {
  UserIcon,
  BookOpenIcon,
  HomeIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import Button from "./Button";
import { useEffect } from "react";
import { notifyError, notifySucces } from "../atoms/notification";
import { axiosInstance } from "../atoms/config";
import { Modal } from "flowbite-react";

export default function Sidebar({ getAcadYearValue, acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
  const [activePage, setActivePage] = useState("/");
  const [academicYear, setAcademicYear] = useState([]);
  const [update, setUpdate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const acyear_string = `${acyear.start_year}/${acyear.end_year}(${
    Number(acyear.semester) + 1
  })`;
  const defaultInput = {
    start_year: "",
    end_year: "",
    semester: 0,
  };
  const [input, setInput] = useState(defaultInput);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`${URL}academic_year`);
        const sortedAcademicYear = res.data.data.sort((a, b) => {
          if (a.start_year === b.start_year) {
            return a.semester - b.semester;
          }
          return a.start_year - b.start_year;
        });
        setAcademicYear(sortedAcademicYear);
      } catch (err) {
        notifyError(err);
      }
    })();
  }, [update]);
  useEffect(() => {
    (async () => {
      try {
        const currentTime = new Date();
        const month = currentTime.getMonth();
        const sems = month > 5 ? 0 : 1;
        const year = currentTime.getFullYear() - 1;

        const res = await axiosInstance.get(`${URL}academic_year`);
        const filtered = res.data.data.find(
          (item) => item.start_year == year && item.semester == sems
        );

        if (filtered) {
          getAcadYearValue(filtered);
        } else {
          getAcadYearValue(res.data.data[0]);
        }
      } catch (err) {
        notifyError(err);
        getAcadYearValue({
          start_year: 2022,
          end_year: 2023,
          semester: 1,
          academic_year_id: 1,
        });
      }
    })();
  }, []);

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

  function SidebarTitle({ text }) {
    return <div className='text-grey font-bold ml-3 py-2'>{text}</div>;
  }

  function SidebarLink({ Icon, text, linkto }) {
    return (
      <Link
        to={linkto}
        className={`text-grey flex items-center justify-start text-md space-x-3 hoverAnimation ${
          activePage === linkto ? "font-semibold bg-gray-100" : "font-normal"
        }`}
        onClick={() => setActivePage(linkto)}
      >
        <Icon
          className={`w-5 h-5 min-h-full stroke-current ${
            activePage === linkto ? "stroke-[2.5px]" : "stroke-1.5px]"
          }`}
        />
        <span className='inline truncate'>{text}</span>
      </Link>
    );
  }

  async function postAcadYearTemplate() {
    try {
      await axiosInstance.post(`${URL}academic_year`, {
        start_year: input.start_year,
        end_year: input.end_year,
        semester: input.semester,
      });
      setInput(defaultInput);
      notifySucces("Tahun Ajaran Baru Berhasil Ditambahkab");
      rerender();
    } catch (err) {
      notifyError(err);
    }
  }

  function logoutCheck(e) {
    Swal.fire({
      html: `Anda yakin ingin keluar?`,
      toast: false,
      icon: "warning",
      iconColor: "#000000",
      showCancelButton: true,
      cancelButtonText: "Tidak",
      cancelButtonColor: "#991b1b",
      confirmButtonText: "Ya",
      confirmButtonColor: "#16a34a",
      showClass: {
        popup: "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logoutSubmit(e);
      }
    });
  }

  async function logoutSubmit(e) {
    e.preventDefault();

    await axiosInstance.post(`${URL}logout`).then((res) => {
      if (res.status === 200) {
        localStorage.removeItem("auth_token");
        Swal.fire({
          html: `<b>${res.data.message}</b> tunggu...`,
          toast: true,
          width: 350,
          icon: "success",
          iconColor: "#16a34a",
          showConfirmButton: false,
          timer: 1500,
          showClass: {
            popup: "",
          },
        }).then(() => {
          window.location.href = `${CLIENT_URL}Login`;
        });
      }
    });
  }

  return (
    <div className='flex flex-col justify-between col-span-1 border-r'>
      <div>
        <div className='text-grey items-center px-2 mt-6 ml-3'>
          <div className='h-12 w-12 border rounded-full'>
            <img
              src='https://sbmptmu.id/wp-content/uploads/2022/03/Logo-UAD-Berwarna-1024x1024.png'
              alt=''
              className='p-1 rounded-full'
            />
          </div>
          <div className="py-4 leading-5">
            <h4 className="">Admin</h4>
            <p className="text-xl text-grey-dark font-bold">
              T.A. {acyear.start_year}/{acyear.end_year} <br />
              Semester {String(Number(acyear.semester) + 1)}
            </p>
          </div>
        </div>

        <div className='px-2'>
          <SidebarTitle text='Input Data' />
          <SidebarLink text='Matkul' Icon={BookOpenIcon} linkto='/MataKuliah' />
          <SidebarLink text='Dosen' Icon={UserIcon} linkto='/Dosen' />
          <SidebarLink text='Ruang Kelas' Icon={HomeIcon} linkto='/Ruangan' />

          <SidebarTitle text='Konfigurasi' />
          <SidebarLink
            text='Matkul Terselenggara'
            Icon={ClipboardDocumentCheckIcon}
            linkto='/MKTerselenggara'
          />
          <SidebarLink
            text='Dosen Matkul'
            Icon={IdentificationIcon}
            linkto='/DosenMatkul'
          />
          <SidebarLink
            text='Ruang Kelas dan Waktu'
            Icon={ClockIcon}
            linkto='/RuangWaktu'
          />

          <SidebarTitle text='Jadwal' />
          <SidebarLink
            text='Jadwal Matkul'
            linkto='/Jadwal'
            Icon={BookmarkIcon}
          />
          <div className="mt-4">
            <SidebarTitle text="Atur Tahun Ajaran" />
            <div className="pl-2 space-y-2">
              <Button
                text="Atur"
                color="dark"
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 mb-5'>
        <Button
          text={
            <div className='flex items-center'>
              <ArrowRightOnRectangleIcon className='h-5 mr-1' />
              Logout
            </div>
          }
          color='dark'
          onClick={logoutCheck}
        />
      </div>

      <Modal
        show={showModal}
        position="bottom-left"
        onClose={() => setShowModal(false)}
      >
        <Modal.Header>Atur Tahun Ajaran</Modal.Header>
        <Modal.Body>
          <div className="px-2 mb-5">
            <h2 className="text-lg font-semibold mb-2">Ganti Tahun Ajaran</h2>
            <Dropdown
              label={acyear_string}
              color="dark"
              outline="false"
              size="md"
              arrowPosition="right-end"
            >
              {academicYear.map((acadyear) => (
                <Dropdown.Item
                  key={acadyear.academic_year_id}
                  onClick={() => getAcadYearValue(acadyear)}
                >
                  {acadyear.start_year}/{acadyear.end_year}(
                  {String(Number(acadyear.semester) + 1)})
                </Dropdown.Item>
              ))}
            </Dropdown>
            <h2 className="mt-8 text-lg font-semibold mb-2">
              Tambah Tahun Ajaran
            </h2>
            <div className="flex flex-col space-y-3 items-start mb-4">
              <div className="w-full flex flex-col md:flex-row md:space-x-3">
                <label htmlFor="start-year-input" className="w-full max-w-xs">
                  <h3 className="text-md font-medium mb-1">Tahun Mulai:</h3>
                  <input
                    id="start-year-input"
                    type="text"
                    pattern="\d*"
                    maxLength="4"
                    placeholder="YYYY"
                    value={input["start_year"]}
                    className="border border-gray-300 rounded-lg p-2 w-full mt-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                      setInput({
                        ...input,
                        start_year: Number(e.target.value),
                        end_year: Number(e.target.value) + 1,
                      })
                    }
                  />
                </label>
                <p className="pt-10">-</p>
                <label htmlFor="end-year-input" className="w-full max-w-xs">
                  <h3 className="text-md font-medium mb-1">Tahun Akhir:</h3>
                  <input
                    id="end-year-input"
                    type="text"
                    pattern="\d*"
                    maxLength="4"
                    placeholder="YYYY"
                    value={input["end_year"]}
                    className="border border-gray-300 rounded-lg p-2 w-full mt-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                      setInput({
                        ...input,
                        start_year: Number(e.target.value) - 1,
                        end_year: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
              <h3 className="text-md font-medium mb-1">Semester:</h3>
              <div className="flex items-center space-x-3">
                <input
                  id="ganjil-radio"
                  type="radio"
                  name="semester-radio"
                  value="0"
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  onChange={(e) =>
                    setInput({ ...input, semester: parseInt(e.target.value) })
                  }
                  checked={input.semester === 0}
                />
                <label
                  htmlFor="ganjil-radio"
                  className="ml-2 text-md font-medium text-gray-900"
                >
                  Ganjil
                </label>
                <input
                  id="genap-radio"
                  type="radio"
                  name="semester-radio"
                  value="1"
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  onChange={(e) =>
                    setInput({ ...input, semester: parseInt(e.target.value) })
                  }
                  checked={input.semester === 1}
                />
                <label
                  htmlFor="genap-radio"
                  className="ml-2 text-md font-medium text-gray-900"
                >
                  Genap
                </label>
              </div>
            </div>
            <Button
              text={
                <div className="flex items-center">
                  <DocumentPlusIcon className="h-5 mr-2" />
                  Tambah
                </div>
              }
              color="dark"
              onClick={postAcadYearTemplate}
              className="mt-6"
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
