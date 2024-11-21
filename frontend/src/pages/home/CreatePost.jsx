import { useState, useRef } from "react";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus, FaStar, FaUser } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePostModal = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      return res.json();
    },
  });
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [category, setCategory] = useState("");
  const imgRef = useRef(null);

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img, category }) => {
      try {
        const res = await fetch("/api/post/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img, categoryId: category }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw Error(error);
      }
    },
    onSuccess: () => {
      setText("");
      setImg("");
      setCategory("");
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      document.getElementById("create_post_modal").close(); 
    },
  });

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img, category });
  };

  return (
    <>
      <dialog id="create_post_modal" className="modal">
        <div className="modal-box border border-gray-700 shadow-md rounded-md">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={authUser?.profileImg || "/avatar-placeholder.png"}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-lg text-white">
                {authUser?.fullName}
                {authUser?.role === "admin" && (
                  <FaStar
                    className="inline ml-1 text-yellow-500"
                    style={{ marginBottom: "5px" }}
                  />
                )}
              </h3>
              <span className="text-primary">
                <FaUser className="inline" /> {authUser.username}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-3">Create a New Post</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <textarea
              className="textarea textarea-primary rounded-2xl bg-gray-800 border-gray-700 focus:outline-none focus:border-[rgb(80,200,120)] focus:ring-2 focus:ring-[rgba(80,200,120,0.5)] text-white"
              placeholder="What's happening?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
            />
            <select
              className="select select-primary w-full max-w-xs rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[rgb(80,200,120)] focus:ring-2 focus:ring-[rgba(80,200,120,0.5)]"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              disabled={isLoadingCategories}
            >
              <option disabled value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "Choose a category"}
              </option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {img && (
              <div className="relative w-full mx-auto mt-4">
                <IoCloseSharp
                  className="absolute top-1 right-1 text-white bg-gray-700 rounded-full w-6 h-6 cursor-pointer p-1"
                  onClick={() => {
                    setImg(null);
                    imgRef.current.value = null;
                  }}
                />
                <img
                  src={img}
                  className="w-full h-auto max-h-72 object-contain rounded-md shadow-lg"
                  alt="Uploaded"
                />
              </div>
            )}

            <div className="flex justify-between items-center border-t py-3 border-t-gray-700">
              <div className="flex gap-4 items-center">
                <CiImageOn
                  className="fill-primary w-7 h-7 cursor-pointer hover:fill-opacity-80 transition-all duration-200"
                  onClick={() => imgRef.current.click()}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imgRef}
                onChange={handleImgChange}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-full btn-sm px-6 text-white font-semibold"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>

          {isError && <p className="text-red-500">{error.message}</p>}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">Close</button>
        </form>
      </dialog>
      <button
        className="fixed bottom-4 right-4 btn btn-outline rounded-full btn-sm lg:flex items-center gap-2 border-2 border-green-500 hover:bg-primary transition-all duration-200 z-50"
        onClick={() => document.getElementById("create_post_modal").showModal()}
      >
        <FaPlus className="w-4 h-4" />
        <span className="hidden lg:inline">Add Post</span>
      </button>
    </>
  );
};

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <CreatePostModal />
      </div>
    </div>
  );
};

export default App;
