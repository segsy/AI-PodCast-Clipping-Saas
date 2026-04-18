// Type declaration for expo-file-system
// This is a stub type definition to satisfy TypeScript when the package is not installed.
// The actual expo-file-system package is only needed at runtime in Expo/react-native environments.

declare module 'expo-file-system' {
  export const EncodingType: {
    Base64: 'base64';
    UTF8: 'utf8';
  };

  export interface ReadAsStringOptions {
    encoding?: 'base64' | 'utf8';
    position?: number;
    length?: number;
  }

  export function readAsStringAsync(
    uri: string,
    options?: ReadAsStringOptions
  ): Promise<string>;

  export function writeAsStringAsync(
    uri: string,
    contents: string,
    options?: { encoding?: 'base64' | 'utf8' }
  ): Promise<void>;

  export function deleteAsync(
    uri: string,
    options?: { idempotent?: boolean }
  ): Promise<void>;

  export function getInfoAsync(
    uri: string,
    options?: { size?: boolean }
  ): Promise<{ exists: boolean; isDirectory: boolean; size?: number }>;

  export function makeDirectoryAsync(
    uri: string,
    options?: { intermediates?: boolean }
  ): Promise<void>;
}
