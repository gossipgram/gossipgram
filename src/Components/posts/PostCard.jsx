import React, { useState, useEffect, useId, useRef } from "react";
import {
  FaRegCommentAlt,
  FaRegHeart,
  FaCommentAlt,
  FaChessKing,
} from "react-icons/fa";
import {
  getLikesForPost,
  likePost,
  unlikePost,
} from "../../services/operations/likesAPI";
import { FcLike } from "react-icons/fc";
import CommentsModal from "./CommentsModal";
import { getAllCommentsForPost } from "../../services/operations/commentsAPI";
// import useOnClickOutside from "../../hooks/useOnClickOutside";

const PostCard = ({ post, userId }) => {
  const [totalLike, setTotalLike] = useState(post?.likes?.length);

  const postId = post?._id;
  const token = localStorage.getItem("token").split('"')[1];
  const [likeUser, setLikeUser] = useState([]);
  const [liked, setLiked] = useState(false);
  const [totalComments, setTotalComments] = useState(post?.comments?.length);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allComments, setAllComments] = useState([]);

  // !code not working for modal close on clicking out side screen

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [commentsModal, setCommentsModal] = useState(null);

  // const modalRef = useRef();

  // useOnClickOutside(modalRef, closeModal);

  // const openModal = () => {
  //   addingCommentsData();
  //   setIsModalOpen(true);
  // };

  // const addingCommentsData = () => {
  //   const fetchAllCommnets = async () => {
  //     try {
  //       const response = await getAllCommentsForPost(postId, token);
  //       setCommentsModal(response?.comments);
  //     } catch (error) {
  //       console.error("Eroor fetching comments data");
  //     }
  //   };
  //   fetchAllCommnets();
  // };

  // ?modal logic
  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  // useEffect(() => {
  //   const handleClickOutsideModal = (event) => {
  //     if (isModalOpen && !event.target.closest(".modal-content")) {
  //       toggleModal();
  //     }
  //   };

  //   if (isModalOpen) {
  //     document.addEventListener("click", handleClickOutsideModal);
  //   } else {
  //     document.removeEventListener("click", handleClickOutsideModal);
  //   }

  //   return () => {
  //     document.removeEventListener("click", handleClickOutsideModal);
  //   };
  // }, [isModalOpen]);

  const openModal = () => {
    const fetchAllCommnets = async () => {
      try {
        const response = await getAllCommentsForPost(postId, token);
        setAllComments(response?.comments);
      } catch (error) {
        console.error("Error fetching comments data");
      }
    };
    fetchAllCommnets();
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchLikeUser = async () => {
      try {
        const response = await getLikesForPost(postId, token);
        setLikeUser(response?.likes);
      } catch (error) {
        console.error("Error fetching like Users Data:", error.message);
      }
    };

    fetchLikeUser();
  }, [token]);

  useEffect(() => {
    const compareUserlikeId = () => {
      for (let i = 0; i < likeUser?.length; i++) {
        if (likeUser[i]?.user === userId) {
          setLiked(true);
          return;
        } else {
          continue;
        }
      }
      setLiked(false);
    };

    compareUserlikeId();
  }, [likeUser]);

  const likeHandler = () => {
    setTotalLike(totalLike + 1);
    setLiked(true);
    likePost(postId, token);
  };

  const unlikeHandler = () => {
    setTotalLike(totalLike - 1);
    setLiked(false);
    unlikePost(postId, token);
  };

  const likeButtonHandler = () => {
    if (!liked) {
      likeHandler();
    } else {
      unlikeHandler();
    }
  };

  return (
    <div className="flex flex-col max-w-lg pb-3 max-h-[700px] bg-richblack-800">
      <div className="py-5 flex  items-center">
        <img
          src={post.user.image}
          width={35}
          className="rounded-full mr-2"
        ></img>
        <div className="text-white font-semibold">{post.user.username}</div>
      </div>
      <div className="w-full flex items-center overflow-hidden border-[1px] border-pure-greys-500 rounded-lg">
        <img
          className=" w-full h-full object-cover bg-black"
          src={post.mediaUrl}
        ></img>
      </div>
      <div className="my-3">
        <p className="text-white">
          <span className="font-semibold">{post.user.username}</span>{" "}
          {post.caption}
        </p>
      </div>
      <div className="flex gap-x-5 mt-[2px] items-center">
        <button
          onClick={likeButtonHandler}
          className="flex text-white text-lg gap-1 cursor-pointer hover:opacity-60 transition-all duration-200"
        >
          {liked ? (
            <FcLike className="text-2xl " />
          ) : (
            <FaRegHeart className="text-2xl text-pure-greys-50" />
          )}
          {/*  */}
          <p>{totalLike}</p>
        </button>
        <button
          onClick={openModal}
          className="text-white flex gap-2 items-center cursor-pointer hover:opacity-60 transition-all duration-200"
        >
          <FaRegCommentAlt className="text-2xl text-pure-greys-50" />
          {/* <FaCommentAlt />t<p className="text-lg">{post.comments.length}</p> */}
          <p>{totalComments}</p>
        </button>

        {isModalOpen && (
          <div>
            <CommentsModal
              modalData={allComments}
              token={token}
              postId={postId}
              updateCommentNumber={setTotalComments}
              numberOfComment={totalComments}
              changeIsModalOpen={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        )}
      </div>
      <div className="w-full h-[2px] bg-yellow-600 mt-8"></div>
    </div>
  );
};

export default PostCard;
