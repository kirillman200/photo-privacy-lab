<script setup lang="ts">
import JSZip from 'jszip';
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  MAX_BATCH_BYTES,
  MAX_BATCH_MEGABYTES,
  MAX_FILE_BYTES,
  MAX_FILE_MEGABYTES,
} from '../lib/metadata';

interface BatchItem {
  id: string;
  file: File;
  state: 'queued' | 'working' | 'done' | 'error';
  message: string;
  output?: ArrayBuffer;
  outputName?: string;
}

const MAX_FILES = 20;
const items = ref<BatchItem[]>([]);
const running = ref(false);
const cancelled = ref(false);
const error = ref('');
const zipUrl = ref('');
let worker: Worker | null = null;

const totalSize = computed(() => items.value.reduce((sum, item) => sum + item.file.size, 0));
const completed = computed(() => items.value.filter((item) => item.state === 'done').length);

const clearZip = () => {
  if (zipUrl.value) URL.revokeObjectURL(zipUrl.value);
  zipUrl.value = '';
};

const selectFiles = (list: FileList | File[]) => {
  error.value = '';
  clearZip();
  const files = Array.from(list);
  if (files.length > MAX_FILES) {
    error.value = `Choose no more than ${MAX_FILES} files in one batch.`;
    return;
  }
  const oversized = files.find((file) => file.size > MAX_FILE_BYTES);
  if (oversized) {
    error.value = `${oversized.name} exceeds the ${MAX_FILE_MEGABYTES} MB per-file safety limit.`;
    return;
  }
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_BATCH_BYTES) {
    error.value = `This batch exceeds the ${MAX_BATCH_MEGABYTES} MB total safety limit.`;
    return;
  }
  items.value = files.map((file, index) => ({ id: `${Date.now()}-${index}`, file, state: 'queued', message: 'Ready' }));
};

const processOne = (item: BatchItem): Promise<void> => new Promise(async (resolve) => {
  if (!worker) return resolve();
  const buffer = await item.file.arrayBuffer();
  const listener = (event: MessageEvent) => {
    if (event.data.id !== item.id) return;
    worker?.removeEventListener('message', listener);
    if (event.data.ok) {
      item.state = 'done';
      item.output = event.data.output;
      item.outputName = event.data.outputName;
      item.message = `${event.data.originalRiskCount} private finding${event.data.originalRiskCount === 1 ? '' : 's'} removed; output verified`;
    } else {
      item.state = 'error';
      item.message = event.data.error;
    }
    resolve();
  };
  worker.addEventListener('message', listener);
  worker.postMessage({ id: item.id, name: item.file.name, buffer }, [buffer]);
});

const start = async () => {
  if (!items.value.length || running.value) return;
  running.value = true;
  cancelled.value = false;
  error.value = '';
  clearZip();
  worker = new Worker(new URL('../workers/batch.worker.ts', import.meta.url), { type: 'module', name: 'photo-privacy-batch' });
  try {
    for (const item of items.value) {
      if (cancelled.value) break;
      item.state = 'working';
      item.message = 'Scanning and cleaning in the browser worker...';
      await processOne(item);
    }
    if (!cancelled.value) {
      const zip = new JSZip();
      const report: Array<{ file: string; status: string; note: string }> = [];
      for (const item of items.value) {
        if (item.state === 'done' && item.output && item.outputName) zip.file(item.outputName, item.output);
        report.push({ file: item.file.name, status: item.state, note: item.message });
      }
      zip.file('photo-privacy-verification.json', JSON.stringify({ generatedAt: new Date().toISOString(), files: report, privateValuesIncluded: false }, null, 2));
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      zipUrl.value = URL.createObjectURL(blob);
    }
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Batch processing failed.';
  } finally {
    worker?.terminate();
    worker = null;
    running.value = false;
  }
};

const cancel = () => {
  cancelled.value = true;
  worker?.terminate();
  worker = null;
  const current = items.value.find((item) => item.state === 'working');
  if (current) { current.state = 'queued'; current.message = 'Cancelled before completion'; }
  running.value = false;
};

const removeAll = () => {
  cancel();
  items.value = [];
  error.value = '';
  clearZip();
};

onBeforeUnmount(() => {
  worker?.terminate();
  clearZip();
});
</script>

<template>
  <div class="batch-panel">
    <div class="batch-intro">
      <p class="kicker">Background browser processing</p>
      <h3>Apply one privacy-clean policy</h3>
      <p>Files are processed sequentially in a Web Worker on this device. The ZIP is assembled in your browser.</p>
    </div>
    <label class="drop-zone compact">
      <input type="file" multiple accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" @change="selectFiles(($event.target as HTMLInputElement).files || [])" />
      <span class="drop-zone__icon" aria-hidden="true">+</span>
      <strong>Choose up to 20 photos</strong>
      <small>{{ MAX_FILE_MEGABYTES }} MB per file · {{ MAX_BATCH_MEGABYTES }} MB combined maximum</small>
    </label>
    <p v-if="error" class="error-message" role="alert">{{ error }}</p>
    <div v-if="items.length" class="batch-list">
      <div class="batch-meta">
        <strong>{{ items.length }} files · {{ (totalSize / 1024 / 1024).toFixed(1) }} MB</strong>
        <button type="button" class="quiet-button" @click="removeAll">Remove all</button>
      </div>
      <ol>
        <li v-for="item in items" :key="item.id">
          <span class="file-state" :class="item.state">{{ item.state === 'done' ? '✓' : item.state === 'error' ? '!' : item.state === 'working' ? '…' : '○' }}</span>
          <span><strong>{{ item.file.name }}</strong><small>{{ item.message }}</small></span>
        </li>
      </ol>
      <div class="button-row">
        <button v-if="!running" type="button" class="primary-button" @click="start">Clean batch</button>
        <button v-else type="button" class="secondary-button" @click="cancel">Cancel</button>
        <a v-if="zipUrl && completed" class="primary-button" :href="zipUrl" download="photo-privacy-cleaned.zip">Download ZIP ({{ completed }})</a>
      </div>
    </div>
  </div>
</template>
