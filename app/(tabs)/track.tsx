import { Bookmark, CheckCircle2, Play, Plus, Search, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { exercises as allExercises } from '../../constants/ExerciseData';
import { workoutPresets } from '../../constants/PresetWorkouts';
import { useWorkout } from '../../context/WorkoutContext';

interface Set {
    id: string;
    weight: string;
    reps: string;
    isCompleted: boolean;
}

interface Exercise {
    id: string;
    name: string;
    sets: Set[];
}

export default function TrackScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { saveWorkout, activeWorkout: exercises, setActiveWorkout: setExercises } = useWorkout();
    const [workoutTitle, setWorkoutTitle] = useState('Workout Session');

    // Timer state
    const [seconds, setSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Exercise Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let interval: any;
        if (!isPaused) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startPreset = (presetId: string) => {
        const preset = workoutPresets.find(p => p.id === presetId);
        if (preset) {
            const mappedExercises: Exercise[] = preset.exercises.map((ex, idx) => ({
                id: Date.now().toString() + '-' + idx,
                name: ex.name,
                sets: ex.sets.map((s, sIdx) => ({
                    id: Date.now().toString() + '-' + idx + '-s' + sIdx,
                    weight: s.weight,
                    reps: s.reps,
                    isCompleted: false
                }))
            }));
            setExercises(mappedExercises);
            setWorkoutTitle(preset.title);
            setSeconds(0);
            setIsPaused(false);
            Alert.alert(`Started ${preset.title}`, preset.description);
        }
    };

    const addSelectedExercise = (exerciseName: string) => {
        const newExercise: Exercise = {
            id: Date.now().toString(),
            name: exerciseName,
            sets: [{ id: Date.now().toString() + '-s1', weight: '', reps: '', isCompleted: false }]
        };
        setExercises([...exercises, newExercise]);
        setIsModalVisible(false);
        setSearchQuery('');
    };

    const removeExercise = (exerciseId: string) => {
        setExercises(exercises.filter(ex => ex.id !== exerciseId));
    };

    const addSet = (exerciseId: string) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                const lastSet = ex.sets[ex.sets.length - 1];
                const newSet: Set = {
                    id: Date.now().toString(),
                    weight: lastSet ? lastSet.weight : '',
                    reps: lastSet ? lastSet.reps : '',
                    isCompleted: false
                };
                return { ...ex, sets: [...ex.sets, newSet] };
            }
            return ex;
        }));
    };

    const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: string | boolean) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
                };
            }
            return ex;
        }));
    };

    const removeSet = (exerciseId: string, setId: string) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.filter(s => s.id !== setId)
                };
            }
            return ex;
        }));
    };

    const finishWorkout = () => {
        const duration = formatTime(seconds);
        saveWorkout(exercises, workoutTitle, duration);
        Alert.alert("Workout Finished!", `Great job! Your ${workoutTitle} (${duration}) has been saved.`);

        // Reset
        setExercises([{
            id: '1',
            name: 'Bench Press (Barbell)',
            sets: [{ id: Date.now().toString() + '-s1', weight: '80', reps: '8', isCompleted: false }]
        }]);
        setWorkoutTitle('Workout Session');
        setSeconds(0);
        setIsPaused(false);
    };

    const filteredExercises = useMemo(() => {
        return allExercises.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{workoutTitle}</Text>
                    <Text style={styles.timer}>{formatTime(seconds)}</Text>
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={[styles.presetButton, { backgroundColor: theme.tint + '20' }]}
                        onPress={() => {
                            Alert.alert(
                                "Select a Preset",
                                "Loading a preset will replace your current workout.",
                                workoutPresets.map(p => ({
                                    text: p.title,
                                    onPress: () => startPreset(p.id)
                                })).concat([{ text: "Cancel", onPress: () => { } }])
                            );
                        }}
                    >
                        <Bookmark size={20} stroke={theme.tint} />
                        <Text style={[styles.presetButtonText, { color: theme.tint }]}>Presets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
                        <Text style={styles.finishButtonText}>Finish</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {exercises.map((exercise) => (
                    <View key={exercise.id} style={[styles.exerciseCard, { backgroundColor: theme.card }]}>
                        <View style={styles.exerciseHeader}>
                            <TextInput
                                style={styles.exerciseName}
                                value={exercise.name}
                                onChangeText={(text) => {
                                    setExercises(exercises.map(ex => ex.id === exercise.id ? { ...ex, name: text } : ex));
                                }}
                            />
                            <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                                <Trash2 size={20} stroke="#ef4444" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.columnHeader, { flex: 1 }]}>SET</Text>
                            <Text style={[styles.columnHeader, { flex: 2 }]}>WEIGHT (KG)</Text>
                            <Text style={[styles.columnHeader, { flex: 2 }]}>REPS</Text>
                            <View style={{ width: 40 }} />
                        </View>

                        {exercise.sets.map((set, index) => (
                            <View key={set.id} style={[styles.setRow, set.isCompleted && styles.setRowCompleted]}>
                                <TouchableOpacity onLongPress={() => removeSet(exercise.id, set.id)} style={{ flex: 1 }}>
                                    <Text style={styles.setText}>{index + 1}</Text>
                                </TouchableOpacity>
                                <View style={[styles.inputContainer, { flex: 2 }]}>
                                    <TextInput
                                        style={[styles.input, { color: theme.text }]}
                                        value={set.weight}
                                        onChangeText={(text) => updateSet(exercise.id, set.id, 'weight', text)}
                                        keyboardType="numeric"
                                        placeholder="0"
                                    />
                                </View>
                                <View style={[styles.inputContainer, { flex: 2 }]}>
                                    <TextInput
                                        style={[styles.input, { color: theme.text }]}
                                        value={set.reps}
                                        onChangeText={(text) => updateSet(exercise.id, set.id, 'reps', text)}
                                        keyboardType="numeric"
                                        placeholder="0"
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.checkButton}
                                    onPress={() => updateSet(exercise.id, set.id, 'isCompleted', !set.isCompleted)}
                                >
                                    <CheckCircle2
                                        size={24}
                                        stroke={set.isCompleted ? theme.accent : theme.tabIconDefault}
                                        strokeWidth={set.isCompleted ? 3 : 2}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
                            <Plus size={20} stroke={theme.tint} />
                            <Text style={[styles.addSetText, { color: theme.tint }]}>Add Set</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    style={[styles.addExerciseButton, { borderColor: theme.tint }]}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={[styles.addExerciseText, { color: theme.tint }]}>Add Exercise</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={[styles.controls, { backgroundColor: theme.card, borderTopColor: theme.tabIconDefault + '20' }]}>
                <TouchableOpacity style={styles.controlButton} onPress={() => setSeconds(0)}>
                    <RotateCcw size={24} stroke="#ef4444" />
                    <Text style={styles.controlText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.controlButton, styles.pauseButton]} onPress={() => setIsPaused(!isPaused)}>
                    {isPaused ? <Play size={24} stroke={theme.text} /> : <Pause size={24} stroke={theme.text} />}
                    <Text style={styles.controlText}>{isPaused ? 'Resume' : 'Pause'}</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Exercise</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <X size={24} stroke={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
                            <Search size={20} stroke={theme.tabIconDefault} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.text }]}
                                placeholder="Search exercises..."
                                placeholderTextColor={theme.tabIconDefault}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <FlatList
                            data={filteredExercises}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.exerciseListItem}
                                    onPress={() => addSelectedExercise(item.name)}
                                >
                                    <Text style={styles.exerciseListItemName}>{item.name}</Text>
                                    <Text style={styles.exerciseListItemCategory}>{item.category}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Re-importing missing components
import { Pause, RotateCcw } from 'lucide-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
    },
    timer: {
        fontSize: 14,
        opacity: 0.6,
        marginTop: 2,
        fontFamily: 'SpaceMono',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    presetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginRight: 10,
        gap: 6,
    },
    presetButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    finishButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    finishButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    scrollContent: {
        padding: 20,
    },
    exerciseCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6366f1',
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
    },
    columnHeader: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.4,
        textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 6,
        backgroundColor: 'transparent',
    },
    setRowCompleted: {
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
    setText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputContainer: {
        marginHorizontal: 10,
        backgroundColor: 'transparent',
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        height: 36,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
    },
    checkButton: {
        width: 40,
        alignItems: 'center',
    },
    addSetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    addSetText: {
        marginLeft: 8,
        fontWeight: '600',
    },
    addExerciseButton: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    addExerciseText: {
        fontWeight: '700',
        fontSize: 16,
    },
    controls: {
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 35,
        borderTopWidth: 1,
        justifyContent: 'space-around',
    },
    controlButton: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    controlText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
        opacity: 0.6,
    },
    pauseButton: {
        opacity: 0.8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 15,
        height: 50,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    exerciseListItem: {
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    exerciseListItemName: {
        fontSize: 16,
        fontWeight: '700',
    },
    exerciseListItemCategory: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 2,
    }
});
