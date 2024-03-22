import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/operations/authAPI';
import { MdOutlineSearch } from "react-icons/md";
import SearchedItem from '../Components/Search/SearchedItem';
import UserProfile from '../Components/Profile/UserProfile';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';

const SearchPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token").split('"')[1];
    const [allUsers, setAllUsers] = useState([]);
    const [matchingUsers , setMatchingUsers] = useState([]);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [searchUser , setSearchUser] = useState('');
    const [userId , setUserId] = useState([]);

    const handleShowUserProfile = () => {
        setShowUserProfile(true);
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await getAllUsers(token);
                setAllUsers(res.users);
            } catch(error) {
                console.error("Error fetching user data:", error.message);
            }
        }
        if (token) {
            fetchAllUsers();
        }
    }, [token]);

    const changeHandler = (event) => {
        setSearchUser(event.target.value);
    };

    useEffect(() => {
        if(searchUser) {
            const filteredUsers = allUsers.filter(user =>
                user.username.toLowerCase().includes(searchUser.toLowerCase())
            );
            setMatchingUsers(filteredUsers);
        } else {
            setMatchingUsers([]);
        }
    }, [searchUser, allUsers]);

    const handleSearchItemClick = (userId , username) => {
        setUserId(userId);
        handleShowUserProfile();
        navigate(`/search/${username}`);
    };

    return (
        <div className='flex flex-row p-10 gap-5 w-full h-screen justify-stretch'>
            <div className='flex flex-col bg-richblack-700 w-4/12 h-full p-5 rounded-md gap-5'>
                <h1 className='text-richblack-5 text-3xl font-semibold'>SEARCH</h1>
                <form action="">
                    <label className="w-full relative text-[0.875rem] text-pure-greys-5  mb-1 leading-[1.375rem]">
                        <input
                            required
                            type="text"
                            name="search"
                            onChange={changeHandler}
                            placeholder="Search"
                            className="bg-richblack-500 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
                        />
                    </label>
                </form>

                <div className='w-full h-[1px] bg-yellow-500 mt-5'></div>

                <SearchedItem 
                    matchingUsers={matchingUsers}
                    handleSearchItemClick={handleSearchItemClick}
                />
            </div>

            <div className='flex flex-row bg-richblack-700 w-full p-5 rounded-md '>
                {showUserProfile ? <UserProfile userId={userId} /> : null}
            </div>
        </div>
    );
}

export default SearchPage;
