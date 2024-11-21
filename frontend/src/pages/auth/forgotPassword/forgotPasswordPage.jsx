import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email }) => {
      try {
        const res = await fetch("/api/auth/request-password-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
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
      toast.success("Password reset link sent to your email");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-2 flex-col items-center mb-8"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Forgot Password
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2 w-full">
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          {isError && <p className="text-red-500">{error.message}</p>}
          <button className="btn rounded-full btn-primary text-white w-full mt-4">
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;