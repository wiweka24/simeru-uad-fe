import {
  UserIcon,
  BookOpenIcon,
  HomeIcon,
  ClockIcon,
  ClipboardDocumentIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import SidebarLink from './SidebarLink';
import SidebarTitle from "./SidebarTitle";

export default function Sidebar() {
  return (
    <div className='col-span-1 border-r '>
      <div className="text-grey items-center px-2 mt-6 ml-3" >
        <div className="h-12 w-12 border rounded-full">
          <img
            src="https://user-images.githubusercontent.com/70740913/210069769-0251d1fd-392e-4a3f-8b25-b4dc1d42b474.gif"
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
        <SidebarLink text="Matkul" Icon={BookOpenIcon} />
        <SidebarLink text="Dosen" Icon={UserIcon} />
        <SidebarLink text="Ruang Kelas" Icon={HomeIcon} />

        <SidebarTitle text="Konfigurasi" />
        <SidebarLink text="Dosen Matkul" Icon={ClipboardDocumentIcon} />
        <SidebarLink text="Ruang Kelas dan Waktu" Icon={ClockIcon} />

        <SidebarTitle text="Jadwal" />
        <SidebarLink text="Jadwal Matkul" Icon={BookmarkIcon} />
      </div>
    </div>
  )
}
