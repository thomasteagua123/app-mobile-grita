import { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");

type Circle = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

export default function Home() {
  const [volume, setVolume] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);

  useEffect(() => {
    startRecording();
  }, []);

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();

    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );

    recording.setOnRecordingStatusUpdate((status) => {
      if (status.metering !== undefined) {
        const normalized = Math.max(0, (status.metering + 160) / 160);
        setVolume(normalized);

        // 💥 Si el volumen es alto → crear manchas
        if (normalized > 0.4) {
          createCircle(normalized);
        }
      }
    });

    await recording.startAsync();
  };

  // 🎨 Generar color según volumen
  const getColor = (v: number) => {
    if (v < 0.3) return "rgba(0, 150, 255, 0.5)"; // azul
    if (v < 0.6) return "rgba(255, 165, 0, 0.6)"; // naranja
    return "rgba(255, 0, 0, 0.7)"; // rojo
  };

  // 🎯 Crear círculo
  const createCircle = (v: number) => {
    const newCircle: Circle = {
      id: Math.random().toString(),
      x: Math.random() * width,
      y: Math.random() * height,
      size: 50 + v * 200, // más volumen = más grande
      color: getColor(v),
    };

    setCircles((prev) => [...prev, newCircle].slice(-30)); // limitar cantidad
  };

  return (
    <View style={styles.container}>
      {circles.map((c) => (
        <View
          key={c.id}
          style={[
            styles.circle,
            {
              left: c.x,
              top: c.y,
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
  },
});
