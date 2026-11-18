export const SITE_NAME = 'Photo Privacy Lab';
export const SITE_URL = 'https://exif.utilitas.app';
export const CONTACT_EMAIL = 'contact@exif.utilitas.app';
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
    slug: 'photo-metadata-viewer',
    title: 'Photo Metadata Viewer',
    shortTitle: 'Metadata viewer',
    description: 'View photo information including format, dimensions, GPS, dates, device details, comments, XMP, IPTC, and embedded previews without uploading the image.',
    eyebrow: 'See the information in a picture',
    mode: 'scan',
    intro: 'Open the exact JPEG, PNG, or static WebP file you want to inspect. The viewer separates ordinary picture details from hidden information that may deserve attention before sharing.',
    outcomes: ['Image format, file size, and dimensions', 'EXIF GPS and capture details', 'Owner, device, comments, XMP, and IPTC fields', 'Embedded previews and PNG Content Credentials containers'],
    steps: [
      { title: 'Choose the original picture', body: 'Use the actual file rather than a social-media preview or thumbnail, because different copies can contain different metadata.' },
      { title: 'Read the grouped results', body: 'The viewer sorts findings into critical, personal, contextual, and technical information instead of showing an unexplained tag list.' },
      { title: 'Act on the exact copy', body: 'If something should not travel with the image, create a cleaned copy and scan that exported file again.' },
    ],
    faq: [
      { q: 'What information can I get from a picture?', a: 'Supported files can report format, dimensions, GPS, capture time, device and owner fields, comments, XMP, IPTC, orientation, color profile, and embedded-preview indicators. The exact result depends on what the file contains.' },
      { q: 'Can picture information identify a location?', a: 'Yes. EXIF GPS can contain coordinates, while visible signs, addresses, landmarks, and reflections can reveal a place even when GPS is absent.' },
      { q: 'Does no metadata mean the picture is anonymous?', a: 'No. A clean scan covers supported hidden structures only. The visible pixels and the context in which the picture is posted can still identify people, places, devices, or events.' },
    ],
  },
  {
    slug: 'remove-photo-metadata',
    title: 'Remove Photo Metadata',
    shortTitle: 'Metadata remover',
    description: 'Remove common private EXIF, XMP, IPTC, comment, timestamp, preview, and supported PNG Content Credentials data locally, then rescan the exported copy.',
    eyebrow: 'Clean hidden information',
    mode: 'clean',
    intro: 'Use Privacy Clean when you want to preserve JPEG compressed image data. Use Full Flatten when you want a freshly rendered file with normalized orientation.',
    outcomes: ['Lossless JPEG segment cleaning', 'PNG Content Credentials container removal', 'Fresh flattened PNG, JPEG, or WebP export', 'Automatic clean-copy verification'],
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
    outcomes: ['Up to 20 files per batch', '10 MB per file and 100 MB total', 'Background worker processing', 'ZIP export plus per-file status'],
    steps: [
      { title: 'Choose a bounded batch', body: 'Select up to 20 supported images, no larger than 10 MB each, with a combined size no larger than 100 MB.' },
      { title: 'Process off the main thread', body: 'A browser Web Worker scans and cleans one file at a time.' },
      { title: 'Review and download', body: 'Failed files stay clearly identified. Successful verified copies are packaged in a ZIP.' },
    ],
    faq: [
      { q: 'Are batch files uploaded to a server?', a: 'No. The worker is a browser feature running on your device, not a Cloudflare Worker.' },
      { q: 'Why is there a batch limit?', a: 'Browsers and mobile devices have finite memory. The 10 MB per-file and 100 MB combined limits make failures easier to explain and recover from.' },
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
  seoTitle?: string;
  includeSiteName?: boolean;
  socialTitle?: string;
  socialDescription?: string;
  image?: { src: string; alt: string; width: number; height: number; caption: string };
  slug: string;
  title: string;
  description: string;
  audience: string;

  datePublished?: string;
  dateModified?: string;
  toolSlug?: string;
  toolLabel?: string;
  sources?: Array<{ href: string; label: string }>;
  intro?: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    checklist?: string[];
    table?: { afterParagraph: number; headers: string[]; rows: string[][] };
  }>;
}

