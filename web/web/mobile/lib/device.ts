import * as Application from "expo-application";
import * as Device from "expo-device";

export function getDeviceInfo() {
  return {
    deviceId: Application.getAndroidId?.() || Application.applicationId || "unknown_device",
    deviceName: Device.deviceName || "Unknown Device"
  };
}
