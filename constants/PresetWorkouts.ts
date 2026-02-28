export interface PresetSet {
    weight: string;
    reps: string;
}

export interface PresetExercise {
    name: string;
    sets: PresetSet[];
}

export interface WorkoutPreset {
    id: string;
    title: string;
    description: string;
    exercises: PresetExercise[];
}

export const workoutPresets: WorkoutPreset[] = [
    {
        id: 'push-a',
        title: 'Push A',
        description: 'Chest, Shoulders & Triceps focus',
        exercises: [
            {
                name: 'Bench Press (Barbell)',
                sets: [
                    { weight: '60', reps: '10' },
                    { weight: '60', reps: '10' },
                    { weight: '60', reps: '10' },
                ],
            },
            {
                name: 'Overhead Press (Dumbbell)',
                sets: [
                    { weight: '15', reps: '12' },
                    { weight: '15', reps: '12' },
                ],
            },
            {
                name: 'Tricep Pushdowns',
                sets: [
                    { weight: '20', reps: '15' },
                    { weight: '20', reps: '15' },
                ],
            },
        ],
    },
    {
        id: 'pull-a',
        title: 'Pull A',
        description: 'Back & Biceps focus',
        exercises: [
            {
                name: 'Pull-Ups',
                sets: [
                    { weight: '0', reps: '8' },
                    { weight: '0', reps: '8' },
                    { weight: '0', reps: '8' },
                ],
            },
            {
                name: 'Barbell Row',
                sets: [
                    { weight: '40', reps: '10' },
                    { weight: '40', reps: '10' },
                    { weight: '40', reps: '10' },
                ],
            },
            {
                name: 'Bicep Curls (Dumbbell)',
                sets: [
                    { weight: '12', reps: '12' },
                    { weight: '12', reps: '12' },
                ],
            },
        ],
    },
    {
        id: 'legs-a',
        title: 'Legs A',
        description: 'Quadriceps & Glutes focus',
        exercises: [
            {
                name: 'Squat (Barbell)',
                sets: [
                    { weight: '80', reps: '8' },
                    { weight: '80', reps: '8' },
                    { weight: '80', reps: '8' },
                ],
            },
            {
                name: 'Leg Press',
                sets: [
                    { weight: '120', reps: '12' },
                    { weight: '120', reps: '12' },
                    { weight: '120', reps: '12' },
                ],
            },
            {
                name: 'Calf Raises',
                sets: [
                    { weight: '40', reps: '15' },
                    { weight: '40', reps: '15' },
                ],
            },
        ],
    },
];
