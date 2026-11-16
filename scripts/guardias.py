"""Farmacias de guardia de Tenerife -> src/data/guardias.json

Fuente: Colegio Oficial de Farmacéuticos de Santa Cruz de Tenerife (coftenerife.es).
El COF publica cada mes un PDF de turnos por zona. Este script descarga los PDF de
las zonas de Tenerife del mes actual (y del siguiente si ya existe), lee las filas
"N día 09:00h a 23:59h" con sus coordenadas y extrae farmacéutico, dirección y
teléfono de cada turno. Si una zona no se puede leer con seguridad (faltan días,
formato distinto), se guarda sin turnos y la web muestra solo el enlace al PDF.

Uso: python scripts/guardias.py [salida.json]
"""
import json
import re
import os
import sys
import unicodedata
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import pymupdf

BASE = "https://www.coftenerife.es"
UA = "TenerifeDiceBot/1.0 (+https://tenerifedice.com)"

# Zonas de la isla de Tenerife (el COF también publica La Palma, La Gomera y El Hierro).
TENERIFE = re.compile(
    r"ADEJE|ARICO|BUENAVISTA|CANDELARIA|GARACHICO|GUIA DE ISORA|G.IMAR|ICOD|LA CUESTA|"
    r"LA GUANCHA|LA MATANZA|LA OROTAVA|PUERTO DE LA CRUZ|SAN CRISTOBAL DE LA LAGUNA|"
    r"SAN MIGUEL|SANTA CRUZ DE TENERIFE|^TACO$|VALLE GUERRA",
    re.I,
)


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    return data if binary else data.decode("latin-1")


def zonas(mes, anio):
    raw = get(f"{BASE}/wp-admin/admin-ajax.php?action=getguardias&fecha={mes:02d}|{anio}")
    d = json.loads(raw)
    if int(d.get("Mes", 0)) != mes:
        return []
    return [z["zona"] for z in d.get("data", []) if TENERIFE.search(z["zona"])]


def pdf_url(zona, mes, anio):
    q = urllib.parse.quote(f"{zona}/{anio}/{mes:02d}", safe="/", encoding="latin-1")
    return f"{BASE}/wp-admin/admin-post.php?action=getPdf&guardias={q}"


def descargar_pdf(zona, mes, anio):
    html = get(pdf_url(zona, mes, anio))
    m = re.search(r"file=([^'\"]+\.pdf)", html)
    if not m:
        return None
    return get(f"{BASE}/wp-content/plugins/pdfjs-viewer-shortcode/pdfjs/web/{m.group(1)}", binary=True)


def lineas(page):
    out = []
    for b in page.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            t = " ".join("".join(s["text"] for s in l["spans"]).split())
            if t:
                x0, y0, x1, y1 = l["bbox"]
                out.append({"x": x0, "y": y0, "t": t})
    return out


def limpiar_tel(t):
    m = re.search(r"\(?(\d{3})[-\s.]?(\d{2,3})[-\s.]?(\d{2})[-\s.]?(\d{2,3})\)?", t)
    return " ".join(m.groups()) if m else ""


def parsear(pdf_bytes, ndias, motivo=None):
    """Devuelve {dia: {titular, direccion, telefono, horario}} o None si el formato no cuadra."""
    def fallo(m):
        if motivo is not None:
            motivo.append(m)
        return None

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    ls = lineas(doc[0])
    texto = " ".join(l["t"] for l in ls).upper()
    if "GUARDIA" not in texto:
        return fallo("sin cabecera de guardia")
    # Cada turno empieza con una línea "Lcd..." en la columna central, a la altura de
    # la etiqueta del día ("1 dom") y de su horario ("09:00h a 23:59h").
    anclas = sorted([l for l in ls if 120 <= l["x"] < 450 and re.match(r"Lcd", l["t"])], key=lambda l: l["y"])
    filas = []
    for a in anclas:
        et = [e for e in ls if e["x"] < 50 and abs(e["y"] - a["y"]) < 2.5 and re.fullmatch(r"\d{1,2} \S{3}", e["t"])]
        hor = [h for h in ls if 45 <= h["x"] < 120 and abs(h["y"] - a["y"]) < 2.5]
        if len(et) != 1 or len(hor) != 1:
            return fallo(f"fila sin día/horario: {a['t'][:40]}")
        mh = re.fullmatch(r"(\d{2}):(\d{2})h a (\d{2}):(\d{2})h", hor[0]["t"])
        if not mh:
            return fallo(f"horario raro: {hor[0]['t']}")
        filas.append((int(et[0]["t"].split()[0]), a, mh.groups()))
    dias = [f[0] for f in filas]
    if dias != list(range(1, ndias + 1)):
        return fallo(f"días {dias[:8]}... ({len(dias)})")
    turnos = {}
    for i, (dia, a, (h1, m1, h2, m2)) in enumerate(filas):
        y = a["y"]
        y_fin = filas[i + 1][1]["y"] if i + 1 < len(filas) else y + 30
        bloque = sorted([l for l in ls if 120 <= l["x"] < 450 and y - 2.5 <= l["y"] < y_fin - 2.5], key=lambda l: l["y"])
        tels = [l for l in ls if l["x"] >= 450 and abs(l["y"] - y) < 2.5 and limpiar_tel(l["t"])]
        if len(bloque) < 2 or len(tels) != 1:
            return fallo(f"día {dia}: bloque={len(bloque)} tels={len(tels)}")
        horario = "24 horas (de 9:00 a 9:00 del día siguiente)" if (h1, m1, h2, m2) == ("09", "00", "23", "59") else f"de {int(h1)}:{m1} a {int(h2)}:{m2}"
        turnos[dia] = {
            "titular": bloque[0]["t"],
            "direccion": " ".join(l["t"] for l in bloque[1:]),
            "telefono": limpiar_tel(tels[0]["t"]),
            "horario": horario,
        }
    return turnos