export const guides: GuidePage[] = [
  {
  "slug": "metadata-removal-reverse-image-search",
  "title": "Does removing metadata stop reverse image search?",
  "seoTitle": "Does Removing Metadata Stop Reverse Image Search? No",
  "includeSiteName": false,
  "socialTitle": "Does Removing Metadata Stop Reverse Image Search? No",
  "socialDescription": "A clean metadata scan and a hard-to-trace photograph are different things. Check public copies, visible clues and the exact file before sharing.",
  "description": "Removing photo metadata hides embedded details, not the picture. Learn what reverse image search can still reveal and check your sharing copy locally.",
  "audience": "People preparing a sharing copy",

  "datePublished": "2026-11-18",
  "dateModified": "2026-11-18",
  "toolSlug": "remove-photo-metadata",
  "toolLabel": "Clean a sharing copy locally",
  "intro": "No. Removing metadata does not stop reverse image search: it removes embedded information, not the visible photograph. A cleaned image can still lead to an older public copy or reveal a recognisable scene. Treat metadata cleanup, visible-clue review and your choice of sharing audience as separate decisions.",
  "sections": [
    {
      "heading": "What does reverse image search use instead of metadata?",
      "paragraphs": [
        "An image-search service can compare visual information rather than rely on the camera details stored inside a file. [TinEye explains its image-recognition matching](https://help.tineye.com/article/233-how-does-tineye-work): it creates a fingerprint of the image and compares it with its index, without using the image's filename or metadata.",
        "Services also answer different questions. [Google's image-search help](https://support.google.com/websearch/answer/1325808?hl=en) describes Lens results that can include objects, similar images and websites containing the same or a similar image. A visually similar mountain is different evidence from a page showing your actual photograph.",
        "Imagine you remove the GPS and camera information from a landscape JPEG, then post it under a second account. The mountain, horizon and arrangement of clouds remain available for comparison. Removing the hidden coordinates addresses one disclosure; it leaves the recognisable composition in place."
      ]
    },
    {
      "heading": "Could a cleaned photo connect two accounts?",
      "paragraphs": [
        "Consider a fictional photographer, Alex, who has already posted a lake photograph on a public portfolio carrying their name. Alex now wants to reuse that photograph on an account kept separate from the portfolio.",
        "Walk through the connection: someone gets the new post's image, searches it, and finds the old portfolio page. That page, rather than an EXIF author field in the new file, supplies the name. The result would connect the reused photograph to the portfolio; it would not by itself establish who controls the new account.",
        "For that goal, choose a different photograph that has not already been published in identifying context. Review its visible scene too: a unique building or sign could still disclose a place. If source protection is involved, continue with the broader [photo safety checklist for journalists](/guides/photo-safety-for-journalists/) rather than treating file cleanup as the whole handoff."
      ]
    },
    {
      "heading": "Which part of the sharing risk should you change?",
      "paragraphs": [
        "Before editing, identify what you want to keep private. Use the same lake-photo example to separate four decisions:",
        "If the lake location may be public but its embedded capture timestamp should stay private, metadata cleanup addresses that stored record. If the portfolio connection is the concern, deleting more EXIF fields targets the wrong layer.",
        "For a fuller explanation of hidden fields, use [what photo metadata can reveal](/guides/what-photo-metadata-can-reveal/). Keep that inspection separate from deciding whether the photograph itself belongs in the new post."
      ],
      "table": {
        "afterParagraph": 0,
        "headers": [
          "Risk layer",
          "What could disclose information?",
          "Action for the sharing copy"
        ],
        "rows": [
          [
            "Embedded data",
            "GPS, capture details or an author field inside the file",
            "Inspect the file, remove unnecessary private fields and rescan the export."
          ],
          [
            "Visible clues",
            "A house number, sign, reflection or distinctive scene",
            "Review the full image and remove revealing content, or choose another photograph."
          ],
          [
            "Already-public copies",
            "Alex's named portfolio contains the same lake photograph",
            "Avoid reusing that photograph when separation from the portfolio matters."
          ],
          [
            "Sharing audience",
            "A public post exposes the photograph beyond the intended recipients",
            "Choose a restricted audience or a private sharing route before posting."
          ]
        ]
      }
    },
    {
      "heading": "Will cropping, filters or a screenshot stop matching?",
      "paragraphs": [
        "Treat those edits as presentation changes, not a reliable way to break a connection to an existing image. TinEye's matching explanation above specifically includes cropped, edited, resized and partially matching images. That documented capability is enough to reject cropping as a dependable privacy rule, without predicting every result from every engine.",
        "For example, cropping Alex's sky down to a narrow strip still leaves much of the lake and shoreline. A filter changes their appearance but leaves the basic composition. Taking a screenshot makes a new file while retaining the displayed photograph.",
        "A local byte-level example shows why a changed file is a weak test of visual change. In a synthetic JPEG fixture, Photo Privacy Lab's metadata cleaner reduced the file from 303 bytes to 102 bytes and the scanner's private findings from seven to zero. The compressed scan data remained byte-for-byte identical.",
        "That synthetic fixture checked file structures, not whether a real photograph matched in a search engine. Use the result for its narrow lesson: successful metadata removal and changed file bytes can coexist with preserved image data."
      ]
    },
    {
      "heading": "Should you upload a private photo to check for matches?",
      "paragraphs": [
        "Start with the sharing decision, not an upload. Searching by a local file means supplying it to that third-party service; Google's help above also describes searching by image URL. That is a different data boundary from inspecting a selected file locally in Photo Privacy Lab.",
        "If you want to learn the search interface, use an owned, non-sensitive image you are comfortable supplying. For Alex's already-public portfolio photograph, the public copy is a more appropriate practice subject than an unpublished picture from home. Keep the practice task separate from deciding to share the private image.",
        "An empty result leaves discoverability unresolved. [TinEye explains that an image can be missed because its page has not yet been crawled](https://help.tineye.com/article/237-why-can-t-tineye-find-my-image-i-know-it-is-on-the-web). Do not use a no-match result as clearance to publish a sensitive photograph."
      ]
    },
    {
      "heading": "What if the identifying copy is already online?",
      "paragraphs": [
        "Work on the online copy, not just a replacement on your device. If Alex still controls the portfolio, Alex can remove or replace its photograph. If another site hosts the identifying copy, start with that site's removal or contact route.",
        "[Google's image-removal guidance](https://support.google.com/websearch/answer/4628134?hl=en) separates removal from the source site from updates to search results. After a site removes or changes an image, Google provides a process to request a refresh of outdated image results. Cleaning a new local file does neither of those jobs.",
        "In the lake scenario, removing GPS from the second upload leaves the portfolio's original page untouched. Address that original exposure directly and choose a different image for the separate account rather than depending on a cleaned duplicate."
      ]
    },
    {
      "heading": "How do you prepare the exact copy you plan to share?",
      "paragraphs": [
        "Use this local workflow after choosing a photograph and audience that fit your goal:",
        "1. Open the intended JPEG, PNG or static WebP in the [local photo metadata viewer](/photo-metadata-viewer/). Inspect the selected file rather than relying on another copy's results.\n2. Read the findings, then run the metadata cleaner to create a sharing copy. Review the visible image separately, including its edges and reflections.\n3. Download the export, then [verify the clean photo](/verify-clean-photo/) by opening that exact downloaded file. Check both the metadata findings and the visible result.\n4. Attach the verified export, not the original, and confirm the post's audience before sending.",
        "For Alex, the meaningful improvement is a different, appropriately reviewed photograph plus a verified sharing copy, not a second version of the same named portfolio image. Once you have made that choice, [remove photo metadata locally](/remove-photo-metadata/) to address the embedded-data part of the job.",
        "Sources checked November 2026."
      ]
    }
  ]
},
  {
  "slug": "stop-sharing-google-photos-album",
  "title": "Stop sharing a Google Photos album: links, members and saved copies",
  "seoTitle": "Stop sharing a Google Photos album: links and saved copies",
  "description": "Close access to a Google Photos album, distinguish links from members, and understand why stopping sharing cannot recall saved or downloaded copies.",
  "audience": "Google Photos album owners",

  "datePublished": "2026-11-06",
  "dateModified": "2026-11-06",
  "toolSlug": "verify-clean-photo",
  "toolLabel": "Verify a future sharing copy",
  "sections": [
    {
      "heading": "Stop album access and understand what remains",
      "paragraphs": [
        "To stop sharing an album you own, remove all members and turn off Link sharing. Downloads and copies already made are not deleted. Those are separate problems: closing access to the album is not recalling a picture. See Google's [stop-sharing instructions](https://support.google.com/photos/answer/6280921?hl=en&co=GENIE.Platform%3DDesktop)."
      ]
    },
    {
      "heading": "Choose the result you need",
      "paragraphs": [
        "Use this decision aid before changing settings:",
        "Google's [shared-album controls explanation](https://support.google.com/photos/answer/9789702?hl=en) distinguishes these controls. A link can be forwarded, and removing a member while leaving link access enabled lets someone with the original link still view the album. Do not switch sharing back on if your goal is to stop access."
      ],
      "checklist": [
        "Stop everyone's access: remove all members and leave Link sharing off. Remaining limitation: existing copies survive.",
        "Keep selected members: remove unwanted members and disable link access. Remaining limitation: people with access can add others, so review membership again.",
        "Stop additions only: turn off Collaborate. Remaining limitation: this does not withdraw viewing access.",
        "Replace a circulated link while continuing to share: switch Link sharing off, then on to generate a new URL. Remaining limitation: you are still sharing, not making the album private."
      ]
    },
    {
      "heading": "Pause before removing people",
      "paragraphs": [
        "Only the owner can change link sharing or remove members. Removing someone removes their album photos and comments; making the album private removes comments. Review contributions before acting. These consequences are described in Google's [album privacy guidance](https://support.google.com/photos/answer/9789702?hl=en).",
        "Recommended preparation: confirm that you are in the intended account and album. Decide whether any contributed material needs discussion with its owner before removal. Avoid making irreversible sharing decisions from an unfamiliar account or an album with a similar name."
      ]
    },
    {
      "heading": "Close link access and remove members",
      "paragraphs": [
        "These are documented instructions, not results from a signed-in product test. Google uses different menu wording by platform."
      ]
    },
    {
      "heading": "Android app",
      "paragraphs": [
        "1. Open the album, then More > Sharing.\n2. Turn Link sharing off.\n3. Find each member and use their More > Remove person. Repeat for all members to stop sharing entirely.",
        "Source: [Google Photos Android instructions](https://support.google.com/photos/answer/6280921?hl=en&co=GENIE.Platform%3DAndroid)."
      ]
    },
    {
      "heading": "iPhone or iPad app",
      "paragraphs": [
        "1. Open the album, then More > Sharing settings > Manage access.\n2. Turn Link sharing off.\n3. Find each member and use their More > Remove person. Repeat for all members to stop sharing entirely.",
        "Source: [Google Photos iPhone and iPad instructions](https://support.google.com/photos/answer/6280921?hl=en&co=GENIE.Platform%3DiOS)."
      ]
    },
    {
      "heading": "Computer: member removal",
      "paragraphs": [
        "1. Open the album, then More > Options.\n2. Find a member and choose their More > Remove person. Repeat as needed.",
        "Google's [computer help](https://support.google.com/photos/answer/6280921?hl=en&co=GENIE.Platform%3DDesktop) documents member removal there, but its link-toggle instructions are labelled for the mobile app. Use the appropriate mobile steps above to complete that part rather than assuming the menus are identical."
      ]
    },
    {
      "heading": "Check the change without promising recall",
      "paragraphs": [
        "Recommended check: reopen the album's access settings. Confirm Link sharing is off and the membership list matches your intended result. For a complete stop, check both conditions, not just one.",
        "If you retained the old URL, optionally try it in a signed-out browser session. Treat this only as a limited check of that link in that session. It is not an audit of every account, another sharing route or a recipient's device. Do not send the link to someone new merely to test it."
      ]
    },
    {
      "heading": "Saved copies and later edits are different",
      "paragraphs": [
        "Google explains that [saving shared photos creates a library copy](https://support.google.com/photos/answer/6131416?hl=en&co=GENIE.Platform%3DDesktop). Later edits to the original do not update that saved copy. Google also warns that an old version may temporarily remain visible through an existing shared link after an edit. Editing an already shared original is therefore not a reliable way to recall or immediately redact what recipients see.",
        "Removing a photo from an album does not delete it from your own Google Photos library, either. Album membership, library storage and another person's saved file are different controls. Keep that distinction in mind when deciding what to do next.",
        "Recommended follow-up: if another person has a sensitive copy, discuss deletion directly where appropriate. Do not describe that request as remotely enforced deletion or a verified recall."
      ]
    },
    {
      "heading": "Prepare a future sharing copy only if needed",
      "paragraphs": [
        "Closing the album does not require a local metadata cleaner. If you later choose to share a new file, treat that as a separate task:",
        "1. Review the visible picture for faces, addresses, school names, reflections and other clues. For family pictures, use the [parents' photo-sharing checklist](/guides/photo-sharing-checklist-for-parents/).\n2. Inspect a supported JPEG, PNG or static WebP copy for hidden metadata. Photo Privacy Lab accepts up to 10 MB per file; it does not accept HEIC, video or documents.\n3. If you clean or manually redact a copy, [verify the exact exported file](/verify-clean-photo/) before sharing it.",
        "Selected image files and extracted metadata stay in your browser. This utility cannot inspect or change Google account permissions, disable an album or delete remote copies. A metadata check also cannot certify that a picture is safe to share. Read the [tool's limitations](/limitations/) and choose the audience separately."
      ]
    }
  ],
  "sources": [
    {
      "href": "https://support.google.com/photos/answer/6280921?hl=en&co=GENIE.Platform%3DDesktop",
      "label": "Google Photos Help: stop sharing and manage settings on computer"
    },
    {
      "href": "https://support.google.com/photos/answer/6280921?hl=en&co=GENIE.Platform%3DAndroid",
      "label": "Google Photos Help: Android sharing settings"
    },
    {
      "href": "https://support.google.com/photos/answer/6280921?hl=en&co=GENIE.Platform%3DiOS",
      "label": "Google Photos Help: iPhone and iPad sharing settings"
    },
    {
      "href": "https://support.google.com/photos/answer/9789702?hl=en",
      "label": "Google Photos Help: shared album privacy controls"
    },
    {
      "href": "https://support.google.com/photos/answer/6131416?hl=en&co=GENIE.Platform%3DDesktop",
      "label": "Google Photos Help: share photos and videos"
    }
  ]
},
  {
  "slug": "heic-to-jpeg-before-privacy-check",
  "title": "HEIC to JPEG before a privacy check: export, inspect and verify",
  "seoTitle": "HEIC to JPEG: export, inspect and verify",
  "socialTitle": "HEIC to JPEG before a privacy check",
  "socialDescription": "Keep your original separate. Export a supported still image, review what changed, and verify the final sharing copy.",
  "description": "Export a HEIC photo as JPEG on Mac, keep the original private, inspect the result, then clean and verify the exact copy you plan to share.",
  "audience": "Mac users preparing a sharing copy",

  "datePublished": "2026-10-22",
  "dateModified": "2026-10-22",
  "toolSlug": "verify-clean-photo",
  "toolLabel": "Verify your final sharing copy",
  "image": {
    "src": "/images/articles/heic-to-jpeg-before-privacy-check.png",
    "alt": "A private HEIC original stays separate while a JPEG copy moves through visual inspection, cleaning and verification.",
    "width": 1774,
    "height": 887,
    "caption": "Conceptual export and verification workflow. Original AI-generated illustration created with Codex image_gen for this guide on October 20, 2026; not an operating-system screenshot."
  },
  "sections": [
    {
      "heading": "Start with a supported sharing copy",
      "paragraphs": [
        "If your photo is HEIC, export a separate JPEG before using Photo Privacy Lab. The tool accepts JPEG, PNG and static WebP, up to 10 MB per file, but not HEIC or video. Check the [supported image formats](/supported-formats/) before starting.",
        "Treat conversion as a compatibility step, not a privacy result. Preserve the private original, inspect the exported picture, clean the supported copy and verify the exact file you intend to send. A different filename or format is not evidence that hidden information has been removed."
      ]
    },
    {
      "heading": "Keep the original out of the sharing workflow",
      "paragraphs": [
        "Before exporting, decide where the private original belongs and where the sharing copy will go. Use separate folders or another clear separation that you can recognise when attaching a file. Avoid names that disclose something you were trying to hide.",
        "For example, keep the HEIC in your private photo library and export the working JPEG into a folder used only for the current handoff. Do not attach that whole folder by habit. The point is to make choosing the wrong file harder, not to treat a folder name as a security control.",
        "Work on the copy rather than replacing your only original. This gives you a reference for checking the result and a way to start again if the exported image is unsuitable."
      ]
    },
    {
      "heading": "Export a JPEG with Preview",
      "paragraphs": [
        "Apple's [Preview conversion instructions](https://support.apple.com/guide/preview/convert-image-file-types-prvw1012/mac) describe this route:",
        "1. Open the HEIC file in Preview on your Mac.\n2. Choose File > Export.\n3. In Format, select JPEG and adjust quality if needed.\n4. Give the copy a distinct name and destination, then choose Save.",
        "Open the saved file from that destination before continuing. Do not rely on the image that remains open in the original window. If a label differs on your Mac, use the version selector in Apple's guide rather than guessing from an old screenshot."
      ]
    },
    {
      "heading": "Or export from Photos in a selected format",
      "paragraphs": [
        "For a picture in Photos, Apple's [Photos export guide](https://support.apple.com/guide/photos/export-photos-videos-and-slideshows-pht6e157c5f/mac) documents a selected-format export:",
        "1. Select the photo, then choose File > Export > Export [number] Photos.\n2. Set Photo Kind to JPEG. Expand the options if you need to choose quality, colour profile or size.\n3. Choose the naming options you need, click Export, choose a destination and click Export again.",
        "For this workflow, use the selected-format route, not Export Unmodified Original. The latter preserves the original format rather than making the JPEG you need here. Apple also documents exporting a Live Photo as a still image. This guide checks that still derivative only, not its motion or audio."
      ]
    },
    {
      "heading": "Inspect the exported picture before cleaning",
      "paragraphs": [
        "Open the JPEG and compare it with your private reference. Look at the whole image, then zoom in on details that matter to its purpose. Is the picture upright? Is the crop right? Is necessary text readable? Are colours and fine details acceptable for the intended use?",
        "If the result is wrong, return to the original and try a different export setting. Check the new copy's actual file size against the 10 MB limit. Do not assume it fits because the original did. If you reduce dimensions or quality, inspect that result again rather than accepting a smaller file on size alone.",
        "Keep visual inspection separate from metadata inspection. A picture can look right while still needing a hidden-data check, and a clean report does not judge whether the scene itself reveals too much."
      ]
    },
    {
      "heading": "Clean the supported copy, then verify the output",
      "paragraphs": [
        "Export settings are not a substitute for examining the resulting file. Start with the JPEG you actually saved, review the findings and create a cleaned sharing copy when needed. Photo Privacy Lab's [technical methodology](/methodology/) describes the supported metadata checks and cleaning boundary.",
        "After downloading the result, open that exact file in [Verify a Clean Photo](/verify-clean-photo/). Review the reported categories, including location, time, device, author, comments and embedded previews. Do not rescan the private HEIC or an earlier JPEG and treat that as proof about the final download.",
        "Use a simple stopping rule: if the file you plan to attach is not the one you checked, verification is unfinished. A later edit or export should send you back to the final-copy check. Keep intermediate exports out of the attachment selection so they are not mistaken for the checked result."
      ]
    },
    {
      "heading": "Review visible clues and make the handoff deliberate",
      "paragraphs": [
        "Read the site's [limitations](/limitations/) alongside the report. Hidden-data checks do not assess visible clues such as faces, signs or reflections, and they do not certify that a picture is anonymous. Decide whether to crop or redact sensitive content, or whether not sharing is the better choice. Inspect and verify any newly edited output.",
        "When ready, select only the checked derivative for the handoff. Do not include the private original, extra exports or unrelated files just because they are beside it. If someone needs the original instead, that is a different sharing decision and this JPEG check does not cover it."
      ]
    },
    {
      "heading": "Before you share: final checklist",
      "paragraphs": [
        "Ready for the last step? [Verify your final sharing copy](/verify-clean-photo/)."
      ],
      "checklist": [
        "The original remains separate and private.",
        "The selected copy is JPEG, PNG or static WebP and within 10 MB.",
        "The exported picture has been visually inspected.",
        "Supported metadata findings have been reviewed and cleaned as needed.",
        "The final downloaded or edited file has been independently checked.",
        "Visible content and context have been reviewed by a person.",
        "The attachment is the verified derivative, not the original or an intermediate copy."
      ]
    }
  ],
  "sources": [
    {
      "href": "https://support.apple.com/guide/preview/convert-image-file-types-prvw1012/mac",
      "label": "Apple: Convert image file types using Preview on Mac"
    },
    {
      "href": "https://support.apple.com/guide/photos/export-photos-videos-and-slideshows-pht6e157c5f/mac",
      "label": "Apple: Export photos in a selected format on Mac"
    }
  ]
},
  {
  "slug": "qr-code-photo-privacy",
  "title": "QR codes in photos: why partial covering is not enough",
  "description": "Treat visible QR codes as readable data. Cover the whole code, check nearby identifiers and inspect the exported photo before sharing.",
  "audience": "People sharing tickets, labels and screenshots",

  "datePublished": "2026-10-13",
  "dateModified": "2026-10-13",
  "toolSlug": "screenshot-redactor",
  "toolLabel": "Open the manual redactor",
  "sections": [
    {
      "heading": "A code in the picture is separate from metadata",
      "paragraphs": [
        "Removing GPS or EXIF data does not remove a QR code printed inside a photograph. The code is part of the visible pixels. If you do not want recipients to read it, leave it out of the frame or cover the complete code in a flattened sharing copy. Inspect the rest of the ticket, label or screenshot too: the same information may appear as ordinary text.",
        "Photo Privacy Lab checks supported hidden metadata and offers manual solid redaction. It does not detect QR codes automatically or tell you what a code grants access to. A clean metadata report therefore says nothing about whether a visible code contains a private link, booking reference, contact details or some other information. Decide what may be shared before treating the file as ready."
      ]
    },
    {
      "heading": "Do not rely on a small scratch or a blurred corner",
      "paragraphs": [
        "DENSO WAVE, the developer of QR Code, explains that error correction can restore data when a symbol is dirty or damaged. That makes partial obstruction a poor privacy method. A sticker across one corner, a scribble or a small crop is not reliable evidence that the underlying information can no longer be recovered.",
        "Do not translate an advertised error-correction percentage into a safe percentage of image area to cover. This guide does not offer a decoding threshold. The practical approach is to remove the complete unwanted symbol, including its surrounding margin, instead of trying to discover the smallest change that makes one scanner fail. See the DENSO WAVE source below for the technical distinction."
      ]
    },
    {
      "heading": "Review the whole object, including repeated identifiers",
      "paragraphs": [
        "Work from a private original and make a separate sharing copy. Look for a second code, a barcode, a printed reference, a name, a URL and information along the edge of the image. A packing label, for example, can repeat an identifier in both bars and text. Covering one representation while leaving another visible does not accomplish the intended removal.",
        "Ask what the reader actually needs to see. If you are showing a damaged parcel, a close image of the damage may be enough. If you are asking about a ticket layout, a fabricated sample may communicate the question without exposing a real ticket. These are suggested workflows, not claims about the information encoded by any particular retailer or ticket provider."
      ]
    },
    {
      "heading": "Flatten the mask and inspect the exported file",
      "paragraphs": [
        "In the manual redactor, use a fully opaque solid rectangle that extends beyond the unwanted code. Export the flattened image and open the downloaded copy independently. Check the covered area at full size and verify that you selected the derivative, not the original or a preview with an editable overlay.",
        "A failed scan by one phone is only one observation; it is not proof that no reader can recover a partially visible code. The stronger visible check is that the entire unwanted symbol and any duplicate text are absent from the exported pixels. Also check that the mask did not miss a narrow strip at the image boundary.",
        "Run the exported JPEG, PNG or static WebP through the metadata checker separately. Redaction and metadata cleaning solve different parts of the task. Supported-format and size limits still apply, and the tool is not a PDF or mobile-wallet ticket cleaner."
      ]
    },
    {
      "heading": "Keep the usable original out of the sharing package",
      "paragraphs": [
        "If a code is needed for entry, collection or another legitimate use, preserve its original privately. Do not assume the edited image will still work for that purpose. Share the minimum copy needed for the conversation and avoid attaching an archive that also contains the unedited file.",
        "For an already exposed sensitive code, removing a public image cannot establish that nobody copied it. Use the issuer’s official support route to ask whether replacement or another action is appropriate. Research checked October 13, 2026. This method addresses visible disclosure; it does not certify that a ticket, link or account is secure."
      ],
      "checklist": [
        "Remove the entire unwanted symbol and its margin.",
        "Review repeated text and other codes.",
        "Open and inspect the exact flattened export.",
        "Check metadata separately and keep the original private."
      ]
    }
  ],
  "sources": [
    {
      "label": "DENSO WAVE: QR Code error correction",
      "href": "https://www.qrcode.com/en/about/error_correction.html"
    },
    {
      "label": "Photo Privacy Lab: manual screenshot redaction workflow",
      "href": "https://exif.utilitas.app/guides/redact-a-screenshot-safely/"
    },
    {
      "label": "Photo Privacy Lab: supported formats and limits",
      "href": "https://exif.utilitas.app/supported-formats/"
    }
  ],
  "image": {
    "src": "/images/articles/qr-code-photo-privacy.png",
    "caption": "Original AI-generated editorial illustration, October 13, 2026. Illustrative code, not a real ticket.",
    "alt": "Illustrative ticket code before and after complete opaque covering",
    "width": 1730,
    "height": 909
  }
},
  {
  "slug": "icc-colour-profile-photo-privacy",
  "title": "Why a cleaned photo can still have an ICC colour profile",
  "description": "Understand why Photo Privacy Lab preserves colour profiles, what that does and does not prove about privacy, and how to check the exported image.",
  "audience": "Photo sharing",

  "datePublished": "2026-10-06",
  "dateModified": "2026-10-06",
  "toolSlug": "verify-clean-photo",
  "toolLabel": "Verify the exported photo",
  "sections": [
    {
      "heading": "A colour profile is different from a location tag",
      "paragraphs": [
        "An ICC colour profile can remain after privacy cleaning because it helps software interpret the image colours. Its presence alone does not mean that GPS coordinates or camera-owner fields survived. Read the category and the cleaner’s stated behaviour instead of treating every remaining metadata item as the same kind of information.",
        "The International Color Consortium describes profiles as part of colour management between devices and colour spaces. That is a different job from an EXIF field recording where a photograph was taken. Removing a profile can affect appearance in a colour-managed workflow, so deleting every non-pixel byte is not always the result you want."
      ]
    },
    {
      "heading": "What Photo Privacy Lab preserves",
      "paragraphs": [
        "Photo Privacy Lab’s JPEG Privacy Clean removes supported privacy-bearing metadata segments while preserving compressed image data and ICC profiles. When orientation is required, it can also write a minimal orientation field. A report showing preserved technical information is therefore compatible with the documented cleaning operation.",
        "The scanner also recognises colour-profile containers in supported PNG and static WebP files. Recognition means that it found a profile container; it is not a detailed audit of every internal profile tag. The interface does not certify that arbitrary metadata inside a custom profile is harmless. Keep that distinction when assessing an image from an unfamiliar source."
      ]
    },
    {
      "heading": "Compare colour without changing everything at once",
      "paragraphs": [
        "Keep the original privately, make one cleaned copy, and open both in the same viewer on the same display. Compare a few recognisable areas, such as neutral surfaces, skin tones where present and strongly coloured objects. This is a practical visual comparison, not a calibrated colour measurement or a guarantee about another person’s screen.",
        "If the copies look different, record which operation produced the derivative. Privacy Clean and Full Flatten are different paths. Full Flatten creates a fresh rendered export and can change colour handling, compression and file size. Moving between applications at the same time can introduce another variable, making it harder to identify what changed."
      ]
    },
    {
      "heading": "Do not confuse removing a profile with converting colours",
      "paragraphs": [
        "A colour conversion and deleting a profile are different operations. A colour-managed conversion interprets source values in a defined workflow; simply discarding the profile does not establish that those values have been converted to the intended output colour space. Do not relabel an image as sRGB solely because its original profile disappeared.",
        "If accurate colour is essential for a client, catalogue or print deliverable, use the agreed colour-managed production workflow and keep its requirements with the file. Photo Privacy Lab is a privacy inspection and cleaning tool, not a proofing system. A quick side-by-side check cannot certify a print match or replace an agreed output specification."
      ]
    },
    {
      "heading": "Finish with a privacy check of the exact copy",
      "paragraphs": [
        "Rescan the actual exported JPEG, PNG or static WebP. Review GPS, owner, device, timestamp and other supported findings separately from the ICC result. Then inspect the visible image for addresses, reflections, screens and other details that metadata cleaning cannot remove. Give the derivative a suitable filename and choose it deliberately when attaching it.",
        "If your threat model requires auditing every byte of a custom profile, this tool’s presence check is insufficient. Preserve the original, use appropriate specialist review and do not describe a technical-profile finding as a privacy certificate. For ordinary sharing, the useful conclusion is narrower: the supported categories were checked, and the retained technical data matches the operation you chose."
      ],
      "checklist": [
        "Inspect the downloaded derivative rather than the original.",
        "Read preserved technical categories separately from private findings.",
        "Check appearance in a consistent viewer.",
        "Review visible content, filename and intended audience."
      ]
    }
  ],
  "sources": [
    {
      "label": "International Color Consortium: introduction to profile-based colour management",
      "href": "https://preview.color.org/getting-started/"
    },
    {
      "label": "Photo Privacy Lab: cleaning methodology",
      "href": "https://exif.utilitas.app/methodology/"
    },
    {
      "label": "Photo Privacy Lab: limitations",
      "href": "https://exif.utilitas.app/limitations/"
    }
  ]
},
  {
  "slug": "photo-file-dates-after-metadata-removal",
  "title": "Why photo file dates remain after metadata removal",
  "description": "Understand Date taken, Date modified and downloaded-file timestamps, then verify the exact cleaned photo without confusing file properties with embedded metadata.",
  "audience": "People checking a cleaned photo before sharing",

  "datePublished": "2026-09-29",
  "dateModified": "2026-09-29",
  "toolSlug": "verify-clean-photo",
  "toolLabel": "Check the exported photo",
  "sections": [
    {
      "heading": "A file date is not automatically a surviving EXIF date",
      "paragraphs": [
        "A cleaned photo can still show a creation or modification date in a file manager. That alone does not prove that its original capture timestamp survived. File-system properties describe a stored file; embedded fields such as EXIF DateTimeOriginal describe information inside the image. Check which field you are looking at before deciding that a privacy clean failed.",
        "The distinction matters when you download a new copy. You may see today beside the exported file while the original photo was taken years earlier. Conversely, an image can retain an embedded capture time even when its file-system date has changed. Neither of those dates, by itself, answers whether GPS or other private fields remain."
      ]
    },
    {
      "heading": "Identify the three places a date can come from",
      "paragraphs": [
        "First, look for embedded capture and editing fields. ExifTool documents DateTimeOriginal and ModifyDate in its EXIF tag reference. These are fields that metadata tools can inspect within a supported image. A label such as Date taken in a photo application often refers to capture information, but applications can also derive or store their own dates.",
        "Second, distinguish file properties maintained by the operating system from image tags. ExifTool lists FileModifyDate and FileCreateDate separately in its Extra Tags reference. Third, consider the receiving application: an album can have an upload time, an imported date or manually assigned information that is not the same thing as an embedded field in the downloaded picture. Ask where a displayed date comes from instead of assuming one universal photo date."
      ]
    },
    {
      "heading": "Compare an original and a derivative deliberately",
      "paragraphs": [
        "Keep the original in a private folder and make a separate sharing copy. Note the original capture date if your viewer reports one, then clean the derivative and download it. Close the first result or clear the tool selection before opening the exported file. This small separation prevents a common comparison error: inspecting the original again because both files look identical.",
        "Run the exact derivative through Photo Privacy Lab and review supported timestamp findings alongside GPS, owner, device and other metadata categories. Then inspect its ordinary file properties separately. Write down the label and location of any date that still concerns you, for example Date modified in the Downloads folder, rather than recording only that a date remains."
      ],
      "checklist": [
        "Select the exported copy, not the original or an old preview.",
        "Identify whether the date is inside the image or in its storage/application context.",
        "Review all reported private categories, not timestamps alone."
      ]
    },
    {
      "heading": "What a website can learn from a selected file",
      "paragraphs": [
        "MDN documents the browser File.lastModified property as the last modification time of a selected file. It also explains that an unknown modification time can be represented by the current time. A website therefore does not have to find an EXIF date to obtain a file timestamp after you select a file. That capability is separate from whether the website sends it anywhere.",
        "Photo Privacy Lab keeps selected file bytes and extracted metadata in the browser, as its project contract describes. A different destination has its own handling and privacy practices. Metadata removal cannot promise that the recipient will have no record of when a file was uploaded, downloaded or received. Decide whether the sharing context itself is appropriate."
      ]
    },
    {
      "heading": "Preserve useful originals without disclosing them",
      "paragraphs": [
        "If capture dates help you organise a private archive, preserve that archive and share only the derivative. Do not rewrite original dates merely to make two file-manager columns agree. Changing the displayed date can obscure your own records without addressing an embedded location, a visible address or a revealing caption.",
        "For an evidentiary or professional workflow, follow the record-retention requirements that apply to it before altering source material. This guide explains a privacy check, not a method for certifying authenticity or proving when a photograph was taken. A missing timestamp cannot establish that a picture is anonymous or unaltered."
      ]
    },
    {
      "heading": "Finish with the exact attachment",
      "paragraphs": [
        "Open the final image, inspect the visible pixels and rescan it after any additional edit or export. Review its filename and the destination caption too. A neutral export may still show a clock, an appointment letter or another date inside the picture itself. Those details need a visual decision, not an EXIF setting.",
        "The useful completion criterion is specific: the exported JPEG, PNG or static WebP has been checked for supported hidden-data categories, visually reviewed, and chosen intentionally for this audience. Photo Privacy Lab does not erase file-system history, account activity or every possible record outside the image."
      ]
    }
  ],
  "sources": [
    {
      "label": "ExifTool: EXIF capture and editing tags",
      "href": "https://exiftool.org/TagNames/EXIF.html"
    },
    {
      "label": "ExifTool: Extra Tags and file-system timestamps",
      "href": "https://exiftool.org/TagNames/Extra.html"
    },
    {
      "label": "MDN: File.lastModified",
      "href": "https://developer.mozilla.org/en-US/docs/Web/API/File/lastModified"
    }
  ]
},
  {
  "slug": "photo-filename-privacy",
  "title": "Photo filename privacy: rename the copy before sharing",
  "description": "A photo filename can reveal a name, address or project even after metadata cleaning. Check the filename, archive entries and exact exported image before sharing.",
  "audience": "People sharing photos and image attachments",

  "datePublished": "2026-09-08",
  "dateModified": "2026-09-08",
  "toolSlug": "verify-clean-photo",
  "toolLabel": "Verify the final image",
  "sections": [
    {
      "heading": "A clean image can still have a revealing name",
      "paragraphs": [
        "Yes, a filename can disclose information even when GPS and other embedded metadata have been removed. A name such as client-jordan-home-address.jpg gives a recipient context without requiring an EXIF viewer. Review the name of the exported copy as a separate step from scanning its contents. For public listings, use the [marketplace photo safety guide](/guides/marketplace-photo-safety/).",
        "MDN documents that a browser can read the name of a file selected by the user through the File API. That name is separate from the image's embedded metadata. This does not mean every site uploads it, but it explains why a filename belongs in the sharing review rather than being assumed invisible."
      ],
      "checklist": [
        "People, client or employer names",
        "Street addresses, school names or appointment details",
        "Case references, account identifiers or confidential project labels",
        "Dates or sequence numbers that reveal more context than intended"
      ]
    },
    {
      "heading": "Choose a useful neutral filename",
      "paragraphs": [
        "Make a derivative for sharing and give it a neutral name that still helps you select the right attachment. For example, listing-chair-01.jpg explains the content without adding a seller's surname or apartment number. For an image review, diagram-review-02.png may be enough. These are naming examples, not a rule that every date or descriptive word is private.",
        "Keep the correct extension, such as .jpg, .png or .webp. Renaming is not format conversion and does not clean the image bytes. Changing a .jpg ending to .png does not turn a JPEG into a PNG, and changing a personal filename does not remove a GPS record embedded inside it. Use the appropriate image operation for each task."
      ]
    },
    {
      "heading": "Rename the exported copy, then open it again",
      "paragraphs": [
        "First clean metadata or apply the visual redactions the image requires. Download the result, find that exact file and rename it using your device's file manager. Microsoft documents Rename among File Explorer's file actions. Avoid renaming the only original when you need it for private records, evidence or later editing.",
        "Open the renamed image to check that it is the intended derivative. Look for a crop or solid redaction you deliberately applied, inspect the visible background and rescan the exported file in the clean-copy verifier. The filename check, pixel review and metadata rescan answer different questions, so none should stand in for the other two."
      ]
    },
    {
      "heading": "Check batches and ZIP contents too",
      "paragraphs": [
        "A neutral archive name does not make the names of files inside it neutral. Before sharing a batch, inspect both the ZIP's name and its entry names. If any names disclose private context, rename the derivative files and create a new archive using your device's normal archive workflow.",
        "Photo Privacy Lab supports local batch cleaning for its supported image formats, but a batch completion message is not a review of your naming choices. Reopen the final archive and sample the images you intend to send. Confirm that an older original or a duplicate with a revealing name has not been included alongside the cleaned copies."
      ]
    },
    {
      "heading": "Review what the recipient will receive",
      "paragraphs": [
        "Where possible, inspect the pending attachment name in the destination app before sending. Delivery services handle names differently, and a service changing a name today is not a promise about another upload route or a future version. Prepare the copy to be suitable even if its filename is preserved.",
        "Do not treat renaming as anonymity. Faces, landmarks, reflections, account context, captions and the timing of a post can still identify someone. Photo Privacy Lab scans supported hidden-data categories; it does not automatically detect all sensitive visible details. For a high-risk disclosure, seek an appropriate independent review instead of relying on a clean report."
      ],
      "checklist": [
        "Neutral filename with the correct image extension",
        "Exact derivative opened and visually checked",
        "Final image rescanned for supported metadata",
        "Archive entries and attachment selection reviewed",
        "Private original kept out of the sharing folder"
      ]
    }
  ],
  "sources": [
    {
      "label": "MDN: File.name and the filename exposed to a browser",
      "href": "https://developer.mozilla.org/en-US/docs/Web/API/File/name"
    },
    {
      "label": "Microsoft: file management and Rename in File Explorer",
      "href": "https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows"
    }
  ]
},
  {
    slug: 'what-photo-metadata-can-reveal',
    title: 'What information can photo metadata reveal?',
    description: 'A practical guide to location, time, device, ownership, editing, preview, and technical fields stored alongside image pixels.',
    audience: 'Anyone sharing photos publicly',

    sections: [
      { heading: 'A photo is more than its visible pixels', paragraphs: ['Image formats can store structured records used by cameras, editors, newsrooms, and catalog systems. These records may describe when and where an image was captured, which device created it, who owns it, and how software handled it.', 'Metadata is not automatically harmful. Orientation and color profiles can make the picture display correctly. Privacy depends on the field, the sharing context, and what the visible image already reveals. Cleaning those records still leaves the photograph available for visual comparison. See [whether removing metadata stops reverse image search](/guides/metadata-removal-reverse-image-search/) before reusing a public image under a different account.'] },
      { heading: 'The fields that deserve the most attention', paragraphs: ['GPS coordinates are the clearest high-risk example because they can identify a home, workplace, school, or travel location. Owner names, camera serial numbers, document identifiers, user comments, and embedded previews can also disclose information that is not visible in the main image.'], checklist: ['Exact GPS latitude and longitude', 'Camera owner or author names', 'Device serial and document identifiers', 'Comments, descriptions, and keywords', 'Embedded thumbnails or previews'] },
      { heading: 'Context changes the risk', paragraphs: ['A camera model in a landscape photo is usually a technical detail. The same model and timestamp may matter more to a journalist protecting a source or an employee sharing evidence from a restricted site.', 'Use risk labels as a prompt for judgment, not as a substitute for reviewing the purpose and audience of the share. For family photos, follow the [photo-sharing checklist for parents](/guides/photo-sharing-checklist-for-parents/).'] },
      { heading: 'A safer sharing routine', paragraphs: ['Scan the original, remove fields that do not need to travel, flatten any visual redactions, then inspect the exported copy. Keep the original private and share only the verified derivative.'], checklist: ['Review hidden metadata', 'Inspect the visible background and reflections', 'Use solid masks for secrets', 'Verify the exact exported file'] },
    ],
  },
  {
    slug: 'how-gps-is-stored-in-photos',
    title: 'How GPS coordinates are stored in photographs',
    description: 'Understand EXIF GPS latitude, longitude, hemisphere references, altitude, direction, and why coordinates can be surprisingly precise.',
    audience: 'Travelers, parents, sellers, and privacy reviewers',

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

    sections: [
      { heading: 'EXIF describes capture and image handling', paragraphs: ['Cameras commonly write EXIF fields for device details, exposure, capture time, orientation, and GPS. JPEG EXIF is usually stored in an APP1 segment containing a TIFF structure.'] },
      { heading: 'XMP is flexible and extensible', paragraphs: ['XMP is XML-based and can carry creator, rights, workflow, location, rating, and editing information. Software may write an XMP packet even when equivalent EXIF fields are absent.'] },
      { heading: 'IPTC supports publishing workflows', paragraphs: ['IPTC fields are widely used for captions, credits, keywords, locations, and editorial management. They are useful in a newsroom or asset library but may be unnecessary in a public sharing copy. See the [photo safety checklist for journalists](/guides/photo-safety-for-journalists/) for a publication handoff.'] },
      { heading: 'Cleaning one family is not enough', paragraphs: ['A tool that removes only an EXIF block may leave an XMP location or IPTC caption behind. A trustworthy report names the metadata structures it checked and states format-specific limitations.'], checklist: ['Scan EXIF directories', 'Detect XMP packets', 'Detect IPTC blocks', 'Check comments and embedded previews', 'Rescan the output'] },
    ],
  },
  {
    slug: 'why-cleaned-photos-rotate',
    title: 'Why cleaned photos sometimes appear rotated',
    description: 'How EXIF orientation works, why indiscriminate metadata removal can turn a phone photo sideways, and two safe cleaning strategies.',
    audience: 'Anyone cleaning phone photos',

    sections: [
      { heading: 'The stored pixels may be sideways', paragraphs: ['Many cameras store pixels in the sensor orientation and add an EXIF Orientation value that tells viewing software how to rotate or mirror the display. Removing that instruction without changing the pixels can make the copy look wrong.'] },
      { heading: 'Strategy one: preserve a minimal orientation tag', paragraphs: ['A lossless JPEG cleaner can remove private directories and add back a tiny EXIF block containing only the orientation instruction. The compressed image data remains untouched.'] },
      { heading: 'Strategy two: normalize the pixels', paragraphs: ['A flattening workflow decodes the displayed image, draws it in the correct direction, and exports new pixels without an orientation tag. This is appropriate when redactions must become permanent.'] },
      { heading: 'Test all eight orientation values', paragraphs: ['EXIF defines rotations and mirrored variants. Automated fixtures should cover values one through eight, and browser tests should compare the visible result as well as metadata.'] },
    ],
  },
  {
    "slug": "redact-a-screenshot-safely",
    "title": "How to redact a screenshot safely",
    "seoTitle": "Redact a screenshot safely: cover, export and verify",
    "includeSiteName": false,
    "socialTitle": "Redact a screenshot safely: cover, export and verify",
    "socialDescription": "Find every copy of a secret, use opaque masks, and check the exact PNG you will attach.",
    "description": "Redact a screenshot with solid masks, export a fresh image and check the downloaded copy. Follow Windows and Mac steps without sharing the original.",
    "audience": "Support teams, employees, teachers, and creators",

    "datePublished": "2026-07-21",
    "dateModified": "2026-11-18",
    "toolSlug": "verify-clean-photo",
    "toolLabel": "Verify the sharing copy",
    "intro": "To redact a screenshot safely, cover private details with fully opaque solid masks, render the edited picture into a new image and inspect that exported file. Check the entire frame, not just the obvious secret. Share only the reviewed derivative, keeping the original and any editable project out of the attachment.",
    "sections": [
      {
        "heading": "What should you remove before opening an editor?",
        "paragraphs": [
          "Decide what the recipient actually needs. A support team investigating an error usually needs the error message and relevant controls, not an entire desktop. Capture only the necessary area when possible, then review tabs, notifications, account menus, file paths, sidebars and background windows.",
          "In a fictional support request, Priya captures a billing error. Her email appears in the account menu and again in a browser tab. A recovery-code panel is open behind the error. Priya closes the unrelated panel and takes a smaller capture, reducing the amount that needs redaction.",
          "Next, scan for repeated information. A name removed from the main message may remain in the chat heading. Include QR codes, barcodes and avatars in that pass rather than searching only for text that looks like a password.",
          "If a real credential has already reached someone who should not have it, use the account provider's recovery process and replace that credential. Editing a new attachment addresses the new image, not copies already received."
        ]
      },
      {
        "heading": "Why use solid masks instead of a highlighter or blur?",
        "paragraphs": [
          "Choose a filled, opaque rectangle that extends beyond every letter and its edge pixels. A translucent highlighter deliberately lets the background contribute to the result. A rectangle with only a border leaves its centre readable.",
          "Blur and pixelation alter the appearance of source information rather than replacing the whole region with a uniform fill. Use the [blur-versus-redaction comparison](/guides/blur-vs-permanent-redaction/) when choosing a method; there is no universal blur-strength setting that makes every secret safe.",
          "For Priya's account email, cover the full address in both places, including the domain. For the recovery panel, remove the whole panel rather than leaving a fragment of each code visible. Then preserve the non-sensitive error message so the support team can still act."
        ]
      },
      {
        "heading": "What can Windows Snipping Tool redact?",
        "paragraphs": [
          "[Microsoft documents Text actions and Quick redact](https://support.microsoft.com/en-us/windows/apps/use-snipping-tool-to-capture-screenshots) for captured snips. Quick redact targets recognised email addresses and phone numbers; use a separate visual pass for other details.",
          "1. Open your capture in Snipping Tool and select Text actions if available.\n2. Use Quick redact for detected email addresses and phone numbers.\n3. Review the result for missed instances and information outside those categories.\n4. Use Save as to save a separate copy rather than sharing immediately.\n5. Cover any remaining secrets with the manual solid-mask workflow below, then inspect the exported image before attaching it.",
          "In Priya's capture, a customer reference and a QR code still need attention even if Quick redact finds the email. Treat text recognition as a useful first pass. Check for an automatically saved original in the Screenshots folder when choosing the final attachment.",
          "If your installed version lacks these controls, use a manual opaque-mask workflow instead of improvising with a highlighter. Keep the destination file name distinct from the initial capture."
        ]
      },
      {
        "heading": "How can you cover information on a Mac?",
        "paragraphs": [
          "For a PNG or JPEG opened in Preview, [Apple's image-annotation instructions](https://support.apple.com/guide/preview/annotate-an-image-prvw1501/mac) describe the Markup toolbar, Shapes and Fill Color. Work on a duplicate image:",
          "1. Open the duplicate and show the Markup toolbar.\n2. Add a rectangle and set its fill to a fully opaque colour.\n3. Position and resize it to cover the complete sensitive region.\n4. Save the image, reopen it and inspect the covered areas at full size.",
          "Apple distinguishes saved image annotations from annotations in an editable PDF. Keep this task as a raster-image export rather than turning the screenshot into a PDF to retain movable objects.",
          "If the image passes through iPhone Photos later, avoid All Photos Data when sharing. [Apple says that option can include the original and edit history](https://support.apple.com/guide/iphone/share-photos-and-videos-iphf28f17237/ios). Select the final derivative file rather than an original-library sharing route."
        ]
      },
      {
        "heading": "How do you flatten and verify a local sharing copy?",
        "paragraphs": [
          "The [screenshot redactor](/screenshot-redactor/) offers a manual route in the browser. Selected image bytes remain local. Its interface accepts a supported JPEG, PNG or static WebP, up to 10 MB per file.",
          "1. Choose or paste the image and select solid.\n2. Drag over each private detail with a margin around its edges. Use crop for background you do not need.\n3. Choose Flatten and verify. The tool renders a fresh PNG and scans that output for supported private metadata.\n4. Choose Download redacted PNG.\n5. Open the downloaded PNG separately and review the visible result.",
          "Priya checks the two email locations, the removed recovery panel and the full frame. The automatic metadata pass says nothing about whether she remembered every visible secret. Reopening the actual download makes that final human check concrete."
        ]
      },
      {
        "heading": "What should you inspect before attaching the file?",
        "paragraphs": [
          "Review the file at full size, then at a smaller size resembling the recipient's view. Look for missed edges, duplicate text, codes and unrelated content that gives the same information away.",
          "A screenshot can also carry hidden information, so use [the screenshot metadata guide](/guides/do-screenshots-have-metadata/) to understand that separate check. Open the final download in the [clean-copy verifier](/verify-clean-photo/) and send that file, not the original screenshot, editor project or a folder containing both.",
          "Sources checked November 2026."
        ]
      }
    ]
  },
  {
    "slug": "blur-vs-permanent-redaction",
    "title": "Blur versus permanent redaction",
    "seoTitle": "Blur vs permanent redaction: which should you use?",
    "includeSiteName": false,
    "socialTitle": "Blur vs permanent redaction: which should you use?",
    "socialDescription": "Blur versus permanent redaction: separate visual obscuring from replacing private pixels, then check the exact export.",
    "description": "Choose blur for a visual effect and solid, flattened masks for private text or codes. Compare the methods and check the exact image you plan to send.",
    "audience": "Anyone hiding visible information",

    "datePublished": "2026-07-21",
    "dateModified": "2026-11-18",
    "toolSlug": "verify-clean-photo",
    "toolLabel": "Verify the sharing copy",
    "intro": "When choosing blur versus permanent redaction, use a fully opaque, flattened mask for information that must leave the shared image. Blur and pixelation can retain visual clues. A solid mask must cover the whole detail and become part of the exported pixels. Review that final file rather than trusting the editor preview.",
    "sections": [
      {
        "heading": "How do the methods change an image?",
        "paragraphs": [
          "Blur softens the appearance of existing information. [Microsoft's Gaussian blur documentation](https://learn.microsoft.com/en-us/windows/win32/direct2d/gaussian-blur) describes a Gaussian-kernel effect with an adjustable blur amount. That makes it an image-processing operation, not a promise that a name or code has become undiscoverable.",
          "Pixelation reduces visible detail into blocks. An opaque fill replaces the selected visible region with a uniform colour. Cropping excludes a region from the intended exported frame. Each can change what a viewer sees, but they answer different sharing goals.",
          "In a fictional teaching example, Lee wants to show a settings screen without its private invitation code. A softened background is harmless decoration; the code needs full removal from the sharing copy. Lee chooses a solid rectangle for the code rather than applying one effect to the whole image."
        ],
        "table": {
          "afterParagraph": 1,
          "headers": [
            "Method",
            "Appropriate goal",
            "What to check before sharing"
          ],
          "rows": [
            [
              "Blur",
              "Soften a background for appearance",
              "Do not depend on it to protect private text or a code."
            ],
            [
              "Pixelation",
              "Create a coarse visual effect",
              "Remaining shapes and context can still provide clues."
            ],
            [
              "Opaque solid fill",
              "Remove a complete visible secret from the derivative",
              "Cover every edge, flatten and inspect the export."
            ],
            [
              "Crop",
              "Exclude unnecessary parts of the frame",
              "Confirm the exported file contains only the kept region."
            ]
          ]
        }
      },
      {
        "heading": "Why can blur or pixelation leave useful clues?",
        "paragraphs": [
          "A private field does not have to be perfectly reconstructed to reveal something useful. A partly readable domain, a familiar logo, the shape of a word or a known form layout can narrow what a viewer infers. Adjacent unedited text may disclose the same information directly.",
          "For Lee's screen, blurring the invitation code leaves its label and an account email visible below it. A reader who already knows the account context has more information than someone seeing an isolated block of pixels. Lee removes the email too, rather than treating blur strength as the only variable.",
          "This is a practical reason to prefer complete replacement for secrets, not a claim that every blurred image can be reversed. There is no general blur radius or pixel-block size that clears every photograph, display size and disclosure consequence."
        ]
      },
      {
        "heading": "What makes a solid mask genuinely opaque?",
        "paragraphs": [
          "Choose a filled rectangle, not an outline, and use a colour with full opacity. Disable transparency or blend effects that allow the underlying content to contribute. [Microsoft's transparency documentation](https://learn.microsoft.com/en-us/windows/win32/direct2d/opacity-masks-overview) explains that alpha information controls how source pixels are blended; the relevant editorial lesson is to avoid a semi-transparent cover.",
          "Extend the fill beyond the first and last character and beyond faint edge pixels. Cover the entire QR code or barcode rather than leaving fragments for someone to inspect. If the detail appears twice, mask both instances.",
          "Lee's first rectangle stops at the code's last dark stroke. On closer inspection, a faint edge remains outside it. Lee enlarges the mask, then checks that the useful settings labels still read correctly. The test is coverage in the exported picture, not whether the on-screen rectangle looks roughly aligned."
        ]
      },
      {
        "heading": "Does saving an edit remove the original?",
        "paragraphs": [
          "Not necessarily. An editable project or photo-library item may retain its original and editing state. [Apple documents that Photos keeps the original](https://support.apple.com/guide/photos/editing-basics-pht304c2ace6/mac) and supports Revert to Original. Keep that private working item separate from the outgoing derivative.",
          "Flattening renders the edited picture into a new raster image, with the masks baked into its pixels rather than supplied as movable objects. It does not erase your private original or copies already shared. Also check for [older embedded thumbnails](/guides/embedded-thumbnail-risk/) and other hidden structures in the exported file.",
          "Lee saves the project for private revision, then exports a separate PNG containing the finished masks. Sending both files in one folder would undo the separation: the recipient would still receive the private working material. Rename and organise the derivative so that it is easy to select alone."
        ]
      },
      {
        "heading": "How do you make and inspect the final derivative?",
        "paragraphs": [
          "For an actual capture-and-mask procedure, follow [how to redact a screenshot safely](/guides/redact-a-screenshot-safely/). To apply the choice locally, the [manual screenshot redactor](/screenshot-redactor/) provides solid, blur, pixelate and crop controls.",
          "1. Open a supported JPEG, PNG or static WebP, up to 10 MB.\n2. Select solid and cover each complete private region.\n3. Choose Flatten and verify, then Download redacted PNG.\n4. Open that download independently and inspect the full image at full size.\n5. Review its metadata as a separate task before attaching it.",
          "The tool renders a new PNG and rescans supported hidden-data categories. It does not automatically find every face, code or identifier. Use [what metadata can reveal](/guides/what-photo-metadata-can-reveal/) to understand why a hidden-data check and a visual review remain separate.",
          "For Lee, completion means the code and duplicate email are absent from the outgoing pixels, the exported file passes the supported metadata checks, and the private project is not attached. Finish with the [clean-copy verifier](/verify-clean-photo/) on that exact export.",
          "Sources checked November 2026."
        ]
      }
    ]
  },
  {
    slug: 'embedded-thumbnail-risk',
    title: 'How embedded thumbnails can expose old image content',
    description: 'Why a JPEG can contain a second preview image, how stale thumbnails survive careless edits, and why redacted exports must be flattened and rescanned.',
    audience: 'People editing or redacting JPEG photos',

    sections: [
      { heading: 'One file can hold more than one image', paragraphs: ['A JPEG EXIF block may include a small thumbnail used for quick previews. That thumbnail is separate from the main compressed image stream.'] },
      { heading: 'The preview can become stale', paragraphs: ['Some editing workflows update the main image without replacing the embedded preview. A redacted main image can therefore travel with a tiny older version that still shows the original scene.'] },
      { heading: 'Metadata-only edits need careful rules', paragraphs: ['A lossless metadata cleaner should remove embedded thumbnails. Any workflow that changes visible pixels should generate a completely new flattened image with no inherited EXIF, XMP, or IPTC blocks.'] },
      { heading: 'Verification catches the second copy', paragraphs: ['Rescan the output and require the embedded-thumbnail category to report not found. The report should describe the category without copying any private source values. Compare [blur and permanent redaction](/guides/blur-vs-permanent-redaction/) when choosing how to cover visible information.'] },
    ],
  },
  {
    "slug": "marketplace-photo-safety",
    "title": "How to share marketplace photos safely",
    "seoTitle": "Marketplace photo safety: protect your home details",
    "includeSiteName": false,
    "socialTitle": "Marketplace photo safety: protect your home details",
    "socialDescription": "Show the item's condition without exposing mail, family details or hidden capture locations.",
    "description": "Prepare safer marketplace photos: check reflections, labels and location data, keep useful product details, then verify each final listing image.",
    "audience": "Marketplace sellers and small businesses",

    "datePublished": "2026-07-21",
    "dateModified": "2026-11-18",
    "toolSlug": "verify-clean-photo",
    "toolLabel": "Verify the sharing copy",
    "intro": "Marketplace photo safety starts with the scene: show the item's condition against a plain background, remove private labels and reflections, and clean the final files' metadata. Keep useful model details visible. Review every exported image before uploading, so a close-up or extra photo does not reveal what the main image hides.",
    "sections": [
      {
        "heading": "What should you move before taking the photographs?",
        "paragraphs": [
          "Prepare the scene instead of planning to edit everything later. Move mail, prescriptions, family photographs, appointment cards and work documents away from the item. Avoid a window view or a house number if the listing should not identify your home.",
          "In a fictional listing, Jordan photographs a used coffee machine on the kitchen counter. A parcel label sits beside it, and a school timetable hangs behind it. Jordan moves the machine to a plain table and removes both objects before taking new photographs.",
          "Keep the lighting useful: buyers should still see dents, scratches and missing parts. A privacy edit should remove unrelated information, not disguise the item's condition. If the safest crop hides a damaged area, take a different picture that shows the damage without the personal background."
        ]
      },
      {
        "heading": "Where do reflections and close-ups expose extra details?",
        "paragraphs": [
          "Check shiny screens, mirrors, chrome, glass doors and glossy packaging. Look at the actual full-size photographs, not just small listing thumbnails. A reflection can include the photographer, another person, an open document or a view through a window.",
          "Jordan's coffee-machine front reflects a shipping label from the opposite counter. Moving the first label was useful, but it did not settle the whole scene. Jordan changes the angle and checks the new reflection before keeping that photograph.",
          "Inspect every close-up independently. A detail shot of a control panel may include an account name on an app screen; a photograph of accessories may include an invoice. Use the [solid-mask comparison](/guides/blur-vs-permanent-redaction/) for details you must cover, or retake the image when a clean background is simpler."
        ]
      },
      {
        "heading": "Which product identifiers should stay visible?",
        "paragraphs": [
          "Distinguish a model number that helps a buyer check compatibility from an identifier unique to your device or account. Show the model, dimensions, connector type and relevant accessories when they matter to the sale. Consider whether a full serial, barcode, receipt address or account-linked QR code is necessary in the public picture.",
          "For Jordan's machine, the model label helps a buyer find the correct manual. The adjoining owner-registration code serves a different purpose. Jordan keeps the model readable and covers the entire registration-code area on the sharing copy.",
          "If a buyer needs further evidence, agree on which detail they need before sending another photograph. Prepare and check that image separately rather than sending the unedited original. Keep the original for your own records, and do not obscure safety information or misrepresent the item's ownership or condition."
        ]
      },
      {
        "heading": "How do you remove the file's hidden information?",
        "paragraphs": [
          "Start with the [photo-metadata overview](/guides/what-photo-metadata-can-reveal/). GPS is one concern, but a caption or creator-contact field may also be relevant. The [IPTC Photo Metadata Standard](https://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata) defines fields for creator contact details, descriptions and locations; a publishing export may therefore need more than a GPS-only check.",
          "For a one-off iPhone share, [Apple documents this location-control route](https://support.apple.com/en-au/guide/personal-safety/ips0d7a5df82/web):",
          "1. Open Photos and select the picture or pictures.\n2. Tap Share, then Options.\n3. Turn off Location and return to the Share sheet.\n4. Choose the destination and check that the intended derivative is selected.",
          "For an exported listing file, inspect and [remove supported photo metadata locally](/remove-photo-metadata/), then download the clean copy. The local utility supports JPEG, PNG and static WebP up to 10 MB per file; export a supported still first if your source is HEIC.",
          "If you use Google Photos, do not treat a hidden account location as a cleaned download. [Google explains that external downloads can carry the original device-saved location](https://support.google.com/photos/answer/6153599?hl=en&co=GENIE.Platform%3DDesktop). Jordan checks the actual downloaded product images instead of using an album's map display as the test."
        ]
      },
      {
        "heading": "How do you verify a complete set of listing photos?",
        "paragraphs": [
          "Use a separate sharing folder, with only the approved derivatives inside it. An attachment picker full of originals and exports makes it easier to choose the wrong file. Give the derivatives neutral, useful names; [filename privacy](/guides/photo-filename-privacy/) is separate from embedded metadata.",
          "For Jordan's listing, the review covers the front, side, model label, accessories and damage close-up. The front photograph passes only after the reflection is removed; the model-label photograph passes only after the registration code is fully covered. A successful main-image review does not clear the other images automatically.",
          "Before uploading each file:",
          "- Check the full frame and reflective surfaces.\n- Confirm that condition and model details remain truthful and useful.\n- Check every label, barcode and code, not just the most obvious address.\n- Open the final export and review its supported metadata findings.\n- Select only those reviewed derivatives in the listing uploader.",
          "After upload, check the listing's visible images and text for accidental address or pickup-detail disclosures. A platform's displayed preview says nothing certain about every version it may provide, so keep your local-file review as a distinct step. Start the final pass with the [clean-copy verifier](/verify-clean-photo/).",
          "Sources checked November 2026."
        ]
      }
    ]
  },
  {
    "slug": "photo-sharing-checklist-for-parents",
    "title": "Photo-sharing checklist for parents",
    "seoTitle": "Photo-sharing checklist for parents: a safer routine",
    "includeSiteName": false,
    "socialTitle": "Photo-sharing checklist for parents: a safer routine",
    "socialDescription": "Choose the audience, check school and home clues, and verify a separate family-photo sharing copy.",
    "description": "Before sharing family photos, check the audience, school clues, names and hidden location data. Make a separate copy and verify the file you send.",
    "audience": "Parents and caregivers",

    "datePublished": "2026-07-21",
    "dateModified": "2026-11-18",
    "toolSlug": "verify-clean-photo",
    "toolLabel": "Verify the sharing copy",
    "intro": "Before sharing a child's photo, work through a short checklist: choose the audience, check visible names and places, and prepare a separate sharing copy. Parents and caregivers should review hidden location data too. Open the final exported file before sending it, and keep the original in your private library.",
    "sections": [
      {
        "heading": "Who needs to see this photo?",
        "paragraphs": [
          "Start with the reason for sharing. A grandparent wanting to see a birthday cake needs a different audience from a public club announcement. Choose the smallest group that serves that purpose, and check the recipients before attaching anything.",
          "Ask your child, when appropriate, whether they are comfortable with the picture and caption. Check with other families before posting their children. If someone objects, choose a different photograph or leave the post unsent rather than treating editing as automatic permission.",
          "For example, a school-event picture may include a child whose family has asked to stay out of public posts. Sending that same group shot to a large neighbourhood chat still expands its audience. A close-up of your own child's artwork could meet the original purpose with less information about other people."
        ]
      },
      {
        "heading": "What can the picture and caption reveal together?",
        "paragraphs": [
          "Inspect the full-resolution image, including corners, mirrors and windows. Look for school badges, house numbers, street signs, name tags, certificates, appointment letters and screens. Read the caption alongside it: an unnamed uniform becomes more revealing when the text names a school and describes a daily pickup time.",
          "A fictional parent, Sam, wants to share a first-day-of-school photo. The frame includes a school crest, a house number and a sibling's full name on a bag. Sam chooses a closer crop, removes the bag from the frame and avoids naming the school in the caption.",
          "If those details are central to the picture, take another photograph against a plain background. Covering a badge does little if a notice behind it still names the school. Work from a duplicate so that the family keeps its unedited memory privately."
        ]
      },
      {
        "heading": "How do you check an iPhone photo before sharing?",
        "paragraphs": [
          "[Apple's photo-information instructions](https://support.apple.com/guide/iphone/see-photo-and-video-information-iph0edb9c18f/ios) explain how to open a photo and swipe up or tap Info to review its saved details. Use that as an initial check, then decide what belongs in the outgoing copy.",
          "For a one-off share from iPhone Photos, follow [Apple's location-metadata sharing instructions](https://support.apple.com/en-au/guide/personal-safety/ips0d7a5df82/web):",
          "1. Open the selected photo and tap Share.\n2. Tap Options and turn off Location.\n3. Leave All Photos Data off when offered, then return to the Share sheet.\n4. Choose the intended recipient or destination and review the attachment.",
          "[Apple's separate sharing guide](https://support.apple.com/guide/iphone/share-photos-and-videos-iphf28f17237/ios) describes All Photos Data as including the original file, edit history and metadata. Avoid selecting it when your purpose is to send only a reviewed derivative.",
          "Sam uses the location switch for the school photo, but still checks the visible crest separately. For library changes and a fuller export workflow, use [removing location from iPhone photos](/guides/remove-location-from-iphone-photos/)."
        ]
      },
      {
        "heading": "What should you check in a Google Photos family album?",
        "paragraphs": [
          "Review who has access separately from whether photo locations are shown. For an existing shared album on a computer, [Google's location-sharing instructions](https://support.google.com/photos/answer/6153599?hl=en&co=GENIE.Platform%3DDesktop) give this route:",
          "1. Open Google Photos and choose Collections > Albums.\n2. Open the shared album and click Share.\n3. Beside Sharing photo locations, choose Album options.\n4. Turn Share photo locations off and click Done.",
          "This controls the album's location display. Google says its location-sharing settings do not change the original device location in a file downloaded and shared outside Google Photos. Inspect a downloaded attachment separately rather than assuming the album setting cleaned it.",
          "For Sam's birthday album, disabling locations and checking the members are separate tasks. If the audience is no longer appropriate, use the [Google Photos album access-withdrawal guide](/guides/stop-sharing-google-photos-album/) rather than uploading a replacement picture and assuming the old access disappeared."
        ]
      },
      {
        "heading": "How do you prepare and check the sharing copy?",
        "paragraphs": [
          "Use [what photo metadata can reveal](/guides/what-photo-metadata-can-reveal/) to distinguish embedded fields from visible information. A school sign lives in the pixels; a GPS record lives in the file. Removing one leaves the other to review.",
          "1. Keep the original private and create a clearly named sharing copy.\n2. Crop unnecessary background or use the [manual image redactor](/screenshot-redactor/) with solid masks for details that must be removed.\n3. Clean the sharing copy's supported metadata.\n4. Download the result, reopen it and inspect every edge at full size.\n5. Attach only that export and check the post's recipients and caption.",
          "The local tools accept JPEG, PNG and static WebP up to 10 MB per file; export a supported still copy first if your original is HEIC or a Live Photo. A metadata result covers supported hidden fields, not a judgement about whether the child or place can be recognised.",
          "For Sam, the final decision includes a closer photograph, a non-identifying caption and a small family audience. Finish by opening the actual attachment in the [clean-copy verifier](/verify-clean-photo/), rather than relying on an earlier check of the original.",
          "Sources checked November 2026."
        ]
      }
    ]
  },
  {
    "slug": "photo-safety-for-journalists",
    "title": "Photo safety checklist for journalists",
    "seoTitle": "Photo safety for journalists: a publication checklist",
    "includeSiteName": false,
    "socialTitle": "Photo safety for journalists: a publication checklist",
    "socialDescription": "Separate the evidentiary original, the publication image and the delivery context when protecting a source.",
    "description": "Review photo metadata, visible source clues and captions before publication. Preserve the original, export a separate copy and verify the handoff.",
    "audience": "Journalists, researchers, and activists",

    "datePublished": "2026-07-21",
    "dateModified": "2026-11-18",
    "toolSlug": "verify-clean-photo",
    "toolLabel": "Verify the sharing copy",
    "intro": "For journalists, photo safety means identifying what could expose the source, preserving the original privately and making a separate publication copy. Review metadata, visible clues, captions and the delivery route together. Have another person inspect the exact outgoing image, then verify that same file after any final resize, watermark or export.",
    "sections": [
      {
        "heading": "What are you trying to keep private?",
        "paragraphs": [
          "Name the information at risk before choosing an edit: a source's identity, their access to a room, the capture location, a meeting time or the device used. Decide who might combine that detail with information they already have. That decision may lead to a different photograph or no publication, rather than another cleaning pass.",
          "Consider a fictional newsroom receiving a photograph from inside a workplace. The source can be identified by a badge, the room's unusual equipment or knowledge of who was present. Removing GPS addresses one stored record; it leaves those other routes for the editor to assess.",
          "Make the publication decision with the responsible editor and your organisation's source-protection procedures. Treat a browser utility as one bounded image-processing step, not the security plan for contacting, storing or protecting a source."
        ]
      },
      {
        "heading": "Which original should you preserve, and who receives it?",
        "paragraphs": [
          "Keep the received original in the newsroom's approved restricted storage. Create a working derivative rather than overwriting the only original. Record the transformation and the file's role without copying sensitive source values into a public checklist or caption.",
          "Separate three destinations: private original, editorial working copy and publication-ready export. A publisher who needs the export should not automatically receive the source folder. If an evidentiary original is required for a separate review, arrange that deliberately under your established procedure.",
          "In the workplace scenario, the editor labels the masked file as a publication derivative and records that the badge and location fields were removed. That note explains the edit without restating the source's name or the exact coordinates. Image verification and source verification remain different editorial tasks."
        ]
      },
      {
        "heading": "What should the metadata review include?",
        "paragraphs": [
          "Look beyond a single GPS result. [Apple's photo-information documentation](https://support.apple.com/guide/iphone/see-photo-and-video-information-iph0edb9c18f/ios) illustrates saved capture time, device and location information. The [photo-metadata overview](/guides/what-photo-metadata-can-reveal/) explains how these fields differ from the visible photograph.",
          "Publishing records deserve attention too. The [IPTC Photo Metadata Standard](https://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata) defines creator contact information, descriptions, people shown, location created, location shown and rights-related fields. Review which of those should accompany the public derivative, and which belong only in private editorial records.",
          "Use the [EXIF, XMP and IPTC comparison](/guides/exif-vs-xmp-vs-iptc/) when a workflow carries several field families. A file with no EXIF GPS may still have a location or identity in a description. Keep the publication's authorised credit and rights information in its approved publishing workflow instead of assuming that every useful editorial field must be deleted everywhere.",
          "For the workplace photograph, a cleaned coordinate field would not settle a caption naming the department. Review both the exported file and the CMS caption before the handoff is accepted."
        ]
      },
      {
        "heading": "What remains identifiable in the visible photograph?",
        "paragraphs": [
          "Check badges, faces, screens, reflections, tattoos, documents and distinctive equipment. Also consider a window view, room layout, uniform or notice that someone with local knowledge might recognise. Review the caption, alt text and nearby story text together with the image.",
          "In the fictional workplace image, an opaque mask hides the badge but a reflected monitor still shows the source's account name. The editor crops the reflection, masks the remaining identifier and asks whether the room alone reveals who supplied the image. If it does, a different illustration may be the better editorial choice.",
          "An already-public copy creates a further connection. Read [why metadata removal does not stop reverse image search](/guides/metadata-removal-reverse-image-search/) before republishing a recognisable source photograph under a new context. Do not upload an unpublished source image to a search service merely to obtain a reassuring no-match result."
        ]
      },
      {
        "heading": "Which Apple export route produces the intended copy?",
        "paragraphs": [
          "On a Mac, [Apple distinguishes an edited photo export from an unmodified-original export](https://support.apple.com/guide/photos/export-photos-videos-slideshows-and-memories-pht6e157c5f/mac):",
          "1. In Photos, select the intended edited photograph.\n2. Choose File > Export > Export Photos, then choose the required image type and output settings.\n3. Export into a separate publication folder and inspect the resulting file.\n4. Reserve Export Unmodified Original for a deliberate original-file handoff, not for sending the masked publication image.",
          "Apple also documents an optional Export IPTC as XMP sidecar in the original-export workflow. Check the folder for extra files before handing it over. A sidecar is a separate metadata-bearing artifact, not something an image-only scan automatically clears.",
          "For an iPhone transfer, [Apple describes All Photos Data as sending the original, edit history and metadata](https://support.apple.com/guide/iphone/share-photos-and-videos-iphf28f17237/ios). When that option is offered, leave it off for a publication-copy handoff. Select the reviewed export deliberately; a sharing switch does not replace checking the file."
        ]
      },
      {
        "heading": "What evidence should accompany the publication handoff?",
        "paragraphs": [
          "Use the [local metadata cleaner](/remove-photo-metadata/) on a supported JPEG, PNG or static WebP, up to 10 MB, after making the required visual edits. A HEIC original needs a supported still export first. Open the downloaded result for an independent check rather than relying on a success label from an earlier copy.",
          "Ask the second reviewer to check the visible image, supported metadata findings, filename, caption, credit and destination. Agree on the exact file being accepted. If a later resize, watermark or publishing export changes it, check that new file before release.",
          "In the workplace scenario, the final handoff contains only the reviewed publication image and the authorised caption, while the original remains restricted. Finish by opening that exact image in the [clean-copy verifier](/verify-clean-photo/) and recording the reviewer and result in your private editorial workflow.",
          "Sources checked November 2026."
        ]
      }
    ]
  },
  {
    slug: 'browser-local-image-processing',
    title: 'How browser-local image processing works',
    description: 'How File and Blob APIs, ArrayBuffer parsing, canvas rendering, Web Workers, object URLs, and browser-generated downloads can transform images without an upload endpoint.',
    audience: 'Privacy-conscious users and web developers',

    sections: [
      { heading: 'Selection grants local file access', paragraphs: ['A browser page cannot freely read your photo library. It receives File objects only for items you explicitly choose, drop, or paste. The application can read those bytes into an ArrayBuffer in the tab.'] },
      { heading: 'Parsing does not require a server', paragraphs: ['JavaScript can inspect JPEG segments, PNG chunks, and WebP RIFF chunks directly. The parsed findings exist in memory and can be cleared when you remove the files or close the tab.'] },
      { heading: 'Cleaning creates a browser-generated Blob', paragraphs: ['A metadata cleaner can assemble new bytes locally. A redactor can draw into a canvas and encode a fresh Blob. An object URL gives the browser a temporary download target without a server-generated file.'] },
      { heading: 'A Web Worker is not a Cloudflare Worker', paragraphs: ['A browser Web Worker is a background thread on your device. Cloudflare Workers run on Cloudflare infrastructure. Photo Privacy Lab uses the former for batch processing and does not send images to the latter.'] },
    ],
  },
  {
    slug: 'clean-chatgpt-image-metadata',
    title: 'How to check and clean ChatGPT image metadata',
    description: 'Inspect a downloaded ChatGPT image, understand C2PA Content Credentials and SynthID, remove supported metadata from a sharing copy, and verify what changed.',
    audience: 'People downloading and sharing AI-generated images',

    datePublished: '2026-08-06',
    dateModified: '2026-08-06',
    toolSlug: 'remove-photo-metadata',
    toolLabel: 'Open the metadata cleaner',
    sources: [
      { href: 'https://help.openai.com/en/articles/8912793-c2pa-in-dall-e-3', label: 'OpenAI: C2PA and SynthID in generated images' },
      { href: 'https://spec.c2pa.org/specifications/specifications/2.4/specs/ContentCredentials.html', label: 'C2PA Content Credentials specification' },
    ],
    sections: [
      { heading: 'Start with the downloaded file', paragraphs: ['Do not infer metadata from how an image looks in a chat window. Download the image and inspect that exact file, because copying, editing, screenshotting, and posting through another service can change which metadata survives.', 'Photo Privacy Lab reads supported structures locally. It does not send the selected image to this site or to OpenAI.'] },
      { heading: 'Generated images can carry provenance signals', paragraphs: ['OpenAI states that images generated with ChatGPT, Codex, and its API include C2PA metadata and SynthID watermarks. C2PA is file metadata used to carry provenance information. SynthID is a separate signal embedded in the image itself.', 'The local scanner can report a PNG C2PA Content Credentials container. It does not validate the signature or decide who created the image. Use OpenAI Verify or a dedicated Content Credentials validator when provenance verification is the goal.'] },
      { heading: 'Choose what clean means for your purpose', paragraphs: ['Privacy Clean removes supported metadata while preserving the image payload where the format allows it. Full Flatten decodes the visible image and creates a new file without inheriting the original metadata blocks.', 'Removing metadata is not the same as removing every provenance signal. A pixel-level watermark may survive flattening or other transformations. This tool does not detect, remove, or make claims about SynthID.'] },
      { heading: 'Verify the exported copy', paragraphs: ['Scan the downloaded clean or flattened copy, not just the original. Confirm that supported Content Credentials, text, EXIF, XMP, IPTC, GPS, comments, and embedded previews are no longer reported.', 'A missing C2PA container does not prove that an image was not generated by OpenAI. Metadata can be lost during ordinary transformations, and provenance requires a purpose-built validator.'], checklist: ['Download the exact image', 'Scan before changing it', 'Choose Privacy Clean or Full Flatten', 'Download the derivative', 'Scan the derivative again'] },
    ],
  },
  {
    slug: 'do-screenshots-have-metadata',
    title: 'Do screenshots have metadata?',
    description: 'Learn which metadata a screenshot may contain, how operating systems and apps differ, and how to inspect the exact screenshot before sharing it.',
    audience: 'Anyone sharing screenshots',

    datePublished: '2026-08-06',
    dateModified: '2026-08-06',
    toolSlug: 'photo-metadata-viewer',
    toolLabel: 'Check a screenshot locally',
    sections: [
      { heading: 'Yes, a screenshot can have metadata', paragraphs: ['A screenshot is an image file, and image files can contain metadata. The exact fields depend on the operating system, capture tool, editor, export format, and any service that handled the file afterward.', 'Many screenshots contain fewer camera-specific fields than photos because there is no lens, exposure, or camera GPS capture. They can still carry dimensions, color information, timestamps, software fields, text chunks, profiles, or other application-added data.'] },
      { heading: 'The visible screen is usually the bigger risk', paragraphs: ['Notifications, tabs, email addresses, usernames, account balances, document titles, QR codes, recovery codes, and background windows are stored in the pixels. Removing EXIF cannot remove those details.', 'Review the entire frame at full size. Crop unnecessary areas and use permanent solid masks for secrets before flattening the result into new pixels. Follow [how to redact a screenshot safely](/guides/redact-a-screenshot-safely/) for the full workflow.'] },
      { heading: 'Different copies can produce different answers', paragraphs: ['The original screenshot, an edited copy, a pasted version, and a file downloaded from a messaging platform may not have the same metadata. Some transformations remove fields and others add software or time information.', 'Inspect the exact copy you intend to send. If you redact it, inspect the exported redacted copy again rather than relying on the source-file result.'] },
      { heading: 'Use a two-part screenshot check', paragraphs: ['First, run a metadata scan for supported hidden structures. Second, inspect the visible image for secrets and contextual clues. Neither review replaces the other.'], checklist: ['Open the final screenshot file', 'Check hidden metadata', 'Review every visible edge at full size', 'Use solid masks for secrets', 'Flatten and rescan the shared copy'] },
    ],
  },
  {
    slug: 'photo-metadata-examples',
    title: 'Photo metadata examples and what they mean',
    description: 'See practical examples of EXIF GPS, capture time, device, owner, XMP, IPTC, comments, orientation, profiles, and embedded previews.',
    audience: 'People learning how to read picture information',

    datePublished: '2026-08-06',
    dateModified: '2026-08-06',
    toolSlug: 'photo-metadata-viewer',
    toolLabel: 'View your photo metadata',
    sections: [
      { heading: 'Location and time example', paragraphs: ['A result such as GPS coordinates 43.653200, -79.383200 identifies a point in decimal degrees. Capture time might appear as 2026:08:06 14:32:10. Together, location and time can connect a photo to a home, workplace, trip, appointment, or routine.', 'Coordinates are high-risk when they identify a sensitive place. A timestamp is contextual: it may be harmless in one image and revealing when combined with a location or posting history.'] },
      { heading: 'Device and owner example', paragraphs: ['A device model might name the phone or camera family. A serial field, image identifier, artist name, or copyright field can be more identifying because it may connect multiple files to one device or person.', 'The scanner separates common technical information from fields that deserve a privacy decision. It does not assume every camera model is secret.'] },
      { heading: 'Description and workflow example', paragraphs: ['JPEG comments, PNG text, XMP packets, and IPTC blocks can carry captions, creator details, keywords, locations, editing history, or publishing information. A photo can have no EXIF GPS and still contain a location in XMP or a caption.', 'This is why an EXIF-only check is incomplete. Review each supported metadata family and the embedded preview category.'] },
      { heading: 'Technical metadata example', paragraphs: ['Dimensions such as 4032 by 3024 describe the pixel grid. Orientation tells software how to rotate stored pixels. An ICC profile helps preserve intended color. These fields are usually functional rather than private.', 'A cleaner should explain what it preserves. Removing orientation without normalizing pixels can rotate the image, while discarding a color profile can change appearance.'] },
      { heading: 'How to read your own result', paragraphs: ['Open the original file in the metadata viewer and compare each finding with the audience and purpose of the share. Then create a separate derivative, clean or redact it, and scan the derivative again.'], checklist: ['Treat GPS as location data', 'Review timestamps in context', 'Check device and owner identifiers', 'Look beyond EXIF to XMP and IPTC', 'Preserve useful display information when appropriate'] },
    ],
  },
  {
    slug: 'remove-location-from-iphone-photos',
    title: 'How to remove location from iPhone photos before sharing',
    description: 'Use Apple Photos sharing controls, remove a saved location, and verify the exact exported file for GPS and other metadata before posting it.',
    audience: 'iPhone and iPad users sharing photos',

    datePublished: '2026-08-25',
    dateModified: '2026-08-25',
    toolSlug: 'verify-clean-photo',
    toolLabel: 'Verify the final photo',
    sources: [
      { href: 'https://support.apple.com/en-au/guide/personal-safety/ips0d7a5df82/web', label: 'Apple Personal Safety User Guide: manage location metadata in Photos' },
      { href: 'https://www.apple.com/legal/privacy/data/en/photos/', label: 'Apple Photos and Privacy' },
    ],
    sections: [
      {
        heading: 'Choose whether to hide location for one share or remove it from the library',
        paragraphs: [
          'For a one-time share, Apple documents a Share Sheet control that leaves the library copy organized by place but omits location from that sharing action. Select the photo or photos, open Share, choose Options, turn off Location, and complete the share.',
          'To remove the saved location association from a photo in the Photos app, open the photo, choose the More button, select Adjust Location, and choose No Location. Keep in mind that menus can move between software versions, so use Apple\'s current guide when the labels on your device differ.',
        ],
        checklist: ['One share only: Share, Options, Location off', 'Library change: More, Adjust Location, No Location', 'Check every selected item in a multi-photo share'],
      },
      {
        heading: 'Decide whether future photos should keep location',
        paragraphs: [
          'Apple says the Camera app can embed coordinates when it has access to Location Services. You can stop future collection through Settings, Privacy & Security, Location Services, Camera, then Never. That also removes location-based organization and search for future captures.',
          'A more selective routine is often useful: keep location for a private library, disable it for sensitive shoots, or remove it from a derivative before public sharing. The right choice depends on whether the organizational benefit is worth retaining the coordinates in the original.',
        ],
      },
      {
        heading: 'Verify the file that actually left Photos',
        paragraphs: [
          'A setting shown in Photos is not the same as a check of the delivered bytes. The receiving app may request an original, create a derivative, or handle metadata differently. Save or receive the shared copy, then inspect that exact JPEG, PNG, or static WebP file instead of rescanning the private original.',
          'Photo Privacy Lab checks supported GPS, capture time, device, owner, XMP, IPTC, comment, and embedded-preview structures locally in the browser. If GPS remains, create a cleaned sharing copy and run an independent scan on the output before posting it.',
        ],
        checklist: ['Export or receive the final copy', 'Open the final copy in the verifier', 'Confirm GPS is not found', 'Review time, device, owner, XMP, IPTC, and previews', 'Share only the verified derivative'],
      },
      {
        heading: 'Review visible location clues too',
        paragraphs: [
          'Removing GPS does not remove a house number, street sign, school logo, boarding pass, vehicle plate, reflection, or recognizable landmark. Crop unnecessary surroundings or use a solid flattened mask for details that should not be public.',
          'Keep the original private if you want to preserve capture history. Give the sharing copy a distinct filename and inspect it at full resolution. A clean metadata result supports one part of the decision, but it does not prove that the visible scene is anonymous.',
        ],
      },
      {
        heading: 'Use a repeatable iPhone sharing routine',
        paragraphs: [
          'Before a public post, decide who needs the photo, remove unnecessary location data, review visible clues, and verify the derivative. For several photos, check the batch rather than assuming one Share Sheet choice produced identical outputs for every destination.',
          'Apple controls are the fastest first step for iPhone and iPad users. Independent file verification adds evidence about the copy you will share and helps catch metadata outside the location field.',
        ],
      },
    ],
  },
];

