import { useEffect, useState } from 'react';

export type EmotionLabel =
  | 'Awful'
  | 'Bad'
  | 'Neutral'
  | 'Good'
  | 'Great';

export type Emotion = {
  emoji: string;
  label: EmotionLabel;
  time: string;
};

export type EmotionCalendar = {
  [date: string]: Emotion[];
};

const STORAGE_KEY = 'emotion-calendar';

export function useEmotionCalendar() {
  const today = new Date().toISOString().slice(0, 10);

  const [calendar, setCalendar] = useState<EmotionCalendar>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedDate, setSelectedDate] = useState<string>(today);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendar));
  }, [calendar]);

  const addEmotion = (emoji: string, label: EmotionLabel) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setCalendar(prev => ({
      ...prev,
      [selectedDate]: [
        ...(prev[selectedDate] || []),
        { emoji, label, time },
      ],
    }));
  };

  return {
    selectedDate,
    setSelectedDate,
    addEmotion,
    emotionsOfSelectedDate: calendar[selectedDate] || [],
    calendar,
  };
}
