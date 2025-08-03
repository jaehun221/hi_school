// src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ darkMode }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className={`flex space-x-6 px-8 py-2 text-lg font-semibold ${darkMode ? 'bg-[#236B8E] text-white' : 'bg-[#236B8E] text-white'}`}>
      {/* 카테고리 1 */}
      <div className="relative" onMouseEnter={() => toggleMenu('1')} onMouseLeave={() => toggleMenu(null)}>
        <span className="cursor-pointer">1</span>
        {openMenu === '1' && (
          <div className={`absolute top-full left-0 bg-white shadow-lg rounded-md mt-1 w-32 z-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <Link to="/1/1" className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700">1-1</Link>
            <Link to="/1/2" className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700">1-2</Link>
          </div>
        )}
      </div>

      {/* 카테고리 2 */}
      <div className="relative" onMouseEnter={() => toggleMenu('2')} onMouseLeave={() => toggleMenu(null)}>
        <span className="cursor-pointer">2</span>
        {openMenu === '2' && (
          <div className={`absolute top-full left-0 bg-white shadow-lg rounded-md mt-1 w-32 z-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <Link to="/2/1" className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700">2-1</Link>
            <Link to="/2/2" className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700">2-2</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
