// components/Header.js
import { useState } from 'react';
import styles from '../styles/header.module.css';

interface HeaderProps {
    onUserSelection: () => void,
    onGameSelection: () => void,
    onLeaderBoardSelection: () => void,
}

export default function Header({onUserSelection, onGameSelection, onLeaderBoardSelection}: HeaderProps) {
  // State to track which view is active
  const [activeView, setActiveView] = useState('game'); // default to 'game'

  return (
    <header className={styles.header}>
      <div className={styles.navButtons}>
        <button
          className={`${styles.navButton} ${activeView === 'user' ? styles.active : ''}`}
          onClick={() => {
            setActiveView('user');
            onUserSelection();
        }}
        >
          User
        </button>
        <button
          className={`${styles.navButton} ${activeView === 'game' ? styles.active : ''}`}
          onClick={() => {
            setActiveView('game');
            onGameSelection();
          }}
        >
          Game
        </button>
        <button
          className={`${styles.navButton} ${activeView === 'leaderboard' ? styles.active : ''}`}
          onClick={() => {
            setActiveView('leaderboard');
            onLeaderBoardSelection();
          }}
        >
          Leaders
        </button>
      </div>
    </header>
  );
}