import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const normalizeEndedAt = (endedAt) => typeof endedAt === 'string' && Number.isFinite(Date.parse(endedAt))
  ? new Date(endedAt).toISOString()
  : null;

const normalizeScores = (scores = []) => (Array.isArray(scores) ? scores : [])
  .map((entry) => ({
    score: typeof entry === 'number' ? entry : entry?.score,
    endedAt: normalizeEndedAt(entry?.endedAt),
  }))
  .filter((entry) => Number.isFinite(entry.score));

const topFiveScores = (scores) => [...scores]
  .sort((a, b) => b.score - a.score || (Date.parse(b.endedAt) || 0) - (Date.parse(a.endedAt) || 0))
  .slice(0, 5);

export const useScoreStore = create()(
  persist(
    (set, get) => ({

      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      maxScore: 0,
      setMaxScore: (value) => set({ maxScore: value }),

      recentScores: [],
      bestScores: [],
      recordScore: (score, endedAt) => {
        if (!Number.isFinite(score)) return;
        const entry = { score, endedAt: normalizeEndedAt(endedAt) ?? new Date().toISOString() };

        set((state) => {
          const bestScores = topFiveScores([...state.bestScores, entry]);

          return {
            maxScore: bestScores[0].score,
            recentScores: [...state.recentScores, entry].slice(-5),
            bestScores,
          };
        });
      },
      addRecentScore: (score, endedAt) => get().recordScore(score, endedAt),

    }),
    {
      name: 'score-store', 
      version: 3,
      migrate: (persistedState) => {
        const recentScores = normalizeScores(persistedState?.recentScores).slice(-5);
        const scores = normalizeScores(persistedState?.bestScores ?? recentScores);
        const maxScore = Number.isFinite(persistedState?.maxScore) ? persistedState.maxScore : 0;

        // Preserve a historical high score that has already fallen out of recent history.
        if (maxScore > 0 && !scores.some((entry) => entry.score === maxScore)) {
          scores.push({ score: maxScore, endedAt: null });
        }
        const bestScores = topFiveScores(scores);

        return {
          maxScore: bestScores[0]?.score ?? 0,
          recentScores,
          bestScores,
        };
      },
      partialize: ({ maxScore, recentScores, bestScores }) => ({ maxScore, recentScores, bestScores }),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
    },
  ),
)
