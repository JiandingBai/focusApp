import { useState, useCallback } from 'react';
import { Timer, CheckSquare, FileText, Users, Image, Volume2, Music, TrendingUp } from 'lucide-react';
import { SessionModal } from './modals/SessionModal';
import { TasksModal } from './modals/TasksModal';
import { NotesModal } from './modals/NotesModal';
import { FriendsModal } from './modals/FriendsModal';
import { SpacesModal } from './modals/SpacesModal';
import { SoundsModal } from './modals/SoundsModal';
import { ProgressModal } from './modals/ProgressModal';

const OFFSETS: Record<string, { x: number; y: number }> = {
  session:  { x: -20, y: -20 },
  tasks:    { x:  20, y:  20 },
  notes:    { x: -60, y:  40 },
  friends:  { x:  60, y: -40 },
  spaces:   { x: -40, y:  60 },
  sounds:   { x:  40, y: -60 },
  music:    { x:   0, y:  80 },
  progress: { x:  80, y:   0 },
};

export function Navigation() {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const close = useCallback((id: string) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const topLinks = [
    { id: 'session',  icon: Timer,       label: 'Session'  },
    { id: 'tasks',    icon: CheckSquare, label: 'Tasks'    },
    { id: 'progress', icon: TrendingUp,  label: 'Progress' },
    { id: 'notes',    icon: FileText,    label: 'Notes'    },
    { id: 'friends',  icon: Users,       label: 'Friends'  },
  ];

  const bottomLinks = [
    { id: 'spaces', icon: Image,   label: 'Spaces' },
    { id: 'sounds', icon: Volume2, label: 'Sounds' },
    { id: 'music',  icon: Music,   label: 'Music'  },
  ];

  const renderBtn = (id: string, Icon: React.ElementType, label: string) => {
    const isActive = openModals.has(id);
    return (
      <button
        key={id}
        onClick={() => toggle(id)}
        className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-md transition-colors text-white ${isActive ? 'bg-primary' : 'bg-secondary hover:bg-sidebar-accent'}`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[8px] font-['Lato',sans-serif] font-bold leading-none">{label}</span>
      </button>
    );
  };

  return (
    <>
      <nav className="fixed left-2 top-2 bottom-2 z-50 w-[50px] flex flex-col gap-2">
        <div className="bg-sidebar backdrop-blur-md border border-sidebar-border rounded-lg p-1.5">
          <div className="flex flex-col gap-1.5">
            {topLinks.map(({ id, icon, label }) => renderBtn(id, icon, label))}
          </div>
        </div>
        <div className="bg-sidebar backdrop-blur-md border border-sidebar-border rounded-lg p-1.5">
          <div className="flex flex-col gap-1.5">
            {bottomLinks.map(({ id, icon, label }) => renderBtn(id, icon, label))}
          </div>
        </div>
      </nav>

      <SessionModal  isOpen={openModals.has('session')}  onClose={() => close('session')}  initialOffset={OFFSETS.session}  />
      <TasksModal    isOpen={openModals.has('tasks')}    onClose={() => close('tasks')}    initialOffset={OFFSETS.tasks}    />
      <NotesModal    isOpen={openModals.has('notes')}    onClose={() => close('notes')}    initialOffset={OFFSETS.notes}    />
      <FriendsModal  isOpen={openModals.has('friends')}  onClose={() => close('friends')}  initialOffset={OFFSETS.friends}  />
      <SpacesModal   isOpen={openModals.has('spaces')}   onClose={() => close('spaces')}   initialOffset={OFFSETS.spaces}   />
      <SoundsModal   isOpen={openModals.has('sounds')}   onClose={() => close('sounds')}   initialOffset={OFFSETS.sounds}   />
      <ProgressModal isOpen={openModals.has('progress')} onClose={() => close('progress')} initialOffset={OFFSETS.progress} />
    </>
  );
}
