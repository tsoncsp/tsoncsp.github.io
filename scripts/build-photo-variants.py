"""Build portrait and landscape crops from the original downloaded photos (macOS sips)."""
import concurrent.futures
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / 'photo-data.js'
MARKER = 'window.HAWAII_PHOTOS = '
# Subject positions in the original photo, used to keep landmarks in the crop.
FOCUS = {
    'Hanauma Bay': (0.46, 0.53),
    'Honolulu Zoo': (0.55, 0.45),
    'International Market Place': (0.52, 0.38),
    'Kūhiō Beach Park': (0.52, 0.46),
    'Magic Island (Hawaii)': (0.52, 0.62),
    'Makapuʻu Point Light': (0.50, 0.37),
    'Nuʻuanu Pali': (0.35, 0.48),
    'Waimānalo, Hawaii': (0.40, 0.50),
    'Hālona Blowhole': (0.52, 0.50),
    'Kapiʻolani Park': (0.65, 0.60),
    'Sandy Beach, Hawaii': (0.49, 0.52),
    'Waikīkī': (0.52, 0.51),
    'Waikīkī Aquarium': (0.51, 0.43),
    'Kailua beach': (0.53, 0.60),
    'Live music': (0.64, 0.64),
    'Lighthouse walk': (0.55, 0.48),
    'Fireworks': (0.42, 0.40),
    'Kaimana': (0.43, 0.55),
    'Ahaaina': (0.52, 0.46),
    'Hyatt market': (0.51, 0.55),
    'Paina': (0.55, 0.44),
    'Ala Wai Canal': (0.53, 0.54),
}

def dimensions(filename):
    result = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(filename)], check=True, capture_output=True, text=True).stdout
    return tuple(int(re.search(rf'{key}: (\d+)', result)[1]) for key in ('pixelWidth', 'pixelHeight'))

def build(item):
    name, photo = item
    original = ROOT / photo['src']
    width, height = dimensions(original)
    focus_x, focus_y = FOCUS.get(name, (0.5, 0.5))
    for variant, ratio_x, ratio_y, max_unit in [('mobile', 9, 16, 80), ('desktop', 16, 9, 100)]:
        unit = min(width // ratio_x, height // ratio_y)
        crop_w, crop_h = ratio_x * unit, ratio_y * unit
        left = max(0, min(width - crop_w, round(width * focus_x - crop_w / 2)))
        top = max(0, min(height - crop_h, round(height * focus_y - crop_h / 2)))
        output = ROOT / 'assets' / 'photos' / variant / original.name
        output.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['sips', '--cropToHeightWidth', str(crop_h), str(crop_w), '--cropOffset', str(top), str(left), str(original), '--out', str(output)], check=True, capture_output=True)
        output_unit = min(unit, max_unit)
        output_w, output_h = ratio_x * output_unit, ratio_y * output_unit
        subprocess.run(['sips', '--resampleHeightWidth', str(output_h), str(output_w), '-s', 'format', 'jpeg', '-s', 'formatOptions', '78', str(output)], check=True, capture_output=True)
        assert dimensions(output) == (output_w, output_h), output
        photo[variant] = {'src': str(output.relative_to(ROOT)), 'width': output_w, 'height': output_h}
    return name, photo

if __name__ == '__main__':
    photos = json.loads(DATA.read_text().split(MARKER, 1)[1].rstrip(';\n'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        photos = dict(pool.map(build, photos.items()))
    DATA.write_text('// Destination photos sourced from the internet. Screen variants are cropped from the credited originals.\n' + MARKER + json.dumps(photos, ensure_ascii=False, indent=2) + ';\n')
    print(f'Built {len(photos)} portrait (9:16) and {len(photos)} landscape (16:9) variants; verified dimensions.')
