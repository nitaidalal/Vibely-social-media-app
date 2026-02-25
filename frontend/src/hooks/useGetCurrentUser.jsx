import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setFollowing, setUserData ,setLoading} from '../redux/userSlice';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      // Only fetch if user is logged in (has userData)
      if (!userData) return;

      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/current`,
          { withCredentials: true }
        );
        
        // Update user data with fresh data from backend
        dispatch(setUserData(response.data.user));
        dispatch(setFollowing(response.data.user.following));
      } catch (error) {
        console.error('Error fetching current user:', error);
        // If token is invalid, user will be redirected to login by auth middleware
      }finally {
        dispatch(setLoading(false));
      }
    };

    fetchCurrentUser();
  }, []); // Run only once on mount

  return null;
};

export default useGetCurrentUser;
