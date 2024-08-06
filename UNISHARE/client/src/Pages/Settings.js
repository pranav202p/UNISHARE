import React ,{useState} from 'react';
import Layout from '../Components/Layout';



export default function Settings() {
  const [formData, setFormData] = useState({
    fullName: 'User Name',
    email: 'user@example.com',
    phoneNo: '1234567890',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Implement logic to save the updated user details to the database
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
       
        </div>
        <div className="flex-1 p-8">
         
        </div>
      
    </Layout>
  );
}
