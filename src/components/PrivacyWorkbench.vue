<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { buildSafeReport, cleanPrivacyBytes, reportText } from '../lib/clean';
import { assertFileSize, MAX_FILE_MEGABYTES, privateFindings, scanBytes } from '../lib/metadata';
import type { CleanResult, Finding, ScanResult } from '../lib/types';
import type { ToolMode } from '../data/site';
import BatchCleaner from './BatchCleaner.vue';
import ImageRedactor from './ImageRedactor.vue';

const props = defineProps<{ initialMode?: ToolMode }>();
type PrimaryMode = 'scan' | 'clean' | 'gps' | 'verify' | 'batch' | 'redact';

const mode = ref<PrimaryMode>(props.initialMode || 'scan');
const file = ref<File | null>(null);
const scan = ref<ScanResult | null>(null);
const cleaned = ref<CleanResult | null>(null);
const busy = ref(false);
const error = ref('');
const status = ref('Choose a JPEG, PNG, or static WebP file to begin.');
const downloadUrl = ref('');
const hydrated = ref(false);

const tabs: Array<{ id: PrimaryMode; label: string }> = [
  { id: 'scan', label: 'Privacy scan' },
  { id: 'clean', label: 'Clean metadata' },
  { id: 'gps', label: 'GPS check' },
  { id: 'redact', label: 'Redact' },
  { id: 'verify', label: 'Verify copy' },
  { id: 'batch', label: 'Batch' },
];

const grouped = computed(() => {
  const result: Record<string, Finding[]> = { critical: [], personal: [], contextual: [], technical: [] };
  for (const item of scan.value?.findings || []) result[item.risk].push(item);
  return result;
});
const gpsFinding = computed(() => scan.value?.findings.find((item) => item.id === 'gps'));
const safeReport = computed(() => scan.value ? buildSafeReport(scan.value) : null);
const attentionCount = computed(() => scan.value ? privateFindings(scan.value).length : 0);

const clearDownload = () => {
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
  downloadUrl.value = '';
};

const reset = () => {
  clearDownload();
  file.value = null;
  scan.value = null;
  cleaned.value = null;
  error.value = '';
  status.value = 'Files and temporary previews cleared from this tab.';
};

const acceptFile = async (selected: File) => {
  error.value = '';
  cleaned.value = null;
  clearDownload();
  try { assertFileSize(selected.size); }
  catch (caught) { error.value = caught instanceof Error ? caught.message : `This file exceeds the ${MAX_FILE_MEGABYTES} MB per-file safety limit.`; return; }
  busy.value = true;
  status.value = 'Reading and scanning locally...';
  try {
    const buffer = await selected.arrayBuffer();
    const result = scanBytes(buffer, selected.name);
    file.value = selected;
    scan.value = result;
    status.value = attentionCount.value
      ? `Privacy scan complete. ${attentionCount.value} item${attentionCount.value === 1 ? '' : 's'} need attention.`
      : 'Privacy scan complete. No supported private metadata was found.';
  } catch (caught) {
    file.value = null;
    scan.value = null;
    error.value = caught instanceof Error ? caught.message : 'The image could not be scanned.';
    status.value = 'Scan failed safely.';
  } finally {
    busy.value = false;
  }
};

const onFiles = (list: FileList | File[]) => {
  const selected = Array.from(list)[0];
  if (selected) void acceptFile(selected);
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files.length) onFiles(event.dataTransfer.files);
};

const onPaste = (event: ClipboardEvent) => {
  const item = Array.from(event.clipboardData?.items || []).find((entry) => entry.type.startsWith('image/'));
  const pasted = item?.getAsFile();
  if (pasted) {
    event.preventDefault();
    void acceptFile(new File([pasted], `pasted-image.${pasted.type.split('/')[1] || 'png'}`, { type: pasted.type }));
  }
};

const cleanPrivacy = async () => {
  if (!file.value) return;
  busy.value = true;
  error.value = '';
  status.value = 'Removing supported private metadata locally...';
  try {
    const result = cleanPrivacyBytes(await file.value.arrayBuffer(), file.value.name);
    cleaned.value = result;
    scan.value = result.verification;
    clearDownload();
    downloadUrl.value = URL.createObjectURL(new Blob([result.bytes as BlobPart], { type: result.mimeType }));
    status.value = 'Clean copy generated and rescanned. It is ready to download.';
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Cleaning failed.';
    status.value = 'Cleaning failed safely; no output was offered.';
  } finally {
    busy.value = false;
  }
};

