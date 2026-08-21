"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { get, remove, set } from "@/lib/storage";
import styles from "@/app/page.module.css";
import {
  emptyReadinessAnswers,
  readinessQuestions,
  scoreReadiness,
} from "./readiness";
import type { OnboardingProfile, ReadinessAnswers } from "./types";

const PROFILE_KEY = "profile:onboarding";

export function OnboardingApp() {
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [childName, setChildName] = useState("");
  const [childAgeMonths, setChildAgeMonths] = useState("30");
  const [caregiverName, setCaregiverName] = useState("");
  const [answers, setAnswers] = useState<ReadinessAnswers>(
    emptyReadinessAnswers,
  );

  const readiness = useMemo(() => scoreReadiness(answers), [answers]);

  useEffect(() => {
    let isMounted = true;

    get<OnboardingProfile>(PROFILE_KEY)
      .then((savedProfile) => {
        if (isMounted && savedProfile) {
          setProfile(savedProfile);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const savedProfile: OnboardingProfile = {
      childName: childName.trim(),
      childAgeMonths: Number(childAgeMonths),
      caregiverName: caregiverName.trim(),
      startedAt: new Date().toISOString(),
      readinessAnswers: answers,
      readinessScore: readiness.score,
      readinessBand: readiness.band,
    };

    await set(PROFILE_KEY, savedProfile);
    setProfile(savedProfile);
  }

  async function handleReset() {
    await remove(PROFILE_KEY);
    setProfile(null);
  }

  function updateAnswer(answer: keyof ReadinessAnswers, value: boolean) {
    setAnswers((current) => ({
      ...current,
      [answer]: value,
    }));
  }

  if (isLoading) {
    return (
      <main className={styles.shell} aria-busy="true">
        <p className={styles.kicker}>Loading</p>
        <h1>Potty Pattern Tracker</h1>
        <p className={styles.summary}>Checking this device for saved setup.</p>
      </main>
    );
  }

  if (profile) {
    return (
      <main className={styles.shell}>
        <p className={styles.kicker}>Ready</p>
        <h1>Hi, {profile.childName}</h1>
        <p className={styles.summary}>
          Onboarding is saved on this device. {profile.caregiverName} can start
          logging potty patterns in the next phase.
        </p>
        <section className={styles.panel} aria-label="Saved readiness result">
          <div>
            <p className={styles.metric}>{profile.readinessScore}%</p>
            <p className={styles.muted}>Readiness score</p>
          </div>
          <p className={styles.resultText}>{scoreReadiness(profile.readinessAnswers).message}</p>
        </section>
        <div className={styles.status} aria-label="Persisted setup status">
          <span>Onboarding complete</span>
          <span>IndexedDB saved</span>
          <span>Reload skips setup</span>
        </div>
        <button className={styles.secondaryButton} type="button" onClick={handleReset}>
          Reset onboarding
        </button>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <p className={styles.kicker}>Phase 1</p>
      <h1>Set up the tracker</h1>
      <p className={styles.summary}>
        Answer a few readiness checks so the app can start with the right tone
        and pace.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGrid}>
          <label>
            Child name
            <input
              required
              value={childName}
              onChange={(event) => setChildName(event.target.value)}
              placeholder="Maya"
            />
          </label>
          <label>
            Age in months
            <input
              required
              min="12"
              max="72"
              type="number"
              value={childAgeMonths}
              onChange={(event) => setChildAgeMonths(event.target.value)}
            />
          </label>
          <label>
            Caregiver name
            <input
              required
              value={caregiverName}
              onChange={(event) => setCaregiverName(event.target.value)}
              placeholder="Doreen"
            />
          </label>
        </div>

        <fieldset className={styles.checklist}>
          <legend>Readiness signs</legend>
          {readinessQuestions.map((question) => (
            <label key={question.id} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={answers[question.id]}
                onChange={(event) =>
                  updateAnswer(question.id, event.target.checked)
                }
              />
              <span>{question.label}</span>
            </label>
          ))}
        </fieldset>

        <section className={styles.panel} aria-live="polite">
          <div>
            <p className={styles.metric}>{readiness.score}%</p>
            <p className={styles.muted}>Readiness score</p>
          </div>
          <p className={styles.resultText}>{readiness.message}</p>
        </section>

        <button className={styles.primaryButton} type="submit">
          Save setup
        </button>
      </form>
    </main>
  );
}
