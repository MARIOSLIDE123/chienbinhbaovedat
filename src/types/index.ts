export interface StudentProfile {
  fullName: string;
  className: string;
  schoolName: string;
  province?: string;
  useAbbreviatedName: boolean;
  avatarId: string;
}

export type TopicId = 'soil-pollution' | 'soil-erosion' | 'soil-protection';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string; // Q01 - Q20
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: DifficultyLevel;
  topic: TopicId;
}

export interface QuizAttempt {
  attemptId: string;
  studentName: string;
  displayName: string;
  className: string;
  schoolName: string;
  province?: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  durationSeconds: number;
  startedAt: string;
  submittedAt: string;
  answersSummary: Record<string, string>; // { "Q01": "B", ... }
  status: 'completed' | 'timeout';
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  className: string;
  schoolName: string;
  province?: string;
  bestScore: number;
  bestCorrect: number;
  bestDurationSeconds: number;
  bestSubmittedAt: string;
  attemptCount?: number;
}

export interface UserLearningProgress {
  completedLessons: string[]; // ['soil-pollution', 'soil-erosion', 'soil-protection']
  completedSimulations: string[]; // ['erosion-rainfall', 'waste-journey', 'water-treatment']
  practiceCompleted: number; // number of practice activities finished
  practiceTotal: number;
  arenaAttempts: number;
  highestScore: number;
  badges: string[];
  checklistActions: string[];
}
