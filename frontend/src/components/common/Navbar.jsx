import TalkSpaceLogo from "../svgs/logo";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Navbar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to logout");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    logout();
  };

  const { data } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black flex items-center justify-evenly h-20 p-2 border-b border-gray-700">
      <Link to="/" className="flex items-center">
        <TalkSpaceLogo className="w-12 sm:w-16 md:w-20 lg:w-24 rounded-full fill-white hover:bg-stone-900 max-w-full h-auto" />
      </Link>
      <ul className="flex gap-4">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-1 px-2 cursor-pointer"
          >
            <MdHomeFilled className="w-6 h-6" />
            <span className="text-md hidden md:block">Home</span>
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            to="/notifications"
            className="flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-1 px-2 cursor-pointer"
          >
            <IoNotifications className="w-5 h-5" />
            <span className="text-md hidden md:block">Notifications</span>
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            to={`/profile/${data?.username}`}
            className="flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-1 px-2 cursor-pointer"
          >
            <FaUser className="w-5 h-5" />
            <span className="text-md hidden md:block">Profile</span>
          </Link>
        </li>
      </ul>
      {data && (
        <div
          className="flex gap-2 items-center transition-all duration-300 hover:bg-[#181818] py-1 px-2 rounded-full cursor-pointer"
          onClick={handleLogout}
        >
          <div className="avatar hidden md:inline-flex">
            <div className="w-8 rounded-full">
              <img src={data?.profileImg || "/avatar-placeholder.png"} />
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-1">
            <p className="text-white font-bold text-sm">{data?.fullName}</p>
            <span className="text-primary text-xs">
              <FaUser className="inline" /> {data?.username}
            </span>
          </div>
          <BiLogOut
            className="w-4 h-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
