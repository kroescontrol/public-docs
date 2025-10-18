#!/usr/bin/env python3
"""
Generate OpenGraph image (1200x630px) with white background and centered logo.
"""
from PIL import Image
import os

# Paths
LOGO_PATH = "public/branding/logo/png/kc-logo-gradientkleur.png"
OUTPUT_PATH = "public/og-image.png"

# OG image standard dimensions
OG_WIDTH = 1200
OG_HEIGHT = 630

def generate_og_image():
    """Generate OG image with white background and centered logo."""

    # Create white background
    og_image = Image.new('RGB', (OG_WIDTH, OG_HEIGHT), 'white')

    # Open logo
    logo = Image.open(LOGO_PATH)

    # Calculate logo size (maintain aspect ratio, fit within 70% of canvas)
    max_logo_width = int(OG_WIDTH * 0.7)
    max_logo_height = int(OG_HEIGHT * 0.7)

    logo_ratio = logo.width / logo.height

    if logo_ratio > (max_logo_width / max_logo_height):
        # Logo is wider - fit to width
        new_width = max_logo_width
        new_height = int(new_width / logo_ratio)
    else:
        # Logo is taller - fit to height
        new_height = max_logo_height
        new_width = int(new_height * logo_ratio)

    # Resize logo
    logo_resized = logo.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Calculate position to center logo
    x = (OG_WIDTH - new_width) // 2
    y = (OG_HEIGHT - new_height) // 2

    # Paste logo onto white background (with alpha channel if present)
    if logo_resized.mode == 'RGBA':
        og_image.paste(logo_resized, (x, y), logo_resized)
    else:
        og_image.paste(logo_resized, (x, y))

    # Save as PNG
    og_image.save(OUTPUT_PATH, 'PNG', optimize=True)

    # Get file size
    file_size = os.path.getsize(OUTPUT_PATH)
    file_size_kb = file_size / 1024

    print(f"✅ OG image generated successfully!")
    print(f"   Output: {OUTPUT_PATH}")
    print(f"   Size: {OG_WIDTH}x{OG_HEIGHT}px")
    print(f"   File size: {file_size_kb:.1f} KB")
    print(f"   Logo size: {new_width}x{new_height}px")

    if file_size_kb > 500:
        print(f"⚠️  Warning: File size exceeds 500KB recommendation")
    else:
        print(f"✅ File size within recommendation (<500KB)")

if __name__ == "__main__":
    generate_og_image()
