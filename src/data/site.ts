export const SITE_NAME = 'Photo Privacy Lab';
export const SITE_URL = 'https://exif.utilitas.app';
export const SOURCE_URL = 'https://github.com/kirillman200/photo-privacy-lab';
export const SITE_DESCRIPTION =
  'Inspect hidden photo metadata, remove private fields, redact visible information, and verify the clean copy in your browser.';

export type ToolMode = 'scan' | 'clean' | 'gps' | 'batch' | 'redact' | 'verify';

export interface ToolPage {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  mode: ToolMode;
  intro: string;
  outcomes: string[];
  steps: Array<{ title: string; body: string }>;
  faq: Array<{ q: string; a: string }>;
}

export const tools: ToolPage[] = [
  {
    slug: 'photo-privacy-check',
    title: 'Photo Privacy Check',
    shortTitle: 'Privacy check',
    description: 'Scan JPEG, PNG, and WebP photos for GPS, timestamps, device details, comments, XMP, IPTC, and hidden previews without uploading them.',
    eyebrow: 'Inspect before sharing',
    mode: 'scan',
    intro: 'See what a photo can reveal before deciding what to remove. Findings are grouped by practical risk instead of presented as an unexplained tag dump.',
    outcomes: ['GPS and location indicators', 'Personal and device fields', 'Embedded previews and metadata blocks', 'Low-risk image details worth preserving'],
    steps: [
      { title: 'Open locally', body: 'Choose or paste a supported image. The browser reads the file only after you select it.' },
      { title: 'Review the risks', body: 'Critical, personal, contextual, and technical findings are explained separately.' },
      { title: 'Choose the next action', body: 'Remove private metadata, flatten the image, redact visible details, or download a verification report.' },
    ],
    faq: [
      { q: 'Does scanning send my photo anywhere?', a: 'No. Selected image bytes and extracted metadata stay in this browser tab.' },
      { q: 'Is every metadata field dangerous?', a: 'No. Dimensions and color information are usually technical, while GPS and owner fields deserve more attention.' },
    ],
  },
  {
    slug: 'remove-photo-metadata',
    title: 'Remove Photo Metadata',
    shortTitle: 'Metadata remover',
    description: 'Remove common private EXIF, XMP, IPTC, comment, timestamp, and preview data locally, then rescan the exported copy.',
    eyebrow: 'Clean hidden information',
    mode: 'clean',
    intro: 'Use Privacy Clean when you want to preserve JPEG compressed image data. Use Full Flatten when you want a freshly rendered file with normalized orientation.',
    outcomes: ['Lossless JPEG segment cleaning', 'Fresh flattened PNG, JPEG, or WebP export', 'Safe orientation handling', 'Automatic clean-copy verification'],
    steps: [
      { title: 'Scan first', body: 'The original file is inspected so you can see what will change.' },
      { title: 'Select a cleaning mode', body: 'Privacy Clean preserves compressed JPEG image data. Full Flatten redraws the visible image.' },
      { title: 'Verify the output', body: 'The generated copy is rescanned before a download is offered.' },
    ],
    faq: [
      { q: 'Will cleaning lower photo quality?', a: 'Privacy Clean does not recompress JPEG image data. Full Flatten can change compression and file size.' },
      { q: 'Why can orientation be preserved?', a: 'Some photos store sideways pixels and rely on an orientation instruction. A minimal safe orientation tag prevents unexpected rotation.' },
    ],
  },
  {
    slug: 'remove-gps-from-photo',
    title: 'Remove GPS From a Photo',
    shortTitle: 'GPS remover',
    description: 'Find locally stored photo coordinates, understand their precision, and remove them without sending the coordinates to a map provider.',
    eyebrow: 'Protect exact locations',
    mode: 'gps',
    intro: 'Photo coordinates can identify a home, workplace, school, or travel location. The scanner displays them locally and never loads a map automatically.',
    outcomes: ['Latitude and longitude detection', 'Local-only coordinate display', 'Explicit external-map consent', 'Coordinate removal and output verification'],
    steps: [
      { title: 'Check for coordinates', body: 'Read EXIF GPS latitude, longitude, altitude, and direction fields.' },
      { title: 'Assess the context', body: 'Decide whether the location could identify somewhere sensitive.' },
      { title: 'Remove and verify', body: 'Generate a copy and confirm that GPS fields are no longer present.' },
    ],
    faq: [
      { q: 'Will Photo Privacy Lab open a map automatically?', a: 'No. Opening a third-party map requires a separate explicit action and can disclose the coordinates to that provider.' },
      { q: 'Can a photo reveal a location without GPS metadata?', a: 'Yes. Signs, addresses, landmarks, reflections, and other visible clues can still reveal location.' },
    ],
  },
  {
    slug: 'batch-metadata-remover',
    title: 'Batch Photo Metadata Remover',
    shortTitle: 'Batch cleaner',
    description: 'Scan and clean a set of photos in a background browser thread, then download verified files in one ZIP archive.',
    eyebrow: 'Clean a set consistently',
    mode: 'batch',
    intro: 'Apply one documented cleaning policy to multiple JPEG, PNG, and WebP files. Processing is sequential and bounded to reduce memory pressure.',
    outcomes: ['Up to 20 files per batch', '100 MB per file and 250 MB total', 'Background worker processing', 'ZIP export plus per-file status'],
    steps: [
      { title: 'Choose a bounded batch', body: 'Select up to 20 supported images, no larger than 100 MB each, with a combined size no larger than 250 MB.' },
      { title: 'Process off the main thread', body: 'A browser Web Worker scans and cleans one file at a time.' },
      { title: 'Review and download', body: 'Failed files stay clearly identified. Successful verified copies are packaged in a ZIP.' },
    ],
    faq: [
      { q: 'Are batch files uploaded to a server?', a: 'No. The worker is a browser feature running on your device, not a Cloudflare Worker.' },
      { q: 'Why is there a batch limit?', a: 'Browsers and mobile devices have finite memory. The 100 MB per-file and 250 MB combined limits make failures easier to explain and recover from.' },
    ],
  },
  {
    slug: 'screenshot-redactor',
    title: 'Screenshot and Photo Redactor',
    shortTitle: 'Redactor',
    description: 'Cover addresses, usernames, faces, codes, and document details, flatten the result, and verify that old metadata and previews are absent.',
    eyebrow: 'Remove visible information',
    mode: 'redact',
    intro: 'Draw permanent solid masks for secrets. Blur and pixelation are available as visual effects, but they are not labeled as secure redaction.',
    outcomes: ['Solid redaction rectangles', 'Crop, blur, and pixelation modes', 'Undo, redo, zoom, and before view', 'Fresh flattened export with verification'],
    steps: [
      { title: 'Open the image', body: 'Paste a screenshot or choose a local photo.' },
      { title: 'Cover what must not be shared', body: 'Use solid masks for addresses, account numbers, QR codes, faces, and other sensitive details.' },
      { title: 'Flatten and verify', body: 'The visible result is rendered into a new file without the original metadata or hidden thumbnail.' },
    ],
    faq: [
      { q: 'Is blur safe for passwords or account numbers?', a: 'Solid redaction is the safer choice. Blur and pixelation are visual obscuring effects and may leave recoverable clues.' },
      { q: 'Does the export keep the original embedded thumbnail?', a: 'No. Redacted exports are freshly rendered and then rescanned.' },
    ],
  },
  {
    slug: 'verify-clean-photo',
    title: 'Verify a Clean Photo',
    shortTitle: 'Clean-copy verifier',
    description: 'Rescan a cleaned or edited image and create a privacy-safe text or JSON report that does not repeat removed private values.',
    eyebrow: 'Check the copy you will share',
    mode: 'verify',
    intro: 'Verification is a separate step, not a success message based on assumptions. Open the exact file you plan to share and inspect it again.',
    outcomes: ['Independent output rescan', 'Category-level clean report', 'No removed values in reports', 'Text and JSON report downloads'],
    steps: [
      { title: 'Open the final copy', body: 'Select the exact downloaded or edited file you intend to share.' },
      { title: 'Review each category', body: 'Check GPS, time, device, author, comments, XMP, IPTC, and embedded previews.' },
      { title: 'Save the proof', body: 'Download a privacy-safe report containing categories and outcomes rather than sensitive source values.' },
    ],
    faq: [
      { q: 'Does a clean metadata report prove the picture is safe?', a: 'It proves only the checked hidden-data categories. Visible content and contextual clues still require human review.' },
      { q: 'Why does the report omit removed values?', a: 'A verification report should not recreate the private information that was removed from the photo.' },
    ],
  },
];

