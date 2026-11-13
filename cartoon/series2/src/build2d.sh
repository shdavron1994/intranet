#!/bin/bash
# 2D v2 episode: Silero voices -> warp -> lip-sync envelopes -> page -> frames -> music -> mix -> mp4
set -e
n=$1; S=/tmp/claude-0/-home-user-intranet/84066f47-4ffe-5045-a560-9cc8ed14f4d7/scratchpad; cd $S/s2
if [ ! -f v$n/voice_manifest.json ]; then rm -rf v$n; $S/silero_venv/bin/python $S/s3d/make_silero.py $S/silero/v5_1_ru.pt cues${n}_orig.json v$n 2>/dev/null | tail -1; fi
python3 $S/s3d/warp3d.py cues${n}_orig.json v$n/voice_manifest.json warp$n.json
$S/silero_venv/bin/python $S/s3d/env3d.py v$n/voice_manifest.json v$n env$n.json
python3 build2.py $n
node shotv2.js v2ep$n.html dump$n 1 | tail -1
node export.js v2ep$n.html v2video$n.mp4 | tail -1
node $S/series/audio.js dump${n}_scenes.json v2music$n.wav
python3 $S/s3d/mix3d.py dump${n}_scenes.json v2music$n.wav v$n/voice v2mix$n.wav
ffmpeg -loglevel error -y -i v2video$n.mp4 -i v2mix$n.wav -c:v copy -c:a aac -b:a 160k -shortest /home/user/intranet/cartoon/series2/chiston-v2-ep$n.mp4
echo "ep$n done $(ffprobe -v error -show_entries format=duration -of csv=p=0 /home/user/intranet/cartoon/series2/chiston-v2-ep$n.mp4)"
