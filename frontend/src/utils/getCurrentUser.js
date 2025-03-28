// src/utils/getCurrentUser.js
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};

export default getCurrentUser;
