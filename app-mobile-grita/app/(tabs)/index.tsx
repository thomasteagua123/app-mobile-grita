import { useEffect, useRef, useState } from "react";
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
  const [circles, setCircles] = useState<Circle[]>([]);
  const volumeRef = useRef(0);

  useEffect(() => {
    startRecording();
    startSpawner();
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
        const volume = Math.max(0, (status.metering + 160) / 160);
        volumeRef.current = volume;
      }
    });

    await recording.startAsync();
  };

  const startSpawner = () => {
    setInterval(() => {
      const v = volumeRef.current;

      if (v > 0.6) {
        for (let i = 0; i < 4; i++) {
          createCircle(v);
        }
      }
    }, 60);
  };

  const getColor = (v: number) => {
    if (v > 0.9) {
      const strongColors = [
        "rgba(180, 0, 0, 1)",
        "rgba(120, 0, 120, 1)",
        "rgba(0, 0, 180, 1)",
        "rgba(50, 0, 0, 1)",
      ];
      return strongColors[Math.floor(Math.random() * strongColors.length)];
    }

    if (v > 0.45) {
      const vividColors = [
        "rgba(255, 165, 0, 1)",
        "rgba(255, 255, 0, 1)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 200, 255, 1)",
      ];
      return vividColors[Math.floor(Math.random() * vividColors.length)];
    }

    const softColors = [
      "rgba(200, 255, 200, 0.8)",
      "rgba(200, 200, 255, 0.8)",
      "rgba(255, 255, 255, 0.8)",
      "rgba(220, 255, 240, 0.8)",
    ];
    return softColors[Math.floor(Math.random() * softColors.length)];
  };

  const createCircle = (v: number) => {
    const size = 50 + v * 200;

    const newCircle: Circle = {
      id: Math.random().toString(),
      x: Math.random() * (width - size),
      y: Math.random() * (height - size),
      size,
      color: getColor(v),
    };

    setCircles((prev) => [...prev, newCircle].slice(-40));

    setTimeout(() => {
      setCircles((prev) => prev.slice(1));
    }, 300);
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
              borderRadius: c.size / 2,
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
  },
});
