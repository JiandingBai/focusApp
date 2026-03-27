import { useState } from 'react';
import { Timer, CheckSquare, FileText, Users, Image, Volume2, Music } from 'lucide-react';
import { SessionModal } from './modals/SessionModal';
import { TasksModal } from './modals/TasksModal';
import { NotesModal } from './modals/NotesModal';
import { FriendsModal } from './modals/FriendsModal';
import { SpacesModal } from './modals/SpacesModal';
import { SoundsModal } from './modals/SoundsModal';

export function Navigation() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  
  const topLinks = [
    { id: 'session', icon: Timer, label: 'Session' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'friends', icon: Users, label: 'Friends' },
  ];
  
  const bottomLinks = [
    { id: 'spaces', icon: Image, label: 'Spaces' },
    { id: 'sounds', icon: Volume2, label: 'Sounds' },
    { id: 'music', icon: Music, label: 'Music' },
  ];
  
  return (
    <>
      <nav className="fixed left-2 top-2 bottom-2 z-50 w-[50px] flex flex-col gap-2">
        <div className="bg-sidebar backdrop-blur-md border border-sidebar-border rounded-lg p-1.5">
          <div className="flex flex-col gap-1.5">
            {topLinks.map((link) => {
              const Icon = link.icon;
              const isActive = openModal === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setOpenModal(isActive ? null : link.id)}
                  className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-md transition-colors text-white ${isActive ? 'bg-primary' : 'bg-secondary hover:bg-sidebar-accent'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[8px] font-['Lato',sans-serif] font-bold leading-none">{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="bg-sidebar backdrop-blur-md border border-sidebar-border rounded-lg p-1.5">
          <div className="flex flex-col gap-1.5">
            {bottomLinks.map((link) => {
              const Icon = link.icon;
              const isActive = openModal === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setOpenModal(isActive ? null : link.id)}
                  className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-md transition-colors text-white ${isActive ? 'bg-primary' : 'bg-secondary hover:bg-sidebar-accent'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[8px] font-['Lato',sans-serif] font-bold leading-none">{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Modals */}
      <SessionModal isOpen={openModal === 'session'} onClose={() => setOpenModal(null)} />
      <TasksModal isOpen={openModal === 'tasks'} onClose={() => setOpenModal(null)} />
      <NotesModal isOpen={openModal === 'notes'} onClose={() => setOpenModal(null)} />
      <FriendsModal isOpen={openModal === 'friends'} onClose={() => setOpenModal(null)} />
      <SpacesModal isOpen={openModal === 'spaces'} onClose={() => setOpenModal(null)} />
      <SoundsModal isOpen={openModal === 'sounds'} onClose={() => setOpenModal(null)} />
    </>
  );
}
