
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Info } from 'lucide-react';
import Logo from './Logo';
import { ThemeToggle } from "./ThemeToggle";
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import AdminInfoDialog from './AdminInfoDialog';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useSupabaseAuth();

  // Consider admin user as the email admin@admin.com (replace as needed)
  const ADMIN_EMAIL = "admin@admin.com";
  const isAuthenticated = !!user;
  const isAdmin = user && user.email === ADMIN_EMAIL;

  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];
  const adminNavItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Billing', path: '/billing' },
    { name: 'Reports', path: '/reports' },
  ];

  const navItems = isAuthenticated
    ? (isAdmin ? [...adminNavItems] : adminNavItems)
    : publicNavItems;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-red-600 dark:bg-slate-900 dark:border-red-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-300 dark:bg-slate-800">
        <div className="flex justify-between h-16 bg-slate-200 dark:bg-slate-900">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-10" />
              <span className="text-xl font-bold text-navy-900 dark:text-white hidden sm:block">
                Shreeram Marketing
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(isAdmin
              ? adminNavItems.map(item => (
                  <Link key={item.name} to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-red-600 bg-red-50 border-b-2 border-red-600 dark:text-red-400 dark:bg-red-950 dark:border-red-900'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-red-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name === "Dashboard" ? (
                      <span className="flex items-center">
                        <Shield className="w-4 h-4 mr-1 text-blue-600" /> {item.name}
                      </span>
                    ) : item.name}
                  </Link>
                ))
              : navItems.map(item => (
                  <Link key={item.name} to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-red-600 bg-red-50 border-b-2 border-red-600 dark:text-red-400 dark:bg-red-950 dark:border-red-900'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-red-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )))}
            {/* Info button ALWAYS visible if authenticated */}
            {isAuthenticated && (
              <span className="ml-2">
                <AdminInfoDialog
                  trigger={
                    <button
                      aria-label="App Info"
                      className="inline-flex items-center px-2 py-2 rounded-full bg-blue-50 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-800 transition-colors"
                    >
                      <Info className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                    </button>
                  }
                />
              </span>
            )}
            {!isAuthenticated ? (
              <Link to="/admin-login" className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600">
                Admin Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center dark:bg-red-800 dark:hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            )}
            <ThemeToggle />
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-red-600 p-2 dark:text-gray-200 dark:hover:text-red-400">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-slate-900">
              {(isAdmin
                ? adminNavItems.map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.path)
                          ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950'
                          : 'text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-red-400 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name === "Dashboard" ? (
                        <span className="flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-blue-600" /> {item.name}
                        </span>
                      ) : item.name}
                    </Link>
                  ))
                : navItems.map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.path)
                          ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950'
                          : 'text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-red-400 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))
              )}
              {/* Info button on mobile - always if authenticated */}
              {isAuthenticated && (
                <div className="px-3 py-2">
                  <AdminInfoDialog
                    trigger={
                      <button
                        aria-label="App Info"
                        className="inline-flex items-center px-2 py-2 rounded-full bg-blue-50 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-800 transition-colors"
                      >
                        <Info className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      </button>
                    }
                  />
                </div>
              )}
              {!isAuthenticated ? (
                <Link
                  to="/admin-login"
                  className="block bg-blue-900 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
