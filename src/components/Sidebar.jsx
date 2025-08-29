import { useState } from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Menus from './Menu';
import axios from 'axios';

const Sidebar = ({children}) => {
  const [isOpen, setIsOpen] = useState(true);

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : {};
  const role = decoded.role;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      // Token expired, logout silently
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to login page
    } else {
      // Token is valid, proceed with logout
      axios.post('http://localhost:3000/api/auth/logout', {}, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          localStorage.removeItem('token');
          window.location.href = '/'; // Redirect to login page
        })
        .catch(err => {
          console.error('Logout failed:', err);
        });
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100`}>
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white`}>
        <div className="flex items-center justify-between p-4">
          <h3 className={`text-xl font-bold ${!isOpen && 'hidden'}`}>Welcome</h3>
          <button onClick={toggleSidebar} className="text-white focus:outline-none focus:ring-0">
            ☰
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <Menus role={role} />
            <li className="flex items-center p-4 hover:bg-blue-700 cursor-pointer" onClick={handleLogout}>
              <FaUser className="mr-3" />
              {isOpen && <span>Logout</span>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
