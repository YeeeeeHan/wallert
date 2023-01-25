const User = require("../models/userModel");

const createUser = ({ username, walletAddress, tgChatId }) => {
  const u = User.create({
    username,
    walletAddress,
    tgChatId,
  });

  return u;
};

module.exports = {
  createUser,
};
