import React from "react";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ setIsActive, onAddNote, handleKeyDown }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  return (
    <>
      <div className="bg-[#eceff8] text-black w-full min-h-screen absolute top-0 left-0 flex justify-center items-center">
        <div className="sm:w-[60%] lg:w-[40%]  w-[80%] my-10">
          <div className="flex flex-col gap-4  md:flex-row justify-between items-center mb-10">
            <button
              onClick={() => setIsActive(false)}
              className="p-2 flex items-center gap-2 poppins-regular hover:border hover:border-black/70 rounded-sm transition duration-200"
            >              
              <IoMdArrowBack className="text-[18px]" />
              Back to Notes
            </button>
            <h1 className="text-2xl poppins-regular font-black leading-tight pb-2">
              Create New Note
            </h1>
          </div>

          <div className=" bg-white rounded-md shadow-lg p-6 flex flex-col gap-10 text-black/80">
            <div className="title flex flex-col gap-4">
              <label htmlFor="" className="font-medium poppins-regular">
                Note Title
              </label>
              <input
                type="text"
                placeholder="Enter a catchy title for your notes .."
                value={title}
                onChange={(e) => {
                  e.target.value !== "" ? setTitle(e.target.value) : "";
                }}
                className="p-3 shadow-sm rounded-sm placeholder:poppins-thin bg-gray-100 placeholder:text-black/70 text-black focus:outline-0"
              />
            </div>

            <div className="summary bg-gray-100 text-black">
              <textarea
                name=""
                id=""
                className=" p-3 w-full placeholder:text-black/70 text-black shadow-sm rounded-sm min-h-24 focus:outline-0 placeholder:poppins-thin"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="title flex flex-col gap-4">
              <label htmlFor="" className="font-medium poppins-regular">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                name=""
                id=""
                className="p-3 rounded-sm bg-gray-200 placeholder:text-black/70 border-0 shadow-sm focus:outline-0"
              >
                <option value="">Select Category</option>
                <option value="General">
                  General
                </option>
                <option value="Personal">
                  Personal
                </option>
                <option value="Important">
                  Important
                </option>
              </select>
            </div>

              <button
                onClick={() => {
                  const today = new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  onAddNote({
                    id: Date.now(),
                    title,
                    description,
                    category,
                    date: today,
                  });
                  setTitle("");
                  setDescription("");
                  setCategory("");
                  setIsActive(false);
                }}
                onKeyDown={handleKeyDown}
                className="w-full  bg-[#675efb] poppins-regular rounded-sm flex justify-center items-center font-semibold  p-3 text-white"
              >
                Add
              </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
