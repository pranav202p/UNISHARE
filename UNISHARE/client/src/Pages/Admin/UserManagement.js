import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch users from the backend API
    axios.get('/api/v1/auth/users')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleSort = (sortByField) => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const aValue = a[sortByField].toLowerCase();
      const bValue = b[sortByField].toLowerCase();
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
    setSortBy(sortByField);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleToggleActive = async (userId, currentIsActive) => {
    try {
      const response = await axios.put(`/api/v1/auth/users/${userId}`, { isActive: !currentIsActive });
      const updatedUser = response.data;

      // Update user's isActive status in the local state
      const updatedFilteredUsers = filteredUsers.map(user =>
        user._id === userId ? { ...user, isActive: updatedUser.isActive } : user
      );
      setFilteredUsers(updatedFilteredUsers);

      if (updatedUser.isActive) {
        toast.success('User account activated successfully');
      } else {
        toast.success('User account deactivated successfully');
      }
    } catch (error) {
      console.error('Error toggling user active status:', error);
      // Handle error
      toast.error('Failed to update user account status');
    }
  };
  const handleSignOut = () => {
    // Redirect to the home page ('/')
    navigate('/');
  };
  return (
    <>
      <div className="flex h-screen text-gray-100">
      <div className="w-64 bg-gray-900 fixed top-0 bottom-0">
    <div className="p-5">
      <h1 className="text-lg font-bold">ADMIN</h1>
    </div>
    <nav className="mt-6">
      <Link to="/DashBoard" className="block py-2 px-4 text-2xl mt-4 font-semibold hover:bg-gray-700">Dashboard</Link>
      <Link to="/user" className="block py-2 px-4 text-2xl mt-24 font-semibold hover:bg-gray-700">Users</Link>
      <Link to="/resource" className="block py-2 px-4 text-2xl mt-24 font-semibold hover:bg-gray-700">Resources</Link>
     
      <Link to="/report" className="block py-2 px-4 text-2xl mt-24 font-semibold hover:bg-gray-700">Reporting and Analytics</Link>
    </nav>
  </div>

        <div className="flex flex-col flex-1">
          <header className="bg-gray-200 border-b p-4 flex justify-between items-center">
            <h1 className="text-xl text-blue-800 font">Unishare</h1>
            <div>
              <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full mr-2 hover:bg-gray-300"  onClick={handleSignOut}>
                Sign out
              </button>
           
            </div>
          </header>
          <div className="container ml-64 p-8">
            <h1 className="text-3xl mt-11 text-black font-bold mb-4">User Management</h1>
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 text-black px-3 py-2 rounded-md mb-4"
            />
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th onClick={() => handleSort('firstName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">First Name</th>
                  <th onClick={() => handleSort('lastName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Last Name</th>
                  <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-black whitespace-nowrap">{user.firstName}</td>
                    <td className="px-6 py-4 text-black whitespace-nowrap">{user.lastName}</td>
                    <td className="px-6 py-4 text-black whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 text-black whitespace-nowrap">user</td>
                    <td className="px-6 py-4 text-black whitespace-nowrap">
                      <span className={user.isActive ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full' : 'bg-red-100 text-red-800 px-2 py-1 rounded-full'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleToggleActive(user._id,user.isActive)} className="text-indigo-600 hover:text-indigo-900">
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
