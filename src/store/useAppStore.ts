import { create } from "zustand";
import { AppState, Achievement, Task, FitnessEntry, CodingEntry, VisionCard } from "@/types";
import { saveToStorage, loadFromStorage } from "@/utils/storage";
import { startOfWeek, endOfWeek, isWithinInterval, parseISO, differenceInDays } from "date-fns";

const STORAGE_KEY = "fitcode-tracker-data";

const initialAchievements: Achievement[] = [
  {
    id: "first-workout",
    name: "First Steps",
    description: "Log your first workout",
    conditionType: "fitness-milestone",
    target: 1,
    unlocked: false,
    icon: "🏃",
  },
  {
    id: "streak-3",
    name: "Getting Started",
    description: "Complete tasks for 3 days in a row",
    conditionType: "streak",
    target: 3,
    unlocked: false,
    icon: "🔥",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    conditionType: "streak",
    target: 7,
    unlocked: false,
    icon: "⚡",
  },
  {
    id: "coding-10",
    name: "Code Master",
    description: "Complete 10 coding tasks",
    conditionType: "coding-milestone",
    target: 10,
    unlocked: false,
    icon: "💻",
  },
  {
    id: "weekly-goal",
    name: "Weekly Champion",
    description: "Complete all weekly tasks",
    conditionType: "weekly-goal",
    target: 1,
    unlocked: false,
    icon: "🏆",
  },
  {
    id: "fitness-20",
    name: "Fitness Enthusiast",
    description: "Log 20 fitness activities",
    conditionType: "fitness-milestone",
    target: 20,
    unlocked: false,
    icon: "💪",
  },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    name: "Morning workout",
    category: "fitness",
    icon: "🏋️",
    isCompleted: false,
    date: new Date().toISOString(),
    isDaily: true,
  },
  {
    id: "task-2",
    name: "Code for 2 hours",
    category: "coding",
    icon: "💻",
    isCompleted: false,
    date: new Date().toISOString(),
    isDaily: true,
  },
  {
    id: "task-3",
    name: "Read tech article",
    category: "personal",
    icon: "📚",
    isCompleted: false,
    date: new Date().toISOString(),
    isDaily: true,
  },
];

const loadInitialState = () => {
  const stored = loadFromStorage(STORAGE_KEY, null);
  if (stored) {
    return stored;
  }
  return {
    tasks: initialTasks,
    fitnessEntries: [],
    codingEntries: [],
    achievements: initialAchievements,
    visionCards: [],
    hasCompletedOnboarding: false,
  };
};

export const useAppStore = create<AppState>((set, get) => {
  const initialState = loadInitialState();

  const persistState = () => {
    const state = get();
    saveToStorage(STORAGE_KEY, {
      tasks: state.tasks,
      fitnessEntries: state.fitnessEntries,
      codingEntries: state.codingEntries,
      achievements: state.achievements,
      visionCards: state.visionCards,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
    });
  };

  return {
    ...initialState,

    // Tasks
    addTask: (task) => {
      set((state) => ({
        tasks: [...state.tasks, { ...task, id: `task-${Date.now()}` }],
      }));
      persistState();
      get().checkAchievements();
    },

    toggleTask: (id) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        ),
      }));
      persistState();
      get().checkAchievements();
    },

    deleteTask: (id) => {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
      persistState();
    },

    // Fitness
    addFitnessEntry: (entry) => {
      set((state) => ({
        fitnessEntries: [...state.fitnessEntries, { ...entry, id: `fitness-${Date.now()}` }],
      }));
      persistState();
      get().checkAchievements();
    },

    deleteFitnessEntry: (id) => {
      set((state) => ({
        fitnessEntries: state.fitnessEntries.filter((entry) => entry.id !== id),
      }));
      persistState();
    },

    // Coding
    addCodingEntry: (entry) => {
      set((state) => ({
        codingEntries: [...state.codingEntries, { ...entry, id: `coding-${Date.now()}` }],
      }));
      persistState();
      get().checkAchievements();
    },

    toggleCodingEntry: (id) => {
      set((state) => ({
        codingEntries: state.codingEntries.map((entry) =>
          entry.id === id ? { ...entry, completed: !entry.completed } : entry
        ),
      }));
      persistState();
      get().checkAchievements();
    },

    deleteCodingEntry: (id) => {
      set((state) => ({
        codingEntries: state.codingEntries.filter((entry) => entry.id !== id),
      }));
      persistState();
    },

    // Achievements
    unlockAchievement: (id) => {
      set((state) => ({
        achievements: state.achievements.map((achievement) =>
          achievement.id === id && !achievement.unlocked
            ? { ...achievement, unlocked: true, dateUnlocked: new Date().toISOString() }
            : achievement
        ),
      }));
      persistState();
    },

    checkAchievements: () => {
      const state = get();
      
      // Check first workout
      if (state.fitnessEntries.length >= 1) {
        state.unlockAchievement("first-workout");
      }

      // Check fitness milestone
      if (state.fitnessEntries.length >= 20) {
        state.unlockAchievement("fitness-20");
      }

      // Check coding tasks
      const completedCodingTasks = state.codingEntries.filter(e => e.completed).length;
      if (completedCodingTasks >= 10) {
        state.unlockAchievement("coding-10");
      }

      // Check streak
      const dailyTasks = state.tasks.filter(t => t.isDaily).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      let currentStreak = 0;
      let lastDate: Date | null = null;
      
      for (const task of dailyTasks) {
        if (!task.isCompleted) continue;
        
        const taskDate = parseISO(task.date);
        if (!lastDate) {
          lastDate = taskDate;
          currentStreak = 1;
        } else {
          const daysDiff = differenceInDays(lastDate, taskDate);
          if (daysDiff === 1) {
            currentStreak++;
            lastDate = taskDate;
          } else if (daysDiff > 1) {
            break;
          }
        }
      }

      if (currentStreak >= 3) {
        state.unlockAchievement("streak-3");
      }
      if (currentStreak >= 7) {
        state.unlockAchievement("streak-7");
      }

      // Check weekly goal
      const now = new Date();
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      
      const weeklyTasks = state.tasks.filter(task => {
        if (task.isDaily) return false;
        const taskDate = parseISO(task.date);
        return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
      });
      
      const allWeeklyCompleted = weeklyTasks.length > 0 && weeklyTasks.every(t => t.isCompleted);
      if (allWeeklyCompleted) {
        state.unlockAchievement("weekly-goal");
      }
    },

    // Vision Board
    addVisionCard: (card) => {
      set((state) => ({
        visionCards: [
          ...state.visionCards,
          { ...card, id: `vision-${Date.now()}`, createdAt: new Date().toISOString() },
        ],
      }));
      persistState();
    },

    updateVisionCard: (id, updates) => {
      set((state) => ({
        visionCards: state.visionCards.map((card) =>
          card.id === id ? { ...card, ...updates } : card
        ),
      }));
      persistState();
    },

    deleteVisionCard: (id) => {
      set((state) => ({
        visionCards: state.visionCards.filter((card) => card.id !== id),
      }));
      persistState();
    },

    // Settings
    setOnboardingComplete: () => {
      set({ hasCompletedOnboarding: true });
      persistState();
    },

    resetAllData: () => {
      set({
        tasks: initialTasks,
        fitnessEntries: [],
        codingEntries: [],
        achievements: initialAchievements,
        visionCards: [],
        hasCompletedOnboarding: false,
      });
      persistState();
    },
  };
});