export interface TrustPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; items?: string[]; link?: { href: string; label: string } }>;
}

export const trustPages: TrustPage[] = [
  {
    slug: 'privacy', title: 'Privacy policy', description: 'The exact data boundary for local image processing, site delivery, advertising, and contact.',
    intro: 'Photo Privacy Lab is designed so selected image files and extracted metadata stay in your browser. This policy separates image processing from ordinary website delivery.',
    sections: [
      { heading: 'Image processing', paragraphs: ['Selected images are processed locally in your browser. Image bytes, previews, extracted metadata, redaction geometry, and generated reports are not transmitted to Photo Privacy Lab servers. Images are not stored on our servers, and no account is required.'] },
      { heading: 'Site delivery', paragraphs: ['The host receives ordinary request information needed to deliver public HTML, CSS, JavaScript, fonts, and other site assets. This can include IP address, requested URL, browser information, and security logs. The application has no file-upload endpoint.'] },
      { heading: 'Advertising and optional analytics', paragraphs: ['The site loads Google AdSense for advertising. Google and its advertising partners may receive ordinary browser, page, cookie, and request information under their own policies. Photo Privacy Lab also has its own Google Analytics 4 property, but Analytics does not load until you select Allow page analytics, and Global Privacy Control keeps it off. When allowed, it receives a query-free page path, page title, referrer origin, and ordinary device or browser information. Selected photographs, image bytes, previews, filenames, extracted metadata, redaction geometry, and generated files are never supplied to advertising or analytics scripts. The Analytics choices button reopens the choice.'] },
      { heading: 'Local cleanup', paragraphs: ['Use Remove all to revoke temporary preview URLs and release in-memory references. Closing the tab also clears transient application state. Photo files are not placed in browser local storage.'] },
    ],
  },
  {
    slug: 'methodology', title: 'Technical methodology', description: 'How Photo Privacy Lab scans, cleans, flattens, and verifies supported image formats.',
    intro: 'The product reports only what its parsers and output checks can support. This page documents the current technical boundary.',
    sections: [
      { heading: 'Scanning', paragraphs: ['JPEG parsing walks marker segments and TIFF-style EXIF directories with strict offset checks. PNG parsing inventories chunks, including the C2PA caBX container used for Content Credentials. WebP parsing inventories RIFF chunks. The scanner classifies findings rather than executing metadata content.', 'Content Credentials detection reports that a supported container exists. It does not cryptographically validate the manifest, identify its issuer, or prove who created the image.'] },
      { heading: 'Privacy Clean', paragraphs: ['JPEG cleaning removes EXIF, XMP, IPTC, comment, and embedded-preview segments while preserving compressed scan data and ICC color profiles. When required, a new minimal EXIF block contains only the original orientation value. PNG cleaning also removes a detected C2PA caBX container. PNG and WebP cleaning removes supported privacy-bearing chunks without changing image payload chunks.'] },
      { heading: 'Full Flatten and redaction', paragraphs: ['The browser decodes the displayed image, applies orientation, crop, and visible masks, then encodes a fresh JPEG, PNG, or WebP. The export does not reuse the original metadata blocks or embedded preview.'] },
      { heading: 'Verification', paragraphs: ['Generated bytes are parsed again. Reports include categories and presence outcomes, but omit removed private source values by default. Verification does not analyze faces, signs, reflections, or other visible context.'] },
    ],
  },
  {
    slug: 'supported-formats', title: 'Supported image formats', description: 'Exact JPEG, PNG, and static WebP support, preservation behavior, and intentionally unsupported formats.',
    intro: 'Narrow and testable support is more trustworthy than a vague promise to remove all metadata from every file type.',
    sections: [
      { heading: 'JPEG', paragraphs: ['Deepest support: EXIF and GPS scanning, orientation reading, embedded-thumbnail detection, XMP, IPTC, comments, ICC preservation, lossless metadata-segment cleaning, flattening, and verification.'] },
      { heading: 'PNG', paragraphs: ['Supports IHDR dimensions plus common eXIf, text, time, XMP-bearing, and C2PA caBX chunk detection and removal. C2PA support detects the container but does not validate provenance claims or signatures. Critical image data and color-profile chunks are preserved. Flattening is available when a fresh render is preferred.'] },
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
      { heading: 'Product feedback', paragraphs: ['Describe the browser, image format, approximate size, and steps without attaching a sensitive source image or private metadata.'], link: { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL } },
      { heading: 'Security reports', paragraphs: ['For a suspected vulnerability, email the dedicated contact address or use the repository private vulnerability reporting form. Provide a minimal synthetic reproduction where possible and do not place exploit details or private images in a public issue.'], link: { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL } },
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
