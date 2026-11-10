# page.sh n [with2d] -> ep{n}_3d.html
n=$1; extra=""
if [ "$2" = "2d" ]; then extra='<canvas id="cv" width="1280" height="720" style="display:none"></canvas><script src="./lib2d.js"></script><script src="./lib2d2.js"></script><script src="./explain2d.js"></script>'; fi
cat > ep${n}_3d.html <<HTML
<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pangolin&display=swap">
<script type="importmap">{"imports":{"three":"./three.module.js"}}</script></head>
<body style="margin:0;background:#000"><canvas id="gl" width="1280" height="720" style="display:none"></canvas><canvas id="out" width="1280" height="720"></canvas>
$extra
<script type="module" src="./ep${n}_3d.js"></script></body></html>
HTML
