#!/bin/bash
# full pipeline for one 3D episode: cues -> Silero voices -> warp -> render -> music -> mix -> mp4
set -e
n=$1; port=$2; S=/tmp/claude-0/-home-user-intranet/84066f47-4ffe-5045-a560-9cc8ed14f4d7/scratchpad
cd $S/s3d
rm -f warp3d_$n.json
node shots3d.js ep${n}_3d.html cq$n 0 > /dev/null
rm -rf v3d_$n; $S/silero_venv/bin/python make_silero.py $S/silero/v5_1_ru.pt cq${n}_cues.json v3d_$n 2>/dev/null | tail -1
python3 warp3d.py cq${n}_cues.json v3d_$n/voice_manifest.json warp3d_$n.json
node shots3d.js ep${n}_3d.html cw$n 0 > /dev/null
node export3d.js ep${n}_3d.html video3d_$n.mp4 24 $port | tail -1
node ../series/audio.js cw${n}_cues.json music3d_$n.wav
python3 mix3d.py cw${n}_cues.json music3d_$n.wav v3d_$n/voice mix3d_$n.wav
mkdir -p /home/user/intranet/cartoon/3d
ffmpeg -loglevel error -y -i video3d_$n.mp4 -i mix3d_$n.wav -c:v copy -c:a aac -b:a 160k -shortest /home/user/intranet/cartoon/3d/chiston-3d-ep$n.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 /home/user/intranet/cartoon/3d/chiston-3d-ep$n.mp4
