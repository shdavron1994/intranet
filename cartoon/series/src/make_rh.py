# Voice every cue with RHVoice (native Russian voices), one voice per character.
import json, subprocess, sys, os
rh = sys.argv[1]; cues_path = sys.argv[2]; outdir = sys.argv[3]
env = dict(os.environ, LD_LIBRARY_PATH=f'{rh}/inst/lib:{rh}/inst/lib64')
# character -> list of (voice, pitch %); several entries = chorus
CAST = {
  'Мама': [('arina', 100)], 'Рассказчик': [('aleksandr-hq', 100)], 'Чистон': [('pavel', 105)],
  'Дилшод': [('seva', 170)], 'Томирис': [('anna', 132)], 'Пиксель': [('umka', 118)],
  'Кроссовки': [('elena', 140)], 'Вещи': [('elena', 140), ('victoria', 150)], 'Липучки': [('elena', 150)],
  'Дети': [('seva', 170), ('anna', 132)], 'Песня': [('seva', 170), ('anna', 132)],
  'Все': [('seva', 170), ('anna', 132), ('arina', 100), ('pavel', 105)],
}
os.makedirs(f'{outdir}/voice', exist_ok=True); os.makedirs(f'{outdir}/raw', exist_ok=True)
def norm(t):
    return t.replace('«', '').replace('»', '').replace('…', '...').replace('Ску-у-учно', 'Скууучно')
def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
scenes = json.load(open(cues_path)); manifest = []
for si, s in enumerate(scenes):
    for ci, c in enumerate(s['cues']):
        who, text = c[2], norm(c[3])
        parts = []
        for j, (v, p) in enumerate(CAST.get(who, [('aleksandr-hq', 100)])):
            f = f'{outdir}/raw/c{si}_{ci}_{j}.wav'
            subprocess.run([f'{rh}/inst/bin/RHVoice-test', '-p', v, '-t', str(p), '-o', f], input=text.encode(), env=env, check=True)
            parts.append(f)
        out = f'{outdir}/voice/c{si}_{ci}.mp3'
        if len(parts) == 1:
            af = ['-i', parts[0], '-af', 'loudnorm=I=-16:TP=-1.5']
        else:
            ins = sum([['-i', p] for p in parts], [])
            af = ins + ['-filter_complex', f'{"".join(f"[{k}]" for k in range(len(parts)))}amix=inputs={len(parts)}:normalize=0,loudnorm=I=-16:TP=-1.5']
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y'] + af + ['-ar', '44100', '-ac', '1', '-b:a', '64k', out], check=True)
        manifest.append({'file': f'voice/c{si}_{ci}.mp3', 'si': si, 'ci': ci, 'len': round(dur(out), 3)})
json.dump(manifest, open(f'{outdir}/voice_manifest.json', 'w'))
print('clips', len(manifest))
