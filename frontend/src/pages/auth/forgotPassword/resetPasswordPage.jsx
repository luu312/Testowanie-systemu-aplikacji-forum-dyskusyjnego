import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ token, newPassword }) => {
      try {
        const res = await fetch(`/api/auth/reset-password/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/login");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ token, newPassword });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-2 flex-col items-center mb-8"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Reset Password
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <input
              type="password"
              className="grow"
              placeholder="New Password"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white w-full mt-4">
            {isPending ? "Resetting..." : "Reset Password"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;