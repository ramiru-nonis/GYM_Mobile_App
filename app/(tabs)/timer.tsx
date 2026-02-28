import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Pause, Play, RotateCcw, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TimerScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [timeLeft, setTimeLeft] = useState(90);
    const [isActive, setIsActive] = useState(false);
    const [totalTime, setTotalTime] = useState(90);
    const timerRef = useRef<any>(null);

    const presets = [15, 30, 45, 60, 90, 120, 150, 180, 240, 300];

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            Alert.alert("Time's up!", "Your rest period is over.");
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(totalTime);
    };

    const selectPreset = (seconds: number) => {
        setIsActive(false);
        setTotalTime(seconds);
        setTimeLeft(seconds);
    };

    const handleCustomTime = () => {
        Alert.prompt(
            "Custom Timer",
            "Enter seconds for your rest period:",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Set",
                    onPress: (value?: string) => {
                        const seconds = parseInt(value || "0");
                        if (seconds > 0) selectPreset(seconds);
                    }
                }
            ],
            "plain-text",
            totalTime.toString()
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: theme.background }}>
            <View style={styles.timerContainer}>
                <View style={[styles.outerCircle, { borderColor: theme.card }]}>
                    <LinearGradient
                        colors={isActive ? ['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.05)'] : ['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.02)']}
                        style={styles.innerCircle}
                    >
                        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                        <Text style={styles.timerSub}>{isActive ? 'Resting...' : 'Ready'}</Text>
                    </LinearGradient>
                </View>
            </View>

            <View style={styles.presetsContainer}>
                {presets.map((time) => (
                    <TouchableOpacity
                        key={time}
                        style={[
                            styles.presetButton,
                            { backgroundColor: theme.card },
                            totalTime === time && { borderColor: theme.tint, borderWidth: 2 }
                        ]}
                        onPress={() => selectPreset(time)}
                    >
                        <Text style={styles.presetText}>{time}s</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={[styles.presetButton, { backgroundColor: theme.card, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.tint }]}
                    onPress={handleCustomTime}
                >
                    <Text style={[styles.presetText, { color: theme.tint }]}>Custom</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity
                    style={[styles.roundButton, { backgroundColor: theme.card }]}
                    onPress={resetTimer}
                >
                    <RotateCcw size={28} stroke={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.mainPlayButton} onPress={toggleTimer}>
                    <LinearGradient
                        colors={['#6366f1', '#4f46e5']}
                        style={styles.playGradient}
                    >
                        {isActive ? (
                            <Pause size={40} stroke="white" fill="white" />
                        ) : (
                            <Play size={40} stroke="white" fill="white" />
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.roundButton, { backgroundColor: theme.card }]}>
                    <Volume2 size={28} stroke={theme.text} />
                </TouchableOpacity>
            </View>

            <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Bell size={20} stroke={theme.tint} />
                        <Text style={styles.settingTitle}>Sound & Notification</Text>
                    </View>
                    <View style={[styles.switch, { backgroundColor: theme.accent }]} />
                </View>
                <Text style={styles.settingDesc}>App will notify you when rest period is over.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
    },
    timerContainer: {
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    outerCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    innerCircle: {
        width: 240,
        height: 240,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 64,
        fontWeight: '800',
        fontFamily: 'SpaceMono',
    },
    timerSub: {
        fontSize: 18,
        opacity: 0.5,
        marginTop: 8,
        fontWeight: '600',
    },
    presetsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 50,
        backgroundColor: 'transparent',
    },
    presetButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 15,
        minWidth: 70,
        alignItems: 'center',
    },
    presetText: {
        fontSize: 16,
        fontWeight: '700',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 50,
        backgroundColor: 'transparent',
    },
    roundButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    mainPlayButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        elevation: 8,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    playGradient: {
        flex: 1,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsCard: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 40,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'transparent',
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    settingDesc: {
        fontSize: 13,
        opacity: 0.5,
        marginTop: 8,
        marginLeft: 32,
    },
    switch: {
        width: 44,
        height: 24,
        borderRadius: 12,
    }
});
