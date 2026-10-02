# Canvas Tab
A local-first Chrome new-tab whiteboard. No build step, accounts, API keys, or remote dependencies.

<img src="https://raw.githubusercontent.com/monapdx/canvas-tab-chrome-extension/refs/heads/main/canvas-tab/banner.png">

<p align="center"><img src="https://raw.githubusercontent.com/monapdx/canvas-tab-chrome-extension/refs/heads/main/canvas-tab/hot-pink-check.gif" height="100"> <img src="https://raw.githubusercontent.com/monapdx/canvas-tab-chrome-extension/refs/heads/main/canvas-tab/beakers.gif" height="100"> <img src="https://raw.githubusercontent.com/monapdx/canvas-tab-chrome-extension/refs/heads/main/canvas-tab/photo.gif" height="100"></p>


## Install
1. Extract this ZIP into a permanent folder.
2. Open chrome://extensions in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the `canvas-tab` folder containing manifest.json.
5. Open a new tab. If Chrome asks, keep the new-tab change.

## Make things
- Add text or notes; double-click to edit. Select and use the toolbar to set colors, font, font size, or bold.
- Upload images, transparent stickers, SVGs, or animated GIFs. You can also drop images onto the canvas or paste images from your system clipboard.
- Open Stickers to search the included emoji sticker collection, or upload your own. This version does not search online sticker services.
- Pen, pencil, and translucent marker support adjustable colors and thickness. Lines, rectangles, and ellipses are included; Fill applies to rectangles and ellipses.
- Every object, including a drawing, gets eight draggable edge/corner handles when selected. Drag objects to move them. Text handles resize the text box; use Size to change font size. Image and drawing resizing is freeform.
- Shift-click to select multiple objects. Drag to move the selection; resize handles affect their individual object.
- Ctrl/Cmd+C, X, and V copy/cut/paste board objects. The internal object clipboard includes all object data, including image and widget contents. It is available within the current tab, not between tabs/apps. With no internal objects copied, system text and images can be pasted.
- Ctrl/Cmd+D duplicates; Delete removes; Ctrl/Cmd+Z undoes; Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redoes; Ctrl/Cmd+A selects all. Arrow keys nudge; Shift+arrow moves 10 pixels.
- Pan with the Hand tool, Alt+drag, middle-button drag, or scroll. Ctrl/Cmd+scroll zooms around the pointer.
- Front/back controls change the stacking order.

## Screenshots

### Editor

<img src="https://raw.githubusercontent.com/monapdx/canvas-tab-chrome-extension/refs/heads/main/canvas-tab/editor.png">

### View Mode

<img src="https://raw.githubusercontent.com/monapdx/canvas-tab-chrome-extension/refs/heads/main/canvas-tab/view.png">

## Widgets
Enter HTML, CSS and JavaScript in the widget editor. Double-click a widget to enable interaction; double-click its top label to return to moving/resizing. Select it and press Edit to change its code.

Widgets run in a separate sandboxed page without extension APIs or access to the board. Use self-contained code; remote JavaScript and network requests are not supported. Inline scripts supplied as HTML are not run; put JavaScript in the JavaScript field. Widgets restart when the board redraws or reloads, so runtime state is temporary; the widget source is saved. Do not put secrets into widget code.

## Saving
The board saves in IndexedDB inside the extension. Backup downloads a JSON file containing the board, images and widget source; Restore replaces the current board and can be undone during the session. Keep backups before uninstalling or removing the extension: uninstalling can remove its saved data. Use one board tab at a time; simultaneously open tabs do not synchronize edits. Large image collections consume browser storage. A failed save is shown in the top bar.

This version is intended for installation as an unpacked extension. Chrome Web Store review/publication has not been performed.

## Widget library (v1.1)
Click Library in the sidebar to insert an audio playlist, checklist, or image gallery. Drag its title bar to move it; click the title bar to select it and use any edge/corner handle to resize. Controls are interactive directly, without toggling widget interaction mode. Select and use Edit (or double-click the title bar) to rename a container.

