import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Coffee, X, CheckCircle, Activity, Eye } from 'lucide-react';

interface BreakPromptProps {
  isVisible: boolean;
  onDismiss: () => void;
  onTakeBreak: () => void;
  onContinue: () => void;
}

const BREAK_ACTIVITIES = [
  { icon: Activity, text: 'Stretch your body', duration: '2 min' },
  { icon: Eye, text: 'Rest your eyes', duration: '1 min' },
  { icon: Coffee, text: 'Get some water', duration: '3 min' },
];

export function BreakPrompt({ isVisible, onDismiss, onTakeBreak, onContinue }: BreakPromptProps) {
  const [selectedActivity, setSelectedActivity] = useState(0);
  
  useEffect(() => {
    if (isVisible) {
      setSelectedActivity(Math.floor(Math.random() * BREAK_ACTIVITIES.length));
    }
  }, [isVisible]);
  
  const activity = BREAK_ACTIVITIES[selectedActivity];
  const ActivityIcon = activity.icon;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            <Card className="max-w-md w-full p-6 space-y-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center"
                >
                  <Coffee className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl">Time for a Break!</h3>
                <p className="text-muted-foreground">
                  You've been focused for a while. Taking breaks helps maintain attention and prevents burnout.
                </p>
              </div>
              
              <div className="bg-accent/50 rounded-lg p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                  <ActivityIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.text}</p>
                  <p className="text-sm text-muted-foreground">Suggested: {activity.duration}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button onClick={onTakeBreak} className="w-full" size="lg">
                  <Coffee className="w-4 h-4 mr-2" />
                  Take a Break
                </Button>
                <Button onClick={onContinue} variant="outline" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I'll Continue (5 more min)
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Breaks help restore attention and improve overall productivity
              </p>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
