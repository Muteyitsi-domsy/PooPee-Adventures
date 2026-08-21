import { OnboardingApp } from "@/features/onboarding/OnboardingApp";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <OnboardingApp />
    </div>
  );
}
