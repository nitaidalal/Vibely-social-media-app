import axiosInstance from '../api/api';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSuggestedUsers } from '../redux/userSlice';

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const {userData} = useSelector((state) => state.user);
    useEffect(() => {
        if (!userData?._id) return;

        const fetchSuggestedUsers = async () => {
            try {
                const response = await axiosInstance.get('/user/suggested', {
                    withCredentials: true,
                });
                
                dispatch(setSuggestedUsers(response.data.users));
                
            } catch (error) {
                console.error("Error fetching suggested users:", error);
            }
        };

        fetchSuggestedUsers();
    }, [userData?._id]);
};

export default useGetSuggestedUsers;
