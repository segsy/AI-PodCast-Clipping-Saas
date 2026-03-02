import * as FileSystem from "expo-file-system";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { v4 as uuidv4 } from "uuid";

export async function compressVideo(inputUri: string): Promise<string> {
  const out = `${FileSystem.cacheDirectory}${uuidv4()}_compressed.mp4`;

  const cmd =
    `-y -i "${inputUri}" ` +
    `-vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" ` +
    `-c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p ` +
    `-c:a aac -b:a 128k "${out}"`;

  const session = await FFmpegKit.execute(cmd);
  const returnCode = await session.getReturnCode();

  if (!returnCode?.isValueSuccess()) {
    throw new Error("Compression failed");
  }

  return out;
}
