import * as LocalAuthentication from "expo-local-authentication";

export async function authenticateWithBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return true;

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) return true;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Unlock AI Podcast Clipping",
    disableDeviceFallback: false,
    cancelLabel: "Cancel"
  });

  return result.success;
}
