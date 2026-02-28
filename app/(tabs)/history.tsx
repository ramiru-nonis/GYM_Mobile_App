import { Calendar, ChevronRight, Clock, Scale } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useWorkout } from '../../context/WorkoutContext';

export default function HistoryScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { workoutHistory } = useWorkout();

    const totalWorkouts = workoutHistory.length;
    const totalVolume = workoutHistory.reduce((acc, curr) => acc + curr.totalVolume, 0);
    const totalTimeMinutes = totalWorkouts * 45; // Mocking 45 mins per workout
    const totalHours = (totalTimeMinutes / 60).toFixed(1);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.summaryContainer}>
                <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                    <Text style={styles.summaryTitle}>Overall Overview</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{totalWorkouts}</Text>
                            <Text style={styles.statLabel}>Workouts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{totalHours}h</Text>
                            <Text style={styles.statLabel}>Total Time</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{(totalVolume / 1000).toFixed(1)}k</Text>
                            <Text style={styles.statLabel}>Total Vol</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Past Workouts</Text>
                <TouchableOpacity>
                    <Calendar size={20} stroke={theme.tint} />
                </TouchableOpacity>
            </View>

            {workoutHistory.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
                    <Text>No workouts logged yet. Start tracking!</Text>
                </View>
            ) : (
                workoutHistory.map((item) => (
                    <TouchableOpacity key={item.id} style={[styles.historyCard, { backgroundColor: theme.card }]}>
                        <View style={styles.cardMain}>
                            <View style={styles.emojiContainer}>
                                <Text style={styles.emojiText}>{item.emoji}</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDate}>{item.date}</Text>
                                <View style={styles.cardStatsRow}>
                                    <View style={styles.inlineStat}>
                                        <Clock size={12} stroke={theme.tabIconDefault} />
                                        <Text style={styles.inlineStatText}>{item.duration}</Text>
                                    </View>
                                    <View style={styles.inlineStat}>
                                        <Scale size={12} stroke={theme.tabIconDefault} />
                                        <Text style={styles.inlineStatText}>{item.totalVolume.toLocaleString()} kg</Text>
                                    </View>
                                </View>
                            </View>
                            <ChevronRight size={20} stroke={theme.tabIconDefault} />
                        </View>
                    </TouchableOpacity>
                ))
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    summaryContainer: {
        marginTop: 20,
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    summaryCard: {
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 15,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    statItem: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#6366f1',
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 4,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    historyCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardMain: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    emojiContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    emojiText: {
        fontSize: 24,
    },
    cardContent: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    cardDate: {
        fontSize: 12,
        opacity: 0.5,
        marginVertical: 2,
    },
    cardStatsRow: {
        flexDirection: 'row',
        marginTop: 4,
        backgroundColor: 'transparent',
    },
    inlineStat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: 'transparent',
    },
    inlineStatText: {
        fontSize: 11,
        opacity: 0.6,
        marginLeft: 4,
    }
});
