<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { buildSafeReport } from '../lib/clean';
import { assertFileSize, MAX_FILE_MEGABYTES, privateFindings, scanBytes } from '../lib/metadata';

type Tool = 'solid' | 'blur' | 'pixelate' | 'crop';
interface Mark { tool: Tool; x: number; y: number; width: number; height: number }

const canvas = ref<HTMLCanvasElement | null>(null);
const file = ref<File | null>(null);
const marks = ref<Mark[]>([]);
const undone = ref<Mark[]>([]);
const activeTool = ref<Tool>('solid');
const zoom = ref(1);
const showBefore = ref(false);
const status = ref('Choose or paste an image, then drag across information to hide.');
const error = ref('');
const outputUrl = ref('');
const outputName = ref('redacted-photo.png');
const verified = ref<ReturnType<typeof buildSafeReport> | null>(null);
let sourceImage: HTMLImageElement | null = null;
let sourceUrl = '';
let drawingStart: { x: number; y: number } | null = null;
let previewMark: Mark | null = null;

const canUndo = computed(() => marks.value.length > 0);
const canRedo = computed(() => undone.value.length > 0);

const clearOutput = () => {
  if (outputUrl.value) URL.revokeObjectURL(outputUrl.value);
  outputUrl.value = '';
  verified.value = null;
};

const applyMark = (context: CanvasRenderingContext2D, mark: Mark) => {
  const x = Math.min(mark.x, mark.x + mark.width);
  const y = Math.min(mark.y, mark.y + mark.height);
  const width = Math.abs(mark.width);
  const height = Math.abs(mark.height);
  if (!sourceImage || width < 1 || height < 1) return;
  if (mark.tool === 'solid') {
    context.save();
    context.fillStyle = '#101c27';
    context.fillRect(x, y, width, height);
    context.restore();
  } else if (mark.tool === 'blur') {
    context.save();
    context.filter = `blur(${Math.max(8, Math.round(Math.min(width, height) / 10))}px)`;
    context.drawImage(canvas.value!, x, y, width, height, x, y, width, height);
    context.restore();
  } else if (mark.tool === 'pixelate') {
    const block = Math.max(6, Math.round(Math.min(width, height) / 12));
    const temp = document.createElement('canvas');
    temp.width = Math.max(1, Math.ceil(width / block));
    temp.height = Math.max(1, Math.ceil(height / block));
    const tctx = temp.getContext('2d');
    if (!tctx) return;
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(canvas.value!, x, y, width, height, 0, 0, temp.width, temp.height);
    context.save();
    context.imageSmoothingEnabled = false;
    context.drawImage(temp, 0, 0, temp.width, temp.height, x, y, width, height);
    context.restore();
  }
};

const render = () => {
  if (!canvas.value || !sourceImage) return;
  const context = canvas.value.getContext('2d');
  if (!context) return;
  canvas.value.width = sourceImage.naturalWidth;
  canvas.value.height = sourceImage.naturalHeight;
  context.drawImage(sourceImage, 0, 0);
  if (!showBefore.value) {
    for (const mark of marks.value) applyMark(context, mark);
    if (previewMark) {
      if (previewMark.tool === 'crop') {
        context.save();
        context.strokeStyle = '#2cd5a4';
        context.lineWidth = Math.max(2, canvas.value.width / 500);
        context.setLineDash([12, 8]);
        context.strokeRect(previewMark.x, previewMark.y, previewMark.width, previewMark.height);
        context.restore();
      } else applyMark(context, previewMark);
    }
    const crop = [...marks.value].reverse().find((mark) => mark.tool === 'crop');
    if (crop) {
      context.save();
      context.fillStyle = 'rgba(9, 20, 29, 0.55)';
      context.beginPath();
      context.rect(0, 0, canvas.value.width, canvas.value.height);
      context.rect(Math.min(crop.x, crop.x + crop.width), Math.min(crop.y, crop.y + crop.height), Math.abs(crop.width), Math.abs(crop.height));
      context.fill('evenodd');
      context.restore();
    }
  }
};

