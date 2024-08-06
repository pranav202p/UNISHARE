import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className='w-1/6 text-white '>
      <div className="bg-gray-900 h-full">
        <div className="p-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <Link to ="/DashBoard" className="block py-2 px-4 text-2xl mt-4 font-semibold hover:bg-gray-700">Dashboard</Link>
          <Link to="/user" className="block py-2 px-4 text-2xl mt-11 font-semibold hover:bg-gray-700">Users</Link>
          <Link to="/resource" className="block py-2 px-4 text-2xl mt-11 font-semibold hover:bg-gray-700">Resources</Link>
          <Link to="/category" className="block py-2 px-4 text-2xl mt-11 font-semibold hover:bg-gray-700">Category</Link>
          <Link to="/report" className="block py-2 px-4 text-2xl mt-11 font-semibold hover:bg-gray-700">Reporting and Analytics</Link>
        </nav>
      </div>
    </div>
  );
}
