import { Navigation } from '../components/Navigation';
import { useAppStore } from '../stores/useAppStore';
import imgFrame2 from 'figma:asset/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png';

export function Workspace() {
  const { backgroundImage } = useAppStore();
  const bgImage = backgroundImage && backgroundImage !== 'none' ? backgroundImage : imgFrame2;
  
  return (
    <div className="min-h-screen relative font-['Inter',sans-serif] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <Navigation />
      
      {/* Header bars */}
      <div className="fixed top-2 left-[70px] right-2 flex justify-between items-center z-40">
        <div className="bg-muted rounded-[5px] px-4 py-2">
          <p className="text-xs text-black">Title/Name</p>
        </div>
        <div className="bg-muted rounded-[5px] px-4 py-2">
          <p className="text-xs text-black">Title/Name</p>
        </div>
      </div>
      
      <main className="relative pt-16 pb-8 px-4 ml-[70px] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Welcome to Your Focus Space
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md">
            Click the sidebar buttons to get started
          </p>
        </div>
      </main>
    </div>
  );
}
