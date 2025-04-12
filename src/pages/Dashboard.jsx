import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import LogoutButton from '../components/LogoutButton';
import LowStockAlert from '../components/LowStockAlert';
import { validRoutes } from '../components/routes'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiBox, FiFileText, FiUsers, FiDollarSign } from 'react-icons/fi';
import { API_URL } from '../config'; // Assurez-vous que le chemin est correct

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [menu, setMenu] = useState([]);
  const [image, setImage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour fermer le sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Icônes pour les éléments du menu
  const menuIcons = {
    'Utilisateurs': <FiUsers className="mr-3" />,
    'Clients': <FiUser className="mr-3" />,
    'Produits': <FiBox className="mr-3" />,
    'Creation Factures': <FiFileText className="mr-3" />,
    // 'Lists Facture': <FiDollarSign className="mr-3" />,
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user && user.image) {
      setImage(user.image);
    }

    let newMenu = [
      { name: 'Clients', path: '/dashboard/clients' },
      { name: 'Produits', path: '/dashboard/produits' },
      { name: 'Creation Factures', path: '/dashboard/factures2' },
      // { name: 'Lists Facture', path: '/dashboard/factures1' }
    ];

    if (user.role === 'SuperAdmin') {
      newMenu.unshift({ name: 'Utilisateurs', path: '/dashboard/users' });
    }

    setMenu(newMenu);
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const allowedRoutes = validRoutes[user.role];
      const isRouteValid = allowedRoutes.includes(location.pathname);
  
      if (isRouteValid) {
        localStorage.setItem('lastVisitedPath', location.pathname);
      } else {
        navigate(user.role === 'SuperAdmin' ? '/dashboard/users' : '/dashboard/clients');
      }
    }
  }, [location.pathname, user, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md lg:hidden focus:outline-none transition-all duration-200 hover:bg-blue-700 shadow-md"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-72 bg-white text-gray-800 p-6 flex flex-col justify-between transform transition-all duration-300 ease-in-out border-r border-gray-200 ${
          isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
        } lg:w-64 h-screen z-40`}
      >
        <div>
          {/* User profile */}
          <div className="flex items-center mb-8 p-4 bg-blue-50 rounded-lg">
            {image ? (
              <img 
                src={`${API_URL}/uploads/${image}`} 
                alt="User" 
                className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 border-2 border-blue-200">
                <FiUser className="text-blue-500" size={20} />
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-800">{user?.nom} {user?.prenom}</h2>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="mt-6">
            <ul className="space-y-2">
              {menu.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      closeSidebar();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path 
                        ? 'bg-blue-100 text-blue-600 font-medium' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {menuIcons[item.name]}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout section */}
        <div className="mt-auto">
          <div className="border-t border-gray-200 pt-4">
            <LogoutButton 
              className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" 
              onClick={closeSidebar}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header with alert */}
          <div className="mb-6">
            <LowStockAlert />
          </div>
          
          {/* Page content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;