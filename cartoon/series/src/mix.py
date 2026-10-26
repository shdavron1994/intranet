import json, subprocess, sys
n = sys.argv[1]
sc = json.load(open(f'cues{n}.json'))
args = ['ffmpeg', '-loglevel', 'error', '-y', '-i', f'music{n}.wav']; fl = []; i = 0
for si, s in enumerate(sc):
    for ci, c in enumerate(s['cues']):
        args += ['-i', f'out{n}/voice/c{si}_{ci}.mp3']; d = int((s['start'] + c[0]) * 1000)
        fl.append(f'[{i+1}]adelay={d}|{d}[v{i}]'); i += 1
fl.append('[0]' + ''.join(f'[v{k}]' for k in range(i)) + f'amix=inputs={i+1}:normalize=0:duration=first,alimiter=limit=0.95[out]')
subprocess.run(args + ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '44100', f'mix{n}.wav'], check=True)
