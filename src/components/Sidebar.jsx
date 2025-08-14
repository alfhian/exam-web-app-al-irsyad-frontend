import { useState } from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`flex h-screen bg-gray-100`}>
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white`}>
        <div className="flex items-center justify-between p-4">
          <h3 className={`text-xl font-bold ${!isOpen && 'hidden'}`}>Welcome</h3>
          <button onClick={toggleSidebar} className="text-white focus:outline-none focus:ring-0">
            ☰
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="flex items-center p-4 hover:bg-blue-700 cursor-pointer">
              <FaHome className="mr-3" />
              {isOpen && <span>Dashboard</span>}
            </li>
            <li className="flex items-center p-4 hover:bg-blue-700 cursor-pointer">
              <FaUser className="mr-3" />
              {isOpen && <span>Users</span>}
            </li>
            <li className="flex items-center p-4 hover:bg-blue-700 cursor-pointer">
              <FaCog className="mr-3" />
              {isOpen && <span>Settings</span>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Main Content Area</h1>
        <p className="mt-4">This is where your main content will go.</p>
      </div>
    </div>
  );
};

export default Sidebar;
