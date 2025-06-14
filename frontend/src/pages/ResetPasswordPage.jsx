import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Eye, EyeClosed, Lock, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/Input";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isLoading, message } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useParams();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleReset = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert("password and confirm password doesn't match");
        return;
      }
      await resetPassword(token, password);
      toast.success("password reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-md w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl
overflow-hidden"
    >
      <div className="p-8">
        <h2
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent
bg-clip-text"
        >
          Reset Password
        </h2>
        <form onSubmit={handleReset}>
          <Input
            leftIcon={Lock}
            rightIcon={showPassword ? EyeClosed : Eye}
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password.trim()}
            onChange={(e) => setPassword(e.target.value)}
            onRightIconClick={togglePasswordVisibility}
          />
          <Input
            leftIcon={Lock}
            rightIcon={showPassword ? EyeClosed : Eye}
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword.trim()}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onRightIconClick={togglePasswordVisibility}
          />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
          font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 ☐ focus:ring-green-500 focus:ring-offset-2
          focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