export interface GuidePage {
  slug: string;
  title: string;
  description: string;
  audience: string;
  readTime: string;
  sections: Array<{ heading: string; paragraphs: string[]; checklist?: string[] }>;
}

export const guides: GuidePage[] = [
  {
    slug: 'what-photo-metadata-can-reveal',
    title: 'What information can photo metadata reveal?',
    description: 'A practical guide to location, time, device, ownership, editing, preview, and technical fields stored alongside image pixels.',
    audience: 'Anyone sharing photos publicly',
    readTime: '7 min',
    sections: [
      { heading: 'A photo is more than its visible pixels', paragraphs: ['Image formats can store structured records used by cameras, editors, newsrooms, and catalog systems. These records may describe when and where an image was captured, which device created it, who owns it, and how software handled it.', 'Metadata is not automatically harmful. Orientation and color profiles can make the picture display correctly. Privacy depends on the field, the sharing context, and what the visible image already reveals.'] },
      { heading: 'The fields that deserve the most attention', paragraphs: ['GPS coordinates are the clearest high-risk example because they can identify a home, workplace, school, or travel location. Owner names, camera serial numbers, document identifiers, user comments, and embedded previews can also disclose information that is not visible in the main image.'], checklist: ['Exact GPS latitude and longitude', 'Camera owner or author names', 'Device serial and document identifiers', 'Comments, descriptions, and keywords', 'Embedded thumbnails or previews'] },
      { heading: 'Context changes the risk', paragraphs: ['A camera model in a landscape photo is usually a technical detail. The same model and timestamp may matter more to a journalist protecting a source or an employee sharing evidence from a restricted site.', 'Use risk labels as a prompt for judgment, not as a substitute for reviewing the purpose and audience of the share.'] },
      { heading: 'A safer sharing routine', paragraphs: ['Scan the original, remove fields that do not need to travel, flatten any visual redactions, then inspect the exported copy. Keep the original private and share only the verified derivative.'], checklist: ['Review hidden metadata', 'Inspect the visible background and reflections', 'Use solid masks for secrets', 'Verify the exact exported file'] },
    ],
  },
  {
    slug: 'how-gps-is-stored-in-photos',
    title: 'How GPS coordinates are stored in photographs',
    description: 'Understand EXIF GPS latitude, longitude, hemisphere references, altitude, direction, and why coordinates can be surprisingly precise.',
    audience: 'Travelers, parents, sellers, and privacy reviewers',
    readTime: '8 min',
    sections: [
      { heading: 'Coordinates live in an EXIF subdirectory', paragraphs: ['JPEG EXIF data commonly uses a TIFF-style directory. A GPS pointer leads to values for latitude, longitude, altitude, direction, and the letter references that identify north, south, east, or west.', 'Latitude and longitude are often stored as degrees, minutes, and seconds using rational numbers. A scanner converts those components to decimal degrees for easier review.'] },
      { heading: 'Precision is a privacy decision', paragraphs: ['Several decimal places can narrow a location to a building or smaller area. Even less precise coordinates can identify a neighborhood or work site when combined with the visible scene and posting history.'] },
      { heading: 'Maps create a separate disclosure', paragraphs: ['Displaying coordinates locally is different from sending them to a map service. A privacy tool should not load a third-party map automatically because the request itself can reveal the coordinates and ordinary browser information.', 'If you choose to open a map, treat that as a separate disclosure to the selected provider.'] },
      { heading: 'Removing GPS does not remove every clue', paragraphs: ['Street signs, house numbers, school logos, shipping labels, reflections, and distinctive landmarks remain in the pixels. Metadata cleaning and visual review solve different parts of the problem.'] },
    ],
  },
  {
    slug: 'check-photo-for-location-data',
    title: 'How to check whether a photo contains location data',
    description: 'A step-by-step workflow for checking the original file, understanding GPS findings, cleaning a copy, and verifying the result.',
    audience: 'People preparing a photo for public sharing',
    readTime: '6 min',
    sections: [
      { heading: 'Check the original file, not a preview', paragraphs: ['Messaging and social platforms may alter metadata, while exported thumbnails may differ from the camera original. Open the exact source you plan to transform so the result describes that file.'] },
      { heading: 'Look beyond a single GPS label', paragraphs: ['Review latitude, longitude, altitude, and direction together. Also check capture time and visible landmarks that can connect a coordinate to a specific event or routine.'], checklist: ['Latitude and longitude', 'Altitude and image direction', 'Capture date and time zone', 'Visible signs and landmarks'] },
      { heading: 'Create a derivative instead of changing your archive', paragraphs: ['Keep the original photo in a private archive. Generate a cleaned sharing copy with a distinct file name so you do not accidentally destroy information you still need.'] },
      { heading: 'Verify the derivative', paragraphs: ['Open the newly generated file and rescan it. Confirmation should come from the output bytes, not merely from the fact that a cleaning button ran.'] },
    ],
  },
  {
    slug: 'exif-vs-xmp-vs-iptc',
    title: 'EXIF versus XMP versus IPTC',
    description: 'Learn what the three major photo metadata families are for, where privacy-sensitive values appear, and why a cleaner must check all of them.',
    audience: 'Photographers, editors, publishers, and developers',
    readTime: '9 min',
    sections: [
      { heading: 'EXIF describes capture and image handling', paragraphs: ['Cameras commonly write EXIF fields for device details, exposure, capture time, orientation, and GPS. JPEG EXIF is usually stored in an APP1 segment containing a TIFF structure.'] },
      { heading: 'XMP is flexible and extensible', paragraphs: ['XMP is XML-based and can carry creator, rights, workflow, location, rating, and editing information. Software may write an XMP packet even when equivalent EXIF fields are absent.'] },
      { heading: 'IPTC supports publishing workflows', paragraphs: ['IPTC fields are widely used for captions, credits, keywords, locations, and editorial management. They are useful in a newsroom or asset library but may be unnecessary in a public sharing copy.'] },
      { heading: 'Cleaning one family is not enough', paragraphs: ['A tool that removes only an EXIF block may leave an XMP location or IPTC caption behind. A trustworthy report names the metadata structures it checked and states format-specific limitations.'], checklist: ['Scan EXIF directories', 'Detect XMP packets', 'Detect IPTC blocks', 'Check comments and embedded previews', 'Rescan the output'] },
    ],
  },
  {
    slug: 'why-cleaned-photos-rotate',
    title: 'Why cleaned photos sometimes appear rotated',
    description: 'How EXIF orientation works, why indiscriminate metadata removal can turn a phone photo sideways, and two safe cleaning strategies.',
    audience: 'Anyone cleaning phone photos',
    readTime: '6 min',
    sections: [
      { heading: 'The stored pixels may be sideways', paragraphs: ['Many cameras store pixels in the sensor orientation and add an EXIF Orientation value that tells viewing software how to rotate or mirror the display. Removing that instruction without changing the pixels can make the copy look wrong.'] },
      { heading: 'Strategy one: preserve a minimal orientation tag', paragraphs: ['A lossless JPEG cleaner can remove private directories and add back a tiny EXIF block containing only the orientation instruction. The compressed image data remains untouched.'] },
      { heading: 'Strategy two: normalize the pixels', paragraphs: ['A flattening workflow decodes the displayed image, draws it in the correct direction, and exports new pixels without an orientation tag. This is appropriate when redactions must become permanent.'] },
      { heading: 'Test all eight orientation values', paragraphs: ['EXIF defines rotations and mirrored variants. Automated fixtures should cover values one through eight, and browser tests should compare the visible result as well as metadata.'] },
    ],
  },
  {
    slug: 'redact-a-screenshot-safely',
    title: 'How to redact a screenshot safely',
    description: 'A practical checklist for removing visible secrets, avoiding reversible overlays, flattening the export, and verifying the final image.',
    audience: 'Support teams, employees, teachers, and creators',
    readTime: '8 min',
    sections: [
      { heading: 'Start with a copy', paragraphs: ['Keep the original private and work on a duplicate. Review the entire frame, including browser tabs, notifications, bookmarks, background windows, QR codes, avatars, and reflections.'] },
      { heading: 'Use solid masks for secrets', paragraphs: ['Opaque rectangles are the safer choice for passwords, recovery codes, account numbers, addresses, document identifiers, and private messages. Ensure the mask covers the full glyphs plus surrounding anti-aliased edges.'] },
      { heading: 'Flatten the result', paragraphs: ['A reversible editor layer is not a safe export. Render the composed result into fresh image pixels so the hidden content is not merely covered by an editable object.'] },
      { heading: 'Review at full size', paragraphs: ['Zoom into the exported copy and check every edge. Then scan the file for hidden metadata and old embedded previews before sharing it.'], checklist: ['Use a copy', 'Cover full edges', 'Flatten into new pixels', 'Rescan the output', 'Share only the derivative'] },
    ],
  },
  {
    slug: 'blur-vs-permanent-redaction',
    title: 'Blur versus permanent redaction',
    description: 'Why blur and pixelation are useful visual effects but solid flattened masks are safer for text, codes, identifiers, and other secrets.',
    audience: 'Anyone hiding visible information',
    readTime: '7 min',
    sections: [
      { heading: 'Blur changes appearance, not meaning', paragraphs: ['A blur mixes nearby pixels. Large text, short numbers, logos, and familiar layouts may remain guessable. The original information also remains available if the blur exists only as an editable layer.'] },
      { heading: 'Pixelation can preserve patterns', paragraphs: ['Pixelation replaces regions with coarse blocks, but block positions and colors can still reveal structure. It may be acceptable for an aesthetic face effect, not for a recovery code or account number.'] },
      { heading: 'Solid means fully opaque', paragraphs: ['A secure visual mask should have full opacity and no blend mode that lets source pixels influence the result. It must be baked into a fresh export rather than stored as a removable overlay.'] },
      { heading: 'Match the tool to the consequence', paragraphs: ['Use solid masks when disclosure could cause account loss, personal danger, harassment, or financial harm. Use blur only when obscuring identity is a preference rather than a guarantee.'] },
    ],
  },
  {
    slug: 'embedded-thumbnail-risk',
    title: 'How embedded thumbnails can expose old image content',
    description: 'Why a JPEG can contain a second preview image, how stale thumbnails survive careless edits, and why redacted exports must be flattened and rescanned.',
    audience: 'People editing or redacting JPEG photos',
    readTime: '7 min',
    sections: [
      { heading: 'One file can hold more than one image', paragraphs: ['A JPEG EXIF block may include a small thumbnail used for quick previews. That thumbnail is separate from the main compressed image stream.'] },
      { heading: 'The preview can become stale', paragraphs: ['Some editing workflows update the main image without replacing the embedded preview. A redacted main image can therefore travel with a tiny older version that still shows the original scene.'] },
      { heading: 'Metadata-only edits need careful rules', paragraphs: ['A lossless metadata cleaner should remove embedded thumbnails. Any workflow that changes visible pixels should generate a completely new flattened image with no inherited EXIF, XMP, or IPTC blocks.'] },
      { heading: 'Verification catches the second copy', paragraphs: ['Rescan the output and require the embedded-thumbnail category to report not found. The report should describe the category without copying any private source values.'] },
    ],
  },
  {
    slug: 'marketplace-photo-safety',
    title: 'How to share marketplace photos safely',
    description: 'Protect home locations, shipping labels, serial numbers, reflections, and routines when photographing items for a public listing.',
    audience: 'Marketplace sellers and small businesses',
    readTime: '8 min',
    sections: [
      { heading: 'The room can reveal more than the item', paragraphs: ['Windows, family photographs, medication, calendars, mail, and reflections can disclose where and how you live. Use a plain backdrop and inspect the edges of every frame.'] },
      { heading: 'Labels and serial numbers need context', paragraphs: ['Shipping labels can expose names and addresses. Device serial numbers and invoices may be usable for social engineering or fraudulent support claims. Cover unnecessary identifiers with a permanent solid mask.'] },
      { heading: 'Remove capture location and time', paragraphs: ['GPS can point to the pickup location. Repeated timestamps may reveal routines. Create a cleaned copy for the listing while retaining the original privately.'] },
      { heading: 'Use a repeatable listing checklist', paragraphs: ['A consistent routine is safer than relying on memory during a busy listing session.'], checklist: ['Use a neutral background', 'Check reflective surfaces', 'Cover labels and identifiers', 'Remove metadata', 'Verify the listing copy'] },
    ],
  },
  {
    slug: 'photo-sharing-checklist-for-parents',
    title: 'Photo-sharing checklist for parents',
    description: 'A calm, practical review of location, school details, routines, names, uniforms, documents, and audience before sharing family photos.',
    audience: 'Parents and caregivers',
    readTime: '7 min',
    sections: [
      { heading: 'Decide on the audience first', paragraphs: ['A private family message, a limited group, and a public social post have different risk. Choose the smallest audience that meets the reason for sharing.'] },
      { heading: 'Check location and routine clues', paragraphs: ['GPS, house numbers, school logos, street signs, sports schedules, and recurring timestamps can reveal where a child spends time. Review visible and hidden information together.'] },
      { heading: 'Look for names and documents', paragraphs: ['Certificates, mail, medical paperwork, device screens, and name tags can be readable at full resolution even when they look small in a feed preview.'] },
      { heading: 'Prepare a sharing copy', paragraphs: ['Crop unnecessary background, apply solid masks where needed, clean metadata, and inspect the exact exported file.'], checklist: ['Choose the audience', 'Remove location clues', 'Cover names and documents', 'Clean metadata', 'Review the final copy at full size'] },
    ],
  },
  {
    slug: 'photo-safety-for-journalists',
    title: 'Photo safety checklist for journalists',
    description: 'A threat-aware workflow for source protection, location review, device identifiers, visual clues, derivatives, and secure handoff.',
    audience: 'Journalists, researchers, and activists',
    readTime: '10 min',
    sections: [
      { heading: 'Begin with the threat model', paragraphs: ['Identify who may seek the location, source identity, device history, or capture time and what other information they can combine with the image. A generic clean label is not enough for high-risk reporting.'] },
      { heading: 'Separate originals from publication copies', paragraphs: ['Preserve evidentiary originals in an appropriate secure system. Create a distinct derivative for publication, and document what was removed without placing the private values in the report.'] },
      { heading: 'Review hidden and visible identifiers', paragraphs: ['GPS, serial numbers, owner fields, timestamps, embedded previews, shadows, weather, landmarks, badges, reflections, and unique objects can all contribute to identification.'] },
      { heading: 'Use layered verification', paragraphs: ['Combine automated metadata checks with a second-person visual review when consequences are high. Follow organizational security and legal procedures rather than treating a browser utility as a complete operational-security system.'], checklist: ['Define the adversary and consequence', 'Protect the original', 'Create a cleaned derivative', 'Perform independent visual review', 'Verify the exact publication file'] },
    ],
  },
  {
    slug: 'browser-local-image-processing',
    title: 'How browser-local image processing works',
    description: 'How File and Blob APIs, ArrayBuffer parsing, canvas rendering, Web Workers, object URLs, and browser-generated downloads can transform images without an upload endpoint.',
    audience: 'Privacy-conscious users and web developers',
    readTime: '9 min',
    sections: [
      { heading: 'Selection grants local file access', paragraphs: ['A browser page cannot freely read your photo library. It receives File objects only for items you explicitly choose, drop, or paste. The application can read those bytes into an ArrayBuffer in the tab.'] },
      { heading: 'Parsing does not require a server', paragraphs: ['JavaScript can inspect JPEG segments, PNG chunks, and WebP RIFF chunks directly. The parsed findings exist in memory and can be cleared when you remove the files or close the tab.'] },
      { heading: 'Cleaning creates a browser-generated Blob', paragraphs: ['A metadata cleaner can assemble new bytes locally. A redactor can draw into a canvas and encode a fresh Blob. An object URL gives the browser a temporary download target without a server-generated file.'] },
      { heading: 'A Web Worker is not a Cloudflare Worker', paragraphs: ['A browser Web Worker is a background thread on your device. Cloudflare Workers run on Cloudflare infrastructure. Photo Privacy Lab uses the former for batch processing and does not send images to the latter.'] },
    ],
  },
];

