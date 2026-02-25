import React from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { clearUserData } from '../redux/userSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { BsArrowBarLeft } from 'react-icons/bs'

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
      try {
        // pass withCredentials in the axios config (3rd arg) so browser sends cookies
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
          {},
          { withCredentials: true },
        );
        dispatch(clearUserData());
        toast.success('Logged out successfully');
        navigate('/signin');
      } catch (error) {
        console.error("Logout error:", error);
        toast.error('Failed to logout');
      }
    };

  return (
    <div className="w-full min-h-screen bg-dark-bg text-dark-text p-4">
      <div className="flex justify-between items-center">
        <p className='text-2xl cursor-pointer font-extrabold' onClick={() => navigate(-1)}>←</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 cursor-pointer bg-accent rounded-md "
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings
