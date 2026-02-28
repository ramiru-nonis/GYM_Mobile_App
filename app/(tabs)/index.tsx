import { LinearGradient } from 'expo-linear-gradient';
import { Activity, ChevronRight, Flame, History, Target, Timer, TrendingUp, Trophy } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

import { useRouter } from 'expo-router';
import { useProgress } from '../../context/ProgressContext';
import { useWorkout } from '../../context/WorkoutContext';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { workoutHistory, activeWorkout } = useWorkout();
  const { weightHistory } = useProgress();

  // Dynamic calculations
  const totalWorkoutsThisWeek = workoutHistory.length; // Simplified for mockup
  const weeklyGoal = 5;
  const lastWorkout = workoutHistory[0];
  const lastWorkoutText = lastWorkout ? `Last: ${lastWorkout.date}` : 'No workouts yet';
  const currentWeight = weightHistory[0]?.value || 0;

  const inProgressExercise = activeWorkout.find(ex => ex.sets.some(s => !s.isCompleted));
  const trackSubtitle = inProgressExercise ? `Next: ${inProgressExercise.name}` : 'Ready to start';

  const widgets = [
    { id: 'track', title: 'Quick Track', icon: Activity, color: '#6366f1', subtitle: trackSubtitle, route: '/(tabs)/track' },
    { id: 'progress', title: 'Progress', icon: TrendingUp, color: '#10b981', subtitle: `${currentWeight} kg logged`, route: '/modal' },
    { id: 'timer', title: 'Rest Timer', icon: Timer, color: '#f59e0b', subtitle: 'Rest intervals', route: '/(tabs)/timer' },
    { id: 'history', title: 'History', icon: History, color: '#3b82f6', subtitle: `${workoutHistory.length} Sessions`, route: '/(tabs)/history' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey Ramiru! 👋</Text>
        <Text style={styles.subtitle}>Ready for your workout today?</Text>
      </View>

      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#6366f1', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.mainCardContent}>
            <View>
              <Text style={styles.mainCardTitle}>Weekly Goal</Text>
              <Text style={styles.mainCardValue}>{totalWorkoutsThisWeek} / {weeklyGoal}</Text>
              <Text style={styles.mainCardSub}>Workouts completed</Text>
            </View>
            <View style={{ opacity: 0.8 }}>
              <Flame size={40} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.miniStatsRow}>
          <TouchableOpacity
            style={[styles.miniStat, { backgroundColor: theme.card }]}
            onPress={() => router.push('/modal')} // Placeholder for goals modal
          >
            <Target size={20} stroke={theme.accent} />
            <Text style={styles.miniStatTitle}>Daily Goal</Text>
            <Text style={styles.miniStatValue}>2400 kcal</Text>
          </TouchableOpacity>
          <View style={[styles.miniStat, { backgroundColor: theme.card }]}>
            <Trophy size={20} stroke="#f59e0b" />
            <Text style={styles.miniStatTitle}>Streak</Text>
            <Text style={styles.miniStatValue}>{totalWorkoutsThisWeek > 0 ? '3 Days' : '0 Days'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Sections</Text>
      <View style={styles.grid}>
        {widgets.map((widget) => (
          <TouchableOpacity
            key={widget.id}
            style={[styles.widget, { backgroundColor: theme.card }]}
            activeOpacity={0.7}
            onPress={() => router.push(widget.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: widget.color + '20' }]}>
              <widget.icon size={24} stroke={widget.color} />
            </View>
            <Text style={styles.widgetTitle}>{widget.title}</Text>
            <Text style={styles.widgetSubtitle} numberOfLines={1}>{widget.subtitle}</Text>
            <View style={styles.chevron}>
              <ChevronRight size={16} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.1.0 (Live Data)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 4,
  },
  statsContainer: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  mainCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  mainCardTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  mainCardValue: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  mainCardSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  miniStatsRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  miniStat: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  miniStatTitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 8,
  },
  miniStatValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  widget: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    height: 140,
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  widgetSubtitle: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  chevron: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  footer: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.3,
  },
});
