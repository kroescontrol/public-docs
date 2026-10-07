// MDX-toets voor agent-taken (task849, security ed420d8e en daarna).
// Ontleedt een .mdx-bestand met dezelfde parser als de build (remark-parse + remark-mdx, de motor van @mdx-js/mdx 3)
// en laat alleen een kleine lijst toe. VOERT NIETS UIT: alleen ontleden en de boom lezen.
//
// Toegestaan:
//  - import { A, B } from 'lucide-react'  (alleen PascalCase-namen, geen alias, geen default, geen namespace)
//  - JSX: de geïmporteerde lucide-iconen (attributen: className, size, strokeWidth) en de HTML-elementen
//    br, span, div, p, strong, em, code (alleen className); waarden een tekenreeks of een getal
//  - {/* één commentaar */} als enige inhoud van een expressie
//  - Markdown: plaatjes alleen met een relatief pad (geen schema, geen //), links niet naar javascript:, data:, vbscript:
// Al het andere is rood: export, andere imports, expressies, spreads, onbekende of kleine-letter-elementen, <style>, <script>.
// Kan het bestand niet ontleed worden, dan rood (niet kunnen meten is niet groen).
//
// Gebruik: node toets.mjs <bestand.mdx> [...]      exit 0 groen, 1 rood, 2 kon niet meten
import { readFileSync } from 'node:fs'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { visit } from 'unist-util-visit'

const HTML_OK = new Set(['br', 'span', 'div', 'p', 'strong', 'em', 'code'])
const ICOON_ATTR = new Set(['className', 'size', 'strokeWidth'])
const HTML_ATTR = new Set(['className'])
const NAAM = /^[A-Z][A-Za-z0-9]*$/
const ENKEL_COMMENTAAR = /^\/\*(?:(?!\*\/)[\s\S])*\*\/$/

const PLAATJE_PAD = /^(\.\/|\/)?[A-Za-z0-9_-]+([.\/][A-Za-z0-9_-]+)*\.(png|jpe?g|gif|svg|webp|avif)$/i
// Layout-klassen die een laag over de pagina leggen (phishing-vorm): fixed, absolute, sticky, inset-*, z-*, top-/left-/right-/bottom-*
const LAYOUT_KLASSE = /^-?(fixed|absolute|sticky|inset|z|top|left|right|bottom)(-|$)/

function urlFout(url, soort) {
  const u = String(url ?? '').trim()
  if (/^(javascript|data|vbscript)\s*:/i.test(u)) return `${soort} met een gevaarlijk schema`
  if (soort === 'plaatje') {
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith('//')) return 'extern plaatje'
    if (u.split('/').includes('..') || u.includes('..')) return 'plaatje buiten de map (..)'
    // Nextra maakt van een relatief plaatje een import van dat bestand: alleen een gewoon pad naar een plaatjesbestand
    if (!PLAATJE_PAD.test(u)) return 'plaatje met een pad dat niet is toegestaan'
  }
  return null
}

function klasseFout(waarde) {
  // Een verbodslijst op Tailwind is niet dicht te krijgen (security 04-10: [position:fixed], !fixed, md:!fixed,
  // [inset:0] en [z-index:9999] gingen erdoor). Daarom omgedraaid: na het weghalen van varianten (alles tot de
  // laatste ':' buiten haken) mag een klasse alleen uit kleine letters, cijfers en streepjes bestaan. Geen [ ] ! / .
  // De lijst met layout-klassen blijft er bovenop.
  for (const t of String(waarde).split(/\s+/).filter(Boolean)) {
    if (/[\[\]!\/]/.test(t)) return `className met een teken dat niet is toegestaan (${t})`
    const kaal = t.slice(t.lastIndexOf(':') + 1)
    if (!/^-?[a-z0-9-]+$/.test(kaal)) return `className met een vorm die niet is toegestaan (${t})`
    if (LAYOUT_KLASSE.test(kaal)) return `className met een layout-klasse die een laag over de pagina legt (${t})`
  }
  return null
}

