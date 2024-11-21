const PostSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-xl my-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-full"></div>
          <div className="flex flex-col">
            <div className="skeleton h-3 w-20 rounded-full"></div>
            <div className="skeleton h-2 w-12 rounded-full mt-1"></div>
          </div>
        </div>
        <div className="skeleton h-6 w-20 rounded-full"></div>
      </div>
      <div className="border-b border-gray-700"></div>
      <div className="skeleton h-20 w-full rounded-lg mt-3"></div>
      <div className="flex justify-between mt-3">
        <div className="flex gap-2">
          <div className="skeleton w-6 h-6 rounded-full"></div>
          <div className="skeleton w-6 h-6 rounded-full"></div>
        </div>
        <div className="flex gap-2">
          <div className="skeleton w-6 h-6 rounded-full"></div>
          <div className="skeleton w-6 h-6 rounded-full"></div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="skeleton h-10 w-full rounded-full"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;


