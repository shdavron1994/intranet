import json, wave, subprocess, re, sys
from piper import PiperVoice, SynthesisConfig
base = sys.argv[1]; cues_path = sys.argv[2]; outdir = sys.argv[3]
v = PiperVoice.load(f"{base}/voice/ru-irinia-medium.onnx", config_path=f"{base}/voice/ru-irinia-medium.onnx.json")
scenes = json.load(open(cues_path))
# small, formant-preserving shifts: big shifts are what made the voice sound like a robot
PITCH = {'Мама':1.0,'Тимур':1.06,'Лея':1.12,'Чистон':0.93,'Пиксель':1.03,'Хрум':0.86,'Кроссовки':1.12,'Рассказчик':1.0,'Песня':1.06,'Липучки':1.15}
SPEED = {'Рассказчик':1.12,'Чистон':1.05,'Хрум':1.15}
WARM = 'highpass=f=70,equalizer=f=250:t=q:w=1:g=2,equalizer=f=6500:t=q:w=1.5:g=-3,aecho=0.8:0.6:35:0.08'
def norm(t):
    t = t.replace('AR-очки','эй-ар очки').replace('Ску-у-учно','Скууучно').replace('«','').replace('»','')
    t = t.replace('Раз, два, три — и', 'Раз-два-три, и').replace(', раз, два, три', ' раз-два-три').replace(' — раз, два, три', ' раз-два-три').replace(' — ', ', ').replace('…', '... ').replace('?..','?')
    return t
def dur(f):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
def synth(text, out, who=''):
    cfg = SynthesisConfig(length_scale=SPEED.get(who, 1.0), noise_scale=0.8, noise_w_scale=0.9)
    with wave.open(out,'wb') as w: v.synthesize_wav(text, w, syn_config=cfg)
def shift(src, k, out):
    pf = f'rubberband=pitch={k}:formant=preserved,' if k != 1.0 else ''
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',src,'-af',pf+WARM,out],check=True)
report=[]; manifest=[]
for si,s in enumerate(scenes):
    cues=s['cues']
    for ci,c in enumerate(cues):
        st,en,who,text=c
        g = s['start'] + st
        later = [x['start']+y[0] for x in scenes for y in x['cues'] if x['start']+y[0] > g]
        avail = (min(later) if later else s['start']+s['dur']) - g - 0.15
        raw=f"{base}/voice/raw/c{si}_{ci}.wav"; synth(norm(text), raw, who)
        parts=[]
        if who in ('Все', 'Вещи'):
            for j,k in enumerate([1.06,1.12,0.93] if who=='Все' else [1.1,1.16,1.03]):
                pj=f"{base}/voice/raw/c{si}_{ci}_{j}.wav"; shift(raw,k,pj); parts.append(pj)
            mixed=f"{base}/voice/raw/c{si}_{ci}_s.wav"
            subprocess.run(['ffmpeg','-loglevel','error','-y','-i',parts[0],'-i',parts[1],'-i',parts[2],'-filter_complex','amix=inputs=3:normalize=0,volume=0.6',mixed],check=True)
        else:
            mixed=f"{base}/voice/raw/c{si}_{ci}_s.wav"; shift(raw,PITCH.get(who,1.0),mixed)
        d=dur(mixed); sp=1.0
        out=f"{outdir}/voice/c{si}_{ci}.mp3"
        subprocess.run(['ffmpeg','-loglevel','error','-y','-i',mixed,'-af',f'atempo={sp:.3f},loudnorm=I=-16:TP=-1.5','-ar','44100','-ac','1','-b:a','64k',out],check=True)
        fd=dur(out); manifest.append({'file':f'voice/c{si}_{ci}.mp3','si':si,'ci':ci,'len':round(fd,3)}); report.append((si,ci,who,round(d,2),round(avail,2),round(sp,2),round(fd,2), 'OVER' if fd>avail+0.05 else ''))
for r in report: print(*r)

json.dump(manifest, open(f'{outdir}/voice_manifest.json','w'))
