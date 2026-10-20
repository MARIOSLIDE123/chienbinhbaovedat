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

  // Total study duration tracking in seconds
  const [studyDuration, setStudyDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('green_planet_study_seconds');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Increment study duration every 10s while tab is open
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyDuration((prev) => {
        const next = prev + 10;
        localStorage.setItem('green_planet_study_seconds', next.toString());
        return next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);

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

  // Helper to sync progress to cloud & Google Sheets
  const syncProgressToCloud = async (
    currProgress: UserLearningProgress,
    actionType?: string,
    actionNote?: string
  ) => {
    if (!profile) return;
    try {
      await fetch('/api/sync-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          progress: currProgress,
          studyDurationSeconds: studyDuration,
          actionType: actionType || 'Cập nhật tiến trình',
          actionNote: actionNote || 'Đồng bộ tự động',
        }),
      });
    } catch {
      // Non-blocking offline fallback
    }
  };

  const handleLogin = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setShowLoginModal(false);
    // Log login activity to server and Google Sheets
    try {
      fetch('/api/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: newProfile,
          actionType: 'Đăng nhập',
          details: `Chiến binh ${newProfile.fullName} (Lớp ${newProfile.className} - ${newProfile.schoolName}) bắt đầu phiên học`,
        }),
      });
    } catch {}
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
      const updated = { ...prev, completedLessons: updatedLessons, badges };
      syncProgressToCloud(updated, 'Hoàn thành bài học', `Học xong bài: ${lessonId}`);
      return updated;
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
      const updated = { ...prev, completedSimulations: updatedSims, badges };
      syncProgressToCloud(updated, 'Hoàn thành thí nghiệm', `Hoàn thành thí nghiệm mô phỏng: ${simId}`);
      return updated;
    });
  };

  const handleUpdatePracticeScore = (correctCount: number) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        practiceCompleted: Math.max(prev.practiceCompleted, correctCount),
      };
      syncProgressToCloud(next, 'Thử tài nhanh trí', `Đạt ${correctCount}/8 thử thách`);
      return next;
    });
  };

  const handleFinishQuiz = (attempt: QuizAttempt) => {
    setProgress((prev) => {
      const badges = [...prev.badges];
      if (attempt.score >= 180 && !badges.includes('badge-arena-master')) {
        badges.push('badge-arena-master');
      }
      const next = {
        ...prev,
        arenaAttempts: prev.arenaAttempts + 1,
        highestScore: Math.max(prev.highestScore, attempt.score),
        badges,
      };
      syncProgressToCloud(next, 'Thi Đấu Trường', `Điểm: ${attempt.score}/200 trong ${attempt.durationSeconds}s`);
      return next;
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
      const nextProgress = { ...prev, checklistActions: updated, badges };
      syncProgressToCloud(nextProgress, 'Cam kết việc tốt', `Thực hiện hành động: ${actionId}`);
      return nextProgress;
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

      {/* Main App Content Viewport - Full 16:9 widescreen layout */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 2xl:px-12 pt-2.5 sm:pt-3.5 pb-2 overflow-x-hidden">
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

      {/* Slim Footer Status Bar - Full 16:9 width */}
      <footer className="bg-white border-t border-emerald-100/80 py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 2xl:px-12 shrink-0 mt-auto">
        <div className="w-full flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <span>🌍</span>
            <span className="font-extrabold text-[#20352B]">HÀNH TINH XANH</span>
            <span className="hidden sm:inline">· Chiến Binh Bảo Vệ Đất (Khoa học 5 - Bài 2)</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowSheetsGuide(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              Cấu hình Sheets
            </button>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Giáo dục vì tương lai xanh</span>
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
