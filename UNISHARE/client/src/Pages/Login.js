import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import axios from "axios";
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth';

export default function Login() {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  

  useEffect(() => {
    // Check if user is already authenticated
    if (auth && auth.token) {
      navigate('/');
    }
  }, [auth, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    try {
      const res = await axios.post('/api/v1/auth/login', formData);
      if (res.data.success) {
        const user = res.data.user;
        if (!user.isActive) {
          // Check if the user's account was previously deactivated
          if (auth && auth.user && !auth.user.isActive) {
            // If the account was previously deactivated but is now active
            toast.success('Your account has been reactivated. You can now login.');
          } else {
            // If the account is currently deactivated
            toast.error('Your account is deactivated. Please contact the administrator.');
            return;
          }
        } else {
          // If the user's account is active
          toast.success(res.data && res.data.message);
          setAuth({
            user: res.data.user,
            token: res.data.token,
          });
          localStorage.setItem('auth', JSON.stringify(res.data));
          navigate('/');
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error("Something went wrong");
    }
    setFormData({
      email: '',
      password: '',
    });
};

  const toggleModal = () => {
    setShowModal(!showModal);
    navigate('/');
  };

  return (
    <Layout title={"Login"}>
 <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!auth.token && showModal &&
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', maxWidth: '400px', width: '80%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={toggleModal} style={{ cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontSize: '20px' }}>&times;</button>
            </div>
            <h2 className='flex justify-center text-2xl p-5 mx-auto mt-0 px-1'>Login</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email" className='text-2xl'>Email:</label><br />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="password" className='text-2xl'>Password:</label><br />
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
              <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#3498db', color: '#fff', border: 'none', cursor: 'pointer' }}>Login</button>
            </form>
          </div>
        </div>
       
      }
       </div>
    </Layout>
  );
}
