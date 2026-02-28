import { Camera, Ruler, Scale, TrendingUp, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useProgress } from '../context/ProgressContext';
import { useWorkout } from '../context/WorkoutContext';
import { getBestLifts, getVolumeData } from '../utils/analytics';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { weightHistory, measurements, photos, logWeight, logMeasurements } = useProgress();
  const { workoutHistory } = useWorkout();

  const bestLifts = getBestLifts(workoutHistory);
  const volumeData = getVolumeData(workoutHistory);

  const [activeTab, setActiveTab] = useState<'stats' | 'photos' | 'measurements'>('stats');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.tabBar}>
        {(['stats', 'photos', 'measurements'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && { borderBottomColor: theme.tint, borderBottomWidth: 3 }]}
          >
            <Text style={[styles.tabText, activeTab === tab ? { color: theme.tint, fontWeight: '700' } : { color: theme.tabIconDefault }]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'stats' && (
          <View style={styles.section}>
            {/* Weight Card */}
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() => {
                Alert.prompt(
                  "Update Weight",
                  "Enter your current weight (kg):",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Update", onPress: (val?: string) => val && logWeight(parseFloat(val)) }
                  ],
                  "plain-text",
                  weightHistory[0]?.value.toString()
                );
              }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Scale size={18} stroke={theme.text} />
                  <Text style={styles.cardTitle}>Weight Trend</Text>
                </View>
                <Text style={styles.cardValue}>{weightHistory[0]?.value} kg</Text>
              </View>
              <View style={[styles.chartMock, { opacity: 0.2 }]}>
                <TrendingUp size={40} stroke={theme.text} />
                <Text style={styles.chartPlaceholder}>Chart visualization would go here</Text>
              </View>
              <View style={styles.historyList}>
                {weightHistory.map((w, i) => (
                  <View key={i} style={styles.historyItem}>
                    <Text style={styles.historyDate}>{w.date}</Text>
                    <Text style={styles.historyValue}>{w.value} kg</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            {/* 1RM Estimates */}
            <Text style={styles.sectionHeading}>Strength Analytics (1RM)</Text>
            {bestLifts.length === 0 ? (
              <Text style={styles.emptyText}>Complete a workout to see 1RM estimates.</Text>
            ) : (
              bestLifts.map((lift, i) => (
                <View key={i} style={[styles.liftCard, { backgroundColor: theme.card }]}>
                  <View style={styles.liftInfo}>
                    <View style={{ marginRight: 8 }}>
                      <Trophy size={16} stroke="#f59e0b" />
                    </View>
                    <Text style={styles.liftName} numberOfLines={1}>{lift.exercise}</Text>
                  </View>
                  <View style={styles.liftStats}>
                    <View style={styles.liftStatItem}>
                      <Text style={styles.liftStatValue}>{lift.oneRM}</Text>
                      <Text style={styles.liftStatLabel}>Est. 1RM</Text>
                    </View>
                    <View style={styles.liftStatItem}>
                      <Text style={styles.liftStatValue}>{lift.weight}x{lift.reps}</Text>
                      <Text style={styles.liftStatLabel}>Best Set</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'photos' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.addPhotoButton, { borderColor: theme.tint }]}
              onPress={() => Alert.alert("Feature Coming Soon", "Photo upload integration is pending device permission logic.")}
            >
              <Camera size={24} stroke={theme.tint} />
              <Text style={[styles.addPhotoText, { color: theme.tint }]}>Add Progress Photo</Text>
            </TouchableOpacity>

            <View style={styles.photoGrid}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <View style={styles.photoDateTag}>
                    <Text style={styles.photoDateText}>{photo.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'measurements' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.logButton, { backgroundColor: theme.tint }]}
              onPress={() => {
                Alert.prompt(
                  "Log Measurements",
                  "Enter values (cm): Chest, Waist, Hips, Arms (comma separated)",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Log",
                      onPress: (val?: string) => {
                        if (!val) return;
                        const [chest, waist, hips, arms] = val.split(',').map((v: string) => parseFloat(v.trim()));
                        logMeasurements({ chest, waist, hips, arms });
                      }
                    }
                  ]
                );
              }}
            >
              <Ruler size={20} stroke="white" />
              <Text style={styles.logButtonText}>Log Measurements</Text>
            </TouchableOpacity>

            {measurements.map((m, i) => (
              <View key={i} style={[styles.measurementCard, { backgroundColor: theme.card }]}>
                <Text style={styles.measurementDate}>{m.date}</Text>
                <View style={styles.measurementGrid}>
                  <View style={styles.mItem}><Text style={styles.mLabel}>Chest</Text><Text style={styles.mValue}>{m.chest} cm</Text></View>
                  <View style={styles.mItem}><Text style={styles.mLabel}>Waist</Text><Text style={styles.mValue}>{m.waist} cm</Text></View>
                  <View style={styles.mItem}><Text style={styles.mLabel}>Hips</Text><Text style={styles.mValue}>{m.hips} cm</Text></View>
                  <View style={styles.mItem}><Text style={styles.mLabel}>Arms</Text><Text style={styles.mValue}>{m.arms} cm</Text></View>
                </View>
              </View>
            ))}
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
  tabBar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: 'transparent',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 15,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartMock: {
    height: 120,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartPlaceholder: {
    fontSize: 12,
    opacity: 0.3,
    marginTop: 8,
  },
  historyList: {
    backgroundColor: 'transparent',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'transparent',
  },
  historyDate: {
    opacity: 0.5,
  },
  historyValue: {
    fontWeight: '600',
  },
  liftCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liftInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  liftName: {
    fontSize: 15,
    fontWeight: '600',
  },
  liftStats: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: 'transparent',
  },
  liftStatItem: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  liftStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  liftStatLabel: {
    fontSize: 10,
    opacity: 0.4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  photoContainer: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoDateTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  photoDateText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addPhotoButton: {
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  logButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  logButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  measurementCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  measurementDate: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    opacity: 0.6,
  },
  measurementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
  mItem: {
    width: '50%',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  mLabel: {
    fontSize: 10,
    opacity: 0.4,
    marginBottom: 2,
  },
  mValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 20,
  }
});