Audio playlists accept local MP3 and WAV files, include native play/pause/volume/seek controls, previous/next track buttons, automatic advance, a loop toggle, and per-track removal. Add more files inside the container. Audio files are embedded in local board storage and JSON backups, so large collections make backups bigger and consume storage. Playback position is temporary and resets on reload, undo, or changes to the playlist. Canvas movement and zoom retain the existing player. Format playback depends on Chrome supporting the codec inside the file.

Checklists store task text and completion status. Galleries accept uploaded images and include previous/next and removal controls. Copy/paste and duplication include container data. No uploads leave your browser.

## Clean view (v1.2)
Click **Hide controls** to hide the header, tool palette, properties, footer, selection outlines, resize handles, and custom-widget drag labels. The board fills the tab. A small **Show controls** button remains in the bottom-right corner; click it to restore the editor. Ctrl/Cmd+Shift+H also toggles the controls when focus is on the board (a focused custom-widget iframe may capture shortcuts).

In clean view, playlist/checklist/gallery controls and custom widgets remain interactive. Board dragging, resizing, and drawing are disabled until the editor is restored. Scrolling still pans and Ctrl/Cmd+scroll still zooms. Toggling preserves the objects’ on-screen positions and does not rebuild media players. Each newly opened tab starts with controls visible.

## Chunky image borders (v1.3)
Select any uploaded image and click **Chunky border** in the properties bar. It adds a square, thick border with a hard, offset shadow. Border sets its color; Weight adjusts thickness from 2–32 pixels (default 8). Click the toggle again to remove the effect. Multiple selected images can be styled together. Borders are saved, backed up, copied and duplicated with each image, and support undo/redo. The frame stays inside the image object's dimensions and the shadow extends outside; very small frames with heavy borders leave less room for the image. In a narrow window, scroll the properties bar horizontally to see the new controls.

## Bookmarks & links (v1.4)
Choose **Library → Bookmarks & links**. Add an optional name and a web URL; missing https:// is supplied automatically. Click a saved link to open it in a new tab. Edit changes a link's name/URL, × removes it, and ↑/↓ reorders the list. Links save with the board, backups, and duplicates; undo/redo works for changes. Drag the title bar to move, use selection handles to resize, and use Edit in the properties bar to rename the container. This is your board's link list; it does not read or modify Chrome's browser bookmarks.

## Automatic bookmark titles (v1.5)
Leave the Name field blank when adding a bookmark to fetch its page title automatically. Chrome requests optional access to that website when you press Add link; denying access still saves the bookmark using its domain name. A filled Name field always wins and skips fetching. To fetch a new title for an existing link, click Edit, clear its name, and save.

Requests go directly to the supplied site without cookies. No external title service is used. Fetching times out after eight seconds and reads at most 2 MB; unavailable pages, unsupported responses, missing titles and errors fall back to the domain. JavaScript-generated titles and sign-in-only pages may not be available. Titles are stored as text and remote page scripts are not run. Optional access remains granted until revoked in Chrome's extension settings.

## Compact bookmark view (v1.6)
Each bookmark widget starts in compact View mode: one link per row, with the full URL available on hover. Click **Edit links** inside the widget to reveal edit/remove/reorder controls and the add-link form. Click **Done** to return to the compact list. This mode is independent for each bookmark widget, is saved with your board, and works even when the main editor controls are hidden. Long titles are truncated visually to save space; their stored names remain intact.

## One-time title permission (v1.7)
Inside a bookmark widget, click **Edit links → Enable automatic titles**. Accept Chrome's one-time request for all HTTP/HTTPS websites. Subsequent blank-name bookmarks fetch titles without opening permission dialogs. Existing per-site grants also work. Adding links now only checks permissions; if access is missing or revoked, it quietly uses the domain name. Granting broad access is optional and can be revoked in Chrome's extension settings.
