import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllDirectMessage } from "../../services/operations/messageAPI";
import toast from "react-hot-toast";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:4000";
var socket;

const ChatListItem = ({
  chat,
  setMessages,
  setChatId,
  handleSendMessageClick,
  userData,
  setChatUser,
  messages,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userUsername = userData?.userDetails?.username;
  const [user1, user2] = chat.users;
  const chatId = chat._id;
  const token = localStorage.getItem("token").split('"')[1];
  const content = chat.latestMessage
    ? `${chat.latestMessage.content.substring(0, 25)}${
        chat.latestMessage.content.length > 25 ? "..." : ""
      }`
    : "";
  const { username: userName, image: userImage } =
    chat.users.find((user) => user.username !== userUsername) || {};

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => console.log("Socket connected"));
  }, []);

  useEffect(() => {
    // Extract chatId from the current path
    const currentChatId = location.pathname.split("/").pop();
    if (currentChatId === chatId) {
      handleChatItemClick();
    }
  }, [location.pathname]); // Listen for changes in the path

  const handleChatItemClick = async () => {
    try {
      const messagesData = await getAllDirectMessage(chatId, token);
      console.log("hellooooooooooo", messagesData);
      setChatUser(chat);
      setMessages(messagesData);
      setChatId(chatId);
      handleSendMessageClick(chat);
      socket.emit("join chat", chatId);
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      toast.error("Failed to fetch messages. Please try again.");
    }
  };

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      // if (
      //   !selectedChatCompare || // if chat is not selected or doesn't match current chat
      //   selectedChatCompare._id !== newMessageRecieved.chat._id
      // ) {
      //   if (!notification.includes(newMessageRecieved)) {
      //     setNotification([newMessageRecieved, ...notification]);
      //     setFetchAgain(!fetchAgain);
      //   }
      // } else {
      //   setMessages([...messages, newMessageRecieved]);
      // }
      setMessages([...messages, newMessageRecieved]);
      console.log("messages---------", messages);
      console.log("newMessageRecieved++++++++++++", newMessageRecieved);
    });
  });

  return (
    <div
      className="flex items-center p-4 border-b border-yellow-500 bg-richblack-700 hover:bg-richblack-600 cursor-pointer transition-all duration-200"
      onClick={handleChatItemClick}
    >
      <img src={userImage} alt="" className="w-10 h-10 rounded-full mr-4" />
      <div>
        <h3 className="font-semibold text-richblack-5 text-lg">{userName}</h3>
        <p className="text-richblack-50">{content}</p>
      </div>
    </div>
  );
};

export default ChatListItem;
