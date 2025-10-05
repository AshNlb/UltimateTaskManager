# Desktop App Icons

This directory contains the icon files for the TaskFlow desktop application.

## Current Icons

- `icon.svg` - Source SVG icon (512x512)

## Required Icon Formats

For production builds, you need to generate these formats from the SVG:

### Windows
- `icon.ico` - Contains multiple sizes (16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256)

### macOS
- `icon.icns` - Apple icon format (contains multiple sizes)

### Linux
- `icon.png` - PNG format (512x512 or 1024x1024 recommended)

## How to Generate Icons

### Option 1: Using Online Tools (Easiest)

1. **For .ico (Windows)**:
   - Go to https://convertico.com/
   - Upload `icon.svg`
   - Download as `icon.ico`
   - Place in this directory

2. **For .icns (macOS)**:
   - Go to https://cloudconvert.com/svg-to-icns
   - Upload `icon.svg`
   - Download as `icon.icns`
   - Place in this directory

3. **For .png (Linux)**:
   - Go to https://cloudconvert.com/svg-to-png
   - Upload `icon.svg`
   - Set size to 512x512 or 1024x1024
   - Download as `icon.png`
   - Place in this directory

### Option 2: Using electron-icon-builder (Automated)

```bash
# Install globally
npm install -g electron-icon-builder

# Generate all formats from SVG
electron-icon-builder --input=./icon.svg --output=./ --flatten
```

### Option 3: Manual Conversion

**For PNG**:
```bash
# Using ImageMagick
convert icon.svg -resize 512x512 icon.png
```

**For ICO** (Windows):
```bash
# Using ImageMagick
convert icon.svg -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

**For ICNS** (macOS - must run on macOS):
```bash
# 1. Create PNG at different sizes
mkdir icon.iconset
sips -z 16 16     icon.svg --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.svg --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.svg --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.svg --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.svg --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.svg --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.svg --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.svg --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.svg --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.svg --out icon.iconset/icon_512x512@2x.png

# 2. Convert to icns
iconutil -c icns icon.iconset
rm -rf icon.iconset
```

## Building Without Icons

If you want to build the app without custom icons (for testing), electron-builder will use default Electron icons. Just comment out the icon lines in `package.json`:

```json
"win": {
  // "icon": "assets/icon.ico"  // Comment this out
},
"mac": {
  // "icon": "assets/icon.icns"  // Comment this out
},
"linux": {
  // "icon": "assets/icon.png"  // Comment this out
}
```

## Customizing the Icon

To create your own icon:

1. Edit `icon.svg` in any vector graphics editor (Inkscape, Adobe Illustrator, Figma, etc.)
2. Keep the canvas size at 512x512 pixels
3. Use simple, bold shapes (avoid fine details that won't be visible at small sizes)
4. Test at small sizes (16x16, 32x32) to ensure clarity
5. Regenerate all formats after editing

## Icon Design Tips

- **Simple is better**: Icons should be recognizable at 16x16 pixels
- **High contrast**: Use colors that stand out
- **Avoid text**: Text becomes unreadable at small sizes
- **Square canvas**: Keep important elements in the center 80% of the canvas
- **Transparent background**: For PNG, use transparent background (SVG and ICO can have solid backgrounds)
