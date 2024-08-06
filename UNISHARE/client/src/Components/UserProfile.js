import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
    
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const { token } = JSON.parse(authData);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        try {
          const response = await axios.get('/api/v1/auth/user/profile', config);
          const userData = response.data.user;
          console.log(userData)
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData((prevUserData) => ({
      ...prevUserData,
      profilePic: file
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('oldPassword', userData.oldPassword);
    formData.append('newPassword', userData.newPassword);
    formData.append('newPasswordConfirm', userData.newPasswordConfirm);
    
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
  
      try {
        const response = await axios.post('/api/v1/auth/profile', formData, config);
        const updatedUserData = response.data.user;
        console.log(updatedUserData)
        setUserData(updatedUserData); // Update state with the new profile data
        console.log('Profile updated successfully:', updatedUserData);
        // Optionally, display a success message to the user
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Profile update failed: Profile endpoint not found');
          // Display user-friendly error message to inform the user
        } else {
          console.error('Error updating profile:', error);
          // Display generic error message or handle other error cases
        }
      }
    }
  }; 

  return (
    <Layout>
      <div className="flex p-5">
        {/* Settings Sidebar */}
        <div className="bg-white text-black ml-80 mt-11 w-full  md:w-64 flex-shrink-0">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Settings</h1>
            <ul className="mt-4">
              <li className="py-2 border-b border-gray-700"><Link to="/profile" className="block hover:bg-gray-200 px-4">Public Profile</Link></li>
              <li className="py-2 border-b border-gray-700"><Link to="/ads" className="block hover:bg-gray-200 px-4">Your Ads</Link></li>
              <li className="py-2 border-b border-gray-700"><Link to="/wishlist" className="block hover:bg-gray-200 px-4">Your Wishlist</Link></li>
             
            </ul>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="max-w-md mx-80 bg-slate-100 mr-30 rounded-3xl shadow-md p-24 mt-11 mb-20">
          <div className="flex items-center mb-8">
            <img src='/images/user1.png'  alt="Avatar" className="w-20 h-20 rounded-full mr-4" />
            <div>
              <div className="text-2xl font-bold">{userData.firstName} {userData.lastName}</div>
              <div className="text-gray-600">{userData.email}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-xl font-bold p-7 b-4">Login and Security</h3>
              <input
                type="password"
                name="oldPassword"
                value={userData.oldPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md mb-2"
                placeholder="Old Password"
              />
              <input
                type="password"
                name="newPassword"
                value={userData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md mb-2"
                placeholder="New Password"
              />
              <input
                type="password"
                name="newPasswordConfirm"
                value={userData.newPasswordConfirm}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md mb-2"
                placeholder="Confirm New Password"
              />
             
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4  py-2 rounded-md transition duration-300">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
