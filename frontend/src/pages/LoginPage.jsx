import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeClosed } from "lucide-react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {login, error, isLoading} = useAuthStore()
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
     await login(email, password) 
     navigate("/")
     toast.success("Successfully Logged in")
    } catch (error) {
      console.log(error); 
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            leftIcon={Mail}
            type="email"
            placeholder="Email Address"
            value={email.trim()}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            leftIcon={Lock}
            rightIcon={showPassword ? EyeClosed : Eye}
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password.trim()}
            onChange={(e) => setPassword(e.target.value)}
            onRightIconClick={togglePasswordVisibility}
          />
          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:underline"
            >
              Forgot Passsword?
            </Link>
          </div>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
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
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link className="text-green-400 hover:underline" to={"/signup"}>
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
