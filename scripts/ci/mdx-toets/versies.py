#!/usr/bin/env python3
"""Vergelijkt de versies van de MDX-ontleder in de toets (package-lock.json hier) met die van de build (pnpm-lock.yaml
in de root van de repo). Rood bij een verschil, zodat toets en build niet stil uit elkaar drijven als iemand Nextra
bijwerkt (nazorg security 04-10-2026). Alleen de pakketten die bepalen hoe MDX wordt ontleed.

  python3 scripts/ci/mdx-toets/versies.py [pnpm-lock.yaml] [package-lock.json]
Exit 0 gelijk, 1 verschil, 2 kon niet meten.
"""
import json
import os
import re
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
PRE = ("micromark-extension-mdx", "micromark-factory-mdx", "micromark-util-events-to-acorn", "mdast-util-mdx")
EXACT = {"remark-parse", "remark-mdx", "unified", "acorn", "acorn-jsx"}


def telt(naam):
    return naam in EXACT or naam.startswith(PRE)


def toets_lock(pad):
    d = json.load(open(pad, encoding="utf-8"))
    uit = {}
    for sleutel, v in d.get("packages", {}).items():
        if sleutel.startswith("node_modules/"):
            naam = sleutel.split("node_modules/")[-1]
            if telt(naam):
                uit[naam] = v["version"]
    return uit


def pnpm_lock(pad):
    """name@versie: onder packages: (twee spaties inspringing). Geeft {naam: {versies}}."""
    uit = {}
    rx = re.compile(r"^  '?((?:@[^/@]+/)?[^@'\s]+)@([0-9][^':\s]*)'?:\s*$")
    in_packages = False
    for r in open(pad, encoding="utf-8"):
        if r.startswith("packages:"):
            in_packages = True; continue
        if in_packages and r.strip() and not r.startswith(" "):
            in_packages = False
        if in_packages:
            m = rx.match(r.rstrip("\n"))
            if m and telt(m.group(1)):
                uit.setdefault(m.group(1), set()).add(m.group(2))
    return uit


def vergelijk(toets, bouw):
    rood = []
    if not toets:
        return ["geen pakketten in de lockfile van de toets gevonden: kan niet meten"]
    if not bouw:
        return ["geen MDX-pakketten in pnpm-lock.yaml gevonden: kan niet meten"]
    for naam, v in sorted(toets.items()):
        if naam in bouw and v not in bouw[naam]:
            rood.append("%s: toets %s, build %s" % (naam, v, "/".join(sorted(bouw[naam]))))
    for naam in sorted(EXACT - {"acorn", "acorn-jsx"}):
        if naam not in toets:
            rood.append("%s ontbreekt in de toets-lockfile" % naam)
        elif naam not in bouw:
            rood.append("%s staat niet in de pnpm-lock van de build" % naam)
    return rood


def zelftest():
    ok = True
    def eis(naam, w):
        nonlocal ok
        print("  %s %s" % ("ok  " if w else "STUK", naam)); ok &= bool(w)
    t = {"remark-mdx": "3.1.1", "remark-parse": "11.0.0", "unified": "11.0.5"}
    b = {"remark-mdx": {"3.1.1"}, "remark-parse": {"11.0.0"}, "unified": {"11.0.5"}}
    eis("gelijke versies zijn groen", vergelijk(t, b) == [])
    eis("een ander versienummer is rood", vergelijk({**t, "remark-mdx": "3.1.0"}, b) != [])
    eis("een extra versie in de build waar de toets bij hoort is groen", vergelijk(t, {**b, "unified": {"11.0.5", "11.0.4"}}) == [])
    eis("een ontbrekend kernpakket is rood", vergelijk({"remark-mdx": "3.1.1"}, b) != [])
    eis("een lege toets-lockfile is rood (niet te meten)", vergelijk({}, b) != [])
    eis("een lege pnpm-lock is rood (niet te meten)", vergelijk(t, {}) != [])
    print("self-test OK" if ok else "self-test STUK")
    return 0 if ok else 1


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(zelftest())
    pnpm = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HIER, "..", "..", "..", "pnpm-lock.yaml")
    plock = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HIER, "package-lock.json")
    try:
        rood = vergelijk(toets_lock(plock), pnpm_lock(pnpm))
    except Exception as e:
        print("::error::kon niet meten: %s" % e); sys.exit(2)
    for r in rood:
        print("ROOD  " + r)
    if rood:
        sys.exit(1)
    print("GELIJK: de MDX-ontleder van de toets komt overeen met de build")
