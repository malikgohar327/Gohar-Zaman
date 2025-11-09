import React from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin }) => {
  const linkStyle = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkStyle = "bg-primary text-white";
  const inactiveLinkStyle = "text-gray-600 hover:bg-pink-100 hover:text-primary";

  return (
    <header className="bg-surface shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">
              <span role="img" aria-label="chicken">🍗</span> Sajji Spot
            </h1>
          </div>
          <nav className="flex items-center space-x-2 p-1 bg-gray-200 rounded-lg">
            {/* FIX: Updated NavLink to use a function for className and the `end` prop for react-router-dom v6 compatibility. */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
              }
            >
              Order
            </NavLink>
            {/* FIX: Updated NavLink to use a function for className for react-router-dom v6 compatibility. */}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
              }
            >
              Admin
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};