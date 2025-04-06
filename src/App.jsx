import React, { useState, useEffect, useRef } from "react";
import prompt from "./prompt";
import dataset from "./smapledata.js";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { useForm } from "react-hook-form";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const apiKey = "AIzaSyBvjlmg0GGsMorTC1W11nl6LhKBqXcP6h4";
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setMessages((prev) => [
      ...prev,
      {
        text: "Welcome to the AI Event Planner! How can I assist you today?",
        sender: "ai",
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const onSubmit = (data) => {
    const userInput = data.input;
    const fetchdata = async () => {
      if (userInput) {
        setLoading(true);
        setMessages((prev) => [
          ...prev,
          { text: userInput, sender: "user" },
        ]);
      }
      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            apiKey,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: ` ${prompt}
                        ${userInput}  in json format`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const result = data.candidates[0].content.parts[0].text;

        let cleartext = result
          .replace(/\],?/g, "")
          .replace(/},?/g, "\n")
          .replace(/\[\s*/g, "")
          .replace(/\s*\]/g, "")
          .replace(/```json/g, "")
          .replace(/```/g, "");

        setMessages((prev) => [
          ...prev,
          { text: cleartext, sender: "ai" },
        ]);
        setLoading(false);
        reset();
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessages((prev) => [
          ...prev,
          { text: "An error occurred while fetching data.", sender: "ai" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-400 to-blue-500 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-8 relative">
        <label className="inline-flex items-center cursor-pointer absolute top-4 right-4">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            onClick={toggleDarkMode}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </label>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-8">
          AI Event Planner
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
              Event Planning Features
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                <span>Schedule Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaUserFriends className="text-purple-600 dark:text-purple-400 text-xl" />
                <span>Guest List Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                <span>Venue Selection</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaClock className="text-purple-600 dark:text-purple-400 text-xl" />
                <span>Time Management</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div
              ref={chatContainerRef}
              className="h-[400px] md:h-[500px] overflow-y-auto mb-4 space-y-4"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.sender === "user"
                      ? "bg-purple-100 dark:bg-purple-700 ml-auto max-w-[80%]"
                      : "bg-blue-100 dark:bg-blue-700 max-w-[80%]"
                  }`}
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    {message.text}
                  </p>
                </div>
              ))}
              {loading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Ask about event planning..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
                {...register("input", { required: true })}
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
