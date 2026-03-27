import { Navigation } from '../components/Navigation';
import { useAppStore } from '../stores/useAppStore';
import imgFrame2 from '../../assets/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png';

export function Workspace() {
  const { backgroundImage, tasks, isTimerActive, currentTaskId } = useAppStore();
  const bgImage = backgroundImage && backgroundImage !== 'none' ? backgroundImage : imgFrame2;
  const currentTask = tasks.find(t => t.id === currentTaskId);

  return (
    <div className="min-h-screen relative font-['Inter',sans-serif] overflow-hidden">
      <div className="absolute inset-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
      </div>

      <Navigation />

      {/* Header */}
      <div className="fixed top-2 left-[70px] right-2 flex justify-between items-center z-40 pointer-events-none">
        <div className="bg-[#999797]/80 backdrop-blur-sm rounded-[5px] px-4 py-1.5 pointer-events-auto">
          <p className="text-xs text-black font-medium">FocusSpace</p>
        </div>
        <div className="bg-[#999797]/80 backdrop-blur-sm rounded-[5px] px-4 py-1.5 pointer-events-auto">
          <p className="text-xs text-black font-medium">
            {isTimerActive && currentTask ? `🧠 ${currentTask.title}` : 'Ready to focus'}
          </p>
        </div>
      </div>
    </div>
  );
}
