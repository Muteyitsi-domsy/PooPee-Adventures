import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.shell}>
        <p className={styles.kicker}>Phase 0</p>
        <h1>Potty Pattern Tracker</h1>
        <p className={styles.summary}>
          The app scaffold is ready. Onboarding, local storage, logging, trends,
          export, and offline support will land in the next phases.
        </p>
        <div className={styles.status} aria-label="Phase 0 status">
          <span>Next.js app</span>
          <span>TypeScript</span>
          <span>CI smoke test</span>
        </div>
      </main>
    </div>
  );
}
