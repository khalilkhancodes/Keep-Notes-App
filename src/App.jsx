import { useState, useEffect} from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

// Icons from ReactIcons
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { HiOutlineSaveAs } from "react-icons/hi";

function App() {
  //
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState([]);
  // track which note is being edited
  const [editIndex, setEditIndex] = useState(null);
  // Handle the Searched Notes
  const [searchTerm, setSearchTerm] = useState("");
  // Filters the Notes Accoeding to Search term and Category
  const [filteredNotes, setFilteredNotes] = useState([]);

  // Used to give different colors to Each Category
  const categoryTerm = ["All", "General", "Personal", "Important"];

  // Keep track of the User and his/her Notes
  const { user } = useUser();
  const userId = user?.id;

  // Updates Notes on Each rendering
  useEffect(() => {
    setFilteredNotes(tasks);
  }, [tasks]);

  // handles Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    // console.log(searchTerm);
    if (e.target.value === "") {
      setFilteredNotes(tasks);
    } else {
      const filtered = tasks.filter((note) =>
        note.title.toLowerCase().includes(searchTerm)
      );
      setFilteredNotes(filtered);
    }
  };

  // Handle category
  const handleCategory = (selectedCategory) => {
    if (selectedCategory === "All") {
      setFilteredNotes(tasks);
    } else {
      const filtered = tasks.filter(
        (note) => note.category === selectedCategory
      );
      setFilteredNotes(filtered);
    }
  };

  // Load saved notes from Local Storage
  useEffect(() => {
    if (!userId) return;
    const saved = JSON.parse(localStorage.getItem(`tasks_${userId}`,"date"));
    if (saved && Array.isArray(saved)) {
      setTasks(saved);
    }
  }, [userId]);

  // Saves notes to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
      console.log("Saved to LS:", tasks);
    }
  }, [tasks, userId]);

  // Add new note in Note List
  const handleAddNotes = (newNote) => {
    if (!newNote || !newNote.title?.trim() === "") return;
    setTasks((prev) => {
      const updated = [...prev, newNote];
      return updated;
    });
  };

  // Delete note from Note List
  const handleDelete = (index) => {
    setTasks((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("data", JSON.stringify(updated));
      return updated;
    });
  };

  // Handle inline edit (title or description)
  const handleEditChange = (index, field, value) => {
    setTasks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Save the edited note (stop editing)
  const handleSave = () => {
    setEditIndex(null);
    localStorage.setItem("data", JSON.stringify(tasks));
  };

  return (
    <>
      <SignedOut>
        <div className="bg-gray-300 flex items-center justify-center h-screen">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="body flex flex-col items-center justify-center">
          <Navbar />
          <main className="w-[85%]">
            <div>
              <div className="Main_Heading flex flex-col sm:flex-row sm:justify-between gap-3 justify-center items-center">
                <h1 className="text-2xl font-bold text-black poppins-regular">MY NOTES</h1>
                <button
                  onClick={() => setIsActive(true)}
                  className="text-white bg-[#675efb] poppins-regular text-[15px] p-2 px-4 rounded-md w-full sm:w-fit"
                >
                  + Create New Note
                </button>
              </div>

              <div className="Search_Section w-full flex gap-2 py-6 flex-col sm:flex-row justify-center items-center sm:gap-4">
                <div className="w-full">
                  <input
                    value={searchTerm}
                    onChange={handleSearch}
                    type="text"
                    placeholder="Search notes"
                    className="bg-white/80 w-full px-4 py-3 rounded-md placeholder:text-black/80 placeholder:poppins-thin placeholder:font-medium text-black shadow-sm hover:scale-[1.01] transition duration-300"
                  />
                </div>

                <div className="group flex flex-col gap-2 relative">
                  <div className="flex gap-2 items-center border-2 border-black/70 px-2 md:px-8 py-2 font-medium rounded-md">
                    <button className="text-black/70 group-hover:text-black group-hover:broder-black poppins-regular">
                      Category
                    </button>
                    <IoMdArrowDropdown className="text-2xl text-black/70 group-hover:rotate-180 transition duration-200" />
                  </div>
                  <div className="hidden group-hover:block p-3 space-y-2 list-none text-black bg-white rounded-md absolute top-12 w-full cursor-pointer">
                    <li
                      onClick={() => handleCategory(categoryTerm[0])}
                      className="p-2 hover:bg-black/20 rounded-md"
                    >
                      All
                    </li>
                    <li
                      onClick={() => handleCategory(categoryTerm[1])}
                      className="p-2 hover:bg-black/20 rounded-md"
                    >
                      General
                    </li>
                    <li
                      onClick={() => handleCategory(categoryTerm[2])}
                      className="p-2 hover:bg-black/20 rounded-md"
                    >
                      Personal
                    </li>
                    <li
                      onClick={() => handleCategory(categoryTerm[3])}
                      className="p-2 hover:bg-black/20 rounded-md"
                    >
                      Important
                    </li>
                  </div>
                </div>
              </div>

              <div className="NotesList space-y-4 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
                <AnimatePresence>
                  {filteredNotes.map((note, index) => {
                    const isEditing = editIndex === index;
                    return (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          scale: 0.6,
                          y: 30,
                          transition: { duration: 0.25 },
                        }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div
                          key={index}
                          className="cards bg-white/90 text-black shadow-sm rounded-md"
                        >
                          <div className="title flex justify-between items-center gap-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={note.title}
                                onChange={(e) =>
                                  handleEditChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="font-semibold text-black p-2  border-l-3 border-l-[#eb26cad6] poppins-regular w-full focus:outline-0"
                              />
                            ) : (
                              <h3 className={`poppins-regular p-2  pt-1 line-clamp-1 border-l-2 ${
                                note.category === "Important"
                                  ? "border-l-[#f43730]"
                                  : note.category === "Personal"
                                  ? "border-l-[#169955d0]"
                                  : "border-l-blue-700"
                              }`}>
                                {note.title}
                              </h3>
                            )}
                            <button
                              className={`category_title px-2 py-1 m-2 ${
                                note.category === "Important"
                                  ? "bg-[#f43730] text-white"
                                  : note.category === "Personal"
                                  ? "bg-[#169955d0] text-white"
                                  : "bg-blue-700/90 text-white"
                              } rounded-xs`}
                            >
                              {note.category || "General"}
                            </button>
                          </div>

                          <div className="p-2">
                            {isEditing ? (
                              <textarea
                                value={note.description}
                                onChange={(e) =>
                                  handleEditChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="edit_description min-h-16 poppins-thin focus:outline-0 text_Description w-full text-[14px]"
                              />
                            ) : (
                              <p className="description min-h-16 poppins-thin flex-wrap w-full line-clamp-3">
                                {note.description}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between items-center p-2 sm:items-center space-y-2 sm:space-y-0">
                            <div className="Date w-full md:text-start">
                              <p>{note.date}</p>
                            </div>
                            <div className="buttons flex justify-end w-full gap-2">
                              {isEditing ? (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  onClick={handleSave}
                                  className="text-2xl pb-2"
                                >
                                  <HiOutlineSaveAs />
                                </motion.button>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => {
                                    setEditIndex(index);
                                  }}
                                  className="text-black text-3xl rounded-md md:py-1"
                                >
                                  <MdEditNote />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleDelete(index)}
                                className=" text-black text-2xl poppins-thin  rounded-md"
                              >
                                <MdDelete />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </main>

          {isActive && (
            <Card
              onAddNote={handleAddNotes}
              isActive={isActive}
              setIsActive={setIsActive}
            />
          )}
        </div>
      </SignedIn>
    </>
  );
}

export default App;
