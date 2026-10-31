import React, { useState, useEffect, useRef } from 'react';
import type { GeneratedRecipe } from '../types';
import { playTimerNotificationSound, playFinishFanfare } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Bell, 
  Volume2, 
  CheckCircle2, 
  Flame,
  Plus
} from 'lucide-react';

interface CookingAssistantModalProps {
  recipe: GeneratedRecipe;
  onClose: () => void;
}

export const CookingAssistantModal: React.FC<CookingAssistantModalProps> = ({ recipe, onClose }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = recipe.steps[currentStepIdx];

  // Timer state (seconds)
  const [timeLeftSec, setTimeLeftSec] = useState<number>(
    currentStep?.timeMin ? currentStep.timeMin * 60 : 0
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // When step changes, reset timer
  useEffect(() => {
    if (currentStep?.timeMin) {
      setTimeLeftSec(currentStep.timeMin * 60);
      setIsActive(false);
    } else {
      setTimeLeftSec(0);
      setIsActive(false);
    }
  }, [currentStepIdx, currentStep]);

  // Timer tick
  useEffect(() => {
    if (isActive && timeLeftSec > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeftSec((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            playTimerNotificationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeftSec]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (currentStep?.timeMin) {
      setTimeLeftSec(currentStep.timeMin * 60);
    }
  };

  const addOneMinute = () => {
    setTimeLeftSec((prev) => prev + 60);
  };

  const handleNextStep = () => {
    if (currentStepIdx < recipe.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      // Completed all steps!
      playFinishFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastStep = currentStepIdx === recipe.steps.length - 1;
  const progressPercent = Math.round(((currentStepIdx + 1) / recipe.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Интерактивный помощник
              </h3>
              <p className="text-[11px] text-slate-400">
                Шаг {currentStepIdx + 1} из {recipe.steps.length} ({progressPercent}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playTimerNotificationSound()}
              title="Проверить звук таймера"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-amber-500 h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 flex flex-col justify-between">
          <div>
            {/* Step Badge & Title */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
              <span>Шаг {currentStepIdx + 1}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mb-3">
              {currentStep.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70 mb-6">
              {currentStep.description}
            </p>
          </div>

          {/* Active Timer Box (if step has timer) */}
          {currentStep.timeMin ? (
            <div className="my-4 p-5 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50/50 border border-amber-200 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>ТАЙМЕР ЭТАПА</span>
              </div>

              {/* Big Digital Display */}
              <div className="text-5xl sm:text-6xl font-black tracking-widest text-slate-900 my-2 font-mono">
                {formatTime(timeLeftSec)}
              </div>

              {timeLeftSec === 0 && (
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full animate-bounce my-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>Время вышло! Переходите к следующему шагу</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={toggleTimer}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold text-white shadow-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                      : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                  }`}
                >
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  <span>{isActive ? 'Пауза' : timeLeftSec === 0 ? 'Запустить снова' : 'Старт'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetTimer}
                  title="Сбросить таймер"
                  className="p-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={addOneMinute}
                  title="Добавить 1 минуту"
                  className="inline-flex items-center gap-1 px-3 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>1 мин</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              Этот шаг не требует таймера. Выполните подготовку и нажимайте «Далее».
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              disabled={currentStepIdx === 0}
              onClick={handlePrevStep}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                currentStepIdx === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all cursor-pointer shadow-md"
            >
              <span>{isLastStep ? 'Каша готова!' : 'Следующий шаг'}</span>
              {isLastStep ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
