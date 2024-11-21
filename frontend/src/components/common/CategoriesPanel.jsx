import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import CategoriesPanelSkeleton from "../skeletons/CategoriesPanelSkeleton";
import { useCategory } from "../../context/CategoryContext";

const CategoriesPanel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [search, setSearch] = useState("");
  const { selectedCategory, setSelectedCategory } = useCategory();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/categories?search=${search}`);
        const data = await res.json();
        console.log("Fetched categories:", data); 
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [search]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (isMobile) {
      document.getElementById("categories_modal").close();
    }
  };

  if (isMobile) {
    return (
      <>
        <button
          className="fixed bottom-4 left-4 btn btn-outline rounded-full btn-sm lg:hidden"
          onClick={() =>
            document.getElementById("categories_modal").showModal()
          }
        >
          Show Categories
        </button>
        <dialog id="categories_modal" className="modal">
          <div className="modal-box border rounded-md border-gray-700 shadow-md">
            <div className="flex justify-center items-center mb-4 relative">
              <h3 className="font-bold text-lg text-center">Categories</h3>
              <IoCloseSharp
                className="text-white w-6 h-6 absolute right-4 cursor-pointer"
                onClick={() =>
                  document.getElementById("categories_modal").close()
                }
              />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="input input-bordered w-full mb-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isLoading ? (
              <>
                <CategoriesPanelSkeleton />
                <CategoriesPanelSkeleton />
                <CategoriesPanelSkeleton />
                <CategoriesPanelSkeleton />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 max-h-96 overflow-y-auto">
                <Link
                  to="#"
                  className="flex justify-center items-center text-white font-bold text-lg rounded-full py-3 px-6 transition-transform transform hover:translate-x-2"
                  style={{
                    width: "180px",
                    textAlign: "center",
                    backgroundColor: "rgb(80, 200, 120)",
                  }}
                  onClick={() => handleCategoryClick(null)}
                >
                  All{" "}
                  {selectedCategory === null && <FaCheck className="ml-2" />}
                </Link>
                {categories?.map((category) => (
                  <Link
                    to="#"
                    className="flex justify-center items-center text-white font-bold text-lg rounded-full py-3 px-6 transition-transform transform hover:translate-x-2"
                    key={category._id}
                    style={{
                      width: "180px",
                      textAlign: "center",
                      backgroundColor: category.color || "gray",
                    }}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {category.name}{" "}
                    {selectedCategory === category._id && (
                      <FaCheck className="ml-2" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className="outline-none">close</button>
          </form>
        </dialog>
      </>
    );
  }

  return (
    <div className="lg:block my-24 mx-2">
      <div className="p-4 rounded-lg sticky top-20">
        <p className="font-bold text-white text-lg mb-4 text-center">
          Categories
        </p>
        <input
          type="text"
          placeholder="Search categories..."
          className="input input-bordered w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isLoading ? (
          <>
            <CategoriesPanelSkeleton />
            <CategoriesPanelSkeleton />
            <CategoriesPanelSkeleton />
            <CategoriesPanelSkeleton />
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to="#"
              className="flex justify-center items-center text-white font-bold text-sm rounded-full py-2 transition-transform transform hover:translate-x-2"
              style={{
                minWidth: "120px",
                textAlign: "center",
                backgroundColor: "rgb(80, 200, 120)",
              }}
              onClick={() => handleCategoryClick(null)}
            >
              All {selectedCategory === null && <FaCheck className="ml-2" />}
            </Link>
            {categories?.map((category) => (
              <Link
                to="#"
                className="flex justify-center items-center text-white font-bold text-sm rounded-full py-2 transition-transform transform hover:translate-x-2"
                key={category._id}
                style={{
                  minWidth: "120px",
                  textAlign: "center",
                  backgroundColor: category.color || "gray",
                }}
                onClick={() => handleCategoryClick(category._id)}
              >
                {category.name}{" "}
                {selectedCategory === category._id && (
                  <FaCheck className="ml-2" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPanel;
