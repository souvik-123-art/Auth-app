import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/formatDate";
const DashboardPage = () => {
  const { user, logout, isLoading } = useAuthStore();
  const handleLogout = ()=>{
    logout()
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
      className="max-w-md p-8 w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl
  overflow-hidden"
    >
      <h2
        className="text-3xl font-bold mb-6 text-center bg-gradient-to-r
from-green-400 to-emerald-600
text-transparent bg-clip-text"
      >
        Dashboard
      </h2>
      <div className="space-y-6">
        <motion.div
          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3
            className="text-xl font-semibold
text-green-400 mb-3"
          >
            Profile Information
          </h3>
          <p className="text-gray-300">Name: {user?.name}</p>
          <p className=" text-gray-300">Email: {user?.email}</p>
        </motion.div>
        <motion.div
          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            Account Activity
          </h3>
          <p className="text-gray-300">
            <span className="font-bold">Joined: </span>
            {new Date(user?.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Last Login: </span>
            {formatDate(user?.lastLogin)}
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-md
shadow-lg hover:from-red-600 hover:to-red-700
focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >{isLoading? "Logging Out" : "Log Out"}</motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
