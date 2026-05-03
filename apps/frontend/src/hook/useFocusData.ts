import { useEffect, useState } from "react";

export type PlantType = "grass" | "flower" | "tree";

export type Plant = {
  id: number;
  type: PlantType;
  x: number;
  y: number;
};

export type HourlyFocus = Record<number, number>;

function getPlantType(minutes: number): PlantType {
  if (minutes < 30) return "grass";
  if (minutes < 60) return "flower";
  return "tree";
}

function getNextPosition(index: number) {
  return {
    x: index % 6,
    y: Math.floor(index / 6),
  };
}

export function useFocusData() {
  // ✅ ✅ STATE MUST BE DECLARED FIRST
  // Initialize from localStorage lazily to avoid calling setState inside an effect
  const [plants, setPlants] = useState<Plant[]>(() => {
    try {
      const saved = localStorage.getItem("focusData");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.plants ?? [];
    } catch {
      return [];
    }
  });

  const [totalMinutes, setTotalMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("focusData");
      if (!saved) return 0;
      const parsed = JSON.parse(saved);
      return parsed.totalMinutes ?? 0;
    } catch {
      return 0;
    }
  });

  const [hourlyFocus, setHourlyFocus] = useState<HourlyFocus>(() => {
    try {
      const saved = localStorage.getItem("focusData");
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return parsed.hourlyFocus ?? {};
    } catch {
      return {};
    }
  });

  // initial state is loaded lazily from localStorage above

  // ✅ ✅ SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(
      "focusData",
      JSON.stringify({
        plants,
        totalMinutes,
        hourlyFocus,
      })
    );
  }, [plants, totalMinutes, hourlyFocus]);

  function addFocusSession(minutes: number) {
    const hour = new Date().getHours();
    setTotalMinutes((m) => m + minutes);

    setHourlyFocus((prev) => ({
      ...prev,
      [hour]: (prev[hour] || 0) + minutes,
    }));

    setPlants((prev) => {
      const pos = getNextPosition(prev.length);
      return [
        ...prev,
        {
          id: Date.now(),
          type: getPlantType(minutes),
          ...pos,
        },
      ];
    });
  }

  return {
    plants,
    totalMinutes,
    hourlyFocus,
    addFocusSession,
  };
}
