import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, code }) => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Email verified successfully");
      navigate("/login");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, code });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-2 flex-col items-center mb-8"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Verify your email
          </h1>
          <p className="text-white mb-4">
            We have sent a verification code to your email: {email}
          </p>
          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <input
              type="text"
              className="grow"
              placeholder="Verification Code"
              name="code"
              onChange={(e) => setCode(e.target.value)}
              value={code}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white w-full mt-4">
            {isPending ? "Verifying..." : "Verify"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
