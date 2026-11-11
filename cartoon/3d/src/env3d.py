# loudness envelopes for lip sync: env3d.py <voice_manifest.json> <voice dir root> <out.json>
import json, subprocess, sys
import numpy as np
man, root, out = sys.argv[1:4]; FPS = 24; SR = 16000; res = {}
for m in json.load(open(man)):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f"{root}/{m['file']}", '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768; hop = SR // FPS
    n = len(a) // hop + 1; rms = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2)) if len(a[i * hop:(i + 1) * hop]) else 0 for i in range(n)])
    ref = np.percentile(rms[rms > 0], 95) if (rms > 0).any() else 1
    v = np.clip((rms / (ref + 1e-9) - .12) / .88, 0, 1)
    # quick open, slightly slower close, so the mouth reads clearly
    s = np.zeros_like(v); p = 0
    for i, x in enumerate(v): p = x if x > p else p * .55 + x * .45; s[i] = p
    res[f"{m['si']}_{m['ci']}"] = [round(float(x), 2) for x in s]
json.dump(res, open(out, 'w'))
print('envelopes', len(res))
