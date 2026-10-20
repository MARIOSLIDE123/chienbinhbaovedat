import React, { useState, useEffect } from 'react';
import { StudentProfile, UserLearningProgress, QuizAttempt } from './types';
import { Header } from './components/common/Header';
import { LoginModal } from './components/auth/LoginModal';
import { HomeDashboard } from './components/home/HomeDashboard';
import { TextbookLessons } from './components/lessons/TextbookLessons';
import { InteractiveMindMap } from './components/mindmap/InteractiveMindMap';
import { QuickPractice } from './components/practice/QuickPractice';
import { ScienceSimulations } from './components/simulations/ScienceSimulations';
import { QuizArena } from './components/arena/QuizArena';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { UserProfile } from './components/profile/UserProfile';
import { GoogleSheetsGuideModal } from './components/sheets/GoogleSheetsGuideModal';
import { Heart, Globe2, Sparkles, BookOpen } from 'lucide-react';

export function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('green_planet_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showSheetsGuide, setShowSheetsGuide] = useState<boolean>(false);

  // User learning journey progress
  const [progress, setProgress] = useState<UserLearningProgress>(() => {
    try {
      const saved = localStorage.getItem('green_planet_progress');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      completedLessons: [],
      completedSimulations: [],
      practiceCompleted: 0,
      practiceTotal: 8,
      arenaAttempts: 0,
      highestScore: 0,
      badges: ['badge-starter'],
      checklistActions: ['act-1'],
    };
  });

  // Save progress to local storage
  useEffect(() => {
    localStorage.setItem('green_planet_progress', JSON.stringify(progress));
  }, [progress]);

  // Open login if no profile exists on first load
  useEffect(() => {
    if (!profile) {
      setShowLoginModal(true);
    }
  }, [profile]);

  const handleLogin = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('green_planet_student');
    setProfile(null);
    setShowLoginModal(true);
  };

  const handleCompleteLesson = (lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updatedLessons = [...prev.completedLessons, lessonId];
      const badges = [...prev.badges];
      if (updatedLessons.length >= 3 && !badges.includes('badge-reader')) {
        badges.push('badge-reader');
      }
      return { ...prev, completedLessons: updatedLessons, badges };
    });
  };

  const handleCompleteSimulation = (simId: string) => {
    setProgress((prev) => {
      if (prev.completedSimulations.includes(simId)) return prev;
      const updatedSims = [...prev.completedSimulations, simId];
      const badges = [...prev.badges];
      if (updatedSims.length >= 3 && !badges.includes('badge-scientist')) {
        badges.push('badge-scientist');
      }
      return { ...prev, completedSimulations: updatedSims, badges };
    });
  };

  const handleUpdatePracticeScore = (correctCount: number) => {
    setProgress((prev) => ({
      ...prev,
      practiceCompleted: Math.max(prev.practiceCompleted, correctCount),
    }));
  };

  const handleFinishQuiz = (attempt: QuizAttempt) => {
    setProgress((prev) => {
      const badges = [...prev.badges];
      if (attempt.score >= 180 && !badges.includes('badge-arena-master')) {
        badges.push('badge-arena-master');
      }
      return {
        ...prev,
        arenaAttempts: prev.arenaAttempts + 1,
        highestScore: Math.max(prev.highestScore, attempt.score),
        badges,
      };
    });
  };

  const handleToggleDailyAction = (actionId: string) => {
    setProgress((prev) => {
      const current = prev.checklistActions || [];
      const updated = current.includes(actionId)
        ? current.filter((id) => id !== actionId)
        : [...current, actionId];
      const badges = [...prev.badges];
      if (updated.length >= 3 && !badges.includes('badge-action-hero')) {
        badges.push('badge-action-hero');
      }
      return { ...prev, checklistActions: updated, badges };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#20352B]">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        onOpenProfile={() => {
          if (profile) setCurrentTab('profile');
          else setShowLoginModal(true);
        }}
        onOpenSheetsGuide={() => setShowSheetsGuide(true)}
      />

      {/* Main App Content Viewport - Optimized for 16:9 widescreen */}
      <main className="flex-1 w-full max-w-[1720px] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && profile && (
          <HomeDashboard
            profile={profile}
            progress={progress}
            onSelectTab={setCurrentTab}
            onToggleAction={handleToggleDailyAction}
          />
        )}

        {currentTab === 'lessons' && (
          <TextbookLessons
            completedLessons={progress.completedLessons}
            onCompleteLesson={handleCompleteLesson}
            onGoToArena={() => setCurrentTab('arena')}
          />
        )}

        {currentTab === 'mindmap' && <InteractiveMindMap />}

        {currentTab === 'practice' && (
          <QuickPractice
            onUpdateScore={handleUpdatePracticeScore}
            onGoToSimulations={() => setCurrentTab('simulations')}
          />
        )}

        {currentTab === 'simulations' && (
          <ScienceSimulations
            completedSimulations={progress.completedSimulations}
            onCompleteSimulation={handleCompleteSimulation}
          />
        )}

        {currentTab === 'arena' && profile && (
          <QuizArena
            profile={profile}
            onFinishQuiz={handleFinishQuiz}
            onGoToLeaderboard={() => setCurrentTab('leaderboard')}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            currentProfile={profile}
            onOpenSheetsGuide={() => setShowSheetsGuide(true)}
          />
        )}

        {currentTab === 'profile' && profile && (
          <UserProfile
            profile={profile}
            progress={progress}
            onEditProfile={() => setShowLoginModal(true)}
            onSelectTab={setCurrentTab}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 py-8 px-4 sm:px-6 mt-auto">
        <div className="w-full max-w-[1720px] 2xl:max-w-[1850px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <span className="font-extrabold text-[#20352B]">HÀNH TINH XANH</span>
            <span>· Chiến Binh Bảo Vệ Đất (Khoa học Lớp 5 - Bài 2)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowSheetsGuide(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              Cấu hình Google Sheets
            </button>
            <span>·</span>
            <span>Giáo dục vì một tương lai bền vững</span>
          </div>
        </div>
      </footer>

      {/* Login / Profile Gate Modal */}
      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          initialProfile={profile}
        />
      )}

      {/* Google Sheets / Apps Script Integration Guide Modal */}
      <GoogleSheetsGuideModal
        isOpen={showSheetsGuide}
        onClose={() => setShowSheetsGuide(false)}
      />
    </div>
  );
}

export default App;
