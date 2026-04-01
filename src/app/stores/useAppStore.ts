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
  parentId?: string; // optional — if set, this is a subtask
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
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'timeSpent'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  isTimerActive: boolean;
  currentTaskId: string | null;
  timerMode: 'focus' | 'break';
  focusDuration: number;
  breakDuration: number;
  startTimer: (taskId?: string) => void;
  stopTimer: () => void;
  setTimerMode: (mode: 'focus' | 'break') => void;
  setFocusDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;

  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id'>) => void;

  ambientSound: string;
  ambientVolume: number;
  setAmbientSound: (sound: string) => void;
  setAmbientVolume: (volume: number) => void;

  backgroundImage: string;
  setBackgroundImage: (image: string) => void;

  username: string;
  isInStudyRoom: boolean;
  setUsername: (name: string) => void;
  joinStudyRoom: () => void;
  leaveStudyRoom: () => void;
}

// ── Demo seed data for CPSC344 usability test ──────────────────────────────
const CPSC344_PARENT_ID = 'demo-cpsc344-final';
const COOP_PARENT_ID = 'demo-coop-app';

const DEMO_TASKS: Task[] = [
  // ── Parent: CPSC344 Final ──────────────────────────────────────────────
  {
    id: CPSC344_PARENT_ID,
    title: 'Prep CPSC344 Final',
    priority: 'high',
    completed: false,
    estimatedMinutes: 300,
    timeSpent: 0,
  },
  {
    id: 'demo-sub-1',
    title: 'Review lecture notes (Weeks 1–6)',
    priority: 'high',
    completed: true,
    estimatedMinutes: 60,
    timeSpent: 3600,
    parentId: CPSC344_PARENT_ID,
  },
  {
    id: 'demo-sub-2',
    title: 'Review lecture notes (Weeks 7–12)',
    priority: 'high',
    completed: false,
    estimatedMinutes: 60,
    timeSpent: 1200,
    parentId: CPSC344_PARENT_ID,
  },
  {
    id: 'demo-sub-3',
    title: 'Practice problems — Ch. 4 & 5',
    priority: 'high',
    completed: false,
    estimatedMinutes: 60,
    timeSpent: 0,
    parentId: CPSC344_PARENT_ID,
  },
  {
    id: 'demo-sub-4',
    title: 'Flashcards — key concepts',
    priority: 'medium',
    completed: false,
    estimatedMinutes: 45,
    timeSpent: 0,
    parentId: CPSC344_PARENT_ID,
  },
  {
    id: 'demo-sub-5',
    title: 'Past exam walkthrough',
    priority: 'medium',
    completed: false,
    estimatedMinutes: 75,
    timeSpent: 0,
    parentId: CPSC344_PARENT_ID,
  },
  // ── Parent: Co-op Application ─────────────────────────────────────────
  {
    id: COOP_PARENT_ID,
    title: 'Co-op Application',
    priority: 'high',
    completed: false,
    estimatedMinutes: 180,
    timeSpent: 0,
  },
  {
    id: 'demo-coop-1',
    title: 'Update resume',
    priority: 'high',
    completed: true,
    estimatedMinutes: 45,
    timeSpent: 2700,
    parentId: COOP_PARENT_ID,
  },
  {
    id: 'demo-coop-2',
    title: 'Write cover letter — Shopify',
    priority: 'high',
    completed: true,
    estimatedMinutes: 45,
    timeSpent: 2400,
    parentId: COOP_PARENT_ID,
  },
  {
    id: 'demo-coop-3',
    title: 'Write cover letter — Amazon',
    priority: 'medium',
    completed: false,
    estimatedMinutes: 45,
    timeSpent: 0,
    parentId: COOP_PARENT_ID,
  },
  {
    id: 'demo-coop-4',
    title: 'Prep behavioural questions',
    priority: 'medium',
    completed: false,
    estimatedMinutes: 45,
    timeSpent: 0,
    parentId: COOP_PARENT_ID,
  },
  // ── Standalone ────────────────────────────────────────────────────────
  {
    id: 'demo-standalone-1',
    title: 'Submit project reflection',
    priority: 'medium',
    completed: false,
    estimatedMinutes: 30,
    timeSpent: 0,
  },
];

const DEMO_SESSIONS: StudySession[] = [
  {
    id: 'demo-session-1',
    taskId: 'demo-sub-1',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600 * 1000),
    duration: 3600,
    breaksCount: 1,
  },
  {
    id: 'demo-session-2',
    taskId: 'demo-sub-2',
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1200 * 1000),
    duration: 1200,
    breaksCount: 0,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: DEMO_TASKS,

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: crypto.randomUUID(), completed: false, timeSpent: 0 },
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
          tasks: state.tasks.filter((task) => task.id !== id && task.parentId !== id),
        })),

      toggleTask: (id) =>
        set((state) => {
          const task = state.tasks.find(t => t.id === id);
          if (!task) return state;
          const nowCompleted = !task.completed;
          let tasks = state.tasks.map(t =>
            t.id === id ? { ...t, completed: nowCompleted } : t
          );
          // Auto-complete parent if all siblings are done
          if (nowCompleted && task.parentId) {
            const siblings = tasks.filter(t => t.parentId === task.parentId);
            if (siblings.every(t => t.completed)) {
              tasks = tasks.map(t =>
                t.id === task.parentId ? { ...t, completed: true } : t
              );
            }
          }
          // Un-complete parent if a subtask is unchecked
          if (!nowCompleted && task.parentId) {
            tasks = tasks.map(t =>
              t.id === task.parentId ? { ...t, completed: false } : t
            );
          }
          return { tasks };
        }),

      isTimerActive: false,
      currentTaskId: null,
      timerMode: 'focus',
      focusDuration: 25,
      breakDuration: 5,
      startTimer: (taskId) => set({ isTimerActive: true, currentTaskId: taskId || null }),
      stopTimer: () => set({ isTimerActive: false, currentTaskId: null }),
      setTimerMode: (mode) => set({ timerMode: mode }),
      setFocusDuration: (duration) => set({ focusDuration: duration }),
      setBreakDuration: (duration) => set({ breakDuration: duration }),

      sessions: DEMO_SESSIONS,
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: crypto.randomUUID() }],
        })),

      ambientSound: 'none',
      ambientVolume: 50,
      setAmbientSound: (sound) => set({ ambientSound: sound }),
      setAmbientVolume: (volume) => set({ ambientVolume: volume }),

      backgroundImage: 'none',
      setBackgroundImage: (image) => set({ backgroundImage: image }),

      username: '',
      isInStudyRoom: false,
      setUsername: (name) => set({ username: name }),
      joinStudyRoom: () => set({ isInStudyRoom: true }),
      leaveStudyRoom: () => set({ isInStudyRoom: false }),
    }),
    {
      name: 'focus-app-storage-v5',
    }
  )
);