const acceptFile = async (selected: File) => {
  error.value = '';
  clearOutput();
  try { assertFileSize(selected.size); }
  catch (caught) { error.value = caught instanceof Error ? caught.message : `This file exceeds the ${MAX_FILE_MEGABYTES} MB limit.`; return; }
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  sourceUrl = URL.createObjectURL(selected);
  const image = new Image();
  image.decoding = 'async';
  try {
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('The browser could not decode this image.')); image.src = sourceUrl; });
    file.value = selected;
    sourceImage = image;
    marks.value = [];
    undone.value = [];
    status.value = 'Image opened locally. Drag on the image to apply the selected tool.';
    await nextTick();
    render();
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The image could not be opened.';
  }
};

const position = (event: PointerEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * (canvas.value!.width / rect.width), y: (event.clientY - rect.top) * (canvas.value!.height / rect.height) };
};

const pointerDown = (event: PointerEvent) => {
  if (!sourceImage || showBefore.value) return;
  canvas.value?.setPointerCapture(event.pointerId);
  drawingStart = position(event);
};

const pointerMove = (event: PointerEvent) => {
  if (!drawingStart) return;
  const current = position(event);
  previewMark = { tool: activeTool.value, x: drawingStart.x, y: drawingStart.y, width: current.x - drawingStart.x, height: current.y - drawingStart.y };
  render();
};

const pointerUp = (event: PointerEvent) => {
  if (!drawingStart) return;
  const current = position(event);
  const mark = { tool: activeTool.value, x: drawingStart.x, y: drawingStart.y, width: current.x - drawingStart.x, height: current.y - drawingStart.y };
  drawingStart = null;
  previewMark = null;
  if (Math.abs(mark.width) > 4 && Math.abs(mark.height) > 4) {
    if (mark.tool === 'crop') marks.value = marks.value.filter((item) => item.tool !== 'crop');
    marks.value.push(mark);
    undone.value = [];
    clearOutput();
    status.value = mark.tool === 'solid' ? 'Solid mask added.' : mark.tool === 'crop' ? 'Crop area set.' : `${mark.tool} effect added. Use solid for secrets.`;
  }
  render();
};

const undo = () => { const mark = marks.value.pop(); if (mark) undone.value.push(mark); clearOutput(); render(); };
const redo = () => { const mark = undone.value.pop(); if (mark) marks.value.push(mark); clearOutput(); render(); };
const reset = () => { marks.value = []; undone.value = []; clearOutput(); render(); status.value = 'All redaction edits removed.'; };

const exportImage = async () => {
  if (!sourceImage) return;
  error.value = '';
  clearOutput();
  try {
    const crop = [...marks.value].reverse().find((mark) => mark.tool === 'crop');
    const sourceX = crop ? Math.max(0, Math.min(crop.x, crop.x + crop.width)) : 0;
    const sourceY = crop ? Math.max(0, Math.min(crop.y, crop.y + crop.height)) : 0;
    const width = crop ? Math.min(sourceImage.naturalWidth - sourceX, Math.abs(crop.width)) : sourceImage.naturalWidth;
    const height = crop ? Math.min(sourceImage.naturalHeight - sourceY, Math.abs(crop.height)) : sourceImage.naturalHeight;
    const full = document.createElement('canvas');
    full.width = sourceImage.naturalWidth;
    full.height = sourceImage.naturalHeight;
    const fullContext = full.getContext('2d', { alpha: false });
    if (!fullContext) throw new Error('Canvas rendering is unavailable.');
    fullContext.fillStyle = '#ffffff';
    fullContext.fillRect(0, 0, full.width, full.height);
    fullContext.drawImage(sourceImage, 0, 0);
    const visibleCanvas = canvas.value;
    canvas.value = full;
    for (const mark of marks.value.filter((item) => item.tool !== 'crop')) applyMark(fullContext, mark);
    canvas.value = visibleCanvas;
    const output = document.createElement('canvas');
    output.width = Math.max(1, Math.round(width));
    output.height = Math.max(1, Math.round(height));
    output.getContext('2d')?.drawImage(full, sourceX, sourceY, width, height, 0, 0, output.width, output.height);
    const blob = await new Promise<Blob>((resolve, reject) => output.toBlob((value) => value ? resolve(value) : reject(new Error('The browser could not encode the redacted copy.')), 'image/png'));
    const name = `${file.value?.name.replace(/\.[^.]+$/, '') || 'photo'}-redacted.png`;
    const outputScan = scanBytes(await blob.arrayBuffer(), name);
    if (privateFindings(outputScan).length) throw new Error('Output verification found private metadata.');
    verified.value = buildSafeReport(outputScan);
    outputName.value = name;
    outputUrl.value = URL.createObjectURL(blob);
    status.value = 'Redactions flattened into a new PNG and the output was rescanned.';
    render();
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The redacted copy could not be exported.';
  }
};

