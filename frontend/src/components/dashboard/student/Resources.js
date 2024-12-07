import React, { useState } from "react";
import Sidebar from "../Sidebar";

// Mock Data - Replace this with real data from your backend
const communities = [
  { id: 1, name: "C++ Community", subject: "C++" },
  { id: 2, name: "Maths Community", subject: "Maths" },
  { id: 3, name: "Physics Community", subject: "Physics" },
  { id: 4, name: "JavaScript Community", subject: "JavaScript" },
];

const samplePosts = [
  {
    id: 1,
    user: "Student1",
    content: "Check out this C++ resource!",
    subject: "C++",  // Added subject to posts
    reactions: { likes: 5, comments: 3 },
    comments: [
      { user: "Student2", content: "Thanks for sharing!" },
      { user: "Student3", content: "Great resource!" },
    ],
  },
  {
    id: 2,
    user: "Student4",
    content: "Any help with C++ assignment?",
    subject: "C++",  // Added subject to posts
    reactions: { likes: 2, comments: 1 },
    comments: [{ user: "Student1", content: "I'll help you out!" }],
  },
  {
    id: 3,
    user: "Student5",
    content: "Anyone struggling with Physics formulas?",
    subject: "Physics",
    reactions: { likes: 1, comments: 0 },
    comments: [],
  },
];

export default function Community() {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState(samplePosts); // List of posts for the selected community
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Handle post submission (mock for now)
  const handlePostSubmit = () => {
    if (postContent || file) {
      alert(`Post shared in ${selectedCommunity.name}: ${postContent} ${file ? `File: ${file.name}` : ""}`);
      setPostContent(""); // Clear the post content
      setFile(null); // Clear the selected file

      // You would send this data to the backend here, for now we simulate adding a new post
      const newPost = {
        id: posts.length + 1,
        user: "Current Student", // Replace with actual user data
        content: postContent,
        subject: selectedCommunity.subject, // Added subject based on selected community
        reactions: { likes: 0, comments: 0 },
        comments: [],
      };
      setPosts([newPost, ...posts]); // Add the new post to the front of the posts list
    }
  };

  // Handle file change (mock for now)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle reacting to posts (likes)
  const handleReactToPost = (postId, reactionType) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        if (reactionType === "like") {
          post.reactions.likes += 1;
        }
        // You can handle other reaction types (comment) here similarly
      }
      return post;
    });
    setPosts(updatedPosts); // Update the posts list
  };

  // Handle comment submission
  const handleCommentSubmit = (postId, commentContent) => {
    if (commentContent.trim() === "") return; // Do not submit empty comments

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        post.comments.push({ user: "Current Student", content: commentContent });
        post.reactions.comments += 1; // Increment comment count
      }
      return post;
    });
    setPosts(updatedPosts); // Update the posts list with new comment
  };

  // Filter posts based on selected community
  const filterPostsBySubject = (subject) => {
    const filteredPosts = samplePosts.filter((post) => post.subject === subject);
    setPosts(filteredPosts);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Community Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Community</h1>

        {/* Community List */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Communities</h2>
          <ul>
            {communities.map((community) => (
              <li
                key={community.id}
                className="bg-gray-100 p-4 mb-4 rounded cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  setSelectedCommunity(community);
                  filterPostsBySubject(community.subject); // Filter posts by subject
                }}
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
              Welcome to the {selectedCommunity.subject} community! Share your thoughts, resources, and discussions here.
            </p>

            {/* Post Submission Form */}
            <textarea
              className="w-full p-4 mb-4 border rounded"
              rows="4"
              placeholder={`Share something in the ${selectedCommunity.name}`}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>

            {/* File Upload */}
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePostSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
            >
              Share Post
            </button>
          </div>
        )}

        {/* Display Posts */}
        {selectedCommunity && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Posts</h3>
            <div>
              {posts.map((post) => (
                <div key={post.id} className="p-4 mb-4 border-b">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">{post.user}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReactToPost(post.id, "like")}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Like {post.reactions.likes}
                      </button>
                      <button
                        onClick={() => setSelectedPostId(post.id)}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Comment {post.reactions.comments}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{post.content}</p>

                  {/* Show Comments */}
                  {selectedPostId === post.id && (
                    <div className="mt-4">
                      <textarea
                        className="w-full p-4 mb-4 border rounded"
                        rows="3"
                        placeholder="Add a comment"
                        onBlur={(e) => handleCommentSubmit(post.id, e.target.value)}
                      ></textarea>
                      <div className="space-y-2">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="text-gray-500">
                            <strong>{comment.user}:</strong> {comment.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
