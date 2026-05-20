import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  Mail, 
  MessageSquare, 
  Share2, 
  GitMerge, 
  Link, 
  Bot, 
  TrendingUp, 
  Settings, 
  Wrench, 
  LayoutGrid, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Circle
} from 'lucide-react';

import { ElementType } from 'react';

interface InstagramIconProps {
  size?: number | string;
  className?: string;
}

const InstagramIcon = ({ size = 20, className }: InstagramIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface SidebarItemProps {
  icon?: ElementType;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  submenuItems?: string[];
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  hasSubmenu, 
  isOpen, 
  onClick,
  submenuItems = [] 
}: SidebarItemProps) => {
  return (
    <div className="flex flex-col">
      <div 
        onClick={onClick}
        className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors duration-200 group ${
          isActive ? 'text-[#00df82]' : 'text-slate-300 hover:text-[#00df82] hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-4">
          {Icon && <Icon size={20} className={isActive ? 'text-[#00df82]' : 'text-slate-400 group-hover:text-[#00df82]'} />}
          <span className="text-[15px] font-medium">{label}</span>
        </div>
        {hasSubmenu && (
          <div className="text-slate-500">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </div>
      
      {hasSubmenu && isOpen && (
        <div className="bg-black/10 py-1">
          {submenuItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 px-10 py-2.5 cursor-pointer text-slate-300 hover:text-[#00df82] hover:bg-white/5 transition-colors duration-200"
            >
              <Circle size={6} className="fill-current text-current opacity-80" />
              <span className="text-[14px]">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [openMenus, setOpenMenus] = useState({
    audience: true,
    campaigns: true,
    analytics: true,
    settings: true,
    toolsSettings: true,
  });

  const toggleMenu = (menu: keyof typeof openMenus) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`w-72 h-screen bg-[#001f1f] flex flex-col fixed left-0 top-0 overflow-y-auto scrollbar-hide z-40 shadow-2xl border-r border-white/5 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder */}
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <Circle size={20} className="rotate-45" /> {/* Simple X mock */}
          </button>
        </div>

        <nav className="flex-1 pb-10">
        <SidebarItem 
          icon={Home} 
          label="Homepage" 
          isActive={true} 
        />
        
        <SidebarItem 
          icon={FileText} 
          label="Templates" 
          hasSubmenu={true}
        />

        <SidebarItem 
          icon={Users} 
          label="Audience" 
          hasSubmenu={true}
          isOpen={openMenus.audience}
          onClick={() => toggleMenu('audience')}
          submenuItems={['Contacts', 'List Segment', 'Live Segment']}
        />

        <SidebarItem 
          icon={Mail} 
          label="Campaigns" 
          hasSubmenu={true}
          isOpen={openMenus.campaigns}
          onClick={() => toggleMenu('campaigns')}
          submenuItems={['RCS Campaign', 'SMS Campaign', 'WhatsApp Campaign', 'Email Campaign']}
        />

        <SidebarItem 
          icon={MessageSquare} 
          label="Chats" 
          hasSubmenu={true}
        />

        <SidebarItem 
          icon={Share2} 
          label="Flow" 
        />

        <SidebarItem 
          icon={GitMerge} 
          label="Journey Builder" 
        />

        <SidebarItem 
          icon={Link} 
          label="Integration" 
        />

        <SidebarItem 
          icon={InstagramIcon} 
          label="Instagram" 
        />

        <SidebarItem 
          icon={Bot} 
          label="AI Assistant" 
        />

        <SidebarItem 
          icon={TrendingUp} 
          label="Analytics" 
          hasSubmenu={true}
          isOpen={openMenus.analytics}
          onClick={() => toggleMenu('analytics')}
          submenuItems={[
            'Abandoned Cart', 
            'Notification Log', 
            'Ai call Log', 
            'WhatsApp Campaign', 
            'RCS Campaign', 
            'Email Campaign', 
            'Whatsapp Orders', 
            'Agent & chatbot'
          ]}
        />

        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          hasSubmenu={true}
          isOpen={openMenus.settings}
          onClick={() => toggleMenu('settings')}
          submenuItems={[
            'Opt-in Management', 
            'Lead Capture Tools', 
            'Create Agent', 
            'Manage Tags', 
            'Profile'
          ]}
        />

        <SidebarItem 
          icon={Wrench} 
          label="ToolsSettings" 
          hasSubmenu={true}
          isOpen={openMenus.toolsSettings}
          onClick={() => toggleMenu('toolsSettings')}
          submenuItems={['QrCode', 'wallet', 'API Keys']}
        />

        <SidebarItem 
          icon={LayoutGrid} 
          label="Configuration" 
        />

        <SidebarItem 
          icon={LogOut} 
          label="Log Out" 
        />
      </nav>
    </div>
    </>
  );
};

export default Sidebar;

