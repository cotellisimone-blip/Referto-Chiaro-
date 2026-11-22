"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BellPlus, BookOpen, Check, FileDown, Loader2, Sparkles, Trash2 } from "lucide-react";
import { api } from "@/components/area/api";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { Ic } from "@/components/home-b/simboli";
import { PersonaSwitcher, useIsDemo, usePersone, type PersonaView } from "@/components/famiglia/shared";
import { SELF_ID } from "@/domain/famiglia/persone";
import { DIARI, DIARI_LIMITI, getDiario, type Diario, type DiarioSlug } from "@/domain/diari/catalogo";
import {
  INTENSITA,
  INTENSITA_AIUTO,
  MOMENTI_GLICEMIA,
  MOMENTI_RESPIRO,
  ORA_RE,
  QUALITA_SONNO,
  SINTOMI,
  buildDiarioIcs,
  dayOf,
  durataTesto,
  fascia,
  giornoBreve,
  kgTesto,
  minutiTra,
  nowAt,
  oreMinuti,
  periodo,
  riepilogoCefalea,
  riepilogoGlicemia,
  riepilogoPeso,
  riepilogoPressione,
  riepilogoRespiro,
  riepilogoSonno,
  scartoBreve,
  scartoTesto,
  rigaVoce,
  type Intensita,
  type MomentoGlicemia,
  type MomentoRespiro,
  type QualitaSonno,
  type Sintomo,
  type VoceDiario,
} from "@/domain/diari/voci";
import { DiariSimboli } from "./disegni";
import { caricaFont, salvaFile } from "./file";
import { cancellaRisultati, leggiRisultati, rigaPerIlMedico, type RisultatoSalvato } from "@/domain/sonno/autovalutazione";
import "./diari.css";

/**
 * Diari della salute nell'area personale (21/11/2026). Una misura si scrive in pochi secondi dal telefono: numeri
 * grandi, l'ora già messa, il resto facoltativo. Il sito calcola medie e conteggi, disegna l'andamento e prepara il
 * foglio per il medico. Non giudica i numeri: nessun colore «alto» o «basso», nessuna soglia, nessun consiglio.
 */

const PERIODI: Record<DiarioSlug, number[]> = {
  pressione: [7, 14, 30],
  glicemia: [14, 30, 90],
  cefalea: [30, 60, 90],
  sonno: [14, 30, 60],
  peso: [7, 30, 90],
  respiro: [14, 30, 60],
};

function usePersona(base: string) {
  const params = useSearchParams();
  const router = useRouter();
  const [persona, setPersona] = useState(params.get("persona") ?? SELF_ID);
  const choose = (id: string) => {
    setPersona(id);
    router.replace(id === SELF_ID ? base : `${base}?persona=${id}`);
  };
  return [persona, choose] as const;
}

function useVoci(persona: string, diario: DiarioSlug | null, tick: number) {
  const [voci, setVoci] = useState<VoceDiario[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const q = `persona=${encodeURIComponent(persona)}${diario ? `&diario=${diario}` : ""}`;
    api<{ voci: VoceDiario[] }>(`/api/v1/area/diari?${q}`)
      .then((r) => alive && setVoci(r.voci))
      .catch((e) => alive && setError(e instanceof Error ? e.message : "Errore"));
    return () => {
      alive = false;
    };
  }, [persona, diario, tick]);
  return { voci, error };
}

const nomeDi = (persone: PersonaView[] | null, id: string) => {
  const p = persone?.find((x) => x.id === id);
  return !p || p.relation === "io" ? null : p.name;
};

/** Quando: «Oggi, 07:32», «Ieri, 20:05», «mar 18 nov, 07:30». */
function quando(at: string, oggi = nowAt().slice(0, 10)) {
  const d = dayOf(at);
  const t = at.slice(11);
  if (d === oggi) return `Oggi, ${t}`;
  const ieri = new Date(Date.parse(`${oggi}T12:00:00Z`) - 864e5).toISOString().slice(0, 10);
  if (d === ieri) return `Ieri, ${t}`;
  return `${giornoBreve(d)}, ${t}`;
}

// ---------------------------------------------------------------------------------------------------------------
// I tuoi diari
// ---------------------------------------------------------------------------------------------------------------

export function DiariHome() {
  const { persone } = usePersone();
  const demo = useIsDemo();
  const [persona, choose] = usePersona("/area-personale/diari");
  const [tick, setTick] = useState(0);
  const { voci, error } = useVoci(persona, null, tick);
  const [busy, setBusy] = useState(false);
  const who = nomeDi(persone, persona);
  const q = persona === SELF_ID ? "" : `?persona=${persona}`;

  async function esempio() {
    setBusy(true);
    try {
      await api("/api/v1/area/diari/esempio", { method: "POST" });
      setTick((x) => x + 1);
    } finally {
      setBusy(false);
    }
  }

  if (error)
    return (
      <p role="alert" className="field-error">
        {error}
      </p>
    );

  return (
    <div className="dra">
      <DiariSimboli />
      <p className="eyebrow">Diari della salute</p>
      <h1 className="area-title mt-3">{who ? `I diari di ${who}.` : "I tuoi diari della salute."}</h1>
      <p className="area-lead">Pressione, glicemia, mal di testa, sonno, peso e respiro. Scrivi una misura in pochi secondi: le medie e il foglio per il medico li prepariamo noi.</p>
      {persone ? (
        <div className="mt-6">
          <PersonaSwitcher persone={persone} current={persona} onChange={choose} label="Di chi è il diario?" />
        </div>
      ) : null}

      {!voci ? (
        <div className="mt-8 h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />
      ) : (
        <>
          <ul className="dra-cards" aria-label="I diari">
            {DIARI.map((d) => (
              <li key={d.slug} className="flex min-w-0">
                <CardDiario d={d} voci={voci.filter((v) => v.diario === d.slug)} href={`/area-personale/diari/${d.slug}${q}`} />
              </li>
            ))}
          </ul>
          {demo && persona === SELF_ID && voci.length === 0 ? (
            <div className="dra-ric mt-6">
              <p>Account dimostrativo: vuoi vedere i diari già compilati con numeri inventati?</p>
              <button type="button" className="btn btn-secondary mt-3" onClick={esempio} disabled={busy} data-testid="diari-esempio">
                {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Sparkles aria-hidden className="h-5 w-5" />} Carica l’esempio
              </button>
            </div>
          ) : null}
        </>
      )}

      <p className="mt-8 text-[1.0625rem]">
        Come si misura bene?{" "}
        <Link href="/diari" className="link">
          Le guide in cinque passi, e i diari da stampare
        </Link>
        .
      </p>
      <Limiti />
    </div>
  );
}

