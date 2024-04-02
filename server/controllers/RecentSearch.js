const RecentSearch = require("../models/RecentSearch");
const User = require("../models/User");

// Controller to add userId to recentSearches array
exports.addRecentSearch = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(req.user.id);
    const isUserValid = await User.findById(req.body.userId);
    console.log("userId", userId);
    console.log("user", user.id);

    if (!isUserValid) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the userId is already in recentSearches
    user?.recentSearches.forEach((search) => {
      // const searchedData = await RecentSearch.findById(search);

      if (search?.searchedUser === userId) {
        return res
          .status(400)
          .json({ success: false, message: "Already searched" });
      }
    });
    const newSearch = new RecentSearch({
      user: user,
      searchedUser: userId,
    });
    const savedSearch = await newSearch.save();

    // Update the user with the new search ID
    await User.findByIdAndUpdate(req.user.id, {
      $push: { recentSearches: savedSearch._id },
    });

    return res
      .status(200)
      .json({ success: true, message: "User added to recent searches", user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Controller to remove userId from recentSearches array
exports.removeRecentSearch = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(req.user.id);

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const deletedSearch = await RecentSearch.findByIdAndDelete(userId);

    if (!deletedSearch) {
      console.log(userId);
      return res.status(404).json({
        success: false,
        message: "Seach not found",
      });
    }

    await User.findByIdAndUpdate(user, {
      $pull: { recentSearches: deletedSearch._id },
    });

    return res.status(200).json({
      success: true,
      message: "User removed from recent searches",
      user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
