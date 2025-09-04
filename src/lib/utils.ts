import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert a Uint8Array to a URL-safe Base64 string
function uint8ArrayToUrlSafeBase64(uint8Array: Uint8Array): string {
  const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
  return btoa(binaryString)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove trailing '='
}

// Helper function to convert a URL-safe Base64 string back to a Uint8Array
function urlSafeBase64ToUint8Array(base64String: string): Uint8Array {
    // Add padding back
  base64String = base64String.padEnd(base64String.length + (4 - base64String.length % 4) % 4, '=');
  // Convert to standard Base64
  const standardBase64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
  const binaryString = atob(standardBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function compressString(input: string): Promise<string> {
  if (typeof CompressionStream === 'undefined') {
    // Fallback for older browsers
    return btoa(input);
  }
  try {
    const stream = new Blob([input], { type: 'text/plain' }).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    const reader = compressedStream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const compressed = new Blob(chunks, { type: 'application/gzip' });
    const buffer = await compressed.arrayBuffer();
    return uint8ArrayToUrlSafeBase64(new Uint8Array(buffer));
  } catch (error) {
    console.error('Compression failed:', error);
    // Fallback to simple Base64 on error
    return btoa(input);
  }
}

export async function decompressString(input: string): Promise<string> {
    if (typeof DecompressionStream === 'undefined') {
    // Fallback for older browsers
    return atob(input);
  }
  try {
    const uint8Array = urlSafeBase64ToUint8Array(input);
    const stream = new Blob([uint8Array], { type: 'application/gzip' }).stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
    const reader = decompressedStream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const decompressed = new Blob(chunks, { type: 'text/plain' });
    return await decompressed.text();
  } catch (error) {
    console.error('Decompression failed:', error);
     // Fallback for non-compressed links
    return atob(input);
  }
}
