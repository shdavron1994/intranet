import re, sys
head = open('head_orig.html').read()
EP = {
 1: dict(title='Чистон: Вещи сбежали', h1='Серия 1. Вещи сбежали',
   lead='Мама будит Дилшода и Томирис, а Дилшод сразу хватает планшет. Планшет ругается на грязные руки и беспорядок, и вещи убегают. Чистон даёт план утреннего героя: зубы, умыться, зарядка, вещи по местам, одеться.'),
 2: dict(title='Чистон: Завтрак', h1='Серия 2. Завтрак',
   lead='Дилшод смотрит в телефон за завтраком, и Чистон объясняет, почему устают глаза. Потом он поперхнулся, и Чистон показывает, почему нельзя говорить с полным ртом. В конце дети моют руки и едут в садик.'),
}
n = int(sys.argv[1]); e = EP[n]
h = head.replace('<title>Чистон. Перезагрузка</title>', f"<title>{e['title']}</title>")
h = h.replace('<div class="eyebrow">Прототип-аниматик · по мотивам темы гигиены</div>', '<div class="eyebrow">Мультфильм «Чистон» · прототип</div>')
h = h.replace('<h1>Чистон. Перезагрузка</h1>', f"<h1>{e['h1']}</h1>")
h = re.sub(r'<p class="lead">.*?</p>', f'<p class="lead">{e["lead"]}</p>', h, flags=re.S)
h = h.replace('aria-label="Мультфильм «Чистон. Перезагрузка»"', f'aria-label="Мультфильм «Чистон». {e["h1"]}"')
h = re.sub(r'<section class="notes">.*?</section>', '''<section class="notes">
    <div class="note">
      <h3>Как смотреть</h3>
      <ul>
        <li>Нажмите ▶ и включите звук.</li>
        <li>Сцены можно переключать кнопками выше.</li>
        <li>Голос синтезированный, его можно выключить: субтитры останутся.</li>
      </ul>
    </div>
    <div class="note">
      <h3>Это прототип</h3>
      <ul>
        <li>Анимация простая, это раскадровка в движении.</li>
        <li>Все роли озвучивает один синтезированный голос. Живые голоса можно вставить вместо него.</li>
      </ul>
    </div>
  </section>''', h, flags=re.S)
import os
warp = open(f'warp{n}.json').read() if os.path.exists(f'warp{n}.json') else '{}'
js = f'const WARP = {warp};\n' + open('lib.js').read() + '\n' + open('lib2.js').read() + '\n' + open(f'ep{n}.js').read() + '\n' + open('engine.js').read()
js = js.replace("const PITCH = { 'Тимур': 1.45,", "const PITCH = { 'Мама': 1.05, 'Вещи': 1.7, 'Дилшод': 1.45, 'Томирис': 1.85, 'Дети': 1.6, 'Тимур': 1.45,")
out = h + '\n<script>\n(() => {\n' + js + '\n})();\n</script>\n'
open(f'ep{n}.html', 'w').write(out)
print('built', n, len(out))
