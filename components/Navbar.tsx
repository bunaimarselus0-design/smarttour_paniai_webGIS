import React, { useState } from 'react';
import { Menu, X, Map, Compass, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: <Map size={18} /> },
    { id: 'recommendation', label: 'Rekomendasi', icon: <Compass size={18} /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <nav className="bg-paniai-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex-shrink-0 font-bold text-xl tracking-wider flex items-center gap-2">
              <Map className="text-paniai-500" />
              <span>SmartTour<span className="text-paniai-500">Paniai</span></span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-paniai-800 text-white'
                      : 'text-paniai-100 hover:bg-paniai-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-paniai-800 inline-flex items-center justify-center p-2 rounded-md text-paniai-100 hover:text-white hover:bg-paniai-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-paniai-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                   currentPage === item.id
                      ? 'bg-paniai-900 text-white'
                      : 'text-paniai-100 hover:bg-paniai-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
