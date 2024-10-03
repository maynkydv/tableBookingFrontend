import React, { useEffect, useState } from 'react';
import serverOrigin from '../../utils/constant';
import { toast } from 'react-hot-toast';
import { useNavigate ,useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";


const RestaurantBookings = () => {
  const { restaurantId } = useParams(); 
  const [cookies, setCookie, removeCookie] = useCookies(["tokenId"]);
  const [bookings, setBookings] = useState([]);
  // const [isAdmin , setIsAdmin] = useState(false);
  const navigate = useNavigate();
  let isAdmin = false;

  useEffect(() => {
    const tokenId = cookies.tokenId;
    if (tokenId) {
      const decodedToken = jwtDecode(tokenId);
      isAdmin = (decodedToken.role == 'admin');
    }

    if (!isAdmin) {
      toast.error('Unauthorized: Only admin can access');
      return navigate('/');
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${serverOrigin}/admin/restaurant/${restaurantId}/bookings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }

        const data = await response.json();
        setBookings(data.bookings);
        console.log(data.bookings);

        if(!data) {
          toast.error('No Booking Available')
          return navigate('/restaurants');
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Bookings of {bookings[0]?.restaurantName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.userId} className="bg-white shadow-md rounded-md p-4 border">
            <h2 className="font-bold text-xl">Table Number: {booking.tableNumber}</h2>
            <p className="text-gray-700">Date: {booking.date}</p>
            <p className="text-gray-700">From: {booking.startTime}</p>
            <p className="text-gray-700">To: {booking.endTime}</p>
            <p className="text-gray-700">For: {booking.guestCount} Guest</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantBookings;
