export type TaskCategory = "fitness" | "coding" | "personal";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  icon?: string;
  isCompleted: boolean;
  date: string; // ISO date string
  isDaily: boolean; // true for daily habits, false for weekly tasks
}

export interface FitnessEntry {
  id: string;
  date: string;
  type: "workout" | "weight" | "general";
  value?: number; // for weight tracking
  notes?: string;
  duration?: number; // minutes
}

export interface CodingEntry {
  id: string;
  date: string;
  hours: number;
  task: string;
  completed: boolean;
}

export type ConditionType =
  | "streak"
  | "task-count"
  | "weekly-goal"
  | "fitness-milestone"
  | "coding-milestone";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  conditionType: ConditionType;
  target: number;
  unlocked: boolean;
  dateUnlocked?: string;
  icon?: string;
}

export interface VisionCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface AppState {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Fitness
  fitnessEntries: FitnessEntry[];
  addFitnessEntry: (entry: Omit<FitnessEntry, "id">) => void;
  deleteFitnessEntry: (id: string) => void;
  
  // Coding
  codingEntries: CodingEntry[];
  addCodingEntry: (entry: Omit<CodingEntry, "id">) => void;
  toggleCodingEntry: (id: string) => void;
  deleteCodingEntry: (id: string) => void;
  
  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  checkAchievements: () => void;
  
  // Vision Board
  visionCards: VisionCard[];
  addVisionCard: (card: Omit<VisionCard, "id" | "createdAt">) => void;
  updateVisionCard: (id: string, updates: Partial<VisionCard>) => void;
  deleteVisionCard: (id: string) => void;
  
  // Settings
  hasCompletedOnboarding: boolean;
  setOnboardingComplete: () => void;
  resetAllData: () => void;
}