const flattenImage = async () => {
  if (!file.value) return;
  busy.value = true;
  error.value = '';
  status.value = 'Decoding the displayed image and creating a fresh copy...';
  let sourceUrl = '';
  try {
    sourceUrl = URL.createObjectURL(file.value);
    const image = new Image();
    image.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('The browser could not decode this image.'));
      image.src = sourceUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas rendering is not available.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    const mimeType = file.value.type === 'image/png' ? 'image/png' : file.value.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('The browser could not encode the flattened copy.')), mimeType, 0.92));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1]!;
    const outputName = `${file.value.name.replace(/\.[^.]+$/, '')}-flattened.${extension}`;
    const verification = scanBytes(bytes, outputName);
    if (privateFindings(verification).length) throw new Error('Output verification found a private metadata category.');
    cleaned.value = { bytes, mimeType, extension, mode: 'full-flatten', preservedOrientation: false, pixelDataPreserved: false, verification };
    scan.value = verification;
    clearDownload();
    downloadUrl.value = URL.createObjectURL(blob);
    status.value = 'Flattened copy generated and rescanned. Compression or file size may have changed.';
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Flattening failed.';
    status.value = 'Flattening failed safely; no output was offered.';
  } finally {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    busy.value = false;
  }
};

const downloadReport = (format: 'json' | 'txt') => {
  if (!scan.value) return;
  const body = format === 'json' ? JSON.stringify(buildSafeReport(scan.value), null, 2) : reportText(scan.value);
  const url = URL.createObjectURL(new Blob([body], { type: format === 'json' ? 'application/json' : 'text/plain' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${scan.value.fileName.replace(/\.[^.]+$/, '')}-verification.${format}`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const openMap = () => {
  const coordinates = gpsFinding.value?.value;
  if (!coordinates || !/^[-\d.]+,\s*[-\d.]+$/.test(coordinates)) return;
  const ok = window.confirm('Opening a map sends these coordinates and ordinary browser information to OpenStreetMap. Continue?');
  if (ok) window.open(`https://www.openstreetmap.org/?mlat=${encodeURIComponent(coordinates.split(',')[0]!.trim())}&mlon=${encodeURIComponent(coordinates.split(',')[1]!.trim())}#map=16/${coordinates.replace(', ', '/')}`, '_blank', 'noopener,noreferrer');
};

onMounted(() => {
  hydrated.value = true;
  window.addEventListener('paste', onPaste);
});
onBeforeUnmount(() => {
  window.removeEventListener('paste', onPaste);
  clearDownload();
});
</script>

<template>
  <section class="workbench" aria-labelledby="workbench-title" data-testid="privacy-workbench" :data-ready="hydrated ? 'true' : 'false'">
    <div class="workbench__head">
      <div>
        <p class="kicker">Private browser workspace</p>
        <h2 id="workbench-title">Inspect, clean, redact, verify</h2>
      </div>
      <div class="local-badge"><span aria-hidden="true"></span> Image files stay in this tab</div>
    </div>

    <div class="mode-tabs" role="tablist" aria-label="Photo privacy tools">
      <button v-for="tab in tabs" :key="tab.id" type="button" role="tab" :aria-selected="mode === tab.id" :class="{ active: mode === tab.id }" @click="mode = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <BatchCleaner v-if="mode === 'batch'" />
    <ImageRedactor v-else-if="mode === 'redact'" />
    <div v-else class="scanner-grid">
      <div class="scanner-input">
        <label class="drop-zone" @dragover.prevent @drop="onDrop">
          <input data-testid="photo-input" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" :disabled="!hydrated" @change="onFiles(($event.target as HTMLInputElement).files || [])" />
          <span class="drop-zone__icon" aria-hidden="true">+</span>
          <strong>{{ file ? 'Choose a different photo' : 'Choose a photo' }}</strong>
          <span>or drag it here, or paste a screenshot</span>
          <small>JPEG, PNG, or static WebP, up to {{ MAX_FILE_MEGABYTES }} MB</small>
        </label>

        <div v-if="file" class="file-card">
          <div>
            <strong>{{ file.name }}</strong>
            <span>{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
          </div>
          <button type="button" class="quiet-button" @click="reset">Remove all</button>
        </div>

        <div v-if="scan && (mode === 'clean' || mode === 'gps' || mode === 'scan')" class="action-panel">
          <template v-if="mode === 'clean' || mode === 'scan'">
            <button type="button" class="primary-button" :disabled="busy" @click="cleanPrivacy">Privacy Clean</button>
            <button type="button" class="secondary-button" :disabled="busy" @click="flattenImage">Full Flatten</button>
            <p>Privacy Clean preserves JPEG compressed image data. Full Flatten redraws the displayed pixels and may change compression.</p>
          </template>
          <template v-if="mode === 'gps'">
            <button type="button" class="primary-button" :disabled="busy" @click="cleanPrivacy">Remove location data</button>
            <button v-if="gpsFinding?.value.includes(',')" type="button" class="secondary-button" @click="openMap">Open in maps</button>
            <p>A map is never loaded automatically. The map button asks before coordinates leave this page.</p>
          </template>
        </div>
      </div>

      <div class="scan-results" aria-live="polite" aria-atomic="false">
        <div v-if="!scan" class="empty-results">
          <div class="radar" aria-hidden="true"><span></span></div>
          <h3>Your privacy report appears here</h3>
          <p>The scanner checks supported metadata structures locally and groups findings by practical risk.</p>
          <ul>
            <li>Location and hidden previews</li>
            <li>Owner, device, and comment fields</li>
            <li>Time, software, and technical display data</li>
          </ul>
        </div>

        <template v-else>
          <div class="result-summary" :class="attentionCount ? 'has-risk' : 'is-clean'">
            <span>{{ attentionCount ? attentionCount : '✓' }}</span>
            <div>
              <strong>{{ attentionCount ? `${attentionCount} item${attentionCount === 1 ? '' : 's'} need attention` : 'No supported private metadata found' }}</strong>
              <small>{{ scan.format.toUpperCase() }} · {{ scan.width && scan.height ? `${scan.width} × ${scan.height}` : 'Dimensions not reported' }}</small>
            </div>
          </div>

          <div v-for="risk in ['critical', 'personal', 'contextual', 'technical']" :key="risk" v-show="grouped[risk]?.length" class="risk-group">
            <h3><span :class="`risk-dot ${risk}`"></span>{{ risk }}</h3>
            <dl>
              <div v-for="item in grouped[risk]" :key="`${item.id}-${item.value}`">
                <dt>{{ item.label }}</dt>
                <dd><strong>{{ item.value }}</strong><span>{{ item.description }}</span></dd>
              </div>
            </dl>
          </div>

          <div v-if="mode === 'verify' || cleaned" class="verification-panel">
            <p class="kicker">Clean-copy verification</p>
            <h3>{{ safeReport?.result === 'clean' ? 'Checked categories are clean' : 'The copy still needs attention' }}</h3>
            <ul>
              <li v-for="check in safeReport?.checks" :key="check.category">
                <span>{{ check.category }}</span><strong :class="check.status">{{ check.status.replace('-', ' ') }}</strong>
              </li>
            </ul>
            <p class="limitation">{{ safeReport?.limitation }}</p>
            <div class="button-row">
              <a v-if="cleaned && downloadUrl" class="primary-button" :href="downloadUrl" :download="cleaned.verification.fileName">Download clean image</a>
              <button type="button" class="secondary-button" @click="downloadReport('txt')">Text report</button>
              <button type="button" class="secondary-button" @click="downloadReport('json')">JSON report</button>
            </div>
          </div>
        </template>

        <p v-if="error" class="error-message" role="alert">{{ error }}</p>
        <p class="status-line" role="status">{{ busy ? 'Working locally. Keep this tab open.' : status }}</p>
      </div>
    </div>

    <aside v-if="cleaned" class="ad-reserve" aria-label="Reserved advertisement area">
      <span>Advertisement</span>
      <p>Reserved space below the completed verification, away from file selection and cleaning controls.</p>
    </aside>
  </section>
</template>
