import { Text } from "react-native";

export default function BlinkIndicator({ blink }: { blink: boolean }) {
  if (!blink) return null;

  return (
    <Text
      style={{
        position: "absolute",
        bottom: 50,
        alignSelf: "center",
        fontSize: 20,
        color: "white",
      }}
    >
      👀 Parpadeo detectado
    </Text>
  );
}
