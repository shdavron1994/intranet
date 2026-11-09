# mix music + voice clips (+ scene clips) at warped times: mix3d.py <cues.json> <music.wav> <voice dir> <out.wav>
import json, subprocess, sys
cues_path, music, vdir, out = sys.argv[1:5]
sc = json.load(open(cues_path))
args = ['ffmpeg', '-loglevel', 'error', '-y', '-i', music]; fl = []; i = 0
for si, s in enumerate(sc):
    for ci, c in enumerate(s['cues']):
        args += ['-i', f'{vdir}/c{si}_{ci}.mp3']; d = int((s['start'] + c[0]) * 1000); fl.append(f'[{i+1}]adelay={d}|{d}[v{i}]'); i += 1
    if s.get('clip'):
        args += ['-i', s['clip']['file']]; d = int((s['start'] + s['clip']['at']) * 1000); fl.append(f'[{i+1}]adelay={d}|{d}[v{i}]'); i += 1
fl.append('[0]' + ''.join(f'[v{k}]' for k in range(i)) + f'amix=inputs={i+1}:normalize=0:duration=first,alimiter=limit=0.95[out]')
subprocess.run(args + ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '44100', out], check=True)
