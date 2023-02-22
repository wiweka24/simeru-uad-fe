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
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";

import Button from "./Button";
import { axiosInstance } from "../atoms/config";

export default function Sidebar({ getAcadYearValue, acyear }) {
  const URL = process.env.REACT_APP_BASE_URL;
  const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
  const [activePage, setActivePage] = useState("/");
  const academicYear = [
    { year: "2022/2023", value: 1 },
    { year: "2023/2024", value: 2 },
    { year: "2024/2025", value: 3 },
    { year: "2025/2026", value: 4 },
    { year: "2026/2027", value: 5 },
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
                label={acyear.year}
                color="dark"
                outline="false"
                size="md"
              >
                {academicYear.map((acadyear) => (
                  <Dropdown.Item
                    key={acadyear.value}
                    onClick={() => getAcadYearValue(acadyear)}
                  >
                    {acadyear.year}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </div>
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
