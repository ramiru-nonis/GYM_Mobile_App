import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Set {
    id: string;
    weight: string;
    reps: string;
    isCompleted: boolean;
}

export interface Exercise {
    id: string;
    name: string;
    sets: Set[];
}

export interface Workout {
    id: string;
    title: string;
    date: string;
    duration: string;
    exercises: Exercise[];
    totalVolume: number;
    emoji: string;
}

interface WorkoutContextType {
    workoutHistory: Workout[];
    saveWorkout: (exercises: Exercise[], title?: string, duration?: string) => void;
    activeWorkout: Exercise[];
    setActiveWorkout: (exercises: Exercise[]) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEY = '@workout_history_v1';

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
    const [activeWorkout, setActiveWorkout] = useState<Exercise[]>([
        {
            id: '1',
            name: 'Bench Press (Barbell)',
            sets: [
                { id: 's1', weight: '80', reps: '8', isCompleted: false },
            ]
        }
    ]);

    // Load history on mount
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const savedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedData) {
                setWorkoutHistory(JSON.parse(savedData));
            }
        } catch (error) {
            console.error('Failed to load workout history:', error);
        }
    };

    const saveWorkout = async (exercises: Exercise[], title: string = 'Workout Session', duration: string = '00:00') => {
        const totalVolume = exercises.reduce((acc, ex) => {
            return acc + ex.sets.reduce((setAcc, set) => {
                if (set.isCompleted) {
                    return setAcc + (parseFloat(set.weight) * parseFloat(set.reps) || 0);
                }
                return setAcc;
            }, 0);
        }, 0);

        const newWorkout: Workout = {
            id: Date.now().toString(),
            title,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            duration,
            exercises: [...exercises],
            totalVolume,
            emoji: ['💪', '🔥', '⚡', '🏋️', '🧗'][Math.floor(Math.random() * 5)],
        };

        const updatedHistory = [newWorkout, ...workoutHistory];
        setWorkoutHistory(updatedHistory);

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Failed to save workout history:', error);
        }
    };

    return (
        <WorkoutContext.Provider value={{ workoutHistory, saveWorkout, activeWorkout, setActiveWorkout }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
}
