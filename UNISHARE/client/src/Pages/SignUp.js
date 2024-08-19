import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../Components/Layout';

const Signup = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    Phoneno: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validatePhoneNo = (phoneNo) => {
    const phoneRegex = /^[0-9]{10}$/; // Regular expression to match a 10-digit number
    return phoneRegex.test(phoneNo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form fields
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.Phoneno ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error('All fields are required');
        return;
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(christuniversity\.in)$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address from christuniversity.in domain');
        return;
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Validate phone number
      if (!validatePhoneNo(formData.Phoneno)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      if (formData.password.length < 5) {
        toast.error('Password must be at least 5 characters long');
        return;
      }

      // Make POST request to register user
      const res = await axios.post('https://unishare.onrender.com/api/v1/auth/register', formData);

      if (res.data.success) {
        setSubmitSuccess(true);
        
        // Send email verification request
        await axios.post('https://unishare.onrender.com/api/v1/auth/send-verification-email', {
          firstName: formData.firstName,
          email: formData.email
        });

        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
    }
  };
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get('https://unishare.onrender.com/api/v1/auth/verify');
        console.log('Email verification response:', response.data);
        
      } catch (error) {
        console.error('Error verifying email:', error);
        
      }
    };

    verifyEmail(); // Call the verifyEmail function when the component mounts
  }, );

  return (
    <Layout title="Signup">
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', maxWidth: '400px', width: '500px' ,height:'500px' }}>
          <button onClick={() => navigate('/')} style={{ cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontSize: '20px', alignSelf: 'flex-end' }}>
            &times;
          </button>
          <h1 style={{ textAlign: 'center', textsize:'80px',marginBottom: '20px'  } }>Signup</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
            <input type="text" name="Phoneno" placeholder="Phone no" value={formData.Phoneno} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Signup</button>
          </form>
          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Registration successful. Please verify your email.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  onClick={() => setSubmitSuccess(false)}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 112 0v5a1 1 0 11-2 0V4zm2 10a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
