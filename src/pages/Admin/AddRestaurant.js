import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import serverOrigin from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';


const AddRestaurant = () => {
  const { authState, logout } = useAuth();

  const [restaurantData, setRestaurantData] = useState({
    name: '',
    location: '',
    mobile: '',
    tableCount: 0,
    userId: '',
  });
  const [users, setUsers] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {

    if (!(authState.isAdmin)) {
      toast.error('Unauthorized! Only admin can access');
      return navigate('/');
    }

    // Fetch all users from the server
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${serverOrigin}/admin/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchUsers();
  }, [authState.isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData({ ...restaurantData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverOrigin}/admin/restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add restaurant');
      }

      toast.success('Restaurant added successfully');
      navigate('/restaurants');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Add A New Restaurant</h1>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={restaurantData.location}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={restaurantData.mobile}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Table Count</label>
            <input
              type="number"
              name="tableCount"
              value={restaurantData.tableCount}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Owner</label>
            <select
              type="userId"
              name="userId"
              value={restaurantData.userId}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Owner</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
