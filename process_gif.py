
import sys
import urllib.request
import os

def process_gif():
    try:
        from PIL import Image, ImageSequence
        print("PIL found. Processing GIF...")
    except ImportError:
        print("PIL missing. Cannot process GIF.")
        return

    url = "https://davidzapata.es/proyectos-beta/moon-bloom/Studio-de-imagen-y-belleza-boadilla-del-monte-moon-boom-ezgif.com-speed.gif"
    input_path = "original_bg.gif"
    output_path = "bg_fast.gif"

    # Download
    print(f"Downloading {url}...")
    urllib.request.urlretrieve(url, input_path)

    # Process
    try:
        with Image.open(input_path) as im:
            frames = []
            durations = []
            
            for frame in ImageSequence.Iterator(im):
                frames.append(frame.copy())
                # Original duration is likely per-frame or global. 
                # We want 1/3 of the duration (3x speed).
                original_duration = frame.info.get('duration', 100)
                new_duration = max(20, int(original_duration / 3)) # Min 20ms to avoid browser issues
                durations.append(new_duration)

            print(f"Accelerating {len(frames)} frames. New duration avg: {sum(durations)/len(durations)}ms")
            
            # Save
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                loop=0,
                duration=durations,
                disposal=2 
            )
            print(f"Saved to {output_path}")

    except Exception as e:
        print(f"Error processing GIF: {e}")

if __name__ == "__main__":
    process_gif()
