import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Files } from 'lucide-react';

const Sidebar = () => {
  const { pathname } = useLocation();
  const nav = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20}/> },
    { name: 'Create Article', path: '/create', icon: <FilePlus size={20}/> },
    { name: 'Manage Articles', path: '/manage', icon: <Files size={20}/> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col p-4">
      <div className="text-xl font-black mb-10 px-4 text-indigo-400">CCI ADMIN</div>
      <nav className="space-y-2">
        {nav.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
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
