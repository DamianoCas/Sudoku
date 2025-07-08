import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

export const TimerState = {
  Stop: 1,
  Start: 2,
  Reset: 3,
} as const;

export type TimerState = (typeof TimerState)[keyof typeof TimerState];

type TimerRef = {
  getRequiredTime: () => number;  // Expose this function to parent
};

type Props = {
  timerRunning: TimerState;
};

const Timer = forwardRef<TimerRef, Props>(({ timerRunning }, ref) => {
  const [seconds, setSeconds] = useState(0);

  // Internal function that will be exposed to parent
  const onRequiredTime = () => {
    return seconds;
  };

  // Expose the onRequiredTime function to parent
  useImperativeHandle(ref, () => ({
    getRequiredTime: onRequiredTime
  }));

  useEffect(() => {
    if(timerRunning == TimerState.Reset) {
      setSeconds(0);
      return;
    }

    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning == TimerState.Start) {
      interval = setInterval(() => {
        setSeconds(prev => {
            const next = prev + 1;
            return next;
        });
      }, 1000);
    } else if(interval && timerRunning == TimerState.Stop) clearInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  function composetimer(): string {
    let min: string = ""+ Math.floor(seconds / 60);
    min = min.length === 1 ? "0" + min : min;

    let sec: string = ""+ seconds % 60;
    sec = sec.length === 1 ? "0" + sec : sec;

    return min + ":" + sec;
  }

  return (
    <h1>{composetimer()}</h1>
  );
});

export default Timer;