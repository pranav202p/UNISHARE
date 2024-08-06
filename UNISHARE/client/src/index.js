import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/auth';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { WishlistProvider } from './context/useWishlist';

// Create a root using ReactDOM.createRoot for concurrent mode
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the root with the application components wrapped in providers
root.render(

    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
 
);

// Measure performance with reportWebVitals
reportWebVitals();
