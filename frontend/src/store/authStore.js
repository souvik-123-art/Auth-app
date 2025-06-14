import { create } from "zustand";
import axios from "axios";
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:7000/api/auth" : "/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: false,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  verifyCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "error verifying acoount",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({isLoading: true, error: null });
   try{ await axios.post(`${API_URL}/logout`);
    set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
    set({ error: "Error logging out", isLoading: false });
    throw error;
    }
  },
  checkAuth: async ()=>{
    set({isCheckingAuth: true, error: null})
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false})
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
      });
      throw error
    }
  },
  forgotPassword: async (email)=>{
    set({isLoading: true, error: null , message: null})
    try {
     const response = await axios.post(`${API_URL}/forgot-password`, {email});
     set({message: response.data.message, isLoading:false})
    } catch (error) {
      set({isLoading: false,
        error: error.response.data.message || "Error Sending Reset Password Email"
      })
      throw error
    }
  },
  resetPassword: async (token, password)=>{
    set({isLoading: true, error: null , message: null})
    try {
     const response = await axios.post(`${API_URL}/reset-password/${token}`, {password});
     set({message: response.data.message, isLoading:false})
    } catch (error) {
      set({isLoading: false,
        error: error.response.data.message || "Error Reseting password"
      })
      throw error
    }
  }
}));
