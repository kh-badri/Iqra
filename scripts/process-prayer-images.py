import os
from PIL import Image

BRAIN_DIR = r"C:\Users\khbad\.gemini\antigravity-cli\brain\e8190f76-dc73-49cb-a69c-5b9a51f28c0c"
DEST_DIR = r"C:\laragon\www\iqra\public\images\prayer"

os.makedirs(DEST_DIR, exist_ok=True)

MAPPINGS = {
    "qiyam": os.path.join(BRAIN_DIR, "qiyam_posture_3d_1792506968064.jpg"),
    "takbir": os.path.join(BRAIN_DIR, "takbiratul_ihram_3d_1792507065259.jpg"),
    "sedekap": os.path.join(BRAIN_DIR, "sholat_sedekap_3d_v2_1792507102323.jpg"),
    "ruku": os.path.join(BRAIN_DIR, "ruku_prayer_posture_perfect_1792507143016.jpg"),
    "itidal": os.path.join(BRAIN_DIR, "itidal_prayer_posture_1792507044348.jpg"),
    "sujud": os.path.join(BRAIN_DIR, "muslim_man_sujud_1792507191518.jpg"),
    "iftirasy": os.path.join(BRAIN_DIR, "sholat_tasyahud_tauhid_v2_1792507234048.jpg"),
    "tasyahud": os.path.join(BRAIN_DIR, "sholat_tasyahud_tauhid_1792507208454.jpg"),
    "salam": os.path.join(BRAIN_DIR, "muslim_man_salam_prayer_v2_1792507234361.jpg"),
}

TARGET_WIDTH = 960

for key, src_path in MAPPINGS.items():
    if not os.path.exists(src_path):
        print(f"Error: {src_path} not found!")
        continue

    with Image.open(src_path) as img:
        img = img.convert("RGB")
        w, h = img.size
        target_h = int((h / w) * TARGET_WIDTH)
        resized = img.resize((TARGET_WIDTH, target_h), Image.Resampling.LANCZOS)

        webp_path = os.path.join(DEST_DIR, f"{key}.webp")
        jpg_path = os.path.join(DEST_DIR, f"{key}.jpg")

        resized.save(webp_path, format="WEBP", quality=92, method=6)
        resized.save(jpg_path, format="JPEG", quality=90, optimize=True)

        size_kb = os.path.getsize(webp_path) / 1024
        print(f"Saved {key}: {TARGET_WIDTH}x{target_h} -> {webp_path} ({size_kb:.1f} KB)")

print("All prayer posture images processed successfully!")
