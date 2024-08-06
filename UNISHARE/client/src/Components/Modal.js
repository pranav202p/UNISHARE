import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../Chat/Sidebar';
import Chat from '../Chat/Chat';
import "../style.scss";
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg w-4/6 h-4/6">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3.646 3.646a.5.5 0 01.708 0L10 9.293l5.646-5.647a.5.5 0 01.708.708L10.707 10l5.647 5.646a.5.5 0 01-.708.708L10 10.707l-5.646 5.647a.5.5 0 01-.708-.708L9.293 10 3.646 4.354a.5.5 0 010-.708z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>

     
    </>,
    document.getElementById('modal-root')
  );
};

export default Modal;