function CardDiario({ d, voci, href }: { d: Diario; voci: VoceDiario[]; href: string }) {
  const last = voci[voci.length - 1];
  let big = "—";
  let small = "Ancora nessuna voce";
  if (d.slug === "pressione") {
    const r = riepilogoPressione(voci, 7);
    if (r.totale) {
      big = `${r.totale.sys}/${r.totale.dia}`;
      small = `Media di ${r.totale.n} misure, ultimi 7 giorni`;
    }
  } else if (d.slug === "glicemia") {
    const r = riepilogoGlicemia(voci, 14);
    const dig = r.perMomento.find((s) => s.momento === "digiuno");
    if (dig) {
      big = `${dig.media}`;
      small = `Media a digiuno (mg/dL), ${dig.n} misure in 14 giorni`;
    } else if (r.misure) {
      big = `${r.misure}`;
      small = "Misure negli ultimi 14 giorni";
    }
  } else if (d.slug === "sonno") {
    const r = riepilogoSonno(voci, 14);
    if (r.aLettoMin !== null) {
      big = oreMinuti(r.aLettoMin);
      small = `A letto in media, ${r.notti} ${r.notti === 1 ? "notte" : "notti"} in 14 giorni`;
    }
  } else if (d.slug === "peso") {
    const r = riepilogoPeso(voci, 30);
    if (r.ultimo !== null) {
      big = kgTesto(r.ultimo);
      small = r.differenza !== null && r.misure > 1 ? `Ultimo peso; ${kgTesto(r.differenza, true)} dal ${giornoBreve(r.dal!)}` : "Ultimo peso";
    }
  } else if (d.slug === "respiro") {
    const r = riepilogoRespiro(voci, 14);
    if (r.mattina) {
      big = `${r.mattina.media}`;
      small = `Media del mattino (L/min), ${r.mattina.n} misure in 14 giorni`;
    } else if (r.misure) {
      big = `${r.misure}`;
      small = "Misure negli ultimi 14 giorni";
    }
  } else if (voci.length) {
    const r = riepilogoCefalea(voci, 30);
    big = `${r.giorniConDolore}`;
    small = `Giorni con mal di testa negli ultimi 30 (${r.giorniSegnati} compilati)`;
  }
  return (
    <Link href={href} className="dra-card w-full" data-testid={`card-${d.slug}`}>
      <span className="dra-card-h">
        <span className="dra-card-ico" aria-hidden="true">
          <Ic id={d.icona} />
        </span>
        <span className="dra-card-t">{d.nome}</span>
      </span>
      <span className="dra-card-v">{big}</span>
      <span className="dra-card-s">{small}</span>
      {last ? <span className="dra-card-s">Ultima voce: {quando(last.at)}</span> : null}
      <span className="dra-card-go">
        {voci.length ? "Apri il diario" : "Comincia"} <ArrowRight aria-hidden className="inline h-5 w-5" />
      </span>
    </Link>
  );
}

