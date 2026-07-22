import { cleanPrivacyBytes } from '../lib/clean';
import { scanBytes } from '../lib/metadata';

interface BatchInput {
  id: string;
  name: string;
  buffer: ArrayBuffer;
}

self.onmessage = (event: MessageEvent<BatchInput>) => {
  const { id, name, buffer } = event.data;
  try {
    const original = scanBytes(buffer, name);
    const cleaned = cleanPrivacyBytes(buffer, name);
    const output = cleaned.bytes.buffer.slice(
      cleaned.bytes.byteOffset,
      cleaned.bytes.byteOffset + cleaned.bytes.byteLength,
    ) as ArrayBuffer;
    self.postMessage({
      id,
      ok: true,
      originalRiskCount: original.findings.filter((item) => item.risk !== 'technical').length,
      output,
      outputName: cleaned.verification.fileName,
      format: cleaned.verification.format,
    }, { transfer: [output] });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : 'Unknown processing error.' });
  }
};