const onPaste = (event: ClipboardEvent) => {
  const item = Array.from(event.clipboardData?.items || []).find((entry) => entry.type.startsWith('image/'));
  const pasted = item?.getAsFile();
  if (pasted) { event.preventDefault(); void acceptFile(new File([pasted], 'pasted-screenshot.png', { type: pasted.type })); }
};

onMounted(() => window.addEventListener('paste', onPaste));
onBeforeUnmount(() => {
  window.removeEventListener('paste', onPaste);
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  clearOutput();
});
</script>

<template>
  <div class="redactor-panel">
    <div v-if="!file" class="redactor-empty">
      <label class="drop-zone compact">
        <input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" @change="acceptFile(($event.target as HTMLInputElement).files?.[0]!)" />
        <span class="drop-zone__icon" aria-hidden="true">+</span>
        <strong>Choose or paste an image</strong>
        <small>Nothing is uploaded · {{ MAX_FILE_MEGABYTES }} MB maximum</small>
      </label>
      <div><h3>Use solid masks for secrets</h3><p>Blur and pixelation are visual effects. A solid flattened mask is the safer choice for text, codes, addresses, and account details.</p></div>
    </div>
    <template v-else>
      <div class="redactor-toolbar" aria-label="Redaction tools">
        <label class="small-file-button">Change image<input type="file" accept="image/jpeg,image/png,image/webp" @change="acceptFile(($event.target as HTMLInputElement).files?.[0]!)" /></label>
        <div class="tool-buttons">
          <button v-for="tool in (['solid','blur','pixelate','crop'] as Tool[])" :key="tool" type="button" :class="{ active: activeTool === tool }" :aria-pressed="activeTool === tool" @click="activeTool = tool">{{ tool }}</button>
        </div>
        <button type="button" :disabled="!canUndo" @click="undo">Undo</button>
        <button type="button" :disabled="!canRedo" @click="redo">Redo</button>
        <button type="button" @click="reset">Reset</button>
        <button type="button" :aria-pressed="showBefore" @click="showBefore = !showBefore; render()">{{ showBefore ? 'Show edits' : 'Hold before' }}</button>
        <label class="zoom-control">Zoom <input v-model.number="zoom" type="range" min="0.5" max="2" step="0.1" /></label>
      </div>
      <p v-if="activeTool === 'blur' || activeTool === 'pixelate'" class="redaction-warning">{{ activeTool }} is visual obscuring, not guaranteed secure redaction.</p>
      <div class="canvas-stage">
        <canvas ref="canvas" :style="{ width: `${zoom * 100}%` }" aria-label="Image redaction canvas" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="pointerUp"></canvas>
      </div>
      <div class="redactor-footer">
        <div><strong>{{ marks.length }} edit{{ marks.length === 1 ? '' : 's' }}</strong><span>Export creates a fresh PNG with no inherited preview.</span></div>
        <button type="button" class="primary-button" :disabled="!marks.length" @click="exportImage">Flatten and verify</button>
        <a v-if="outputUrl" class="primary-button" :href="outputUrl" :download="outputName">Download redacted PNG</a>
      </div>
      <div v-if="verified" class="mini-verification"><strong>Verification passed</strong><span>No supported private metadata or embedded preview was found in the exported PNG.</span></div>
    </template>
    <p v-if="error" class="error-message" role="alert">{{ error }}</p>
    <p class="status-line" role="status">{{ status }}</p>
  </div>
</template>
