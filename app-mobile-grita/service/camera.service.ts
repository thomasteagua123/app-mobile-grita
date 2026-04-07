import { Camera } from "expo-camera";

export const requestCameraPermission = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === "granted";
};
