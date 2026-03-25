import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Volume2, VolumeX, Cloud, Coffee, Waves, TreePine, Music, Radio } from 'lucide-react';

const AMBIENT_SOUNDS = [
  { id: 'none', name: 'None', icon: VolumeX, color: 'text-gray-500' },
  { id: 'rain', name: 'Rain', icon: Cloud, color: 'text-blue-500', description: 'Gentle rainfall' },
  { id: 'cafe', name: 'Café', icon: Coffee, color: 'text-amber-500', description: 'Coffee shop ambience' },
  { id: 'ocean', name: 'Ocean', icon: Waves, color: 'text-cyan-500', description: 'Ocean waves' },
  { id: 'forest', name: 'Forest', icon: TreePine, color: 'text-green-500', description: 'Forest sounds' },
  { id: 'piano', name: 'Piano', icon: Music, color: 'text-purple-500', description: 'Soft piano music' },
  { id: 'lofi', name: 'Lo-fi', icon: Radio, color: 'text-pink-500', description: 'Lo-fi beats' },
];

export function AmbientSoundPlayer() {
  const { ambientSound, ambientVolume, setAmbientSound, setAmbientVolume } = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio oscillator for ambient sounds (simulated)
    // In a real app, you would load actual audio files
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    
    if (ambientSound !== 'none' && audioRef.current) {
      gainNode.gain.value = ambientVolume / 100;
    }
    
    return () => {
      audioContext.close();
    };
  }, [ambientSound, ambientVolume]);
  
  const currentSound = AMBIENT_SOUNDS.find(s => s.id === ambientSound);
  const Icon = currentSound?.icon || VolumeX;
  
  return (
    <Card className="p-4 space-y-4 border-sidebar-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${currentSound?.color || 'text-gray-500'}`} />
          <div>
            <h3 className="text-sm font-medium text-black">Ambient Sound</h3>
            <p className="text-xs text-muted-foreground">
              {currentSound?.description || 'No sound playing'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {AMBIENT_SOUNDS.map((sound) => {
          const SoundIcon = sound.icon;
          const isActive = ambientSound === sound.id;
          
          return (
            <Button
              key={sound.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setAmbientSound(sound.id)}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <SoundIcon className={`w-4 h-4 ${isActive ? '' : sound.color}`} />
              <span className="text-xs">{sound.name}</span>
            </Button>
          );
        })}
      </div>
      
      {ambientSound !== 'none' && (
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <label className="text-sm">Volume</label>
            <span className="text-sm text-muted-foreground">{ambientVolume}%</span>
          </div>
          <Slider
            value={[ambientVolume]}
            onValueChange={([value]) => setAmbientVolume(value)}
            min={0}
            max={100}
            step={5}
          />
        </div>
      )}
    </Card>
  );
}