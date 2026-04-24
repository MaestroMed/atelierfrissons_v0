import type { Metadata } from 'next';
import { ProductSilhouette } from '@/components/marketing/ProductSilhouette';
import { Fleuron } from '@/components/layout/Fleuron';
import { CinematicHero } from '@/components/marketing/CinematicHero';
import { CinematicChapter } from '@/components/marketing/CinematicChapter';
import { CinematicEpilogue } from '@/components/marketing/CinematicEpilogue';
import { JsonLd } from '@/components/shared/JsonLd';
import { buildArticleSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
  title: 'Le rituel inaugural — une expérience éditoriale',
  description:
    "Une expérience scrollytelling en six chapitres — matières, gestes, silences. L'art d'habiter le temps, signé Atelier Frisson.",
  alternates: { canonical: '/rituel-inaugural' },
  openGraph: {
    type: 'article',
    title: 'Le rituel inaugural — Atelier Frisson',
    description:
      'Six chapitres pour comprendre pourquoi un objet bien conçu change le rapport au temps, au corps, à soi.',
  },
};

/**
 * Landing cinématique — « Le rituel inaugural ».
 *
 * Expérience scrollytelling en 6 chapitres + hero + épilogue. Pensée
 * pour qu'une lectrice de Vogue / Madame Figaro reste 2-3 minutes et
 * partage la page avant même d'acheter un objet. Le fond bascule
 * JOUR → NUIT → NOIR au fur et à mesure, la typo se déploie, les
 * silhouettes apparaissent par la gauche.
 *
 * SEO : Schema.org Article + metadata riches. Respecte tous les tokens
 * de la maison (couleurs, Bodoni, Fleuron).
 */
