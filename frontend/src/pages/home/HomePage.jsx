import React, { useState, useEffect } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={`${isMobile ? "" : "mt-24"}`}>
        <div className="flex flex-col items-center w-full max-w-md mx-auto border border-gray-700 rounded-full p-1 sticky top-20 bg-[#16181C] z-10">
          <div className="flex w-full">
            <div
              className={`flex justify-center flex-1 m-1 p-2 rounded-full transition duration-300 cursor-pointer relative ${
                feedType === "forYou"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary"
              }`}
              onClick={() => setFeedType("forYou")}
            >
              For you
            </div>
            <div
              className={`flex justify-center flex-1 m-1 p-2 rounded-full transition duration-300 cursor-pointer relative ${
                feedType === "following"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary"
              }`}
              onClick={() => setFeedType("following")}
            >
              Following
            </div>
          </div>
        </div>

        <div className={`${isMobile ? "mt-24" : ""}`}>
          <Posts feedType={feedType} />
        </div>
      </div>
      <CreatePost />
    </>
  );
};

export default HomePage;
