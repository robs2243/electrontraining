# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron training project demonstrating UI positioning via JSON-based layout configuration. The application creates a fixed-size 800x600 window with various UI elements (buttons, inputs, status panels) that are positioned absolutely using coordinates from `layout.json`.

## Development Commands

### Start the Application
```bash
npm start
```

Launches the Electron app with a fixed 800x600 window (menu bar disabled for clean appearance).

## Architecture

### Main Process (main.js)
- Entry point for Electron application
- Creates BrowserWindow with fixed dimensions (800x600)
- Uses `useContentSize: true` to ensure inner content area is exactly 800x600
- Window is non-resizable and has no menu bar
- **Security Note**: Uses deprecated `nodeIntegration: true` and `contextIsolation: false` - appropriate for training/demo purposes only, not production

### Renderer Process (renderer.js)
- Runs in the browser window context with Node.js integration
- Reads `layout.json` on page load
- Applies absolute positioning (x, y coordinates) to UI elements by their IDs
- Provides F5 key listener for page reload
- Error handling for missing elements or JSON read failures

### Layout System (layout.json)
- Single source of truth for UI element positioning
- Maps element IDs to x/y pixel coordinates
- All positioned elements must have `position: absolute` CSS class (`.ui-element`)
- To reposition elements, modify coordinates in this JSON file and reload (F5)

### HTML/CSS Structure
- `index.html`: Contains all UI elements with unique IDs
- `style.css`: Provides styling with radial gradient background and absolute positioning base class
- All repositionable elements must:
  1. Have a unique ID matching a key in `layout.json`
  2. Include the `ui-element` class for absolute positioning

## Key Architectural Patterns

**JSON-Driven Layout**: Unlike typical web apps with CSS-based layouts, this project uses a JSON configuration file to control element positioning. The renderer process reads this file at startup and programmatically sets `left` and `top` CSS properties.

**Synchronous UI Setup**: Layout is applied via callback after JSON file read. Elements not found in the DOM generate console warnings but don't break the application.

**Fixed Window Dimensions**: The window size is locked (no resize) to maintain consistent positioning - critical since all elements use absolute pixel coordinates rather than responsive units.

## Adding New UI Elements

1. Add element to `index.html` with unique ID and `ui-element` class
2. Add corresponding entry to `layout.json` with x/y coordinates
3. Reload application (F5) to apply layout
