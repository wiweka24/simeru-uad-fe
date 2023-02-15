import {
  UserIcon,
  BookOpenIcon,
  HomeIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { useState } from "react";

export default function Sidebar({ props }) {
  // const academicYear = [Array.from({ length: 10 }, (_, i) => i + 1)];
  const academicYear = [1, 2, 3, 4, 5];
  const [selectYear, setSelectYear] = useState(1);
  function SidebarTitle({ text }) {
    return <div className="text-grey font-bold ml-3 py-2">{text}</div>;
  }

  function SidebarLink({ Icon, text, active, linkto }) {
    return (
      <Link
        to={linkto}
        className={`text-grey flex items-center justify-start text-md space-x-3 hoverAnimation ${
          active && "font-bold"
        }`}
        onClick={() => active}
      >
        <Icon className="w-5 h-5 min-h-full min-w-fit" />
        <span className="inline truncate">{text}</span>
      </Link>
    );
  }

  //Handle and send to parent components
  function handleInputChange(value) {
    setSelectYear(value);
    props.getAcadYearValue(value);
    // console.log(value);
    //console.log(obj);
  }

  return (
    <div className="col-span-1 border-r">
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
      <div className="space-y-1 px-2">
        <div>
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
        </div>

        <div className="pt-5">
          <SidebarTitle text="Atur Tahun Ajaran" />
          <div className="pl-2">
            <Dropdown label={selectYear} color="dark" outline="false" size="md">
              {academicYear.map((year) => (
                <Dropdown.Item
                  key={year}
                  onClick={() => handleInputChange(year)}
                >
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
