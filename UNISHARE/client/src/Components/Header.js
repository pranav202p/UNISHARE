import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { toast } from 'react-toastify';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // New state for managing notification visibility
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: ''
    });
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');
    setShowDropdown(false); // Close the dropdown after logout
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggle the visibility of notification messages
  };

  return (
    <nav
      className={`lg:px-16 px-4 shadow-lg bg-transparent flex items-center fixed justify-between py-4 ${
        visible ? 'sticky top-0' : 'hidden'
      }`}
    >
      <div className="flex items-center">
        <Link to="/" className="text-3xl font-serif italic text-black mr-8">
          Unishare
        </Link>
        <ul className="md:flex items-center justify-between text-base text-gray-700">
          <li>
            <Link
              to="/home"
              className="md:p-4 py-3 hover:bg-gray-300 text-black px-0 block"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/buy"
              className="md:p-4 py-3 px-3 hover:bg-gray-300 text-black block"
            >
              Products
            </Link>
          </li>
          {auth.user && (
            <li>
              <Link
                to="/sell"
                className="md:p-4 py-3 hover:bg-gray-300 text-black px-0 block"
              >
                Sell
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/about"
              className="md:p-4 py-3 hover:bg-gray-300 text-black px-0 block"
            >
              About us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="md:p-4 py-3 hover:bg-gray-300 text-black px-0 block md:mb-0 mb-2"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center">
        {auth.user && (
          <Link to=" " className="mr-4 relative">
            <img src="\images\notification.png" alt="Notification" className="h-6 w-6 me-9 " onClick={handleNotificationClick} />
          </Link>
        )}

        {auth.user && (
          <button
            className="group flex h-8 w-8 flex-col items-end justify-evenly pr-[3px] z-50 undefined hover:after:bg-w-90015 relative after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-lg after:content-[&quot;&quot;]"
            aria-label="Navigation toggle"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {showDropdown ? (
              <>
                <div className="h-px w-[1.6rem] rounded-full border-t-[1.5px] border-black transition duration-300 translate-y-[8.5px] rotate-45"></div>
                <div className="h-px w-[1.6rem] rounded-full border-t-[1.5px] border-black transition duration-300 opacity-0"></div>
                <div className="h-px w-[1.6rem] rounded-full border-t-[1.5px] border-black transition duration-300 -translate-y-[8.5px] -rotate-45"></div>
              </>
            ) : (
              <>
                <div className="h-px w-[1.6rem] rounded-full border-t-[2px] border-black transition duration-300"></div>
                <div className="h-px w-[1.3rem] rounded-full border-t-[1px] border-black transition duration-300"></div>
                <div className="h-px w-[1rem] rounded-full border-t-[1px] border-black transition duration-300"></div>
              </>
            )}
          </button>
        )}

        {showDropdown && (
          <ul className="absolute top-16 right-4 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-10">
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-black bg-white"
              >
                Your profile
              </Link>
            </li>
            
            
            <li>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        )}

        {!auth.user ? (
          <div className="flex justify-between px-4 items-center">
            <Link
              to="/login"
              className="md:p-4 bg-gray-600 text-white hover:bg-gray-500 rounded-full py-2 px-4 block"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="md:p-4 bg-blue-600 text-white hover:bg-blue-400 rounded-full py-2 px-4 block"
            >
              SignUp
            </Link>
          </div>
        ) : null}
      </div>
      {/* Notification dropdown */}
      {showNotifications && (
      <div className="absolute top-16 right-14 bg-white p-4 border border-gray-200 rounded-md shadow-lg z-10" style={{ width: "200px", maxHeight: "400px", overflowY: "auto" }}>
      {/* Render your notification messages here */}
      <p>No notifications</p>
    </div>
    
      )}
    </nav>
  );
};

export default Header;
