import json, wave, subprocess, re, sys
from piper import PiperVoice
base = sys.argv[1]
v = PiperVoice.load(f"{base}/voice/ru-irinia-medium.onnx", config_path=f"{base}/voice/ru-irinia-medium.onnx.json")
scenes = json.load(open(f"{base}/cartoon/cues.json"))
PITCH = {'Тимур':1.14,'Лея':1.32,'Чистон':0.8,'Пиксель':1.24,'Хрум':0.72,'Кроссовки':1.42,'Рассказчик':1.0,'Песня':1.14,'Липучки':1.5}
def norm(t):
    t = t.replace('AR-очки','эй-ар очки').replace('Ску-у-учно','Скууучно').replace('«','').replace('»','')
    t = t.replace('Раз, два, три — и', 'Раз-два-три, и').replace(', раз, два, три', ' раз-два-три').replace(' — раз, два, три', ' раз-два-три').replace(' — ', ', ').replace('…', '... ').replace('?..','?')
    return t
def dur(f):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
def synth(text, out):
    with wave.open(out,'wb') as w: v.synthesize_wav(text, w)
def shift(src, k, out):
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',src,'-af',f'asetrate={int(22050*k)},aresample=22050,atempo={1/k:.4f}',out],check=True)
report=[]; manifest=[]
for si,s in enumerate(scenes):
    cues=s['cues']
    for ci,c in enumerate(cues):
        st,en,who,text=c
        g = s['start'] + st
        later = [x['start']+y[0] for x in scenes for y in x['cues'] if x['start']+y[0] > g]
        avail = (min(later) if later else s['start']+s['dur']) - g - 0.15
        raw=f"{base}/voice/raw/c{si}_{ci}.wav"; synth(norm(text), raw)
        parts=[]
        if who=='Все':
            for j,k in enumerate([1.14,1.32,0.8]):
                pj=f"{base}/voice/raw/c{si}_{ci}_{j}.wav"; shift(raw,k,pj); parts.append(pj)
            mixed=f"{base}/voice/raw/c{si}_{ci}_s.wav"
            subprocess.run(['ffmpeg','-loglevel','error','-y','-i',parts[0],'-i',parts[1],'-i',parts[2],'-filter_complex','amix=inputs=3:normalize=0,volume=0.6',mixed],check=True)
        else:
            mixed=f"{base}/voice/raw/c{si}_{ci}_s.wav"; shift(raw,PITCH.get(who,1.0),mixed)
        d=dur(mixed); sp=min(1.2,max(1.0,d/avail))
        out=f"{base}/cartoon/voice/c{si}_{ci}.mp3"
        subprocess.run(['ffmpeg','-loglevel','error','-y','-i',mixed,'-af',f'atempo={sp:.3f},loudnorm=I=-16:TP=-1.5','-ar','44100','-ac','1','-b:a','64k',out],check=True)
        fd=dur(out); manifest.append({'file':f'voice/c{si}_{ci}.mp3','at':round(g,3)}); report.append((si,ci,who,round(d,2),round(avail,2),round(sp,2),round(fd,2), 'OVER' if fd>avail+0.05 else ''))
for r in report: print(*r)

json.dump(manifest, open(f'{base}/cartoon/voice_manifest.json','w'))
