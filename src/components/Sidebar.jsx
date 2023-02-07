import {
  UserIcon,
  BookOpenIcon,
  HomeIcon,
  ClockIcon,
  ClipboardDocumentIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Sidebar() {
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
        <Icon className="h-5" />
        <span className="hidden md:inline truncate">{text}</span>
      </Link>
    );
  }

  return (
    <div className="col-span-1 border-r ">
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
        <SidebarTitle text="Input Data" />
        <SidebarLink text="Matkul" Icon={BookOpenIcon} linkto="/" />
        <SidebarLink text="Dosen" Icon={UserIcon} />
        <SidebarLink text="Ruang Kelas" Icon={HomeIcon} />

        <SidebarTitle text="Konfigurasi" />
        <SidebarLink
          text="Dosen Matkul"
          Icon={ClipboardDocumentIcon}
          linkto="/DosenMatkul"
        />
        <SidebarLink
          text="Ruang Kelas dan Waktu"
          Icon={ClockIcon}
          linkto="/RuangWaktu"
        />

        <SidebarTitle text="Jadwal" />
        <SidebarLink text="Jadwal Matkul" Icon={BookmarkIcon} />
      </div>
    </div>
  );
}
