import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import BlinkIndicator from "@/components/BlinkIndicator";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [blink, setBlink] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    requestPermission();
  }, []);

  // 👉 cuando "parpadea"
  useEffect(() => {
    if (blink) {
      const frases = ["🔥 GRITA!!!", "😤 DALE!", "💥 SOLTALO!", "😱 AAAA!"];
      const random = frases[Math.floor(Math.random() * frases.length)];

      setMessage(random);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }, [blink]);

  if (!permission) return <Text>Permisos...</Text>;
  if (!permission.granted) return <Text>No hay acceso a la cámara</Text>;

  return (
    <View style={{ flex: 1 }}>
      {/* CAMARA */}
      <CameraView style={{ flex: 1 }} facing="front" active={true} />

      {/* TEXTO */}
      {message !== "" && (
        <Text
          style={{
            position: "absolute",
            top: 100,
            alignSelf: "center",
            fontSize: 28,
            color: "white",
            fontWeight: "bold",
          }}
        >
          {message}
        </Text>
      )}

      {/* BOTÓN PARA SIMULAR PARPADEO */}
      <Pressable
        onPress={() => {
          setBlink(true);
          setTimeout(() => setBlink(false), 300);
        }}
        style={{
          position: "absolute",
          bottom: 100,
          alignSelf: "center",
          backgroundColor: "black",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>Simular parpadeo</Text>
      </Pressable>

      {/* INDICADOR */}
      <BlinkIndicator blink={blink} />
    </View>
  );
}
