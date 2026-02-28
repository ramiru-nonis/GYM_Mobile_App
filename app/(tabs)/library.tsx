import { ChevronDown, ChevronUp, Filter, Info, Plus, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, LayoutAnimation, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, UIManager } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { exercises } from '../../constants/ExerciseData';
import { useWorkout } from '../../context/WorkoutContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LibraryScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { activeWorkout, setActiveWorkout } = useWorkout();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

    const filteredExercises = useMemo(() => {
        return exercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const addToWorkout = (exerciseName: string) => {
        const newExercise = {
            id: Date.now().toString(),
            name: exerciseName,
            sets: [{ id: Date.now().toString() + '-s1', weight: '', reps: '', isCompleted: false }]
        };
        setActiveWorkout([...activeWorkout, newExercise]);
        Alert.alert(
            "Added to Workout",
            `${exerciseName} has been added to your current session.`,
            [
                { text: "Keep Browsing", style: "cancel" },
                { text: "Go to Track", onPress: () => router.push('/(tabs)/track') }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.searchSection}>
                <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
                    <Search size={20} stroke={theme.tabIconDefault} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Search exercises..."
                        placeholderTextColor={theme.tabIconDefault}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.card }]}>
                    <Filter size={20} stroke={theme.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                { backgroundColor: selectedCategory === cat ? theme.tint : theme.card }
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText,
                                { color: selectedCategory === cat ? 'white' : theme.text }
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.exerciseList} contentContainerStyle={styles.listContent}>
                {filteredExercises.map((ex) => (
                    <View key={ex.id} style={[styles.exerciseCard, { backgroundColor: theme.card }]}>
                        <TouchableOpacity
                            style={styles.exerciseHeader}
                            onPress={() => toggleExpand(ex.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.exerciseImageMock, { opacity: 0.5 }]}>
                                <Info size={24} stroke={theme.tint} />
                            </View>
                            <View style={styles.exerciseMainInfo}>
                                <Text style={styles.exerciseName}>{ex.name}</Text>
                                <View style={styles.tagRow}>
                                    <View style={[styles.tag, { backgroundColor: theme.background }]}>
                                        <Text style={styles.tagText}>{ex.category}</Text>
                                    </View>
                                    <View style={[styles.tag, { backgroundColor: theme.background }]}>
                                        <Text style={styles.tagText}>{ex.equipment}</Text>
                                    </View>
                                </View>
                            </View>
                            {expandedId === ex.id ? (
                                <ChevronUp size={20} stroke={theme.tabIconDefault} />
                            ) : (
                                <ChevronDown size={20} stroke={theme.tabIconDefault} />
                            )}
                        </TouchableOpacity>

                        {expandedId === ex.id && (
                            <View style={styles.expandableContent}>
                                <View style={styles.divider} />
                                <View style={styles.infoSection}>
                                    <Text style={styles.infoLabel}>BENEFITS</Text>
                                    <Text style={styles.infoValue}>{ex.benefits}</Text>
                                </View>
                                <View style={styles.infoSection}>
                                    <Text style={styles.infoLabel}>MUSCLE GROUPS</Text>
                                    <View style={styles.muscleTags}>
                                        {ex.muscles.map(muscle => (
                                            <View key={muscle} style={[styles.muscleTag, { backgroundColor: theme.accent + '20' }]}>
                                                <Text style={[styles.muscleTagText, { color: theme.accent }]}>{muscle}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View style={styles.infoSection}>
                                    <Text style={styles.infoLabel}>DIFFICULTY</Text>
                                    <Text style={[styles.infoValue, { color: ex.difficulty === 'Beginner' ? '#10b981' : ex.difficulty === 'Advanced' ? '#ef4444' : '#f59e0b' }]}>
                                        {ex.difficulty}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.addButton, { backgroundColor: theme.tint }]}
                                    onPress={() => addToWorkout(ex.name)}
                                >
                                    <Plus size={20} stroke="white" />
                                    <Text style={styles.addButtonText}>Add to Workout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}

                {filteredExercises.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No exercises found matching your search.</Text>
                    </View>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchSection: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        backgroundColor: 'transparent',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 15,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    filterButton: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriesContainer: {
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    categoryScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    categoryText: {
        fontWeight: '600',
        fontSize: 14,
    },
    exerciseList: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    exerciseCard: {
        borderRadius: 20,
        marginBottom: 12,
        overflow: 'hidden',
    },
    exerciseHeader: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    exerciseImageMock: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    exerciseMainInfo: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: 'transparent',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
        opacity: 0.7,
    },
    expandableContent: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: 'transparent',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 16,
    },
    infoSection: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: '800',
        opacity: 0.4,
        marginBottom: 6,
        letterSpacing: 1,
    },
    infoValue: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
    },
    muscleTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
        backgroundColor: 'transparent',
    },
    muscleTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    muscleTagText: {
        fontSize: 11,
        fontWeight: '700',
    },
    emptyContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        opacity: 0.5,
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
        gap: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    }
});