function Limiti() {
  return (
    <div className="dra-limiti" role="note">
      {DIARI_LIMITI.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Un diario
// ---------------------------------------------------------------------------------------------------------------

export function DiarioArea({ slug }: { slug: DiarioSlug }) {
  const d = getDiario(slug)!;
  const { persone } = usePersone();
  const [persona, choose] = usePersona(`/area-personale/diari/${slug}`);
  const [tick, setTick] = useState(0);
  const { voci, error } = useVoci(persona, slug, tick);
  const [giorni, setGiorni] = useState(PERIODI[slug][0]);
  const [busy, setBusy] = useState<null | "pdf" | "ics">(null);
  const [ric, setRic] = useState(false);
  const [tutte, setTutte] = useState(false);
  const who = nomeDi(persone, persona);
  const q = persona === SELF_ID ? "" : `?persona=${persona}`;
  const oggi = nowAt().slice(0, 10);
  const nel = useMemo(() => (voci ? periodo(voci, giorni, oggi) : []), [voci, giorni, oggi]);
  // 22/11/2026, sezione sonno: le autovalutazioni salvate su questo dispositivo, da aggiungere al foglio se la persona vuole.
  const [autov, setAutov] = useState<RisultatoSalvato[]>([]);
  const [conAutov, setConAutov] = useState(true);
  useEffect(() => {
    if (slug !== "sonno") return;
    // Letto dopo il primo disegno: localStorage non esiste sul server.
    const t = setTimeout(() => setAutov(leggiRisultati()), 0);
    return () => clearTimeout(t);
  }, [slug]);

  async function foglio() {
    if (!voci) return;
    setBusy("pdf");
    try {
      const { renderFoglioMedico, nomeFileFoglio } = await import("@/domain/diari/pdf");
      const autovalutazioni = slug === "sonno" && conAutov && persona === SELF_ID ? autov.map(rigaPerIlMedico) : undefined;
      const bytes = await renderFoglioMedico(d, voci, { persona: who ?? "Titolare dell'account", giorni, oggi, fonts: await caricaFont(), autovalutazioni });
      await salvaFile(nomeFileFoglio(d, oggi), new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } finally {
      setBusy(null);
    }
  }

  async function rimuovi(id: string) {
    await api(`/api/v1/area/diari/${id}`, { method: "DELETE" });
    setTick((x) => x + 1);
  }

  if (error)
    return (
      <p role="alert" className="field-error">
        {error}
      </p>
    );

  const lista = voci ? [...voci].reverse() : [];
  const mostrate = tutte ? lista : lista.slice(0, 12);

  return (
    <div className="dra">
      <DiariSimboli />
      <Link href={`/area-personale/diari${q}`} className="flex min-h-11 w-fit items-center gap-2 font-bold text-teal-deep">
        <ArrowLeft aria-hidden className="h-5 w-5" /> Tutti i diari
      </Link>
      <p className="eyebrow mt-2">Diario{who ? ` di ${who}` : ""}</p>
      <h1 className="area-title mt-3">{d.nome}</h1>
      <nav className="dra-tabs" aria-label="Diari">
        {DIARI.map((x) => (
          <Link key={x.slug} href={`/area-personale/diari/${x.slug}${q}`} className="dra-tab" aria-current={x.slug === slug ? "page" : undefined}>
            <Ic id={x.icona} /> {x.nome}
          </Link>
        ))}
      </nav>
      {persone && persone.length > 1 ? (
        <div className="mt-4">
          <PersonaSwitcher persone={persone} current={persona} onChange={choose} label="Di chi è il diario?" />
        </div>
      ) : null}

      <NuovaVoce key={`${slug}-${persona}`} d={d} persona={persona} voci={voci} onSaved={() => setTick((x) => x + 1)} />

      <section aria-labelledby="dra-riep" className="mt-10">
        <h2 id="dra-riep" className="area-h2">
          Il riepilogo
        </h2>
        <div className="dra-periodo" role="group" aria-label="Periodo">
          {PERIODI[slug].map((g) => (
            <button key={g} type="button" className="dra-chip" aria-pressed={g === giorni} onClick={() => setGiorni(g)}>
              Ultimi {g} giorni
            </button>
          ))}
        </div>
        {!voci ? <div className="mt-6 h-40 animate-pulse rounded-2xl bg-mist" aria-busy="true" /> : <Riepilogo d={d} voci={voci} giorni={giorni} oggi={oggi} />}
        {voci && nel.length ? <Grafico d={d} voci={nel} giorni={giorni} oggi={oggi} /> : null}
      </section>

      <div className="dra-actions">
        <button type="button" className="btn btn-primary" onClick={foglio} disabled={!voci || !nel.length || busy !== null} data-testid="foglio-medico">
          {busy === "pdf" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <FileDown aria-hidden className="h-5 w-5" />} Foglio per il medico (PDF)
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setRic((x) => !x)} aria-expanded={ric} aria-controls="dra-ric" data-testid="promemoria-diario">
          <BellPlus aria-hidden className="h-5 w-5" /> Ricordamelo sul telefono
        </button>
      </div>
      {ric ? <Promemoria d={d} onBusy={(b) => setBusy(b ? "ics" : null)} /> : null}
      {slug === "sonno" && persona === SELF_ID ? (
        <AutovalutazioniSalvate
          lista={autov}
          con={conAutov}
          setCon={setConAutov}
          onCancella={() => {
            cancellaRisultati();
            setAutov([]);
          }}
        />
      ) : null}

      <section aria-labelledby="dra-voci" className="mt-10">
        <h2 id="dra-voci" className="area-h2">
          {slug === "cefalea" ? "Le voci del diario" : slug === "sonno" ? "Le notti" : "Le misure"}
        </h2>
        {voci && !lista.length ? <p className="empty-note mt-4">Ancora nessuna voce. Scrivi la prima qui sopra: ci vogliono pochi secondi.</p> : null}
        <ul className="dra-list" data-testid="voci-elenco">
          {mostrate.map((v) => (
            <li key={v.id} className="dra-item">
              <span className="dra-item-w">{quando(v.at, oggi)}</span>
              <span className="dra-item-v">
                {rigaVoce(v)}
                {v.note ? <small>{v.note}</small> : null}
              </span>
              <ConfirmButton className="btn btn-ghost btn-sm text-danger" question="Eliminare questa voce?" yes="Sì, elimina" onConfirm={() => rimuovi(v.id)}>
                <Trash2 aria-hidden className="h-4 w-4" />
                <span className="sr-only">Elimina</span>
              </ConfirmButton>
            </li>
          ))}
        </ul>
        {lista.length > mostrate.length ? (
          <button type="button" className="dra-more" onClick={() => setTutte(true)}>
            Mostra tutte ({lista.length})
          </button>
        ) : null}
      </section>

      <p className="mt-8 text-[1.0625rem]">
        <BookOpen aria-hidden className="mr-2 inline h-5 w-5 text-teal" />
        <Link href={`/diari/${slug}`} className="link">
          Come misurare bene: la guida in cinque passi
        </Link>
      </p>
      <Limiti />
    </div>
  );
}

// ---- Autovalutazioni del sonno salvate sul dispositivo (22/11/2026) ----

function AutovalutazioniSalvate({ lista, con, setCon, onCancella }: { lista: RisultatoSalvato[]; con: boolean; setCon: (v: boolean) => void; onCancella: () => void }) {
  if (!lista.length)
    return (
      <p className="dra-autov-vuoto" data-testid="autov-vuoto">
        Vuoi aggiungere al foglio anche un’autovalutazione?{" "}
        <Link href="/malattie/sonno/percorso-due-settimane#passo-1" className="link">
          Fanne una in due minuti
        </Link>
        : il risultato resta su questo dispositivo.
      </p>
    );
  return (
    <div className="dra-autov" data-testid="autov-salvate">
      <label className="dra-autov-l">
        <input type="checkbox" checked={con} onChange={(e) => setCon(e.target.checked)} />
        <span>Aggiungi al foglio le autovalutazioni fatte su questo dispositivo</span>
      </label>
      <ul>
        {lista.map((x) => (
          <li key={x.slug}>{rigaPerIlMedico(x)}</li>
        ))}
      </ul>
      <ConfirmButton className="btn btn-ghost btn-sm" question="Togliere le autovalutazioni da questo dispositivo?" yes="Sì, togli" onConfirm={onCancella}>
        Togli dal dispositivo
      </ConfirmButton>
    </div>
  );
}

// ---- Inserimento rapido ----

function Quando({ at, setAt }: { at: string; setAt: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const f = fascia(at);
  return (
    <>
      <button type="button" className="dra-when" onClick={() => setOpen((x) => !x)} aria-expanded={open}>
        {quando(at)}
        {f !== "giorno" ? ` · ${f}` : ""} <span className="font-semibold text-muted">· cambia</span>
      </button>
      {open ? (
        <label className="dra-label w-full">
          Data e ora
          <input className="dra-text" type="datetime-local" value={at} max={nowAt()} onChange={(e) => e.target.value && setAt(e.target.value.slice(0, 16))} />
        </label>
      ) : null}
    </>
  );
}

const soloCifre = (s: string) => s.replace(/\D/g, "").slice(0, 3);

function NuovaVoce({ d, persona, voci, onSaved }: { d: Diario; persona: string; voci: VoceDiario[] | null; onSaved: () => void }) {
  const [at, setAt] = useState(nowAt());
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [momento, setMomento] = useState<MomentoGlicemia | null>(() => {
    const h = Number(nowAt().slice(11, 13));
    return h < 10 ? "digiuno" : h >= 21 ? "sera" : null;
  });
  const [episodio, setEpisodio] = useState(false);
  const [intensita, setIntensita] = useState<Intensita | null>(null);
  const [durata, setDurata] = useState("");
  const [sintomi, setSintomi] = useState<Sintomo[]>([]);
  const [farmaco, setFarmaco] = useState("");
  const [aLetto, setALetto] = useState("23:00");
  const [inPiedi, setInPiedi] = useState(() => (Number(nowAt().slice(11, 13)) < 12 ? nowAt().slice(11, 16) : "07:00"));
  const [risvegli, setRisvegli] = useState<number | null>(null);
  const [qualita, setQualita] = useState<QualitaSonno | null>(null);
  const [svegli, setSvegli] = useState("");
  const [sveglia, setSveglia] = useState("");
  const [momentoR, setMomentoR] = useState<MomentoRespiro>(() => {
    const h = Number(nowAt().slice(11, 13));
    return h < 12 ? "mattina" : h >= 17 ? "sera" : "altro";
  });
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const first = useRef<HTMLInputElement>(null);

  // Tieni l'ora aggiornata finché la persona non la cambia a mano.
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (manual) return;
    const t = setInterval(() => setAt(nowAt()), 30_000);
    return () => clearInterval(t);
  }, [manual]);

  const oggiNiente = d.slug === "cefalea" && voci?.some((v) => v.diario === "cefalea" && dayOf(v.at) === dayOf(nowAt()) && v.dati.tipo === "nessuno");

  async function save(body: unknown, msg: string) {
    setErr(null);
    setOk(null);
    setSaving(true);
    try {
      await api("/api/v1/area/diari", { method: "POST", body });
      setOk(msg);
      setA("");
      setB("");
      setC("");
      setNote("");
      setNoteOpen(false);
      setDurata("");
      setSintomi([]);
      setFarmaco("");
      setIntensita(null);
      setEpisodio(false);
      setRisvegli(null);
      setQualita(null);
      setSvegli("");
      setSveglia("");
      setManual(false);
      setAt(nowAt());
      onSaved();
      first.current?.focus();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Non salvato. Riprova.");
    } finally {
      setSaving(false);
    }
  }

  const profileId = persona === SELF_ID ? null : persona;
  const nota = note.trim() || null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (d.slug === "pressione") {
      if (!a || !b) return setErr("Scrivi la massima e la minima.");
      const prima = voci?.filter((v) => v.diario === "pressione" && dayOf(v.at) === dayOf(at) && fascia(v.at) === fascia(at)).length ?? 0;
      return save(
        { diario: "pressione", profileId, at, note: nota, dati: { sys: Number(a), dia: Number(b), bpm: c ? Number(c) : null } },
        `Salvata: ${a}/${b}.${prima === 0 && fascia(at) !== "giorno" ? " Ora la seconda misura, tra un minuto." : ""}`,
      );
    }
    if (d.slug === "glicemia") {
      if (!a) return setErr("Scrivi il valore.");
      if (!momento) return setErr("Scegli il momento: serve al medico per leggere il numero.");
      return save({ diario: "glicemia", profileId, at, note: nota, dati: { mgdl: Number(a), momento } }, `Salvata: ${a} mg/dL, ${MOMENTI_GLICEMIA[momento].toLowerCase()}.`);
    }
    if (d.slug === "sonno") {
      if (!ORA_RE.test(aLetto) || !ORA_RE.test(inPiedi)) return setErr("Scrivi i due orari: quando sei andato a letto e quando ti sei alzato.");
      const t = minutiTra(aLetto, inPiedi);
      if (t < 60 || t > 18 * 60) return setErr("Controlla i due orari: tra l'ora di andare a letto e quella di alzarti ci sono meno di un'ora o più di 18.");
      if (!qualita) return setErr("Scegli com'è andata la notte.");
      const add = a ? Number(a) : null;
      if (sveglia && !ORA_RE.test(sveglia)) return setErr("L'ora del risveglio non è valida.");
      if (sveglia && minutiTra(aLetto, sveglia) > t) return setErr("L'ora del risveglio deve stare tra quella in cui sei andato a letto e quella in cui ti sei alzato.");
      const sv = svegli ? Number(svegli) : null;
      if (add !== null && sv !== null && add + sv >= t) return setErr("Minuti per addormentarti e minuti svegli insieme superano il tempo a letto: controlla i numeri.");
      return save(
        { diario: "sonno", profileId, at, note: nota, dati: { aLetto, inPiedi, addormentarsiMin: add, risvegli, qualita, svegliMin: sv, sveglia: sveglia || null } },
        `Salvata la notte: ${oreMinuti(t)} a letto, ${QUALITA_SONNO[qualita].toLowerCase()}.`,
      );
    }
    if (d.slug === "peso") {
      const kg = Number(a.replace(",", "."));
      if (!a || Number.isNaN(kg)) return setErr("Scrivi il peso in kg, per esempio 72,4.");
      return save({ diario: "peso", profileId, at, note: nota, dati: { kg } }, `Salvato: ${kgTesto(Math.round(kg * 10) / 10)}.`);
    }
    if (d.slug === "respiro") {
      if (!a) return setErr("Scrivi il migliore dei tre soffi.");
      return save(
        { diario: "respiro", profileId, at, note: nota, dati: { pef: Number(a), momento: momentoR, spray: c ? Number(c) : null } },
        `Salvato: ${a} L/min, ${MOMENTI_RESPIRO[momentoR].toLowerCase()}.`,
      );
    }
    if (!intensita) return setErr("Scegli quanto era forte.");
    const ore = durata ? Number(durata.replace(",", ".")) : null;
    if (ore !== null && Number.isNaN(ore)) return setErr("La durata è un numero di ore, per esempio 2 o 1,5.");
    return save(
      { diario: "cefalea", profileId, at, note: nota, dati: { tipo: "episodio", intensita, durataOre: ore, sintomi, farmaco: farmaco.trim() || null } },
      `Salvato l'episodio: ${INTENSITA[intensita].toLowerCase()}${ore !== null ? `, ${durataTesto(ore)}` : ""}.`,
    );
  }

  const setAtManual = (v: string) => {
    setManual(true);
    setAt(v);
  };

  return (
    <form className="dra-entry" onSubmit={submit} noValidate aria-labelledby="dra-entry-t" data-testid="nuova-voce">
      <div className="dra-entry-h">
        <h2 id="dra-entry-t" className="dra-entry-t">
          {{ pressione: "Nuova misura", glicemia: "Nuova glicemia", cefalea: "Com’è andata?", sonno: "Com’è andata la notte?", peso: "Peso di oggi", respiro: "Nuovo soffio" }[d.slug]}
        </h2>
        {d.slug !== "cefalea" || episodio ? <Quando at={at} setAt={setAtManual} /> : null}
      </div>

      {d.slug === "pressione" ? (
        <>
          <div className="dra-nums">
            <label className="dra-num">
              <span>Massima</span>
              <input
                ref={first}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                enterKeyHint="next"
                aria-describedby="dra-mmhg"
                value={a}
                onChange={(e) => {
                  const v = soloCifre(e.target.value);
                  setA(v);
                  if (v.length === 3) document.getElementById("dra-min")?.focus();
                }}
                data-testid="sys"
              />
            </label>
            <label className="dra-num">
              <span>Minima</span>
              <input id="dra-min" inputMode="numeric" pattern="[0-9]*" autoComplete="off" enterKeyHint="next" aria-describedby="dra-mmhg" value={b} onChange={(e) => setB(soloCifre(e.target.value))} data-testid="dia" />
            </label>
          </div>
          <p id="dra-mmhg" className="mt-2 text-[0.9375rem] text-muted">
            In mmHg, come li mostra l’apparecchio.
          </p>
          <div className="dra-nums is-one">
            <label className="dra-num dra-num-small">
              <span>
                Battiti <small>se l’apparecchio li mostra</small>
              </span>
              <input inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={c} onChange={(e) => setC(soloCifre(e.target.value))} data-testid="bpm" />
            </label>
          </div>
        </>
      ) : null}

      {d.slug === "glicemia" ? (
        <>
          <div className="dra-nums is-one">
            <label className="dra-num">
              <span>
                Glicemia <small>in mg/dL</small>
              </span>
              <input ref={first} inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={a} onChange={(e) => setA(soloCifre(e.target.value))} data-testid="mgdl" />
            </label>
          </div>
          <p className="dra-label">Quando?</p>
          <div className="dra-chips" role="group" aria-label="Momento della misura">
            {(Object.keys(MOMENTI_GLICEMIA) as MomentoGlicemia[]).map((m) => (
              <button key={m} type="button" className="dra-chip" aria-pressed={momento === m} onClick={() => setMomento(m)}>
                {MOMENTI_GLICEMIA[m]}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {d.slug === "sonno" ? (
        <>
          <div className="dra-nums is-time">
            <label className="dra-num dra-num-small">
              <span>
                A letto <small>luce spenta</small>
              </span>
              <input ref={first} type="time" value={aLetto} onChange={(e) => setALetto(e.target.value)} data-testid="a-letto" />
            </label>
            <label className="dra-num dra-num-small">
              <span>
                In piedi <small>alzato</small>
              </span>
              <input type="time" value={inPiedi} onChange={(e) => setInPiedi(e.target.value)} data-testid="in-piedi" />
            </label>
          </div>
          <div className="dra-nums is-one">
            <label className="dra-num dra-num-small">
              <span>
                Minuti per addormentarti <small>una stima va bene</small>
              </span>
              <input inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={a} onChange={(e) => setA(soloCifre(e.target.value))} data-testid="addormentarsi" />
            </label>
          </div>
          {/* 22/11/2026, sezione sonno: i due numeri che servono per l'efficienza del sonno. Facoltativi. */}
          <div className="dra-nums is-time">
            <label className="dra-num dra-num-small">
              <span>
                Minuti svegli di notte <small>in tutto, una stima</small>
              </span>
              <input inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={svegli} onChange={(e) => setSvegli(soloCifre(e.target.value))} data-testid="svegli-min" />
            </label>
            <label className="dra-num dra-num-small">
              <span>
                Sveglio dalle <small>se prima di alzarti</small>
              </span>
              <input type="time" value={sveglia} onChange={(e) => setSveglia(e.target.value)} data-testid="sveglia" />
            </label>
          </div>
          <p className="dra-label">Quante volte ti sei svegliato?</p>
          <div className="dra-chips" role="group" aria-label="Risvegli">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" className="dra-chip dra-chip-n" aria-pressed={risvegli === n} onClick={() => setRisvegli(risvegli === n ? null : n)}>
                {n === 5 ? "5 o più" : n}
              </button>
            ))}
          </div>
          <p className="dra-label">Com’è andata?</p>
          <div className="dra-chips dra-chips-3" role="group" aria-label="Com’è andata la notte">
            {(Object.keys(QUALITA_SONNO) as QualitaSonno[]).map((k) => (
              <button key={k} type="button" className="dra-chip" aria-pressed={qualita === k} onClick={() => setQualita(k)} data-testid={`q-${k}`}>
                {QUALITA_SONNO[k]}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {d.slug === "peso" ? (
        <div className="dra-nums is-one">
          <label className="dra-num">
            <span>
              Peso <small>in kg, con la virgola se c’è</small>
            </span>
            <input ref={first} inputMode="decimal" autoComplete="off" value={a} onChange={(e) => setA(e.target.value.replace(/[^\d,.]/g, "").slice(0, 5))} data-testid="kg" />
          </label>
        </div>
      ) : null}

      {d.slug === "respiro" ? (
        <>
          <div className="dra-nums is-one">
            <label className="dra-num">
              <span>
                Il migliore dei 3 soffi <small>in L/min</small>
              </span>
              <input ref={first} inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={a} onChange={(e) => setA(soloCifre(e.target.value))} data-testid="pef" />
            </label>
          </div>
          <p className="dra-label">Quando?</p>
          <div className="dra-chips dra-chips-3" role="group" aria-label="Momento della misura">
            {(Object.keys(MOMENTI_RESPIRO) as MomentoRespiro[]).map((m) => (
              <button key={m} type="button" className="dra-chip" aria-pressed={momentoR === m} onClick={() => setMomentoR(m)}>
                {MOMENTI_RESPIRO[m]}
              </button>
            ))}
          </div>
          <div className="dra-nums is-one">
            <label className="dra-num dra-num-small">
              <span>
                Spray al bisogno <small>quante volte, se l’hai usato</small>
              </span>
              <input inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={c} onChange={(e) => setC(soloCifre(e.target.value).slice(0, 2))} data-testid="spray" />
            </label>
          </div>
        </>
      ) : null}

      {d.slug === "cefalea" && !episodio ? (
        <div className="dra-row">
          <button type="button" className="btn btn-primary dra-nulla" onClick={() => setEpisodio(true)} data-testid="ho-mal-di-testa">
            Ho mal di testa, o l’ho avuto
          </button>
          <button
            type="button"
            className="btn btn-secondary dra-nulla"
            disabled={saving || oggiNiente}
            onClick={() => save({ diario: "cefalea", profileId, at: nowAt(), note: null, dati: { tipo: "nessuno" } }, "Segnato: oggi niente mal di testa.")}
            data-testid="oggi-niente"
          >
            <Check aria-hidden className="h-5 w-5" /> {oggiNiente ? "Oggi già segnato: niente" : "Oggi niente mal di testa"}
          </button>
        </div>
      ) : null}

      {d.slug === "cefalea" && episodio ? (
        <>
          <p className="dra-label">Quanto forte?</p>
          <div className="dra-chips dra-chips-3" role="group" aria-label="Intensità">
            {(Object.keys(INTENSITA) as Intensita[]).map((k) => (
              <button key={k} type="button" className="dra-chip" aria-pressed={intensita === k} onClick={() => setIntensita(k)} data-testid={`int-${k}`}>
                {INTENSITA[k]}
                <small>{INTENSITA_AIUTO[k]}</small>
              </button>
            ))}
          </div>
          <div className="dra-row">
            <label className="dra-label">
              Quante ore è durato? <span className="font-semibold text-muted">(se lo sai)</span>
              <input className="dra-text" inputMode="decimal" autoComplete="off" value={durata} onChange={(e) => setDurata(e.target.value.replace(/[^\d,.]/g, "").slice(0, 4))} />
            </label>
            <label className="dra-label">
              Che cosa hai preso per il dolore? <span className="font-semibold text-muted">(nome e ora)</span>
              <input className="dra-text" autoComplete="off" maxLength={60} value={farmaco} onChange={(e) => setFarmaco(e.target.value)} placeholder="Niente? Lascia vuoto" />
            </label>
          </div>
          <p className="dra-label">C’era anche…</p>
          <div className="dra-chips" role="group" aria-label="Insieme al dolore">
            {(Object.keys(SINTOMI) as Sintomo[]).map((s) => (
              <button key={s} type="button" className="dra-chip" aria-pressed={sintomi.includes(s)} onClick={() => setSintomi((xs) => (xs.includes(s) ? xs.filter((x) => x !== s) : [...xs, s]))}>
                {SINTOMI[s]}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {d.slug !== "cefalea" || episodio ? (
        <>
          {noteOpen ? (
            <label className="dra-label">
              Nota <span className="font-semibold text-muted">(facoltativa)</span>
              <input className="dra-text" maxLength={200} value={note} onChange={(e) => setNote(e.target.value)} placeholder={{ cefalea: "Sonno, ciclo, stress, cibo…", sonno: "Pisolino, caffè, alcol, farmaci…", peso: "Gonfiore, fiato corto, cambi nella cura…", respiro: "Tosse, notte disturbata, raffreddore…", pressione: "Un malessere, un pasto diverso…", glicemia: "Un malessere, un pasto diverso…" }[d.slug]} />
            </label>
          ) : (
            <button type="button" className="dra-more" onClick={() => setNoteOpen(true)}>
              + Aggiungi una nota
            </button>
          )}
          <button type="submit" className="btn btn-primary dra-save" disabled={saving} data-testid="salva-voce">
            {saving ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Check aria-hidden className="h-5 w-5" />} Salva
          </button>
        </>
      ) : null}

      {err ? (
        <p role="alert" className="field-error mt-3">
          {err}
        </p>
      ) : null}
      {ok ? (
        <p role="status" className="dra-ok" data-testid="voce-salvata">
          <Check aria-hidden className="h-5 w-5 text-teal" /> {ok}
        </p>
      ) : null}
    </form>
  );
}

// ---- Riepilogo e grafico ----

function Riepilogo({ d, voci, giorni, oggi }: { d: Diario; voci: VoceDiario[]; giorni: number; oggi: string }) {
  const items: { t: string; v: string; s: string }[] = [];
  if (d.slug === "pressione") {
    const r = riepilogoPressione(voci, giorni, oggi);
    items.push(
      { t: "Media", v: r.totale ? `${r.totale.sys}/${r.totale.dia}` : "—", s: r.totale ? `${r.totale.n} misure${r.senzaPrimoGiorno ? ", senza il 1° giorno" : ""}` : "Nessuna misura" },
      { t: "Mattina", v: r.mattina ? `${r.mattina.sys}/${r.mattina.dia}` : "—", s: r.mattina ? `${r.mattina.n} misure` : "Nessuna misura" },
      { t: "Sera", v: r.sera ? `${r.sera.sys}/${r.sera.dia}` : "—", s: r.sera ? `${r.sera.n} misure` : "Nessuna misura" },
      { t: "Battiti", v: r.bpm ? String(r.bpm) : "—", s: `${r.giorni} ${r.giorni === 1 ? "giorno" : "giorni"} con misure` },
    );
  } else if (d.slug === "glicemia") {
    const r = riepilogoGlicemia(voci, giorni, oggi);
    for (const s of r.perMomento) items.push({ t: MOMENTI_GLICEMIA[s.momento], v: String(s.media), s: `media di ${s.n} · da ${s.min} a ${s.max}` });
    if (!items.length) items.push({ t: "Misure", v: "0", s: "nel periodo" });
  } else if (d.slug === "sonno") {
    const r = riepilogoSonno(voci, giorni, oggi);
    items.push(
      { t: "Tempo a letto", v: r.aLettoMin !== null ? oreMinuti(r.aLettoMin) : "—", s: r.notti ? `media di ${r.notti} ${r.notti === 1 ? "notte" : "notti"}${r.oraLetto ? ` · dalle ${r.oraLetto} alle ${r.oraInPiedi}` : ""}` : "Nessuna notte" },
      { t: "Per addormentarti", v: r.addormentarsiMin !== null ? `${r.addormentarsiMin} min` : "—", s: "in media" },
      { t: "Risvegli", v: r.risvegli !== null ? String(r.risvegli).replace(".", ",") : "—", s: "in media per notte" },
      { t: "Com’è andata", v: `${r.perQualita.bene}`, s: `notti bene · così così ${r.perQualita.cosi} · male ${r.perQualita.male}` },
      // 22/11/2026, sezione sonno: i calcoli del diario del sonno, descritti e non giudicati.
      { t: "Sonno stimato", v: r.sonnoMin !== null ? oreMinuti(r.sonnoMin) : "—", s: r.nottiComplete ? `media di ${r.nottiComplete} ${r.nottiComplete === 1 ? "notte completa" : "notti complete"}` : "servono i minuti per addormentarti e quelli svegli" },
      { t: "Efficienza del sonno", v: r.efficienza !== null ? `${r.efficienza}%` : "—", s: "parte del tempo a letto passata dormendo" },
      { t: "Orari da una notte all’altra", v: r.variabilitaLetto !== null ? `± ${r.variabilitaLetto} min` : "—", s: r.variabilitaInPiedi !== null ? `a letto · in piedi ± ${r.variabilitaInPiedi} min` : "servono almeno 4 notti" },
      { t: "Fine settimana", v: r.scartoFineSettimana !== null ? scartoBreve(r.scartoFineSettimana) : "—", s: r.scartoFineSettimana !== null ? (Math.abs(r.scartoFineSettimana) < 5 ? "metà della notte alla stessa ora degli altri giorni" : `metà della notte ${scartoTesto(r.scartoFineSettimana)} rispetto agli altri giorni`) : "servono 2 notti del fine settimana" },
    );
  } else if (d.slug === "peso") {
    const r = riepilogoPeso(voci, giorni, oggi);
    items.push(
      { t: "Ultimo peso", v: r.ultimo !== null ? kgTesto(r.ultimo) : "—", s: r.al ? giornoBreve(r.al) : "Nessuna misura" },
      { t: "Dal primo all’ultimo", v: r.differenza !== null && r.misure > 1 ? kgTesto(r.differenza, true) : "—", s: r.dal && r.misure > 1 ? `dal ${giornoBreve(r.dal)}` : "servono 2 misure" },
      { t: "In 3 giorni", v: r.in3Giorni !== null ? kgTesto(r.in3Giorni, true) : "—", s: "rispetto a 3 giorni prima" },
      { t: "Media", v: r.media !== null ? kgTesto(r.media) : "—", s: `${r.misure} misure in ${r.giorni} ${r.giorni === 1 ? "giorno" : "giorni"}` },
    );
  } else if (d.slug === "respiro") {
    const r = riepilogoRespiro(voci, giorni, oggi);
    items.push(
      { t: "Mattina", v: r.mattina ? String(r.mattina.media) : "—", s: r.mattina ? `media di ${r.mattina.n} · L/min` : "Nessuna misura" },
      { t: "Sera", v: r.sera ? String(r.sera.media) : "—", s: r.sera ? `media di ${r.sera.n} · L/min` : "Nessuna misura" },
      { t: "Più alto e più basso", v: r.max !== null ? `${r.max}` : "—", s: r.min !== null ? `il più basso: ${r.min}` : "nel periodo" },
      { t: "Spray al bisogno", v: String(r.giorniConSpray), s: `giorni con spray · ${r.sprayTotale} volte in tutto` },
    );
  } else {
    const r = riepilogoCefalea(voci, giorni, oggi);
    items.push(
      { t: "Giorni con mal di testa", v: String(r.giorniConDolore), s: `su ${r.giorniPeriodo}; ${r.giorniSegnati} giorni compilati` },
      { t: "Episodi", v: String(r.episodi), s: `lievi ${r.perIntensita.lieve} · medi ${r.perIntensita.media} · forti ${r.perIntensita.forte}` },
      { t: "Giorni con qualcosa per il dolore", v: String(r.giorniConFarmaco), s: "contati dal diario" },
      { t: "Durata media", v: r.durataMedia !== null ? durataTesto(r.durataMedia) : "—", s: "degli episodi con durata" },
    );
  }
  return (
    <dl className="dra-sum" data-testid="riepilogo">
      {items.map((i) => (
        <div key={i.t}>
          <dt>{i.t}</dt>
          <dd>
            {i.v}
            <small>{i.s}</small>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Grafico({ d, voci, giorni, oggi }: { d: Diario; voci: VoceDiario[]; giorni: number; oggi: string }) {
  if (d.slug === "cefalea") {
    const r = riepilogoCefalea(voci, giorni, oggi);
    const cal = r.calendario.slice(-Math.min(giorni, 35));
    return (
      <figure className="dra-chart m-0" aria-label={`Calendario: ${r.giorniConDolore} giorni con mal di testa su ${r.giorniPeriodo}`}>
        <figcaption className="font-bold">Giorno per giorno</figcaption>
        <div className="dra-cal">
          {cal.map((g) => (
            <span key={g.day} className="dra-cal-d" data-s={g.stato} data-f={g.farmaco ? "1" : "0"} title={`${giornoBreve(g.day)}: ${g.stato === "vuoto" ? "non compilato" : g.stato === "nessuno" ? "niente mal di testa" : INTENSITA[g.stato as Intensita].toLowerCase()}`}>
              {Number(g.day.slice(8))}
            </span>
          ))}
        </div>
        <ul className="dra-legend">
          <li>
            <i style={{ background: "#e3ddf6" }} />
            Lieve
          </li>
          <li>
            <i style={{ background: "#a99ad9" }} />
            Media
          </li>
          <li>
            <i style={{ background: "#54468a" }} />
            Forte
          </li>
          <li>Punto: preso qualcosa per il dolore</li>
        </ul>
      </figure>
    );
  }
  // Disegno stretto: sul telefono le scritte restano leggibili (circa 14 px a 360 px di larghezza).
  const W = 380;
  const H = 210;
  const L = 44;
  const R = 12;
  const T = 14;
  const B = 30;
  const xs = voci.slice(-60);
  const g = GRAFICI[d.slug as Exclude<DiarioSlug, "cefalea">];
  const vals = xs.flatMap((v) => g.serie.map((f) => f.v(v)).filter((n): n is number => n !== null));
  if (!vals.length) return null;
  const lo = Math.floor((Math.min(...vals) - g.pad) / g.step) * g.step;
  const hi = Math.ceil((Math.max(...vals) + g.pad) / g.step) * g.step;
  const x = (i: number) => L + (xs.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (xs.length - 1));
  const y = (v: number) => T + ((hi - v) * (H - T - B)) / (hi - lo || 1);
  const mid = Math.round((lo + hi) / 2 / (g.step / 2)) * (g.step / 2);
  const ticks = [...new Set([lo, mid, hi])];
  const fmt = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");
  const days: { i: number; day: string }[] = [];
  xs.forEach((v, i) => {
    if (!days.length || days[days.length - 1].day !== dayOf(v.at)) days.push({ i, day: dayOf(v.at) });
  });
  const step = Math.ceil(days.length / 5);
  const line = (f: (v: VoceDiario) => number | null) =>
    xs
      .map((v, i) => [i, f(v)] as const)
      .filter((p): p is readonly [number, number] => p[1] !== null)
      .map(([i, n]) => `${x(i).toFixed(1)},${y(n).toFixed(1)}`)
      .join(" ");
  return (
    <figure className="dra-chart m-0">
      <figcaption className="font-bold">Andamento{xs.length < voci.length ? ` (ultime ${xs.length} voci)` : ""}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${g.label}: ${xs.length} voci, da ${fmt(Math.min(...vals))} a ${fmt(Math.max(...vals))} ${g.unit}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="ax" x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
            <text className="lb" x={L - 8} y={y(t) + 4} textAnchor="end">
              {fmt(t)}
            </text>
          </g>
        ))}
        {days
          .filter((_, k) => k % step === 0)
          .map((gg) => (
            <text key={gg.day} className="lb" x={x(gg.i)} y={H - 8} textAnchor="start">
              {giornoBreve(gg.day).split(" ").slice(1).join(" ")}
            </text>
          ))}
        {g.serie.map((f, k) => (f.line ? <polyline key={`l${k}`} className={`l${f.cls}`} points={line(f.v)} opacity={f.faint ? 0.35 : 1} /> : null))}
        {g.serie.map((f, k) =>
          xs.map((v, i) => {
            const n = f.v(v);
            return n === null ? null : <circle key={`${k}${v.id}`} className={`p${f.dot ? f.dot(v) : f.cls}`} cx={x(i)} cy={y(n)} r={f.r} />;
          }),
        )}
      </svg>
      {g.legend.length ? (
        <ul className="dra-legend">
          {g.legend.map(([t, c]) => (
            <li key={t}>
              <i style={{ background: c }} />
              {t}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-[0.9375rem] text-muted">{g.nota}</p>
      )}
    </figure>
  );
}

interface Serie {
  cls: "1" | "2";
  v: (x: VoceDiario) => number | null;
  line: boolean;
  faint?: boolean;
  r: number;
  /** Colore del punto voce per voce (per esempio mattina o sera). */
  dot?: (x: VoceDiario) => "1" | "2";
}
const C1 = "var(--color-teal-deep)";
const C2 = "var(--color-amber)";
const GRAFICI: Record<Exclude<DiarioSlug, "cefalea">, { serie: Serie[]; pad: number; step: number; label: string; unit: string; legend: [string, string][]; nota?: string }> = {
  pressione: {
    serie: [
      { cls: "1", v: (v) => (v.diario === "pressione" ? v.dati.sys : null), line: true, r: 3 },
      { cls: "2", v: (v) => (v.diario === "pressione" ? v.dati.dia : null), line: true, r: 3 },
    ],
    pad: 8,
    step: 10,
    label: "Andamento della pressione",
    unit: "mmHg",
    legend: [
      ["Massima", C1],
      ["Minima", C2],
    ],
  },
  glicemia: {
    serie: [{ cls: "1", v: (v) => (v.diario === "glicemia" ? v.dati.mgdl : null), line: true, faint: true, r: 4.5 }],
    pad: 8,
    step: 10,
    label: "Andamento della glicemia",
    unit: "mg/dL",
    legend: [],
    nota: "Ogni punto è una misura; il momento è scritto nell’elenco qui sotto.",
  },
  sonno: {
    serie: [{ cls: "1", v: (v) => (v.diario === "sonno" ? Math.round((minutiTra(v.dati.aLetto, v.dati.inPiedi) / 60) * 10) / 10 : null), line: true, faint: true, r: 4.5 }],
    pad: 0.4,
    step: 1,
    label: "Ore a letto, notte per notte",
    unit: "ore",
    legend: [],
    nota: "Ogni punto è una notte: le ore passate a letto, dalla luce spenta a quando ti sei alzato.",
  },
  peso: {
    serie: [{ cls: "1", v: (v) => (v.diario === "peso" ? v.dati.kg : null), line: true, r: 3.5 }],
    pad: 0.3,
    step: 1,
    label: "Andamento del peso",
    unit: "kg",
    legend: [],
    nota: "Ogni punto è una misura, in kg.",
  },
  respiro: {
    serie: [
      {
        cls: "1",
        v: (v) => (v.diario === "respiro" ? v.dati.pef : null),
        line: true,
        faint: true,
        r: 4.5,
        dot: (v) => (v.diario === "respiro" && v.dati.momento === "sera" ? "2" : "1"),
      },
    ],
    pad: 15,
    step: 50,
    label: "Andamento del picco di flusso",
    unit: "L/min",
    legend: [
      ["Mattina (e altri momenti)", C1],
      ["Sera", C2],
    ],
  },
};

// ---- Promemoria nel calendario ----

function Promemoria({ d, onBusy }: { d: Diario; onBusy: (b: boolean) => void }) {
  const [orari, setOrari] = useState(d.promemoria.orari);
  const [giorni, setGiorni] = useState(d.promemoria.giorni);
  const [fatto, setFatto] = useState(false);
  async function go() {
    onBusy(true);
    try {
      const ics = buildDiarioIcs(d, orari, giorni, nowAt().slice(0, 10));
      await salvaFile(`promemoria-diario-${d.slug}.ics`, new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      setFatto(true);
    } finally {
      onBusy(false);
    }
  }
  return (
    <div id="dra-ric" className="dra-ric">
      <p className="font-bold">Un avviso nel calendario del telefono, agli orari che scegli.</p>
      <p className="mt-1 text-[1rem] text-ink-soft">Si apre il calendario e confermi tu. L’avviso dice solo che cosa fare, senza numeri né nomi.</p>
      <div className="dra-orari" role="group" aria-label="Orari">
        {orari.map((o, i) => (
          <input key={i} type="time" aria-label={`Orario ${i + 1}`} value={o} onChange={(e) => setOrari((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))} />
        ))}
      </div>
      <label className="dra-label">
        Per quanti giorni
        <select className="dra-text" value={giorni} onChange={(e) => setGiorni(Number(e.target.value))}>
          {[3, 7, 14, 30, 60, 90].map((g) => (
            <option key={g} value={g}>
              {g} giorni
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="btn btn-primary dra-save" onClick={go} data-testid="aggiungi-calendario">
        <BellPlus aria-hidden className="h-5 w-5" /> Aggiungi al calendario
      </button>
      {fatto ? (
        <p role="status" className="dra-ok">
          <Check aria-hidden className="h-5 w-5 text-teal" /> File pronto: aprilo e conferma nel calendario.
        </p>
      ) : null}
    </div>
  );
}
