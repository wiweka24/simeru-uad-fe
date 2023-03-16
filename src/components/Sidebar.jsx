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
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import Button from "./Button";
import { useEffect } from "react";
import { notifyError, notifySucces } from "../atoms/notification";
import { axiosInstance } from "../atoms/config";

export default function Sidebar({ getAcadYearValue, acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
  const [activePage, setActivePage] = useState("/");
  const [academicYear, setAcademicYear] = useState([]);
  const acyear_string = `${acyear.start_year}/${acyear.end_year}(${
    Number(acyear.semester) + 1
  })`;

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`${URL}academic_year`);
        setAcademicYear(res.data.data);
        console.log(res.data.data, "data acadyear");
        console.log(acyear, "ini acyear");
      } catch (err) {
        notifyError(err);
      }
    })();
  }, []);

  const defaultInput = {
    start_year: "",
    end_year: "",
    semester: 1,
  };
  const [input, setInput] = useState(defaultInput);

  const inputField = [
    {
      id: 1,
      placeholder: "Tahun Mulai",
      valuefor: "start_year",
      type: "number",
    },
    {
      id: 2,
      placeholder: "Tahun Akhir",
      valuefor: "end_year",
      type: "number",
    },
  ];

  function SidebarTitle({ text }) {
    return <div className="text-grey font-bold ml-3 py-2">{text}</div>;
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
        <span className="inline truncate">{text}</span>
      </Link>
    );
  }

  async function postAcadYearTemplate() {
    console.log("test");
    try {
      await axiosInstance.post(`${URL}academic_year`, {
        start_year: input.start_year,
        end_year: input.end_year,
        semester: input.semester,
      });
    } catch (err) {
      notifyError(err);
    }
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
    <div className="flex flex-col justify-between col-span-1 border-r">
      <div>
        <div className="text-grey items-center px-2 mt-6 ml-3">
          <div className="h-12 w-12 border rounded-full">
            <img
              src="https://sbmptmu.id/wp-content/uploads/2022/03/Logo-UAD-Berwarna-1024x1024.png"
              alt=""
              className="p-1 rounded-full"
            />
          </div>
          <div className="py-4 leading-5">
            <h4 className="">Admin</h4>
            <p className="text-xl text-grey-dark font-bold">Scheduler</p>
          </div>
        </div>

        <div className="px-2">
          <SidebarTitle text="Input Data" />
          <SidebarLink text="Matkul" Icon={BookOpenIcon} linkto="/MataKuliah" />
          <SidebarLink text="Dosen" Icon={UserIcon} linkto="/Dosen" />
          <SidebarLink text="Ruang Kelas" Icon={HomeIcon} linkto="/Ruangan" />

          <SidebarTitle text="Konfigurasi" />
          <SidebarLink
            text="Matkul Terselenggara"
            Icon={ClipboardDocumentCheckIcon}
            linkto="/MKTerselenggara"
          />
          <SidebarLink
            text="Dosen Matkul"
            Icon={IdentificationIcon}
            linkto="/DosenMatkul"
          />
          <SidebarLink
            text="Ruang Kelas dan Waktu"
            Icon={ClockIcon}
            linkto="/RuangWaktu"
          />

          <SidebarTitle text="Jadwal" />
          <SidebarLink
            text="Jadwal Matkul"
            linkto="/Jadwal"
            Icon={BookmarkIcon}
          />
          <div className="mt-4">
            <SidebarTitle text="Atur Tahun Ajaran" />
            <div className="pl-2">
              <Dropdown
                label={acyear_string}
                color="dark"
                outline="false"
                size="md"
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
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 mb-5">
        <SidebarTitle text="Template Data Tahun Lalu" />
        <div className="px-2">
          <div className="space-y-2">
            {inputField.map((inpt) => (
              <input
                id={inpt.valuefor}
                type={inpt.type}
                placeholder={inpt.placeholder}
                value={input[inpt.valuefor]}
                className="border-2 rounded-lg w-max p-2 bg-grey-light hover:border-grey-dark focus:outline-none focus:border-2 focus:border-grey-dark/80"
                onChange={(e) =>
                  setInput({ ...input, [e.target.id]: e.target.value })
                }
              />
            ))}
          </div>
          <div class="flex items-center">
            <input
              checked
              id="default-radio-1"
              type="radio"
              value="1"
              name="default-radio"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
              onClick={(e) => setInput({ ...input, semester: e.target.value })}
            />
            <label
              for="default-radio-1"
              class="ml-2 text-sm font-medium text-gray-900"
            >
              Ganjil
            </label>
            <input
              id="default-radio-2"
              type="radio"
              value="2"
              name="default-radio"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              onClick={(e) => setInput({ ...input, semester: e.target.value })}
            />
            <label
              for="default-radio-2"
              class="ml-2 text-sm font-medium text-gray-900"
            >
              Genap
            </label>
          </div>
          <Button
            text={
              <div className="flex items-center">
                <DocumentDuplicateIcon className="h-5 mr-1" />
                Set Template Data
              </div>
            }
            color="dark"
            onClick={postAcadYearTemplate}
          />
        </div>
      </div>

      <div className="px-4 mb-5">
        <Button
          text={
            <div className="flex items-center">
              <ArrowRightOnRectangleIcon className="h-5 mr-1" />
              Logout
            </div>
          }
          color="dark"
          onClick={logoutSubmit}
        />
      </div>
    </div>
  );
}
