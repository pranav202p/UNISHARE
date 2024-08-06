import React, { createContext, useState, useContext } from 'react';

// Create Wishlist Context
const WishlistContext = createContext();

// Custom hook to use the WishlistContext
export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Wishlist Context Provider
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.productId !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const wishlistContextValue = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={wishlistContextValue}>
      {children}
    </WishlistContext.Provider>
  );
};
