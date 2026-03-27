import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedMinutes: number;
  timeSpent: number;
  category?: string;
}

export interface StudySession {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  breaksCount: number;
}

export interface AppState {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'timeSpent'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Timer
  isTimerActive: boolean;
  currentTaskId: string | null;
  timerMode: 'focus' | 'break';
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  startTimer: (taskId?: string) => void;
  stopTimer: () => void;
  setTimerMode: (mode: 'focus' | 'break') => void;
  setFocusDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  
  // Sessions
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id'>) => void;
  
  // Settings
  ambientSound: string;
  ambientVolume: number;
  setAmbientSound: (sound: string) => void;
  setAmbientVolume: (volume: number) => void;
  
  // Background
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
  
  // Study Room
  username: string;
  isInStudyRoom: boolean;
  setUsername: (name: string) => void;
  joinStudyRoom: () => void;
  leaveStudyRoom: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Tasks
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              completed: false,
              timeSpent: 0,
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      
      // Timer
      isTimerActive: false,
      currentTaskId: null,
      timerMode: 'focus',
      focusDuration: 25,
      breakDuration: 5,
      startTimer: (taskId) =>
        set({ isTimerActive: true, currentTaskId: taskId || null }),
      stopTimer: () => set({ isTimerActive: false, currentTaskId: null }),
      setTimerMode: (mode) => set({ timerMode: mode }),
      setFocusDuration: (duration) => set({ focusDuration: duration }),
      setBreakDuration: (duration) => set({ breakDuration: duration }),
      
      // Sessions
      sessions: [],
      addSession: (session) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...session,
              id: crypto.randomUUID(),
            },
          ],
        })),
      
      // Settings
      ambientSound: 'none',
      ambientVolume: 50,
      setAmbientSound: (sound) => set({ ambientSound: sound }),
      setAmbientVolume: (volume) => set({ ambientVolume: volume }),
      
      // Background
      backgroundImage: 'none',
      setBackgroundImage: (image) => set({ backgroundImage: image }),
      
      // Study Room
      username: '',
      isInStudyRoom: false,
      setUsername: (name) => set({ username: name }),
      joinStudyRoom: () => set({ isInStudyRoom: true }),
      leaveStudyRoom: () => set({ isInStudyRoom: false }),
    }),
    {
      name: 'focus-app-storage',
    }
  )
);