export default function RituelInauguralPage() {
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: 'Le rituel inaugural',
          excerpt: 'Une expérience éditoriale en six chapitres — matières, gestes, silences.',
          slug: 'rituel-inaugural',
          author: 'Atelier Frisson',
          authorRole: 'Maison éditoriale',
          publishedAt: new Date('2026-04-01'),
          updatedAt: new Date('2026-04-25'),
        })}
      />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <CinematicHero
        overline="Une expérience éditoriale"
        title={`Le rituel <em class="font-italic-editorial text-or">inaugural</em>`}
        subtitle="Six chapitres pour comprendre pourquoi un objet bien conçu change le rapport au temps."
        duration="~ 3 minutes de lecture"
      />

      {/* ─── CHAPITRE I — L'HEURE ───────────────────────────────────── */}
      <CinematicChapter
        id="chapitre-1"
        caption="L’heure"
        chapterNumber="I"
        tone="jour"
        align="left"
        title={`Il n’y a pas de <em class="font-italic-editorial text-or-dark">bon moment</em>. Il y a <em class="font-italic-editorial text-or-dark">ce</em> moment.`}
        body={`Huit heures du soir. La journée a passé trop vite et trop lentement à la fois. Vous fermez la porte, vous posez les clés, vous éteignez une notification. Puis une deuxième. <strong>Ce geste — le vôtre — commence ici</strong>, à l’instant où vous cessez d’être disponible pour les autres.`}
        quote="Ralentir n’est pas perdre du temps. C’est un acte de soin profond."
        quoteAuthor="Le manifeste de la maison"
        visual={
          <div className="bg-ivoire-dark/30 flex aspect-[3/4] w-full max-w-sm items-center justify-center">
            <ProductSilhouette variant="jour" className="h-[70%] max-h-[440px]" />
          </div>
        }
      />

      {/* ─── CHAPITRE II — LA MATIÈRE ───────────────────────────────── */}
      <CinematicChapter
        id="chapitre-2"
        caption="La matière"
        chapterNumber="II"
        tone="noir-velours"
        align="right"
        title={`Elle ne ressemble à <em class="font-italic-editorial text-or-light">aucune autre peau</em>.`}
        body={`Le silicone médical certifié ISO&nbsp;10993 n’est pas un argument marketing — c’est un choix qui coûte. Chaque millilitre coule plus lentement, prend la tiédeur du corps en quelques secondes, ne garde aucune odeur. <em>Velouté, soyeux, dense.</em> Trois adjectifs qui disent ce qu’une photographie ne pourra jamais capturer.`}
        visual={
          <div className="relative flex aspect-square w-full max-w-md items-center justify-center">
            {/* Ondulations concentriques or */}
            <div
              aria-hidden="true"
              className="border-or/30 absolute inset-0 rounded-full border motion-safe:animate-[ripple_4s_ease-out_infinite]"
            />
            <div
              aria-hidden="true"
              className="border-or/40 absolute inset-8 rounded-full border motion-safe:animate-[ripple_4s_ease-out_infinite_0.8s]"
            />
            <div
              aria-hidden="true"
              className="border-or/50 absolute inset-16 rounded-full border motion-safe:animate-[ripple_4s_ease-out_infinite_1.6s]"
            />
            <div className="bg-or/15 relative flex size-32 items-center justify-center rounded-full backdrop-blur-sm">
              <Fleuron variant="mark" size="lg" color="or" className="opacity-90" />
            </div>
            <style>{`
              @keyframes ripple {
                0% { transform: scale(0.85); opacity: 0.65; }
                100% { transform: scale(1.15); opacity: 0; }
              }
            `}</style>
          </div>
        }
      />

      {/* ─── CHAPITRE III — LE GESTE ────────────────────────────────── */}
      <CinematicChapter
        id="chapitre-3"
        caption="Le geste"
        chapterNumber="III"
        tone="rouge"
        align="center"
        title={`Lent, patient, <em class="font-italic-editorial text-or-light">silencieux</em>.`}
        body={`Un objet ne devient rituel que lorsqu’il s’accorde à un geste. Notre collection est pensée pour ça : des courbes qui ne surprennent pas la main, un poids qui rassure sans alourdir, un silence moteur qui n’interrompt jamais la pensée. <strong>La technologie est là pour disparaître</strong> — pour que reste, seule, l’intention.`}
      />

      {/* ─── CHAPITRE IV — LE TEMPS ─────────────────────────────────── */}
      <CinematicChapter
        id="chapitre-4"
        caption="Le temps"
        chapterNumber="IV"
        tone="jour"
        align="left"
        title={`Cinq minutes. Puis <em class="font-italic-editorial text-or-dark">le reste de la vie</em>.`}
        body={`Les études publiées dans le <em>Journal of Behavioral Medicine</em> en 2023 le montrent : trois à huit minutes quotidiennes d’un micro-rituel attentif réduisent le cortisol salivaire de 12&nbsp;% en six semaines. Ce n’est pas spectaculaire. <strong>C’est patient</strong>. Et c’est peut-être la leçon la plus importante qu’un objet peut donner.`}
        quote="Ralentir ne change pas ce qui est urgent. Ralentir change la façon dont nous tenons ce qui est urgent."
        quoteAuthor="Camille Mercier · Rédactrice, ex-Grazia Beauty"
        visual={
          <div className="relative flex aspect-square w-full max-w-sm items-center justify-center">
            {/* Minuterie stylisée */}
            <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-or/30"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="565.48"
                strokeDashoffset="392"
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="text-or-dark motion-safe:animate-[sweep_6s_ease-in-out_infinite]"
              />
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="fill-noir font-display"
                fontSize="28"
                fontWeight="500"
              >
                05
              </text>
              <text
                x="100"
                y="120"
                textAnchor="middle"
                className="fill-or-dark"
                fontSize="10"
                letterSpacing="0.2em"
                fontFamily="Inter, sans-serif"
              >
                MINUTES
              </text>
            </svg>
            <style>{`
              @keyframes sweep {
                0% { stroke-dashoffset: 565.48; }
                50% { stroke-dashoffset: 300; }
                100% { stroke-dashoffset: 565.48; }
              }
            `}</style>
          </div>
        }
      />

      {/* ─── CHAPITRE V — LA DISCRÉTION ─────────────────────────────── */}
      <CinematicChapter
        id="chapitre-5"
        caption="La discrétion"
        chapterNumber="V"
        tone="noir-velours"
        align="right"
        title={`Livré comme on livre un <em class="font-italic-editorial text-or">secret</em>.`}
        body={`Boîte extérieure neutre, sans logo, sans mention du contenu. À l’intérieur, une carte ivoire signée à la main, un ruban or champagne, un monogramme AF gaufré. Rien qui ne trahisse, à la réception comme à la remise. <strong>La confidentialité est une forme de respect</strong> — envers l’objet, envers celle qui l’a choisi, envers son rituel.`}
        visual={
          <div className="border-or/20 bg-noir relative flex aspect-[4/5] w-full max-w-sm items-center justify-center border p-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <Fleuron variant="crown" size="md" color="or" className="opacity-80" />
              <p className="ui-caps text-or/80 text-[10px]">Atelier Frisson</p>
              <p className="font-italic-editorial text-ivoire/75 text-xs">
                Carte signée à la main
                <br />
                Paris — avril 2026
              </p>
              <Fleuron variant="divider" size="sm" color="or" className="opacity-50" />
            </div>
          </div>
        }
      />

      {/* ─── CHAPITRE VI — LE SOI ───────────────────────────────────── */}
      <CinematicChapter
        id="chapitre-6"
        caption="Le soi"
        chapterNumber="VI"
        tone="rouge"
        align="center"
        title={`Tout cela, <em class="font-italic-editorial text-or-light">pour vous</em>.`}
        body={`Atelier Frisson ne fabrique pas des accessoires. Nous concevons des <strong>points d’appui</strong> — de petits objets qui vous rappellent, quand la journée vous dépossède, que vous avez aussi le droit de vous appartenir. Le rituel n’est pas un luxe. C’est une forme de dignité que l’époque a oublié de donner aux femmes.`}
        quote="Pour tous les rituels. Pour tous les moments."
        quoteAuthor="La tagline de la maison"
      />

      {/* ─── ÉPILOGUE ───────────────────────────────────────────────── */}
      <CinematicEpilogue
        overline="Fin de l'expérience — début du rituel"
        headline={`Le prochain geste <em class="font-italic-editorial text-or">vous appartient</em>.`}
        body="Découvrez la collection inaugurale — huit objets conçus à Paris, en silicone médical certifié, livrés dans un emballage signé à la main."
        primaryCta={{ label: 'Voir la collection', href: '/boutique' }}
        secondaryCta={{ label: 'Lire le journal', href: '/rituels' }}
      />
    </>
  );
}
