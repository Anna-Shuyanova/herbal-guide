import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Vibration, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HerbCard({ herb, onPress, isFavorite, onToggleFavorite }) {
  const [imageError, setImageError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const showImage = herb.imageUrl && !imageError;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={0.95} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <LinearGradient colors={[herb.color || '#e8f5e9', '#fff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.card}>
          <View style={styles.left}>
            {showImage ? (
              <Image source={{ uri: herb.imageUrl }} style={styles.image} onError={() => setImageError(true)} />
            ) : (
              <Text style={styles.icon}>{herb.imagePlaceholder || '🌿'}</Text>
            )}
          </View>
          <View style={styles.center}>
            <Text style={styles.name}>{herb.name}</Text>
            <Text style={styles.latin}>{herb.latinName}</Text>
            <View style={styles.symptoms}>
              {herb.symptoms?.slice(0, 2).map((s, i) => (
                <View key={i} style={styles.symptomTag}><Text style={styles.symptomText}>{s}</Text></View>
              ))}
              {herb.symptoms?.length > 2 && <Text style={styles.more}>+{herb.symptoms.length - 2}</Text>}
            </View>
          </View>
          <TouchableOpacity style={styles.favBtn} onPress={(e) => { e.stopPropagation(); onToggleFavorite(herb.id); Vibration.vibrate(50); }}>
            <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20 },
  left: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  image: { width: 60, height: 60, borderRadius: 30 },
  icon: { fontSize: 32 },
  center: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2c5e2a' },
  latin: { fontSize: 11, color: '#999', fontStyle: 'italic' },
  symptoms: { flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' },
  symptomTag: { backgroundColor: 'rgba(76,175,80,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginRight: 6, marginBottom: 4 },
  symptomText: { fontSize: 10, color: '#4caf50' },
  more: { fontSize: 10, color: '#999' },
  favBtn: { padding: 8 },
  favIcon: { fontSize: 24 },
});