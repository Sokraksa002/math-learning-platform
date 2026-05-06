import { useState, useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale';

export default function FocusTimer({ onFinish }: { onFinish: (minutes: number) => void }) {
  const { t } = useLocale();
  const [seconds, setSeconds] = useState(2 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds(s => {
        if (s === 1) {
          clearInterval(interval);
          setRunning(false);
          onFinish(2);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, onFinish]);

  return (
    <div className="text-center">
      <p className="text-4xl font-semibold">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </p>

      <button onClick={() => setRunning(true)}>{t('components.Calendor.FocusTimer.start_focus', 'Start Focus')}</button>
    </div>
  );
}
