import {
  FaRegComment,
  FaPaperPlane,
  FaTrash,
  FaEdit,
  FaUser,
  FaStar,
} from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [comments, setComments] = useState(post.comments);
  const commentsPerPage = 5;
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const isMyPost = authUser?._id === post.user._id;
  const isAdmin = authUser?.role === "admin";
  const [editingPost, setEditingPost] = useState(false);
  const [editingPostText, setEditingPostText] = useState(post.text);
  const [editingPostCategory, setEditingPostCategory] = useState("");
  const [postState, setPostState] = useState(post);

  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isLikedLocal, setIsLikedLocal] = useState(
    authUser ? post.likes.includes(authUser._id) : false
  );

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

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/post/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/post/like/${post._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      setLikesCount((prev) => (isLikedLocal ? prev - 1 : prev + 1));
      setIsLikedLocal((prev) => !prev);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/post/comment/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (data) => {
      toast.success("Comment posted successfully");
      setComment(""); 
      queryClient.invalidateQueries(["post", post._id, "comments"]); 
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(`/api/post/comment/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (data, commentId) => {
      toast.success("Comment deleted successfully");
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateComment, isPending: isUpdatingComment } = useMutation({
    mutationFn: async ({ commentId, text }) => {
      const res = await fetch(`/api/post/comment/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (data, { commentId, text }) => {
      toast.success("Comment updated successfully");
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? { ...comment, text } : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdatePost = (e) => {
    e.preventDefault();
    if (isUpdatingPost) return;
    console.log("Updating post with category:", editingPostCategory); 
    updatePost();
  };

  const { mutate: updatePost, isPending: isUpdatingPost } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/post/${postState._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: editingPostText,
          categoryId: editingPostCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      console.log("Server response:", data); 
      return data;
    },
    onSuccess: (data) => {
      toast.success("Post updated successfully");
      setEditingPost(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      const updatedCategory = categories.find(
        (cat) => cat._id === data.category
      );
      console.log("Mapped category:", updatedCategory); 
      setPostState({ ...data, category: updatedCategory }); 
      console.log("Updated post state:", {
        ...data,
        category: updatedCategory,
      }); 
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEditPost = () => {
    setEditingPost(true);
  };

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handleDeleteComment = (commentId) => {
    if (isDeletingComment) return;
    deleteComment(commentId);
  };

  const handleEditComment = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditingCommentText(text);
  };

  const handleUpdateComment = (e) => {
    e.preventDefault();
    if (isUpdatingComment) return;
    updateComment({ commentId: editingCommentId, text: editingCommentText });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const selectedComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-3xl">
      <div className="border-b border-gray-700 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <Link
                to={`/profile/${postState.user.username}`}
                className="w-10 h-10 rounded-full overflow-hidden"
              >
                <img
                  src={postState.user.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                />
              </Link>
            </div>
            <div className="flex flex-col">
              <Link
                to={`/profile/${postState.user.username}`}
                className="font-bold text-white"
              >
                {postState.user.fullName}
                {postState.user.role === "admin" && (
                  <FaStar
                    className="inline ml-1 text-yellow-500"
                    style={{ marginBottom: "5px" }}
                  />
                )}
              </Link>
              <span className="text-primary">
                <FaUser className="inline" /> {postState.user.username}
              </span>
            </div>
          </div>
          <div>
            {postState.category ? (
              <span
                className="text-xs xs:text-xxs sm:text-sm md:text-base py-0.5 xs:py-0.25 sm:py-0.5 px-2 xs:px-1 sm:px-2 rounded-full"
                style={{
                  backgroundColor: postState.category.color || "#000",
                  color: "#fff",
                }}
              >
                {postState.category.name || "Unnamed Category"}
              </span>
            ) : (
              <span className="text-xs xs:text-xxs sm:text-sm md:text-base bg-gray-700 text-white py-0.5 xs:py-0.25 sm:py-0.5 px-2 xs:px-1 sm:px-2 rounded-full">
                General
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start text-left">
        <div className="mt-2 text-gray-300 w-full">
          {editingPost ? (
            <form onSubmit={handleUpdatePost}>
              <textarea
                value={editingPostText}
                onChange={(e) => setEditingPostText(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-[rgb(80,200,120)] focus:ring-2 focus:ring-[rgba(80,200,120,0.5)]"
                disabled={isLoadingCategories}
              />
              <div className="flex items-center mt-2 space-x-4">
                <select
                  value={editingPostCategory}
                  onChange={(e) => setEditingPostCategory(e.target.value)}
                  className="select select-primary w-full max-w-xs rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[rgb(80,200,120)] focus:ring-2 focus:ring-[rgba(80,200,120,0.5)]"
                  disabled={isLoadingCategories}
                >
                  <option disabled value="">
                    {isLoadingCategories
                      ? "Loading categories..."
                      : "Pick a new category or leave current"}
                  </option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="btn btn-primary rounded-full btn-sm px-6 text-white font-semibold flex items-center justify-center"
                  disabled={isUpdatingPost}
                >
                  {isUpdatingPost ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-justify text-md">{postState.text}</p>
          )}
          {postState.img && (
            <img
              src={postState.img}
              className="mt-4 w-full h-auto rounded-lg border border-gray-700"
              alt="Post"
            />
          )}
        </div>

        <div className="flex justify-between items-center mt-4 w-full">
          <div className="flex gap-4">
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={toggleComments}
            >
              <FaRegComment className="text-gray-500 group-hover:text-primary w-5 h-5" />
              <span className="text-sm text-gray-500 group-hover:text-primary">
                {comments.length}
              </span>
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={handleLikePost}
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : isLikedLocal ? (
                <FaRegHeart className="w-5 h-5 text-pink-500" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-gray-500 group-hover:text-pink-500" />
              )}
              <span
                className={`text-sm ${
                  isLikedLocal
                    ? "text-pink-500"
                    : "text-gray-500 group-hover:text-pink-500"
                }`}
              >
                {likesCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {(isMyPost || isAdmin) && !isDeleting && (
              <>
                <FaEdit
                  className="cursor-pointer hover:text-yellow-500 text-white w-5 h-5"
                  onClick={handleEditPost}
                />
                <FaTrash
                  className="cursor-pointer hover:text-red-500 text-white w-5 h-5"
                  onClick={handleDeletePost}
                />
              </>
            )}
            {isDeleting && <LoadingSpinner size="sm" />}
          </div>
        </div>

        {showComments && (
          <div className="mt-4 w-full">
            <h3 className="font-bold text-lg mb-2 text-white text-center">
              Comments
            </h3>
            {selectedComments.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No comments yet
              </p>
            )}
            {selectedComments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start gap-3 mt-4 p-3 rounded-lg border border-gray-700 shadow-md"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={comment.user.profileImg || "/avatar-placeholder.png"}
                    alt="commenter"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">
                        {comment.user.fullName}
                        {comment.user.role === "admin" && (
                          <FaStar
                            className="inline ml-1 text-yellow-500"
                            style={{ marginBottom: "5px" }}
                          />
                        )}
                      </span>
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <FaUser className="inline w-3 h-3" />{" "}
                        {comment.user.username}
                      </span>
                    </div>

                    {(authUser?._id === comment.user._id ||
                      authUser?.role === "admin") && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={isDeletingComment}
                          className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                        >
                          {isDeletingComment ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <FaTrash className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleEditComment(comment._id, comment.text)
                          }
                          className="text-gray-500 hover:text-yellow-500 transition-colors duration-200"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-1 text-gray-300 leading-relaxed">
                    {editingCommentId === comment._id ? (
                      <form
                        onSubmit={handleUpdateComment}
                        className="flex"
                      >
                        <input
                          type="text"
                          value={editingCommentText}
                          onChange={(e) =>
                            setEditingCommentText(e.target.value)
                          }
                          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                        />
                        <button
                          type="submit"
                          disabled={isUpdatingComment}
                          className="mt-1 mx-4 btn btn-primary rounded-full btn-sm text-white font-semibold"
                        >
                          {isUpdatingComment ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            "Update"
                          )}
                        </button>
                      </form>
                    ) : (
                      <p className="break-words max-w-[100ch] text-justify text-sm">{comment.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {comments.length > commentsPerPage && (
              <div className="join grid grid-cols-2 mt-4 rounded-full">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="join-item btn btn-outline"
                >
                  Previous page
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="join-item btn btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={handlePostComment}
          className="mt-4 w-full flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={authUser?.profileImg || "/avatar-placeholder.png"}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center w-full bg-gray-800 rounded-full px-4 py-2 mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Write your comment.."
              className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={isCommenting}
              className="text-primary hover:text-green-300 w-10 flex justify-center items-center relative"
            >
              {isCommenting ? (
                <LoadingSpinner size="sm" className="absolute" />
              ) : (
                <FaPaperPlane className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
