import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
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
  const [started, setStarted] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const volumeRef = useRef(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (started) {
      startRecording();
      startSpawner();
    }

    return () => stopAll();
  }, [started]);

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
    intervalRef.current = setInterval(() => {
      const v = volumeRef.current;

      if (v > 0.6) {
        for (let i = 0; i < 4; i++) {
          createCircle(v);
        }
      }
    }, 60);
  };

  const stopAll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    stopAll();
    setCircles([]);
    setStarted(false);
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

    if (v > 0.5) {
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

  if (!started) {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.title}>Grita y pinta</Text>

        <Text style={styles.description}>
          Expresá tus emociones a través del sonido.
          {"\n\n"}
          Cuanto más fuerte grites, más intensa será tu obra.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setStarted(true)}
        >
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reiniciar</Text>
      </TouchableOpacity>
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
  startContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 32,
    color: "white",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
  },
  resetButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  resetText: {
    color: "black",
    fontSize: 16,
  },
});
