import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

export default function ResourceManagement() {
    const [resources, setResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResources, setFilteredResources] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch all resources from the backend when component mounts
      axios.get('/api/v1/auth/products')
        .then(response => {
          setResources(response.data.products);
          setFilteredResources(response.data.products);
        })
        .catch(error => console.error('Error fetching resources:', error));
    }, []);

    const handleSearch = (event) => {
      const term = event.target.value.toLowerCase();
      setSearchTerm(term);
      const filtered = resources.filter(resource =>
        resource.productName.toLowerCase().includes(term) ||
        resource.productCategory.toLowerCase().includes(term)
      );
      setFilteredResources(filtered);
    };

    const updateResourceStatus = (productId, status) => {
      const updatedResources = resources.map(resource => {
        if (resource._id === productId) {
          return { ...resource, isApproved: status };
        }
        return resource;
      });
      setResources(updatedResources);
      setFilteredResources(updatedResources);
    };

    const approveResource = (productId) => {
      axios.put(`/api/v1/auth/products/${productId}/approve-reject`, { isApproved: true })
        .then(response => {
          updateResourceStatus(productId, true);
          console.log('Resource approved successfully:', response.data);
        })
        .catch(error => console.error('Error approving resource:', error));
    };

    const rejectResource = (productId) => {
      axios.put(`/api/v1/auth/products/${productId}/approve-reject`, { isApproved: false })
        .then(response => {
          updateResourceStatus(productId, false);
          console.log('Resource rejected successfully:', response.data);
        })
        .catch(error => console.error('Error rejecting resource:', error));
    };

    const deleteResource = (productId) => {
      axios.delete(`/api/v1/auth/products/${productId}/delete`)
        .then(response => {
          const updatedResources = resources.filter(resource => resource._id !== productId);
          setResources(updatedResources);
          setFilteredResources(updatedResources);
          console.log('Resource deleted successfully:', response.data);
        })
        .catch(error => console.error('Error deleting resource:', error));
    };

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalIsOpen(true);
      };
    
      const closeModal = () => {
        setSelectedImage(null);
        setModalIsOpen(false);
      };
      const handleSignOut = () => {
        // Redirect to the home page ('/')
        navigate('/');
      };
    return (
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
          <header className="bg-gray-200 border-b p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl text-blue-800 font">Unishare</h1>
              <div>
                <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full mr-2 hover:bg-gray-300"  onClick={handleSignOut}>
                  Sign out
                </button>
                
              </div>
            </div>
          </header>


          <div className="p-4 ml-64">
            <h2 className="text-3xl font-bold mx-4 text-black mb-4">Resource Management</h2>
            <input
              type="text"
              placeholder="Search resources"
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 text-black px-3 py-2 rounded-md mb-4"
            />
            <div className="grid grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <div key={resource._id} className="bg-gray-300 p-4">
                <h3
                  className="text-xl text-black font-semibold cursor-pointer"
                  onClick={() => openModal(resource.productImage)}
                >
                  {resource.productName}
                </h3>
                  <p className="text-lg text-black mb-2">Category: {resource.productCategory}</p>
                  <p className="mb-2 text-black">Description: {resource.productDescription}</p>
                  {resource.isApproved ? (
                    <p className="text-green-600">Status: Approved</p>
                  ) : (
                    <p className="text-red-600">Status: Pending Approval</p>
                  )}
                  <div className="flex justify-between mt-4">
                    <button onClick={() => approveResource(resource._id)} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Approve</button>
                    <button onClick={() => rejectResource(resource._id)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Reject</button>
                    <button onClick={() => deleteResource(resource._id)} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal for displaying product image */}
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        overlayClassName="overlay"
      >
        <div className="modal-content bg-white p-4 rounded-lg">
          <button onClick={closeModal} className="absolute top-2 right-2 text-3xl font-bold cursor-pointer">&times;</button>
          {selectedImage && <img src={selectedImage} alt="Product" className="w-full rounded-lg" />}
        </div>
      </Modal>
      </div>
    );
}
