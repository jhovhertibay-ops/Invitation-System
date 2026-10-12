import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTime = (): TimeRemaining => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
    };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (time.isExpired) {
    return (
      <div className="py-6 px-4 bg-[#F5EFE6] border border-[#E3DAC8] rounded-2xl text-center">
        <p className="font-serif text-xl text-[#5F7D65] italic font-medium">
          The Celebration Day Has Arrived!
        </p>
        <p className="text-xs text-[#7A7163] mt-1">
          Thank you for sharing your prayers and love with our family.
        </p>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-8">
      <div className="text-center mb-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8C7D69] font-medium">
          Counting Down to the Blessed Day
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 bg-[#F8F5EE] border border-[#E5DAC8] rounded-2xl shadow-xs">
        {units.map((unit) => (
          <div key={unit.label} className="text-center py-2 px-1">
            <div className="font-serif text-2xl sm:text-4xl text-[#3A453C] font-semibold tabular-nums leading-none mb-1">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8C7E6A] font-medium">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
