/* ==========================================================================
   YOUR CONTENT LIVES HERE. This is the only file you need to edit.
   ========================================================================== */

window.SITE = {
  name: "Mayank Mehra",                    // shown top-left and in the browser tab
  role: "Video editor",
  tagline: "I cut out the boring part.",   // big headline (last 2 words turn red)
  intro: "Reels, travel films and brand edits with tight pacing and honest colour. Available for remote work.",
  bio: "Hi, I'm Mayank Mehra, a self-taught editor. No courses, no certificates, no diploma on the wall. I learned by cutting things, breaking them, undoing them (Ctrl+Z is my best friend) and cutting them again until they worked. My teachers were YouTube rabbit holes and a lot of 2 a.m. exports. The only certificate I've got is a pile of finished edits, and honestly, that's the one clients actually watch.",
  email: "mmehraa13@gmail.com",
  formKey: "662536eb-dacf-448e-b016-9cb19bedd71e",   // Web3Forms public access key: the form sends messages straight to your inbox
  instagram: "",                           // full link, or leave "" to hide the button
  linkedin: "",
  youtube: "",
  availability: "Taking new projects",    // small green badge at the top. Set "" to hide it.
  noSocial: {                              // shown when instagram/linkedin/youtube above are empty
    title: "No Instagram. No LinkedIn. No YouTube.",
    text: "I make content for social media. I don't consume it. That's why I'm never doomscrolling, and why my inbox is the one place I'm reliably online."
  },
  services: [                              // "What I do" cards
    { icon: "01", title: "Reels and shorts", text: "Hooks in the first second, cuts on the beat, captions that get read.", joke: "Side effect: people watch till the last second." },
    { icon: "02", title: "Travel films", text: "Raw trip footage turned into a story people watch to the end.", joke: "Your holiday photos will finally be jealous." },
    { icon: "03", title: "Colour and sound", text: "Honest grading and clean audio, so it looks and sounds like you meant it.", joke: "Yes, I notice when the audio hums. Yes, I fix it." },
    { icon: "04", title: "Motion and captions", text: "Titles, transitions and subtitles in After Effects and CapCut.", joke: "Text that moves on purpose, not by accident." },
    { icon: "05", title: "Portfolio websites", text: "Like this site? I can build one for you or your brand. One page, full of personality, easy to edit.", joke: "Video editing is still the main thing. This is the side quest.", side: true }
  ],
  process: [                               // "How it works" steps. Edit the timings to match what you can really promise.
    { title: "Send footage", text: "Share a folder and a short brief: the vibe, the length, a reference you like.", joke: "Messy folders welcome. I've seen worse." },
    { title: "First cut", text: "You get the first cut.", joke: "Plot twist: it's already pretty good." },
    { title: "Revisions", text: "Tell me what to change. Two rounds of revisions are included.", joke: "Feedback is welcome. Ctrl+Z is on standby." },
    { title: "Final delivery", text: "Exported for every platform: 9:16, 16:9 and 1:1 if you need them.", joke: "Exported before you can say \"one more thing\"." }
  ],
  testimonials: [                          // add real client quotes here. The section hides itself when empty.
    // { quote: "Short line from the client.", name: "Client name", role: "Company or channel" }
  ],
  funFacts: [                              // joke "certificate" card in About (shown when stats below is empty)
    ["Certificates", "0"],
    ["Courses taken", "0"],
    ["Teachers", "YouTube + trial and error"],
    ["Ctrl+Z presses", "Uncountable"],
    ["Finished edits", "Plenty"]
  ],
  stats: [],                           // add real counters later, e.g. { n: 50, label: "reels delivered" }
  tools: ["Premiere Pro", "After Effects", "CapCut", "DaVinci Resolve"]
};

/* ---------- SHORT-FORM VIDEOS (vertical 9:16) ----------
   Use ONE of these for each video:
     video:   "assets/videos/short-form/video-01.mp4"   (file you put in that folder)
     youtube: "AbC123xyz"                                (the ID from the YouTube link)
   Optional:
     thumb:   "assets/thumbnails/short-form/video-01.jpg"  (cover image; recommended with video files)
     title:   "" is fine. Leave it empty and no title is shown.
     client / meta: small grey text under the video, e.g. a client name and "0:30". Leave "" to hide.
   Leave video and youtube as "" and a coloured placeholder is shown.
   To add more videos, copy a line and paste it below. To remove one, delete its line. */
window.REELS = [
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-01.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-01.jpg", hue: 18 },
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-02.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-02.jpg", hue: 200 },
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-03.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-03.jpg", hue: 275 },
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-04.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-04.jpg", hue: 150 },
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-05.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-05.jpg", hue: 335 },
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-06.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-06.jpg", hue: 45 },
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-07.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-07.jpg", hue: 100 },
  { title: "", client: "", meta: "", video: "assets/videos/short-form/video-08.mp4", youtube: "", thumb: "assets/thumbnails/short-form/video-08.jpg", hue: 240 }
];

/* ---------- LONG-FORM VIDEOS (wide 16:9) ----------
   Same fields as short-form, plus (optional):
     place / year: small text shown on the clip */
window.TRIPS = [
  { title: "Panchachuli · Darma Valley", client: "", place: "", year: "", meta: "", video: "", youtube: "mPVCpcnvxUY", thumb: "", hue: 210 },
  { title: "", client: "", place: "", year: "", meta: "", video: "", youtube: "deCsU_mcKnI", thumb: "", hue: 30 },
  { title: "", client: "", place: "", year: "", meta: "", video: "", youtube: "uHL0m-9U6Qs", thumb: "", hue: 165 }
];
