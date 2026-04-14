import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

const { width, height } = Dimensions.get("window");

type Circle = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const volumeRef = useRef(0);
  const intervalRef = useRef<any>(null);
  const viewRef = useRef<View>(null);

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

  const takeScreenshot = async () => {
    try {
      if (!viewRef.current) return;

      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      console.log("Imagen:", uri);

      // 👇 chequea si se puede compartir
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert("Error", "No se puede compartir en este dispositivo");
        return;
      }

      // 👇 abre menú de compartir
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Error screenshot:", error);
    }
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
    const padding = 20;

    const x = padding + Math.random() * (width - size - padding * 2);
    const y = padding + Math.random() * (height - size - padding * 2);

    const newCircle: Circle = {
      id: Math.random().toString(),
      x,
      y,
      size,
      color: getColor(v),
    };

    setCircles((prev) => [...prev, newCircle]);

    setTimeout(() => {
      setCircles((prev) => prev.filter((c) => c.id !== newCircle.id));
    }, 5000);
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
          <Text style={styles.buttonText}>Empezar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View ref={viewRef} collapsable={false} style={styles.captureArea}>
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

      <TouchableOpacity style={styles.printButton} onPress={takeScreenshot}>
        <Text style={styles.printText}>Imprime tus emociones</Text>
      </TouchableOpacity>

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
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 34,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },

  description: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    maxWidth: 300, // 👈 esto centra visualmente el texto
  },

  button: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    elevation: 5, // Android shadow
  },

  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  printButton: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  printText: {
    color: "black",
    fontSize: 16,
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
  captureArea: {
    flex: 1,
    backgroundColor: "black",
  },
});
