import React from 'react'
import axiosInstance from '../api/api';
import {useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSuggestedUsers } from '../redux/userSlice';

const getSuggestedUsers = () => {
    const dispatch = useDispatch();
    const {userData} = useSelector((state) => state.user);
    useEffect(() => {
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
    }, [userData]);
};

export default getSuggestedUsers;
