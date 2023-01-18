// import { useNavigate } from 'react-router-dom';

export default function SidebarLink({ Icon, text, active }) {
  // const navigate = useNavigate()
  return (
    <div
      className={`text-grey flex items-center justify-start text-md space-x-3 hoverAnimation ${
        active && "font-bold"
      }`}
      onClick={() => active}
    >
      <Icon className="h-5" />
      <span className="inline truncate">{text}</span>
    </div>
  );
}


