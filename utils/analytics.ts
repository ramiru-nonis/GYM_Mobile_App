import { Workout } from '../context/WorkoutContext';

/**
 * Calculates Estimated One Rep Max using Epley Formula
 * 1RM = weight * (1 + 0.0333 * reps)
 */
export const calculate1RM = (weight: number, reps: number): number => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + 0.0333 * reps));
};

export interface BestLift {
    exercise: string;
    weight: number;
    reps: number;
    oneRM: number;
}

/**
 * Extracts best lifts and 1RM estimates from workout history
 */
export const getBestLifts = (history: Workout[]): BestLift[] => {
    const bestLifts: Record<string, BestLift> = {};

    history.forEach(workout => {
        workout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (!set.isCompleted) return;

                const weight = parseFloat(set.weight);
                const reps = parseInt(set.reps);
                if (isNaN(weight) || isNaN(reps)) return;

                const current1RM = calculate1RM(weight, reps);

                if (!bestLifts[ex.name] || current1RM > bestLifts[ex.name].oneRM) {
                    bestLifts[ex.name] = {
                        exercise: ex.name,
                        weight,
                        reps,
                        oneRM: current1RM
                    };
                }
            });
        });
    });

    return Object.values(bestLifts).sort((a, b) => b.oneRM - a.oneRM);
};

/**
 * Calculates volume progression over time
 */
export const getVolumeData = (history: Workout[]) => {
    return history
        .slice()
        .reverse()
        .map(w => ({
            date: w.date.split(',')[0], // MMM DD
            volume: w.totalVolume
        }));
};
