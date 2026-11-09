# stretch scenes so each voiced line fits: warp3d.py <cues.json> <voice_manifest.json> <out warp.json>
import json, sys
cues_path, man_path, out = sys.argv[1:4]
scenes = json.load(open(cues_path)); L = {(m['si'], m['ci']): m['len'] for m in json.load(open(man_path))}
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
json.dump(warp, open(out, 'w'))
print('warped scenes', len(warp), 'total', round(sum(s['dur'] for s in scenes), 1), '->', round(sum(s['dur'] for s in scenes) + sum(w[-1][1] - w[-1][0] for w in warp.values()), 1))
