import { Link } from "react-router-dom";
import { useState } from "react";
import TalkSpaceLogo from "../../../components/svgs/logo";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(null); 
  const [blockedUntil, setBlockedUntil] = useState(null); 

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (data.blockedUntil) {
            setBlockedUntil(new Date(data.blockedUntil));
            setErrorMessage(`Account blocked until: ${new Date(data.blockedUntil).toLocaleString()}`);
          } else {
            setErrorMessage(data.error || "An error occurred");
          }
          throw new Error(data.error || "An error occurred"); 
        }

        return data;
      } catch (error) {
        console.log("Error during login:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setErrorMessage(null); 
      setBlockedUntil(null); 
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null); 
    setBlockedUntil(null); 
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-2 flex-col items-center mb-8"
          onSubmit={handleSubmit}
        >
          <TalkSpaceLogo className="w-60 fill-white mb-5" />
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome back.
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <FaUser />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white w-full mt-4">
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {errorMessage && (
            <p className="text-red-500">{errorMessage}</p> 
          )}
          <Link to="/forgot-password" className="text-white mt-4">
            Forgot Password?
          </Link>
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2">
          <p className="text-white text-lg text-center">
            Don't have an account?
          </p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