def fijas_santa_cruz(pdf_bytes):
    """Santa Cruz no rota: farmacia de guardia fija 24 h (el resto son horarios ampliados)."""
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    t = doc[0].get_text()
    m = re.search(r"([^\n]+)\n\s*Tel\S{1,2}fono:\s*([\d ]+)\n\s*(Lcd[^\n]+)\n\s*Horario de guardia:\s*24\s*H", t)
    if not m:
        return None
    direccion = m.group(1).strip()
    if "�" in direccion:  # acentos mal codificados en el PDF: mejor solo el enlace
        return None
    titular = re.sub(r"^(Lcd[oa]s?\.?)\s*:\s*", r"\1 ", m.group(3).strip())
    return {
        "titular": "" if "�" in titular else titular,
        "direccion": direccion,
        "telefono": " ".join(m.group(2).split()),
        "horario": "24 horas, todos los días",
    }


def main():
    salida = sys.argv[1] if len(sys.argv) > 1 else "src/data/guardias.json"
    try:
        tz = ZoneInfo("Atlantic/Canary")
    except Exception:  # noqa: BLE001  (Windows sin tzdata: Canarias = UTC en invierno)
        tz = timezone.utc
    ahora = datetime.now(tz)
    meses = [(ahora.month, ahora.year)]
    sig = (ahora.replace(day=1) + timedelta(days=32))
    meses.append((sig.month, sig.year))
    resultado = {"generado": ahora.isoformat(timespec="minutes"), "fuente": f"{BASE}/ciudadanos/farmacias-de-guardia/", "zonas": {}}
    for mes, anio in meses:
        try:
            lista = zonas(mes, anio)
        except Exception as e:  # noqa: BLE001
            print(f"[guardias] lista {mes}/{anio}: {e}")
            continue
        ndias = ((datetime(anio + (mes == 12), mes % 12 + 1, 1)) - timedelta(days=1)).day
        for z in lista:
            ascii_ = unicodedata.normalize("NFKD", z.lower()).encode("ascii", "ignore").decode()
            clave = re.sub(r"[^a-z0-9]+", "-", ascii_).strip("-")
            zona = resultado["zonas"].setdefault(clave, {"nombre": z.strip(), "pdf": {}, "turnos": {}, "fija": None})
            try:
                pdf = descargar_pdf(z, mes, anio)
                if not pdf:
                    if not zona["pdf"]:
                        del resultado["zonas"][clave]
                    continue
                zona["pdf"][f"{anio}-{mes:02d}"] = pdf_url(z, mes, anio)
                if z.upper() == "SANTA CRUZ DE TENERIFE":
                    zona["fija"] = fijas_santa_cruz(pdf)
                    print(f"[guardias] {z} {mes}/{anio}: fija={'ok' if zona['fija'] else 'NO'}")
                    continue
                motivo = []
                turnos = parsear(pdf, ndias, motivo)
                if turnos is None:
                    print(f"[guardias] {z} {mes}/{anio}: formato no reconocido ({'; '.join(motivo)}), solo enlace")
                    continue
                for dia, t in turnos.items():
                    zona["turnos"][f"{anio}-{mes:02d}-{dia:02d}"] = t
                print(f"[guardias] {z} {mes}/{anio}: {len(turnos)} días")
            except Exception as e:  # noqa: BLE001
                print(f"[guardias] {z} {mes}/{anio}: error {e}")
    os.makedirs(os.path.dirname(salida) or ".", exist_ok=True)
    with open(salida, "w", encoding="utf-8") as f:
        json.dump(resultado, f, ensure_ascii=False, indent=1)
    ok = sum(1 for z in resultado["zonas"].values() if z["turnos"] or z["fija"])
    print(f"[guardias] {ok}/{len(resultado['zonas'])} zonas con datos -> {salida}")


if __name__ == "__main__":
    main()
