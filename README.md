# Mayank Mehra: retro desktop portfolio

A portfolio that looks like a retro computer desktop. Folders open as draggable windows; clips open in a player window. Plain HTML, CSS and JS: no build step, free on GitHub Pages. On phones, windows open full screen.

## Folder structure

```
editing portfolio/
├── index.html                  the page (no need to touch)
├── css/style.css               colours and layout
├── js/
│   ├── projects.js             <-- EDIT THIS: your details and every video
│   └── main.js                 the desktop (windows, player, mail form)
└── assets/
    ├── videos/
    │   ├── short-form/         vertical videos   (video-01.mp4 ...)
    │   └── long-form/          wide videos       (video-01.mp4 ...)
    ├── thumbnails/
    │   ├── short-form/         cover images      (video-01.jpg ...)
    │   └── long-form/          cover images      (video-01.jpg ...)
    └── images/                 anything else
```

## Adding a video (2 minutes)

1. Copy the file into the right folder, e.g. `assets/videos/short-form/video-01.mp4`.
2. Save a cover image (a frame from the video) as `assets/thumbnails/short-form/video-01.jpg`.
3. In `js/projects.js`, fill in that video's line:

```js
{ title: "", client: "", meta: "0:30",
  video: "assets/videos/short-form/video-01.mp4",
  thumb: "assets/thumbnails/short-form/video-01.jpg", youtube: "", hue: 18 }
```

Use `youtube: "VIDEO_ID"` instead of `video:` for YouTube. Best for long-form.
Leave `title`, `client` and `meta` empty and the clip shows no text label at all.

## GitHub size limits

- A single file can't exceed **100 MB**; keep each under 50 MB.
- Keep the whole repo under about 1 GB.
- Export short-form as H.264 `.mp4`, 1080x1920. Put long-form on YouTube and use the ID.

## Preview on your computer

Double-click **Open portfolio.bat**. It starts a tiny local server and opens the site.
Do not open `index.html` by double-clicking it: YouTube refuses to play embedded videos on a `file://` page (Error 153).

## Publish on GitHub Pages

1. Create a public repository on GitHub.
2. Upload everything in this folder (or `git push`).
3. Settings → Pages → Branch: `main` → Save.
4. Your site goes live at `https://USERNAME.github.io/REPO/`.
