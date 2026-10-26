import json, sys
n = sys.argv[1]
scenes = json.load(open(f'cues{n}_orig.json')); man = json.load(open(f'out{n}/voice_manifest.json'))
L = {(m['si'], m['ci']): m['len'] for m in man}
warp = {}
for si, s in enumerate(scenes):
    cues = s['cues']
    if not cues: continue
    bounds = sorted(set([0.0, s['dur']] + [c[0] for c in cues]))
    knots = [[0.0, 0.0]]; real = 0.0
    for a, b in zip(bounds, bounds[1:]):
        need = b - a
        for ci, c in enumerate(cues):
            if abs(c[0] - a) < 1e-6: need = max(need, L[(si, ci)] + 0.3)
        real += need; knots.append([b, round(real, 3)])
    if any(abs(k[0] - k[1]) > 1e-3 for k in knots): warp[si] = knots
json.dump(warp, open(f'warp{n}.json', 'w'))
tot0 = sum(s['dur'] for s in scenes); tot1 = tot0 + sum(w[-1][1] - w[-1][0] for w in warp.values())
print('ep', n, 'scenes warped', len(warp), 'duration', round(tot0, 1), '->', round(tot1, 1))
