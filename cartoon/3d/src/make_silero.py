# Voice every cue with Silero TTS (natural Russian voices), one voice per character.
# usage: make_silero.py <model.pt> <cues.json> <outdir>
import json, os, subprocess, sys, wave
import numpy as np
import torch

model_path, cues_path, outdir = sys.argv[1:4]
torch.set_num_threads(4)
model = torch.package.PackageImporter(model_path).load_pickle('tts_models', 'model')
model.to('cpu')
SR = 48000

# character -> list of (speaker, pitch, rate); several entries = chorus
CAST = {
    'Мама': [('baya', 'medium', 'medium')],
    'Папа': [('aidar', 'low', 'medium')],
    'Рассказчик': [('eugene', 'medium', 'slow')],
    'Чистон': [('aidar', 'high', 'medium')],
    'Дилшод': [('xenia', 'x-high', 'medium')],
    'Томирис': [('kseniya', 'x-high', 'medium')],
    'Пиксель': [('xenia', 'high', 'fast')],
    'Вещи': [('kseniya', 'x-high', 'fast'), ('xenia', 'x-high', 'fast')],
    'Дети': [('xenia', 'x-high', 'medium'), ('kseniya', 'x-high', 'medium')],
    'Песня': [('xenia', 'x-high', 'medium'), ('kseniya', 'x-high', 'medium')],
    'Мальчик': [('eugene', 'x-high', 'medium')], 'Девочка': [('kseniya', 'x-high', 'medium')],
    'Ведущий': [('kseniya', 'medium', 'medium')], 'Липучки': [('xenia', 'x-high', 'fast')], 'Кроссовки': [('kseniya', 'x-high', 'fast')],
    'Все': [('xenia', 'x-high', 'medium'), ('kseniya', 'x-high', 'medium'), ('baya', 'medium', 'medium'), ('aidar', 'medium', 'medium')],
}

def clean(t):
    return t.replace('«', '').replace('»', '').replace('…', '...').replace('—', ',').replace('  ', ' ')

def synth(text, speaker, pitch, rate):
    ssml = f'<speak><prosody pitch="{pitch}" rate="{rate}">{text}</prosody></speak>'
    try:
        a = model.apply_tts(ssml_text=ssml, speaker=speaker, sample_rate=SR, put_accent=True, put_yo=True)
    except Exception:
        a = model.apply_tts(text=text, speaker=speaker, sample_rate=SR, put_accent=True, put_yo=True)
    return a.numpy()

def write_wav(path, a):
    a = np.clip(a, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a * 32000).astype(np.int16).tobytes())

def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

os.makedirs(f'{outdir}/voice', exist_ok=True); os.makedirs(f'{outdir}/raw', exist_ok=True)
scenes = json.load(open(cues_path)); manifest = []
for si, s in enumerate(scenes):
    for ci, c in enumerate(s['cues']):
        who, text = c[2], clean(c[3])
        parts = [synth(text, *v) for v in CAST.get(who, [('eugene', 'medium', 'medium')])]
        n = max(len(p) for p in parts)
        mix = sum(np.pad(p, (0, n - len(p))) for p in parts) / (1 if len(parts) == 1 else len(parts) ** .7)
        raw = f'{outdir}/raw/c{si}_{ci}.wav'; write_wav(raw, mix)
        out = f'{outdir}/voice/c{si}_{ci}.mp3'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5', '-ar', '44100', '-ac', '1', '-b:a', '80k', out], check=True)
        manifest.append({'file': f'voice/c{si}_{ci}.mp3', 'si': si, 'ci': ci, 'len': round(dur(out), 3)})
        print(si, ci, who, manifest[-1]['len'], flush=True)
json.dump(manifest, open(f'{outdir}/voice_manifest.json', 'w'))
