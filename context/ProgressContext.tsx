import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface WeightEntry {
    date: string;
    value: number;
}

export interface MeasurementEntry {
    date: string;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
}

export interface ProgressPhoto {
    id: string;
    date: string;
    uri: string;
}

interface ProgressContextType {
    weightHistory: WeightEntry[];
    measurements: MeasurementEntry[];
    photos: ProgressPhoto[];
    logWeight: (value: number) => void;
    logMeasurements: (entry: Omit<MeasurementEntry, 'date'>) => void;
    addPhoto: (uri: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = '@progress_data_v1';

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
        { date: 'Feb 1', value: 85.0 },
        { date: 'Feb 8', value: 84.5 },
        { date: 'Feb 15', value: 83.8 },
        { date: 'Feb 22', value: 83.2 },
    ]);

    const [measurements, setMeasurements] = useState<MeasurementEntry[]>([
        { date: 'Feb 1', chest: 105, waist: 92, hips: 100, arms: 38 },
        { date: 'Feb 22', chest: 106, waist: 90, hips: 99, arms: 39 },
    ]);

    const [photos, setPhotos] = useState<ProgressPhoto[]>([
        { id: '1', date: 'Feb 1', uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' },
    ]);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.weightHistory) setWeightHistory(parsed.weightHistory);
                if (parsed.measurements) setMeasurements(parsed.measurements);
                if (parsed.photos) setPhotos(parsed.photos);
            }
        } catch (error) {
            console.error('Failed to load progress data:', error);
        }
    };

    const saveData = async (updates: any) => {
        try {
            const currentData = { weightHistory, measurements, photos, ...updates };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        } catch (error) {
            console.error('Failed to save progress data:', error);
        }
    };

    const logWeight = (value: number) => {
        const newEntry: WeightEntry = {
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value,
        };
        const updated = [newEntry, ...weightHistory];
        setWeightHistory(updated);
        saveData({ weightHistory: updated });
    };

    const logMeasurements = (entry: Omit<MeasurementEntry, 'date'>) => {
        const newEntry: MeasurementEntry = {
            ...entry,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };
        const updated = [newEntry, ...measurements];
        setMeasurements(updated);
        saveData({ measurements: updated });
    };

    const addPhoto = (uri: string) => {
        const newPhoto: ProgressPhoto = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            uri,
        };
        const updated = [newPhoto, ...photos];
        setPhotos(updated);
        saveData({ photos: updated });
    };

    return (
        <ProgressContext.Provider value={{ weightHistory, measurements, photos, logWeight, logMeasurements, addPhoto }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
}
