import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Plus, Volume2, Bell, Minus } from 'lucide-react';
import { playTimerNotificationSound } from '../utils/audio';

export const FloatingKitchenTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(15 * 60); // default 15 mins
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Таймер казана');
  const intervalRef = useRef<number | null>(null);

  // Countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playTimerNotificationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleRun = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const setPreset = (mins: number, label: string) => {
    setIsRunning(false);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setTimerLabel(label);
  };

  const addMinutes = (mins: number) => {
    setTimeLeft((prev) => Math.max(0, prev + mins * 60));
    setTotalSeconds((prev) => Math.max(0, prev + mins * 60));
  };

  const formatDisplay = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Pill (When closed or minimized) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-500 text-white animate-pulse shadow-amber-500/40 ring-4 ring-amber-400/30'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30'
          }`}
          title="Открыть кухонный таймер"
        >
          <Timer className="w-5 h-5" />
          <span className="font-mono font-bold text-sm tracking-wider">
            {formatDisplay(timeLeft)}
          </span>
          {isRunning && (
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          )}
        </button>
      )}

      {/* Expanded Modal / Floating Widget */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-40 w-[90vw] sm:w-84 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <Timer className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none">Кухонный таймер</h4>
                <span className="text-[10px] text-slate-400">{timerLabel}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => playTimerNotificationSound()}
                title="Тест звука"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="Свернуть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clock Display */}
          <div className="p-4 text-center bg-gradient-to-b from-slate-50 to-amber-50/30">
            <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-wider my-1">
              {formatDisplay(timeLeft)}
            </div>

            {timeLeft === 0 && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-bounce my-1">
                <Bell className="w-3.5 h-3.5" />
                <span>Время вышло!</span>
              </div>
            )}

            {/* Quick Adjust Buttons */}
            <div className="flex items-center justify-center gap-2 my-2 text-[11px] font-bold text-slate-600">
              <button
                type="button"
                onClick={() => addMinutes(-1)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-0.5 cursor-pointer"
              >
                <Minus className="w-3 h-3" /> 1 мин
              </button>
              <button
                type="button"
                onClick={() => addMinutes(1)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 1 мин
              </button>
              <button
                type="button"
                onClick={() => addMinutes(5)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 5 мин
              </button>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                type="button"
                onClick={toggleRun}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-rose-500 hover:bg-rose-600'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Пауза' : timeLeft === 0 ? 'Заново' : 'Старт'}</span>
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Сброс"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Presets for Kazan Cooking */}
          <div className="p-3 bg-white border-t border-slate-100 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
              Кулинарные тайминги:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setPreset(8, 'Обжарка мяса')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200/60 text-left font-medium transition-colors cursor-pointer"
              >
                🥩 Мясо: 8 мин
              </button>
              <button
                type="button"
                onClick={() => setPreset(5, 'Зирвак (лук и морковь)')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200/60 text-left font-medium transition-colors cursor-pointer"
              >
                🥕 Зирвак: 5 мин
              </button>
              <button
                type="button"
                onClick={() => setPreset(15, 'Чечевица / Булгур')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200/60 text-left font-medium transition-colors cursor-pointer"
              >
                ⚡ Чечевица: 15 мин
              </button>
              <button
                type="button"
                onClick={() => setPreset(20, 'Гречка / Рис')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200/60 text-left font-medium transition-colors cursor-pointer"
              >
                🌾 Гречка/Рис: 20 мин
              </button>
              <button
                type="button"
                onClick={() => setPreset(45, 'Перловка / Горох')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200/60 text-left font-medium transition-colors cursor-pointer"
              >
                🫘 Перловка: 45 мин
              </button>
              <button
                type="button"
                onClick={() => setPreset(10, 'Отдых и упревание')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200/60 text-left font-medium transition-colors cursor-pointer"
              >
                ♨️ Отдых: 10 мин
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
