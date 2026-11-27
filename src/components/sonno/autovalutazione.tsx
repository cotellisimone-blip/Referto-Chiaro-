import { HomeSimboli, Ic } from "@/components/home-b/simboli";
import { DiariSimboli } from "@/components/diari/disegni";
import { MalattieSimboli } from "@/components/malattie/simboli";
import type { Autovalutazione } from "@/content/sonno";
import { SonnoSimboli } from "./simboli";
import { Briciole, FineSonno, Fiducia, Fonti } from "./pagina";
import { Questionario } from "./questionario";
import "@/components/temi/temi.css";
import "@/components/diari/diari.css";
import "@/components/malattie/malattie.css";
import "./sonno.css";

/** Una autovalutazione della sezione sonno (22/11/2026): testata, da dove vengono le domande, il questionario, le fonti. */
export function AutovalutazioneView({ a }: { a: Autovalutazione }) {
  return (
    <div className="ht ht-sc ml sn" data-sonno={a.slug}>
      <HomeSimboli />
      <DiariSimboli />
      <MalattieSimboli />
      <SonnoSimboli />
      <section className="ht-hero ml-hero" aria-labelledby="ht-titolo">
        <Ic id="s-test" className="ht-art" />
        <div className="ht-wrap">
          <Briciole ultima={a.porta} />
          <div className="ht-hero-g">
            <span className="ht-ico" aria-hidden="true">
              <Ic id="s-test" />
            </span>
            <div>
              <p className="ht-kicker">
                Sonno · Autovalutazione
                <span className="ht-stato">Bozza</span>
              </p>
              <h1 id="ht-titolo">
                {a.titolo} <em><span>{a.em}</span></em>
              </h1>
              <p className="ht-lead">{a.intro}</p>
            </div>
          </div>
          <div className="sn-ispirazione">
            <p className="sn-ispirazione-t">Domande scritte da noi</p>
            <p>
              <b>Ispirate a:</b> {a.ispirazione.nome}.
            </p>
            <p>{a.ispirazione.nota}</p>
          </div>
          <Fiducia aggiornato={a.aggiornato} fonti={a.fonti.length} />
        </div>
      </section>

      <section className="ht-sec ml-sec" aria-labelledby="sn-q-t">
        <div className="ht-wrap">
          <div className="ml-col sn-col">
            <p className="ht-kicker">{a.periodo}</p>
            <h2 id="sn-q-t" className="ml-h2">
              Le domande
            </h2>
            <Questionario a={a} />
          </div>
        </div>
      </section>

      <Fonti
        fonti={a.fonti}
        aggiornato={a.aggiornato}
        regole="Le domande sono nostre e non sono validate: orientano e aiutano a parlarne, non fanno diagnosi né sostituiscono i questionari usati dai medici."
      />
      <FineSonno />
    </div>
  );
}
