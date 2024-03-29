// import React, { useEffect, useState } from 'react';
// import SearchedItem from '../Components/Search/SearchedItem';
// import UserProfile from '../Components/Profile/UserProfile';
// import { getAllUsers } from '../services/operations/authAPI';

// const SearchPage = () => {
//     const token = localStorage.getItem("token").split('"')[1];
//     const [allUsers, setAllUsers] = useState([]);
//     const [matchingUsers , setMatchingUsers] = useState([]);
//     const [showUserProfile, setShowUserProfile] = useState(false);
//     const [searchUser , setSearchUser] = useState('');
//     const [userId , setUserId] = useState('');

//     const handleShowUserProfile = () => {
//         setShowUserProfile(true);
//     };

//     useEffect(() => {
//         const fetchAllUsers = async () => {
//             try {
//                 const res = await getAllUsers(token);
//                 setAllUsers(res.users);
//             } catch(error) {
//                 console.error("Error fetching user data:", error.message);
//             }
//         }
//         if (token) {
//             fetchAllUsers();
//         }
//     }, [token , userId]);

//     const changeHandler = (event) => {
//         setSearchUser(event.target.value);
//     };

//     useEffect(() => {
//         if(searchUser) {
//             const filteredUsers = allUsers.filter(user =>
//                 user.username.toLowerCase().includes(searchUser.toLowerCase())
//             );
//             setMatchingUsers(filteredUsers);
//         } else {
//             setMatchingUsers([]);
//         }
//     }, [searchUser, allUsers]);

//     const handleSearchItemClick = (userId) => {
//         setUserId(userId);
//         handleShowUserProfile();
//     };

//     return (
//         <div className='flex flex-row p-10 gap-5 w-full h-screen justify-stretch'>
//             <div className='flex flex-col bg-richblack-700 w-4/12 h-full p-5 rounded-md gap-5'>
//                 <h1 className='text-richblack-5 text-3xl font-semibold'>SEARCH</h1>
//                 <form action="">
//                     <label className="w-full relative text-[0.875rem] text-pure-greys-5  mb-1 leading-[1.375rem]">
//                         <input
//                             required
//                             type="text"
//                             name="search"
//                             onChange={changeHandler}
//                             placeholder="Search"
//                             className="bg-richblack-500 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
//                         />
//                     </label>
//                 </form>

//                 <div className='w-full h-[1px] bg-yellow-500 mt-5'></div>

//                 <SearchedItem 
//                     matchingUsers={matchingUsers}
//                     handleSearchItemClick={handleSearchItemClick}
//                 />
//             </div>

//             <div className='flex flex-row bg-richblack-700 w-full p-5 rounded-md overflow-y-scroll scroll-smooth scrolling'>
//                 {showUserProfile && <UserProfile userId={userId} matchingUsers={matchingUsers} handleSearchItemClick={handleSearchItemClick}/>}
//             </div>
//         </div>
//     );
// }

// export default SearchPage;





import React, { useEffect, useState } from 'react';
import SearchedItem from '../Components/Search/SearchedItem';
import UserProfile from '../Components/Profile/UserProfile';
import { getAllUsers } from '../services/operations/authAPI';
import RecentSearched from '../Components/Search/RecentSearched';

const SearchPage = () => {
    const token = localStorage.getItem("token").split('"')[1];
    const [allUsers, setAllUsers] = useState([]);
    const [matchingUsers, setMatchingUsers] = useState([]);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [userId, setUserId] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [recentMatchingUser, setRecentMatchingUser] = useState([]);

    const handleShowUserProfile = () => {
        setShowUserProfile(true);
    };

    useEffect(() => {
        const recentSearchesFromStorage = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(recentSearchesFromStorage);
    }, []);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await getAllUsers(token);
                setAllUsers(res.users);
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        }
        if (token) {
            fetchAllUsers();
        }
    }, [token, userId]);

    const changeHandler = (event) => {
        setSearchUser(event.target.value);
    };
    console.log("recentMatchingUser",recentMatchingUser)
    useEffect(() => {
        if (searchUser) {
            const filteredUsers = allUsers.filter(user =>
                user.username.toLowerCase().includes(searchUser.toLowerCase())
            );
            setMatchingUsers(filteredUsers);
        } else if (recentMatchingUser) {
            setMatchingUsers([recentMatchingUser]);
            console.log("after recentMatchingUser updation to MatchingUsers",matchingUsers)
        } else {
            setMatchingUsers([]);
        }
    }, [searchUser, allUsers , recentMatchingUser]);

    const handleSearchItemClick = (userId) => {
        setUserId(userId);
        setRecentMatchingUser(userId)
        handleShowUserProfile();
        // Update recent searches
        if (!recentSearches.some(search => search._id === userId)) { // Check if the userId is not already in recentSearches
            const updatedRecentSearches = [userId, ...recentSearches];
            // Remove duplicates
            const uniqueRecentSearches = Array.from(new Set(updatedRecentSearches.map(search => search._id)))
                .map(id => updatedRecentSearches.find(search => search._id === id));
            // Limit the number of recent searches to, for example, 5
            if (uniqueRecentSearches.length > 5) {
                uniqueRecentSearches.pop(); // Remove the last search if the array length exceeds 5
            }
            setRecentSearches(uniqueRecentSearches);
            // Update localStorage
            localStorage.setItem('recentSearches', JSON.stringify(uniqueRecentSearches));
        }      
    };
    const handleRemoveRecentSearch = (userId) => {
        const updatedRecentSearches = recentSearches.filter(search => search._id !== userId);
        setRecentSearches(updatedRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
        console.log("RecentSearches in Remove Function",recentSearches)
    };


    console.log("RSRSRSRSRSRSRSRSRSRSRSRSRSRSR",recentSearches)

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

                { searchUser ? <SearchedItem
                    matchingUsers={matchingUsers}
                    handleSearchItemClick={handleSearchItemClick}
                /> : <RecentSearched 
                setRecentMatchingUser={setRecentMatchingUser}
                matchingUsers={matchingUsers}
                recentSearches={recentSearches} 
                handleSearchItemClick={handleSearchItemClick} 
                removeRecentSearch={handleRemoveRecentSearch}/> }

            </div>

            <div className='flex flex-row bg-richblack-700 w-full p-5 rounded-md overflow-y-scroll scroll-smooth scrolling'>
                {showUserProfile && <UserProfile userId={userId} matchingUsers={matchingUsers} handleSearchItemClick={handleSearchItemClick} />}
            </div>
        </div>
    );
}

export default SearchPage;
