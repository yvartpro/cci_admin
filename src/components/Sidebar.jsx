import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Files, Users, LogOut, Image, GalleryHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const nav = [
    { name: 'Tableau de bord', path: '/cci', icon: <LayoutDashboard size={20} /> },
    { name: 'Nouvel article', path: '/cci/create', icon: <FilePlus size={20} /> },
    { name: 'Gerer les articles', path: '/cci/manage', icon: <Files size={20} /> },
    { name: 'Volontaires', path: '/cci/volunteer', icon: <Users size={20} /> },
    { name: 'Images defilantes', path: '/cci/carousel', icon: <GalleryHorizontal size={20} /> },
    { name: 'Gallerie photos', path: '/cci/media', icon: <Image size={20} /> },
    { name: 'Partenaires', path: '/cci/partner', icon: <Image size={20} /> },
    { name: 'Titres', path: '/cci/title', icon: <Image size={20} /> },
    { name: 'Comitards', path: '/cci/comitard', icon: <Image size={20} /> },
    { name: "Deconnexion", path: '/cci/logout', icon: <LogOut size={20} />, onClick: logout },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col p-4">
      <div className="text-xl font-black mb-10 px-4 text-indigo-400">CCI ADMIN</div>
      <nav className="space-y-2">
        {nav.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={item.onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === item.path ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800'}`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
export default Sidebar;
