import React, { useState } from "react";
import Sidebar from "../Sidebar";

const communities = [
  { id: 1, name: "C++ Community", subject: "C++" },
  { id: 2, name: "Maths Community", subject: "Maths" },
  { id: 3, name: "Physics Community", subject: "Physics" },
  { id: 4, name: "JavaScript Community", subject: "JavaScript" },
];

const sampleMessages = {
  "C++": [
    { user: "Student1", content: "Hello, any resources for C++ assignments?" },
    { user: "Student2", content: "You can check out the C++ Primer book." },
  ],
  "Maths": [
    { user: "Student3", content: "Does anyone understand the latest math problem?" },
    { user: "Student4", content: "I think the answer is in the tutorial notes." },
  ],
  "Physics": [
    { user: "Student5", content: "How to approach the energy conservation problem?" },
  ],
  "JavaScript": [
    { user: "Student6", content: "Can someone explain closures?" },
    { user: "Student7", content: "Closures are functions that retain access to their scope." },
  ],
};

export default function Community() {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSelectCommunity = (community) => {
    setSelectedCommunity(community);
    setMessages(sampleMessages[community.subject] || []);
  };

  const handleSendMessage = () => {
    if (messageContent.trim() === "") return;

    const newMessage = { user: "Current Student", content: messageContent };
    setMessages([...messages, newMessage]);
    setMessageContent("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Community Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Community</h1>

        {/* Community List */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Communities</h2>
          <ul>
            {communities.map((community) => (
              <li
                key={community.id}
                className="bg-gray-100 p-4 mb-4 rounded cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelectCommunity(community)}
              >
                {community.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Community */}
        {selectedCommunity && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedCommunity.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome to the {selectedCommunity.subject} community! Discuss and share your thoughts here.
            </p>

            {/* Chat Section */}
            <div className="bg-gray-100 p-4 rounded mb-4 h-64 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <strong className="text-gray-800">{message.user}:</strong>
                  <span className="text-gray-600 ml-2">{message.content}</span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <textarea
              className="w-full p-4 mb-4 border rounded"
              rows="3"
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            ></textarea>
            <button
              onClick={handleSendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
            >
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
