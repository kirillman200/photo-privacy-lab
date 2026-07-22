export type ImageFormat = 'jpeg' | 'png' | 'webp';
export type RiskLevel = 'critical' | 'personal' | 'contextual' | 'technical';

export interface Finding {
  id: string;
  label: string;
  value: string;
  risk: RiskLevel;
  description: string;
}

export interface ScanResult {
  fileName: string;
  format: ImageFormat;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  orientation: number;
  animated: boolean;
  findings: Finding[];
  structures: {
    exif: boolean;
    xmp: boolean;
    iptc: boolean;
    comments: boolean;
    embeddedThumbnail: boolean;
    iccProfile: boolean;
  };
}

export interface VerificationReport {
  version: 1;
  verifiedAt: string;
  file: {
    name: string;
    format: ImageFormat;
    size: number;
    dimensions: string;
  };
  checks: Array<{ category: string; status: 'not-found' | 'present' | 'preserved'; note: string }>;
  result: 'clean' | 'attention-needed';
  limitation: string;
}

export interface CleanResult {
  bytes: Uint8Array;
  mimeType: string;
  extension: string;
  mode: 'privacy-clean' | 'full-flatten';
  preservedOrientation: boolean;
  pixelDataPreserved: boolean;
  verification: ScanResult;
}
