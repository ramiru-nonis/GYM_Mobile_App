export interface Exercise {
    id: string;
    name: string;
    category: string;
    benefits: string;
    muscles: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    equipment: string;
}

export const exercises: Exercise[] = [
    {
        id: '1',
        name: 'Bench Press (Barbell)',
        category: 'Chest',
        benefits: 'The ultimate upper body exercise for building chest mass and pushing strength. It also heavily involves the front deltoids and triceps.',
        muscles: ['Chest', 'Triceps', 'Shoulders'],
        difficulty: 'Intermediate',
        equipment: 'Barbell'
    },
    {
        id: '2',
        name: 'Squat (High Bar)',
        category: 'Legs',
        benefits: 'The king of all exercises. Essential for full-body strength, leg development, and core stability.',
        muscles: ['Quads', 'Glutes', 'Hamstrings', 'Lower Back'],
        difficulty: 'Intermediate',
        equipment: 'Barbell'
    },
    {
        id: '3',
        name: 'Deadlift (Conventional)',
        category: 'Back',
        benefits: 'Builds incredible posterior chain strength. Improves posture and develops the entire back and grip.',
        muscles: ['Lower Back', 'Glutes', 'Hamstrings', 'Traps'],
        difficulty: 'Advanced',
        equipment: 'Barbell'
    },
    {
        id: '4',
        name: 'Overhead Press (Barbell)',
        category: 'Shoulders',
        benefits: 'Develops powerful shoulders and upper body pressing stability. Great for functional strength.',
        muscles: ['Shoulders', 'Triceps', 'Upper Back'],
        difficulty: 'Intermediate',
        equipment: 'Barbell'
    },
    {
        id: '5',
        name: 'Pull-Up',
        category: 'Back',
        benefits: 'The gold standard for upper body pulling strength. Creates a wide V-taper and strong lats.',
        muscles: ['Back', 'Biceps', 'Forearms'],
        difficulty: 'Intermediate',
        equipment: 'Bodyweight'
    },
    {
        id: '6',
        name: 'Barbell Row',
        category: 'Back',
        benefits: 'Develops back thickness and improves bench press stability. Hard on the lower back but very rewarding.',
        muscles: ['Back', 'Biceps', 'Rear Delts'],
        difficulty: 'Intermediate',
        equipment: 'Barbell'
    },
    {
        id: '7',
        name: 'Dips',
        category: 'Chest',
        benefits: 'Excellent for targeting the lower chest and building horseshoe-shaped triceps.',
        muscles: ['Chest', 'Triceps', 'Shoulders'],
        difficulty: 'Intermediate',
        equipment: 'Bodyweight'
    },
    {
        id: '8',
        name: 'Leg Press',
        category: 'Legs',
        benefits: 'Allows for heavy loading of the legs with reduced stress on the lower back compared to squats.',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Beginner',
        equipment: 'Machine'
    },
    {
        id: '9',
        name: 'Dumbbell Lateral Raise',
        category: 'Shoulders',
        benefits: 'Isolation movement essential for building shoulder width and the "capped" look.',
        muscles: ['Shoulders'],
        difficulty: 'Beginner',
        equipment: 'Dumbbell'
    },
    {
        id: '10',
        name: 'Face Pulls',
        category: 'Shoulders',
        benefits: 'Crucial for shoulder health, posture, and rear delt development. Should be in every program.',
        muscles: ['Rear Delts', 'Upper Back'],
        difficulty: 'Beginner',
        equipment: 'Cable'
    },
    {
        id: '11',
        name: 'Bicep Curl (Dumbbell)',
        category: 'Arms',
        benefits: 'Isolation exercise to build larger, peaked biceps.',
        muscles: ['Biceps'],
        difficulty: 'Beginner',
        equipment: 'Dumbbell'
    },
    {
        id: '12',
        name: 'Tricep Pushdown',
        category: 'Arms',
        benefits: 'Safe and effective way to isolate the triceps for growth and definition.',
        muscles: ['Triceps'],
        difficulty: 'Beginner',
        equipment: 'Cable'
    },
    {
        id: '13',
        name: 'Plank',
        category: 'Core',
        benefits: 'Isometric hold that builds deep core stability and spinal health.',
        muscles: ['Abs', 'Obliques', 'Lower Back'],
        difficulty: 'Beginner',
        equipment: 'Bodyweight'
    },
    {
        id: '14',
        name: 'Hanging Leg Raise',
        category: 'Core',
        benefits: 'Advanced core exercise that targets the lower abdominals effectively.',
        muscles: ['Abs', 'Hip Flexors'],
        difficulty: 'Advanced',
        equipment: 'Bodyweight'
    },
    {
        id: '15',
        name: 'Bulgarian Split Squat',
        category: 'Legs',
        benefits: 'The ultimate "love to hate" exercise. Corrects imbalances and builds massive single-leg strength.',
        muscles: ['Quads', 'Glutes', 'Hamstrings'],
        difficulty: 'Intermediate',
        equipment: 'Dumbbell'
    }
];
