import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import serverOrigin from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../utils/AuthContext';



const AdminValid = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ADMIN_KEY:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  useEffect(() => {  
    
    if(authState.isAdmin){
      toast.error('Unauthorized! You already have Admin Access');
      return navigate('/');
    }
    if(!(authState.isLoggedIn)){
      toast.error('Please login First to Validate Admin Accessibility');
      return navigate('/login');
    }

  },[]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${serverOrigin}/admin/define`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const userData = await response.json();

      console.log('User Logged In as Admin successfully:', userData);
      toast.success('Admin authorisation Successful');
      navigate("/home");

    } catch (error) {
      console.error('Error during login:', error.message);
      toast.error(`Login failed: ${error.message}`);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Become Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-gray-700">ADMIN KEY</label>
            <input
              type="text"
              name="ADMIN_KEY"
              value={formData.ADMIN_KEY}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ADMIN KEY"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
          >
            Validate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminValid;