export function toetsTekst(tekst) {
  const rood = []
  let boom
  try {
    boom = unified().use(remarkParse).use(remarkMdx).parse(tekst)
  } catch (e) {
    return { rood: [`kon niet ontleed worden: ${String(e.message).split('\n')[0]}`], gemeten: false }
  }
  const iconen = new Set()
  visit(boom, (n) => {
    switch (n.type) {
      case 'mdxjsEsm': {
        const est = n.data && n.data.estree
        if (!est) { rood.push('import of export zonder boom'); break }
        for (const s of est.body) {
          const ok = s.type === 'ImportDeclaration'
            && s.source.value === 'lucide-react'
            && s.specifiers.length > 0
            && s.specifiers.every((x) => x.type === 'ImportSpecifier' && x.imported.name === x.local.name && NAAM.test(x.local.name))
          if (!ok) rood.push(`niet toegestane ${s.type === 'ImportDeclaration' ? 'import van ' + JSON.stringify(s.source.value) : s.type}`)
          else s.specifiers.forEach((x) => iconen.add(x.local.name))
        }
        break
      }
      case 'mdxFlowExpression':
      case 'mdxTextExpression':
        if (!ENKEL_COMMENTAAR.test(String(n.value).trim())) rood.push('expressie tussen accolades')
        break
      case 'mdxJsxFlowElement':
      case 'mdxJsxTextElement': {
        const naam = n.name
        if (naam === null) { rood.push('fragment'); break }   // <></>
        const icoon = iconen.has(naam)
        if (!icoon && !HTML_OK.has(naam)) { rood.push(`element <${naam}> niet toegestaan`); break }
        const toegestaan = icoon ? ICOON_ATTR : HTML_ATTR
        for (const a of n.attributes) {
          if (a.type !== 'mdxJsxAttribute') { rood.push(`spreadattribuut op <${naam}>`); continue }
          if (!toegestaan.has(a.name)) { rood.push(`attribuut ${a.name} op <${naam}> niet toegestaan`); continue }
          const w = a.value
          if (typeof w === 'string') { if (a.name === 'className') { const f = klasseFout(w); if (f) rood.push(f) } continue }
          if (w === null) continue   // booleaanse attribuutvorm
          const est = w.data && w.data.estree
          const e = est && est.body.length === 1 && est.body[0].type === 'ExpressionStatement' ? est.body[0].expression : null
          const getal = e && ((e.type === 'Literal' && typeof e.value === 'number')
            || (e.type === 'UnaryExpression' && e.operator === '-' && e.argument.type === 'Literal' && typeof e.argument.value === 'number'))
          if (!getal) rood.push(`attribuut ${a.name} op <${naam}> is geen tekenreeks of getal`)
        }
        break
      }
      case 'image': case 'link': case 'definition': {
        const soort = n.type === 'image' ? 'plaatje' : 'link'
        const f = urlFout(n.url, soort)
        if (f) rood.push(f)
        break
      }
      case 'imageReference':
        rood.push('plaatje met verwijzing')
        break
      case 'html':
        rood.push('ruwe HTML')
        break
    }
  })
  // een definitie die een plaatje-verwijzing nodig heeft staat al rood; extern plaatje via definitie:
  return { rood, gemeten: true }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const bestanden = process.argv.slice(2)
  if (bestanden.length === 0) { console.error('gebruik: node toets.mjs <bestand.mdx> ...'); process.exit(2) }
  let code = 0
  for (const f of bestanden) {
    let tekst
    try { tekst = readFileSync(f, 'utf8') } catch (e) { console.log(`ROOD  ${f}: kon niet lezen`); code = Math.max(code, 2); continue }
    const r = toetsTekst(tekst)
    if (!r.gemeten) { for (const x of r.rood) console.log(`ONGEMETEN ${f}: ${x}`); code = 2; continue }
    for (const x of r.rood) console.log(`ROOD  ${f}: ${x}`)
    if (r.rood.length && code < 1) code = 1
  }
  if (code === 0) console.log(`GROEN ${bestanden.length} bestand(en)`)
  process.exit(code)
}
