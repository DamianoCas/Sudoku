// components/Header.js
import { useState } from 'react';
import styles from '../styles/header.module.css';

export default function Header() {
  // State to track which view is active
  const [activeView, setActiveView] = useState('game'); // default to 'game'

  return (
    <header className={styles.header}>
      <div className={styles.navButtons}>
        <button
          className={`${styles.navButton} ${activeView === 'user' ? styles.active : ''}`}
          onClick={() => setActiveView('user')}
        >
          User
        </button>
        <button
          className={`${styles.navButton} ${activeView === 'game' ? styles.active : ''}`}
          onClick={() => setActiveView('game')}
        >
          Game
        </button>
        <button
          className={`${styles.navButton} ${activeView === 'leaderboard' ? styles.active : ''}`}
          onClick={() => setActiveView('leaderboard')}
        >
          Leaders
        </button>
      </div>
    </header>
  );
}