export interface TrustPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; items?: string[] }>;
}

export const trustPages: TrustPage[] = [
  {
    slug: 'privacy', title: 'Privacy policy', description: 'The exact data boundary for local image processing, site delivery, advertising, and contact.',
    intro: 'Photo Privacy Lab is designed so selected image files and extracted metadata stay in your browser. This policy separates image processing from ordinary website delivery.',
    sections: [
      { heading: 'Image processing', paragraphs: ['Selected images are processed locally in your browser. Image bytes, previews, extracted metadata, redaction geometry, and generated reports are not transmitted to Photo Privacy Lab servers. Images are not stored on our servers, and no account is required.'] },
      { heading: 'Site delivery', paragraphs: ['The host receives ordinary request information needed to deliver public HTML, CSS, JavaScript, fonts, and other site assets. This can include IP address, requested URL, browser information, and security logs. The application has no file-upload endpoint.'] },
      { heading: 'Advertising and analytics', paragraphs: ['The site loads Google AdSense for advertising. Google and its advertising partners may receive ordinary browser, page, cookie, and request information under their own policies. Selected photographs, image bytes, previews, filenames, extracted metadata, redaction geometry, and generated files are never supplied to advertising scripts. Photo Privacy Lab does not load a separate first-party analytics service.'] },
      { heading: 'Local cleanup', paragraphs: ['Use Remove all to revoke temporary preview URLs and release in-memory references. Closing the tab also clears transient application state. Photo files are not placed in browser local storage.'] },
    ],
  },
  {
    slug: 'methodology', title: 'Technical methodology', description: 'How Photo Privacy Lab scans, cleans, flattens, and verifies supported image formats.',
    intro: 'The product reports only what its parsers and output checks can support. This page documents the current technical boundary.',
    sections: [
      { heading: 'Scanning', paragraphs: ['JPEG parsing walks marker segments and TIFF-style EXIF directories with strict offset checks. PNG parsing inventories chunks. WebP parsing inventories RIFF chunks. The scanner classifies findings rather than executing metadata content.'] },
      { heading: 'Privacy Clean', paragraphs: ['JPEG cleaning removes EXIF, XMP, IPTC, comment, and embedded-preview segments while preserving compressed scan data and ICC color profiles. When required, a new minimal EXIF block contains only the original orientation value. PNG and WebP cleaning removes supported privacy-bearing chunks without changing image payload chunks.'] },
      { heading: 'Full Flatten and redaction', paragraphs: ['The browser decodes the displayed image, applies orientation, crop, and visible masks, then encodes a fresh JPEG, PNG, or WebP. The export does not reuse the original metadata blocks or embedded preview.'] },
      { heading: 'Verification', paragraphs: ['Generated bytes are parsed again. Reports include categories and presence outcomes, but omit removed private source values by default. Verification does not analyze faces, signs, reflections, or other visible context.'] },
    ],
  },
  {
    slug: 'supported-formats', title: 'Supported image formats', description: 'Exact JPEG, PNG, and static WebP support, preservation behavior, and intentionally unsupported formats.',
    intro: 'Narrow and testable support is more trustworthy than a vague promise to remove all metadata from every file type.',
    sections: [
      { heading: 'JPEG', paragraphs: ['Deepest support: EXIF and GPS scanning, orientation reading, embedded-thumbnail detection, XMP, IPTC, comments, ICC preservation, lossless metadata-segment cleaning, flattening, and verification.'] },
      { heading: 'PNG', paragraphs: ['Supports IHDR dimensions plus common eXIf, text, time, and XMP-bearing chunk detection and removal. Critical image data and color-profile chunks are preserved. Flattening is available when a fresh render is preferred.'] },
      { heading: 'WebP', paragraphs: ['Supports static RIFF WebP chunk scanning and common EXIF, XMP, and ICC metadata handling. Metadata flags are updated when chunks are removed. Animated WebP is rejected for cleaning.'] },
      { heading: 'Not included in version 1', paragraphs: ['HEIC, HEIF, TIFF, AVIF, GIF, RAW formats, documents, audio, and video are not accepted. Format support may expand only after cross-browser and privacy fixture testing.'] },
    ],
  },
  {
    slug: 'limitations', title: 'Limitations', description: 'What automated metadata cleaning and image redaction can and cannot prove.',
    intro: 'A clean metadata scan is evidence about checked hidden fields, not a guarantee that a photo cannot identify a person, place, device, or event.',
    sections: [
      { heading: 'Visible content remains contextual', paragraphs: ['Faces, landmarks, signs, shadows, reflections, weather, room layouts, uniforms, and posting history can identify people and places even after metadata is removed.'] },
      { heading: 'Unknown and malformed structures', paragraphs: ['The parser fails closed on unsupported file signatures and unsafe offsets. A specialized forensic tool may recognize proprietary fields that this browser tool does not interpret.'] },
      { heading: 'Color and compression', paragraphs: ['Privacy Clean preserves JPEG compressed image data and ICC profiles. Full Flatten can change color handling, compression, dimensions, animation, and file size. Compare the final visual result before sharing.'] },
      { heading: 'High-risk use', paragraphs: ['Journalism, activism, legal evidence, medical material, and personal-safety situations require an appropriate threat model, organizational procedure, and often independent review.'] },
    ],
  },
  {
    slug: 'about', title: 'About Photo Privacy Lab', description: 'Why this project combines scanning, explanation, cleaning, redaction, and output verification.',
    intro: 'Photo Privacy Lab is a browser-first sharing safety workflow, built around exact privacy claims and inspectable results.',
    sections: [
      { heading: 'The product idea', paragraphs: ['A basic metadata remover answers only whether a button ran. A safer workflow explains what was found, lets the user choose an appropriate transformation, and checks the generated bytes again.'] },
      { heading: 'Design principles', paragraphs: ['Files stay local. Risk labels remain contextual. Format support is specific. Solid redaction is distinguished from visual blur. Reports do not repeat removed secrets. Ads stay away from primary controls.'] },
      { heading: 'Product status', paragraphs: ['Version 1 focuses on JPEG, PNG, and static WebP. There is no account system, upload endpoint, database, remote API, OAuth provider, MCP server, or autonomous agent.'] },
    ],
  },
  {
    slug: 'contact', title: 'Contact', description: 'How to send product feedback or report a privacy or security problem without attaching sensitive images.',
    intro: 'Do not send private photographs, extracted metadata, GPS coordinates, or other secrets in an initial report.',
    sections: [
      { heading: 'Product feedback', paragraphs: ['Open an issue in the public source repository. Describe the browser, image format, approximate size, and steps without attaching a sensitive source image or private metadata.'] },
      { heading: 'Security reports', paragraphs: ['For a suspected vulnerability, use the repository private vulnerability reporting form. Provide a minimal synthetic reproduction where possible and do not place exploit details or private images in a public issue.'] },
    ],
  },
  {
    slug: 'terms', title: 'Terms of use', description: 'Plain-language terms for using a local photo privacy utility and understanding its limitations.',
    intro: 'Use the tool only with files you are authorized to process, and review the final result before relying on it.',
    sections: [
      { heading: 'Permitted use', paragraphs: ['You may use the public browser tools to inspect and transform images you own or are authorized to process. You remain responsible for lawful handling, consent, copyright, and sharing decisions.'] },
      { heading: 'No guarantee of anonymity', paragraphs: ['The software checks documented metadata structures and applies selected pixel transformations. It cannot guarantee anonymity, remove knowledge held by another party, or identify every contextual clue.'] },
      { heading: 'Availability and changes', paragraphs: ['The site may change supported formats, limits, or features. Important changes should be reflected in the methodology, supported-formats page, and release notes.'] },
    ],
  },
  {
    slug: 'security', title: 'Security policy', description: 'The threat model, public deployment boundary, input controls, disclosure process, and security expectations for Photo Privacy Lab.',
    intro: 'The highest-value assets are selected image bytes, extracted private metadata, generated derivatives, and the integrity of the browser-delivered application.',
    sections: [
      { heading: 'Current security boundary', paragraphs: ['Only static build output is deployed. There is no image upload route, server image processor, database, account session, or secret in browser code. Imported file bytes are treated as untrusted and parsed with format signatures, length checks, and bounded offsets.'] },
      { heading: 'Browser controls', paragraphs: ['The deployed site uses a restrictive content security policy, framing protection, MIME sniffing protection, a limited permissions policy, and no third-party script origins in version 1.'] },
      { heading: 'Reporting a vulnerability', paragraphs: ['Do not include a real private photograph in a report. Use a synthetic fixture, describe the impact, and send sensitive details through the source repository private vulnerability reporting form rather than a public issue.'] },
    ],
  },
];

export const indexablePaths = [
  '/',
  ...tools.map((tool) => `/${tool.slug}/`),
  '/guides/',
  ...guides.map((guide) => `/guides/${guide.slug}/`),
  ...trustPages.map((page) => `/${page.slug}/`),
];

export const navigation = [
  { label: 'Privacy check', href: '/photo-privacy-check/' },
  { label: 'Clean metadata', href: '/remove-photo-metadata/' },
  { label: 'Redact', href: '/screenshot-redactor/' },
  { label: 'Guides', href: '/guides/' },
];
