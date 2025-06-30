import { useState, useEffect } from 'react';

export const TimerState = {
  Stop: 1,
  Start: 2,
  Reset: 3,
} as const;

export type TimerState = (typeof TimerState)[keyof typeof TimerState];

type Props = {
  timerRunning: TimerState;
};

export default function Timer({ timerRunning }: Props) {
  const [seconds, setSeconds] = useState(0);

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

  function composetimer(): string{
    let min: string = ""+ Math.floor(seconds / 60);
    min = min.length === 1 ? "0" + min : min;

    let sec: string = ""+ seconds % 60;
    sec = sec.length === 1 ? "0" + sec : sec;

    return min + ":" + sec;
  }

  return (
    <h1>{composetimer()}</h1>
  );
}