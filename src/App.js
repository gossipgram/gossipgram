import React from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginSignupPage from "./Pages/LoginSignup";
import ChatPage from "./Pages/ChatPage";
import Home from "./Pages/Home";
import VerifyEmail from "./Pages/VerifyEmail";
import PrivateRoute from "./Components/PrivateRoute";
import Notification from "./Pages/Notification";
import PostCreate from "./Pages/PostCreate";
import OpenRoute from "./Components/OpenRoute";
import SideBarLayout from "./Components/common/SideBarLayout";
import NotFound from "./Pages/NotFound";
import ForgetPassword from "./Pages/ForgetPassword";
import UpdatedPassword from "./Pages/UpdatedPassword";
import MessageBox from "./Components/Chat/MessageBox";
import SearchPage from "./Pages/SearchPage";
import UserProfile from "./Components/Profile/UserProfile";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-800 flex  font-inter">
      <SideBarLayout />
      <Routes>
        <Route
          path="/"
          element={
            <OpenRoute>
              <LoginSignupPage />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgetPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatedPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        >
          <Route path="/chat/:chatId" element={<MessageBox />}></Route>
        </Route>

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          {/* <Route path="" element={<MyProfile />} /> */}
          {/* <Route path="" element={<Settings />} /> */}
        </Route>

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }>
            <Route path="/search/:username" element={<UserProfile />}></Route>
        </Route>

        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <Notification />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/create"
          element={
            <PrivateRoute>
              <PostCreate />
            </PrivateRoute>
          }
        ></Route>
        <Route path="*" element={<Navigate to="/404" />}></Route>
        <Route path="/404" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
