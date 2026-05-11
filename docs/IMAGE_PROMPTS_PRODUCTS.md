# Atelier Frisson — 20 Produits × 5 Vues = 100 Prompts GPT Image 2

**Modèle cible** : `gpt-image-2`
**DA** : Bodoni Moda · ivoire `#F2EADF` · rouge laqué `#8B1424` · noir velours `#0A0706` · or champagne `#C9A36B`
**Catalogue cible** : pivot V2 « Couples 30-50 » — 40% objets, 25% lingerie, 20% cosmétique, 15% accessoires.

---

## Principes guardrail-safe (GPT Image 2)

Pour les produits lingerie + accessoires, `gpt-image-2` refuse les prompts qui
combinent : **(a)** un fragment corporel genré (« woman's torso/back/hip/leg »),
**(b)** un descripteur de peau (« warm skin », « skin tone warm »), **(c)** un
contexte intime (lingerie portée, lit, lumière tungstène basse).

**Stratégie pour les vues "porté"** : remplacer toute mention de corps par un
mannequin de tailleur en bois (« tailor's wooden dress-form mannequin, no head,
no figure, neutral wood color »). Le mannequin couture conserve l'information
« comment le vêtement tombe » sans déclencher les guardrails — c'est la
convention Carine Gilson, La Perla et Cadolle pour leurs catalogues B2B.

| Trigger refusé | Alternative safe |
|---|---|
| `woman's torso wearing X` | `garment draped on tailor's wooden dress-form mannequin` |
| `woman's hip / leg / forearm` | section partielle du mannequin (waist-section, leg-form) |
| `Helmut Newton restraint` | `Carine Gilson workshop`, `Saint Laurent SS25 still life` |
| `Helmut Newton interior` | `Pierre Yovanovitch interior`, `Sofia Coppola interior` |
| `confident sensuality`, `tender intimacy` | `quiet confidence`, `tender restraint`, `atelier reveal` |
| `skin (warm/light/tone)`, `no make-up` | omettre tous descripteurs cutanés |
| `boudoir` | `private salon`, `dressing-room`, `dimly-lit interior` |
| `Sofia Coppola intimate` | `Sofia Coppola interior` |
| `forearm fragment, no face, no full body` | reframe sur dish céramique / surface objet |

**Si un prompt est refusé** :
1. Retirer toutes mentions de fragments corporels et descripteurs de peau.
2. Reformuler en « still life » pur ou « draped on mannequin ».
3. Retirer toute référence à Helmut Newton, Vanessa Beecroft, Robert Mapplethorpe, Terry Richardson.
4. Si toujours refusé en `quality: high` → tenter en `quality: standard`.
5. En dernier recours : compositer 2 visuels séparés (objet + drapé) en post.

---

## Cadre constant pour TOUS les produits

**5 vues standardisées par produit** :

| # | Vue | Usage | Ratio | Résolution |
|---|---|---|---|---|
| 1 | **Hero e-com** | Card produit, fiche principale | `4:5` | 2400×3000 |
| 2 | **3/4 angle** | Galerie fiche produit, alt | `1:1` | 2400×2400 |
| 3 | **Detail / Macro** | Zoom matière, texture | `1:1` | 2400×2400 |
| 4 | **Packaging** | Unboxing, social, OG | `4:5` | 2400×3000 |
| 5 | **Lifestyle / contexte** | Lookbook, blog, Pinterest | `4:5` | 2400×3000 |

**Règles globales** :
- Pas de visages reconnaissables. Mains, silhouettes, drapés. Intimité suggérée, jamais montrée.
- Pas de nudité. Lingerie portée → cropping abdominal/dos seulement, jamais frontal poitrine/bassin.
- Backdrop signature : ivory linen, travertine, marbre, lin froissé, satin. Lumière naturelle douce, grain 35mm.
- Toujours en fin de prompt : `no extra words, no duplicate text, no watermark, no logo drift, no faces visible`.
- Quality: `high` sur Hero & Packaging. `standard` acceptable sur 3/4 et Detail si itération budget.

---

# CATÉGORIE 1 — OBJETS (8 produits)

---

## 1 · DUO — Stimulateur couple (forme U / we-vibe)

**Identité** : Silicone médical mat ivoire, base or champagne discrète, forme ergonomique en U.
**Promesse** : Le geste partagé, sans intrusion visuelle.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree slight overhead, single matte ivory silicone object in soft U-shape silhouette (~10cm long, no visible logo), placed centered on creamy travertine plinth #F2EADF, soft directional window light from upper-left, gentle shadow falling right. Backdrop: ivory linen lightly out of focus. A single thin gold ring at the base of the object (champagne gold #C9A36B). Color palette: ivory 75%, champagne gold 5%, warm shadow umber 20%. Style references: Aesop bottle photography × Hermès petit h × Constantin Brancusi sculpture restraint. Shallow depth of field, no extra words, no duplicate text, no watermark, no logo drift, no faces visible.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same matte ivory silicone U-shaped object now rotated 35 degrees showing depth and curve, placed on travertine plinth, soft side-light revealing form contour, single thin champagne gold ring detail at base catching light. Pure white-ivory backdrop. Mood: clinical-luxury crossbreed, Apple product photography meets Aesop apothecary. Color: ivory dominant, single gold accent. Sharp focus on object, soft bokeh background. No extra words, no watermark, no logo drift, no faces.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of matte medical silicone surface in ivory #F2EADF, fine matte texture revealed by raking side-light from left, single thin champagne gold ring band crossing the frame diagonally, gold catching reflective highlight. Pure material study. Color: monochromatic ivory with single gold accent. Style: Hiroshi Sugimoto material × Aesop bottle macro. Ultra-shallow depth of field, no objects identifiable, abstract texture only, no extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography eye-level slight overhead 75-degree, matte ivory cardboard box with magnetic flap closed, gold-foil embossed wordmark "ATELIER FRISSON" in Bodoni Moda serif uppercase narrow letter-spacing on the front (single instance, the only readable text), placed on creamy ivory linen, side-lit by warm afternoon window. Slim raw silk ribbon in oxblood #8B1424 wrapped diagonally and tied. Color palette: ivory 70%, gold 15%, oxblood 15%. Style: Aesop unboxing × Smythson stationery × Hermès orange-box weight. Shallow depth of field, no duplicate "ATELIER FRISSON", no extra words, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle photography 35mm grain, on a marble bathroom shelf ledge: the matte ivory U-shaped silicone object resting beside a folded ivory waffle towel, a single tall taper candle (unlit), and a small ceramic dish with a few drops of clear oil. Soft window light from upper-right, gentle bathroom morning atmosphere, no people. Color palette: ivory dominant, sage towel accent, warm marble veining. Mood: Aesop apothecary × spa morning × Pierre Yovanovitch bathroom. Shallow depth of field on object, dish blurred. No extra words, no watermark, no logo drift, no faces.
```

---

## 2 · ONDE — Wand massager (baguette stimulation externe)

**Identité** : Silicone laqué oxblood profond, manche brossé champagne, tête bulbeuse.
**Promesse** : La vague qui parcourt.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single elegant wand massager (~22cm long, slim handle in brushed champagne gold #C9A36B, bulbous head in deep oxblood lacquer #8B1424 polished mirror-finish, no visible buttons or logo), held vertically on creamy travertine plinth. Soft directional window light from upper-left, mirror reflection of warm window highlight visible on lacquered head. Color palette: ivory background 55%, oxblood 30%, champagne gold 15%. Style: Dyson elegance × Hermès petit h × Constantin Brancusi polish. Shallow depth of field, no extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle slightly low, same wand object now horizontal resting diagonally on creamy ivory linen surface, head in foreground catching ample side-light revealing oxblood lacquer mirror-finish, slender champagne-gold handle receding into soft focus. Color palette: ivory 50%, oxblood 30%, champagne gold 20%. Mood: editorial product, Wallpaper magazine. Shallow depth of field on head, handle softly out of focus. No extra words, no watermark, no logo drift.
```

### Vue 3 — Detail / Macro
```
Macro photography 90mm f/2.8, extreme close-up of polished oxblood Chinese-lacquer #8B1424 surface curving into a junction with brushed champagne-gold metal, raking side-light from upper-right revealing lacquer mirror reflection of soft warm window and gold brush-pattern grain, micro material textures visible. Pure material study. Color: oxblood dominant, gold accent, single warm highlight. Style: Ming dynasty lacquer × Hiroshi Sugimoto material. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography eye-level 75-degree, slim elongated matte ivory cardboard box with magnetic side flap half-open revealing champagne-gold tissue paper and a glimpse of oxblood lacquer surface inside (object intentionally blurred), placed on travertine surface with a folded silk ribbon in oxblood beside. Gold-foil embossed wordmark "ATELIER FRISSON" Bodoni Moda serif on box top (only readable text, single instance). Soft afternoon window light. Color palette: ivory 60%, oxblood 20%, champagne 20%. Style: Aesop unboxing × Le Bon Marché gift wrap. Shallow depth of field, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle photography 35mm grain, eye-level on a low velvet upholstered armchair seat in deep sage-green: the wand massager (oxblood head, gold handle) resting on a folded ivory cashmere throw, a closed leather-bound notebook beside, a small porcelain cup of espresso. Late afternoon golden window light from left, Parisian apartment ambiance. Color palette: sage 35%, ivory 30%, oxblood 15%, champagne gold 10%, dark espresso 10%. Mood: 6th arrondissement private salon, Saint-Germain afternoon. Shallow depth of field. No people, no faces, no extra words, no watermark.
```

---

## 3 · ÉTINCELLE — Bullet vibrator compact

**Identité** : Petit format poche, silicone mat ivoire, bouton or champagne unique.
**Promesse** : Discrétion absolue, geste rapide.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single compact bullet-shaped object (~9cm long, smooth matte ivory silicone #F2EADF with a single thin champagne gold band ring near the base and a barely-visible round button of same gold), placed centered standing upright on creamy travertine plinth. Soft directional window light from upper-left, gentle elongated shadow right. Backdrop: ivory linen out of focus. Color palette: ivory 80%, champagne gold 5%, shadow umber 15%. Style: Apple product simplicity × Aesop apothecary × Muji minimalism. Shallow depth of field, no extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 slight low-angle, same bullet object now horizontal on creamy ivory linen, button-detail in champagne gold facing camera at 60-degree angle catching a single highlight, soft side-light revealing matte texture. Backdrop: blurred ivory linen folds. Color: ivory dominant, gold accent. Mood: clean editorial, Wallpaper magazine. Shallow depth of field. No extra words, no watermark, no logo drift.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of matte medical silicone surface meeting a fine champagne-gold ring band and a small recessed circular gold button, raking side-light from left revealing matte fiber texture and gold polish reflection. Color: ivory and champagne gold only. Pure material study. Ultra-shallow depth of field. Style: Hiroshi Sugimoto × product editorial macro. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, small square matte ivory cardboard box (~8cm) with magnetic flap closed, gold-foil "ATELIER FRISSON" wordmark Bodoni Moda serif uppercase on top (only readable text, single instance), thin oxblood silk ribbon wrapped twice and tied bow on side, placed on creamy ivory linen with a small wax-sealed care card beside. Soft window light from upper-right. Color palette: ivory 65%, gold 15%, oxblood 20%. Style: Smythson × Aesop. Shallow depth of field, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, overhead 90-degree on a marble vanity surface: the compact ivory bullet object placed casually beside an open small leather travel pouch in cognac brown, a folded silk pouch in dusty rose, a tube of clear lip balm, gold hoop earrings. Soft morning window light from top. Color palette: ivory 30%, marble warm beige 25%, cognac 20%, dusty rose 15%, gold 10%. Mood: travel-ready, Paris weekend bag, getaway. No people, no faces, no extra words, no watermark.
```

---

## 4 · MURMURE — Toy télécommandé (couple, longue distance)

**Identité** : Silicone mat ivoire, indicateur LED ambré, télécommande or champagne.
**Promesse** : Le geste à distance, le secret partagé.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single curved matte ivory silicone object (~10cm, S-curve form, one tiny amber LED dot, no buttons no logo) paired with a small thin remote control in brushed champagne-gold metal (~5cm, single circular center button), both objects placed side by side on creamy travertine plinth, soft directional window light from upper-left. Color palette: ivory 70%, champagne gold 20%, amber LED accent 10%. Style: Apple product duo × Hermès petit h. Shallow depth of field, no extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle, same two objects (silicone object + gold remote) arranged in slight diagonal composition on creamy ivory linen, gold remote in foreground catching window highlight, silicone object softly out of focus background. Color: ivory dominant, champagne gold accent. Mood: pair photography, romantic duality. Shallow depth of field. No extra words, no watermark, no logo drift.
```

### Vue 3 — Detail / Macro
```
Macro photography 90mm, extreme close-up of brushed champagne-gold metal surface meeting a fine engraved circle and the edge of matte ivory silicone, raking light from right revealing brush-grain pattern and silicone matte texture, single tiny amber LED light barely visible at frame edge. Pure material macro. Style: watch-photography precision × Aesop macro. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography eye-level 75-degree, longer-format ivory cardboard box (~15cm) with magnetic flap fully open showing two recessed silk-lined cradles in champagne tissue, holding the silicone object and the gold remote nested side by side. Box exterior in matte ivory with embossed AF monogram in Bodoni Moda serif (single instance) only readable mark. Hand-tied oxblood ribbon set aside. Soft afternoon window light. Color: ivory 60%, gold 20%, oxblood 15%, amber 5%. Style: Smythson presentation × Hermès couture box. Shallow depth on contents, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on an open hand-luggage suitcase interior in cognac leather lining: the silicone object nested in a small ivory silk pouch (zipper open, object peeking), the gold remote tucked into an interior leather slip pocket, a folded ivory cashmere wrap, a passport in oxblood leather, a small Eiffel Tower-shaped keychain. Soft morning window light from top-left. Color: cognac 35%, ivory 30%, oxblood 15%, gold 10%, sky blue passport accent 10%. Mood: long-distance couple, Paris-Tokyo flight, anticipation. No people, no faces, no extra words, no watermark.
```

---

## 5 · VELOURS — Stimulateur interne signature

**Identité** : Silicone laqué glossy oxblood, base or champagne, forme ergonomique sculpturale.
**Promesse** : La pièce signature, le rituel du soir.

### Vue 1 — Hero e-com
```
Product photography eye-level slight overhead 75-degree, single sculptural object with curved silhouette (~18cm), surface in deep oxblood Chinese-lacquer #8B1424 polished mirror-finish, base ring in brushed champagne gold #C9A36B, no buttons visible, no logo. Placed centered on creamy travertine plinth, soft directional window light from upper-left throwing mirror reflection of window pane on lacquer surface. Color palette: ivory background 50%, oxblood 35%, champagne gold 15%. Style: Constantin Brancusi sculpture × Ming dynasty lacquerware × Hermès petit h. Shallow depth of field, no extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same sculptural oxblood-lacquer object now lying horizontally on creamy ivory satin surface, soft side-light from left revealing curve and mirror reflection along the body, champagne gold base ring catching highlight at frame edge. Backdrop: blurred satin folds. Color: oxblood dominant, ivory 30%, gold 10%. Mood: editorial atelier. Shallow depth of field. No extra words, no watermark, no logo drift.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of polished oxblood lacquer surface curving into brushed champagne-gold metal junction, raking light from right revealing lacquer mirror-reflection of soft warm window and the gold brushed grain pattern. Pure material study. Color: oxblood and champagne gold only. Style: Ming dynasty lacquer macro × Hiroshi Sugimoto. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography eye-level 75-degree, elongated ivory cardboard presentation box with hinged flap open at 110 degrees, revealing the oxblood-lacquer sculptural object cradled in a recessed champagne-gold silk-lined bed, a folded ivory care leaflet beside, a small ivory drawstring pouch in raw silk. Gold-foil embossed AF monogram in Bodoni Moda serif on hinged inner-lid (only readable mark, single instance). Soft afternoon window light. Color: ivory 50%, oxblood 25%, champagne gold 25%. Style: Smythson box × Goyard presentation × Hermès Birkin reveal. Shallow depth on object, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, evening atmosphere on a deep walnut bedside table: the oxblood-lacquer sculptural object placed beside a single tall taper candle (lit, warm flame), a folded ivory cashmere throw in deep shadow, a closed leather-bound book in cognac, a small crystal glass with single ice cube and amber liquid. Walls in deep ink-black behind. Color palette: ink-black 40%, walnut warm 25%, oxblood 15%, ivory cashmere 10%, candle amber 10%. Mood: blue-hour bedroom, Wong Kar-wai cinematic, slow evening, no rush. No people, no faces, shallow depth of field. No extra words, no watermark.
```

---

## 6 · PROFOND — Massager prostatique (couples)

**Identité** : Silicone mat noir velours, base or champagne, forme courbée anatomique.
**Promesse** : Le territoire à explorer, ensemble.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single curved sculptural object (~12cm, soft anatomical S-shape, surface in deep matte velvet-black silicone #0A0706, no buttons, no logo, base ring in brushed champagne gold), placed standing upright on creamy travertine plinth, soft directional window light from upper-left throwing soft elongated shadow right. Color palette: ivory background 60%, velvet black 30%, champagne gold 10%. Style: Saint Laurent menswear × Constantin Brancusi sculpture × Aesop apothecary. Shallow depth of field, no extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle slight low, same matte black sculptural object now lying diagonally on creamy ivory linen, gold base ring foreground catching warm side-light, surface revealing soft matte velvet texture. Color: ivory 50%, velvet black 35%, champagne gold 15%. Mood: confident editorial, masculine sophistication. Shallow depth of field. No extra words, no watermark, no logo drift.
```

### Vue 3 — Detail / Macro
```
Macro photography 90mm, extreme close-up of matte velvet-finish black silicone surface meeting a brushed champagne-gold base ring, raking light from upper-left revealing micro-fiber matte texture and gold brushed grain. Pure material study. Color: deep ink black 75%, gold 25%. Style: Saint Laurent menswear macro × material editorial. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, matte ivory cardboard box with embossed AF monogram in champagne-gold foil Bodoni Moda serif (only readable text, single instance), magnetic flap open revealing oxblood silk-lined recessed cradle holding the matte black sculptural object. Folded ivory care leaflet beside. Soft window light from upper-right. Color: ivory 55%, oxblood lining 20%, velvet black 15%, gold 10%. Style: Smythson × Aesop. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on a polished walnut writing desk: the matte velvet-black sculptural object placed beside a leather-bound dark green journal, a brass-finished pen, a small crystal glass with neat whiskey, a folded ivory linen pocket square. Late evening warm tungsten reading-lamp light from upper-left. Color palette: walnut warm 40%, ink black 25%, ivory 15%, dark green journal 10%, amber whiskey 10%. Mood: gentleman's study, evening pause, Saint Laurent rive gauche. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

## 7 · PIERRE — Pierre de massage chauffante

**Identité** : Pierre noire polie type basalte, ergonomie en oeuf, base or champagne discrète.
**Promesse** : Le poids juste, la chaleur lente.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single ovoid massage stone (~9cm long, polished basalt-black surface #0A0706 with subtle gray micro-veining like onyx, soft warm reflection across upper curve, single fine champagne-gold band line at the equator), placed centered on creamy travertine plinth, soft directional window light from upper-left. Color: ivory background 60%, basalt black 30%, champagne gold 10%. Style: Aesop hot-stone × Constantin Brancusi egg sculpture × spa apothecary. Shallow depth of field, no extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same polished basalt-black egg-shaped stone now resting on creamy ivory linen surface, side-light from left revealing polish reflection along upper curve, fine champagne-gold equator band catching highlight. Color: ivory 50%, black 40%, gold 10%. Mood: meditative still life. Shallow depth of field. No extra words, no watermark.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of polished basalt-black stone surface revealing micro gray veining and a soft warm window highlight reflection, fine engraved champagne-gold band line crossing diagonally. Pure material study. Color: black with gray micro 80%, gold 20%. Style: Sugimoto material × spa stone macro. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, small square ivory cardboard box (~12cm) with magnetic flap open revealing oxblood silk-lined recessed bed holding the basalt-black stone, a small folded ivory cotton cloth beside, a wax-sealed care card. Gold-foil AF monogram on inner-lid (only readable mark, single instance). Soft window light from upper-right. Color: ivory 55%, oxblood 20%, black 15%, gold 10%. Style: Aesop spa unboxing × Smythson. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on a marble bathroom shelf: the basalt-black egg-shaped stone resting beside a small ivory ceramic dish containing a few drops of warm amber massage oil, a folded sage waffle towel, two unlit white taper candles, a sprig of dried eucalyptus. Soft morning window light from left. Color: marble warm beige 35%, basalt black 20%, ivory 15%, sage 15%, amber oil 10%, eucalyptus 5%. Mood: home-spa ritual, Aesop apothecary morning. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

## 8 · CRESCENDO — Wand multi-rythmes

**Identité** : Silicone mat ivoire avec nervures sculpturales, manche or champagne, tête souple.
**Promesse** : La progression, l'intensité construite.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single elongated wand object (~24cm, slim brushed champagne-gold #C9A36B handle transitioning into a sculpted matte ivory silicone head with subtle parallel ribbed grooves like art deco architecture, no buttons no logo), held vertically on creamy travertine plinth. Soft directional window light from upper-left revealing rib-shadow detail on head. Color palette: ivory 65%, champagne gold 25%, shadow umber 10%. Style: Art Deco architectural detail × Aesop bottle photography × Wallpaper magazine. Shallow depth of field, no extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same wand now horizontal on creamy ivory linen, ribbed silicone head in foreground catching strong side-light revealing groove shadows, gold handle receding into soft focus. Color: ivory 50%, gold 35%, deep shadow 15%. Mood: editorial product. Shallow depth of field. No extra words, no watermark, no logo drift.
```

### Vue 3 — Detail / Macro
```
Macro photography 90mm, extreme close-up of matte ivory silicone surface with parallel ribbed grooves, raking light from right revealing rib-shadow rhythm and matte fiber texture, transitioning into brushed champagne-gold metal handle at frame edge. Pure material study. Color: ivory dominant, gold accent. Style: Art Deco macro × material editorial. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography eye-level 75-degree, slim elongated ivory cardboard box (~28cm) with hinged side flap open revealing champagne-gold tissue and the ribbed wand cradled in oxblood silk lining, hand-tied silk ribbon set beside. Gold-foil AF monogram on inner-lid in Bodoni serif (only readable text). Soft afternoon window light. Color: ivory 55%, oxblood 20%, champagne 15%, gold 10%. Style: Aesop unboxing × Hermès Kelly box. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on a marble vanity ledge: the ribbed-wand object resting on a folded ivory silk scarf, beside a small open jewelry box revealing gold rings, a vintage Diptyque candle, an open art book on Art Deco architecture (cover only, no readable spine text). Soft late afternoon window light from upper-right. Color: marble warm 30%, ivory 25%, gold 20%, oxblood candle 15%, dark book 10%. Mood: Parisian apartment dressing-room, getting ready. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

# CATÉGORIE 2 — LINGERIE (5 produits)

---

## 9 · SILLAGE — Nuisette soie

**Identité** : Soie 22 momme ivoire perle, coupe slip dress mi-cuisse, bordure dentelle Calais champagne.
**Promesse** : Le drapé qui suit, jamais ne pèse.

### Vue 1 — Hero e-com
```
Editorial lingerie photography eye-level slight low-angle 65-degree, ivory pearl silk slip-dress on a slim wooden hanger against a creamy ivory linen wall, soft directional window light from left revealing silk sheen and gentle drape folds, fine champagne-gold lace trim along bust line and lower hem visible, narrow adjustable straps. Garment shown empty (no body), purely as object. Color palette: ivory pearl silk 75%, champagne gold lace 15%, warm shadow umber 10%. Style: La Perla × Carine Gilson × Toast magazine product. Shallow depth of field on lace detail, fabric crisp. No extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle (draped, no body)
```
Editorial lingerie photography slight 3/4 angle, the same ivory pearl silk slip-dress now draped softly on a tailor's wooden dress-form mannequin (no head, no figure, neutral wood color), revealing the natural fall of the fabric, the fine champagne-gold lace trim along the bust line and lower hem catching warm window light from left. Backdrop: ivory plaster wall, soft directional morning light, gentle film grain. Color: ivory silk 65%, wood mannequin 15%, gold lace 15%, soft shadow 5%. Mood: atelier presentation, Carine Gilson workshop × Toast magazine product editorial × Vogue Italia atelier visit. Shallow depth of field on lace, fabric crisp. No extra words, no watermark, no logo drift, no figures, no faces.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of silk satin fabric weave in ivory pearl meeting hand-knotted Calais lace trim in champagne-gold metallic thread, raking side-light from left revealing silk sheen and lace pattern intricacy. Pure material study. Color: ivory 65%, champagne gold 35%. Style: La Perla product macro × textile editorial. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, the ivory silk slip-dress folded in three onto a sheet of champagne tissue paper, placed inside a flat ivory cardboard presentation box, lid set aside revealing oxblood silk ribbon and a wax-sealed care card with embossed AF monogram (single readable mark). Soft afternoon window light. Color: ivory 70%, champagne tissue 15%, oxblood 10%, gold 5%. Style: La Perla unboxing × Carine Gilson presentation. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the ivory silk slip-dress draped casually across an unmade bed of creamy linen sheets, a single dried hydrangea bloom on the pillow, soft morning window light from left, a wooden hanger dangling off the bed-frame, no people. Atmosphere of after-the-night, the morning after. Color: ivory dominant 70%, dusty mauve hydrangea 15%, walnut hanger 10%, soft sage shadow 5%. Mood: Sofia Coppola morning × Marie Antoinette private chambers. Shallow depth on flower. No extra words, no watermark, no faces.
```

---

## 10 · DENTELLE NOIRE — Body dentelle

**Identité** : Body en dentelle Leavers noire, doublure soie noire, bretelles fines, agrafes or champagne.
**Promesse** : L'architecture du désir.

### Vue 1 — Hero e-com
```
Editorial lingerie photography eye-level slight low-angle, black Leavers-lace bodysuit on a slim wooden hanger against creamy ivory linen wall, intricate floral lace pattern visible across bust and torso, fine champagne-gold hook closures along front-line, soft directional window light from left revealing lace pattern shadows on the wall behind. Garment shown empty, no body. Color palette: ivory wall 50%, ink-black lace 40%, champagne gold 10%. Style: La Perla × Aubade × Carine Gilson. Shallow depth of field on lace detail. No extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle (draped, no body)
```
Editorial lingerie photography 3/4 angle, the same black Leavers-lace bodysuit now suspended on a tailor's wooden dress-form mannequin (no head, no figure, neutral wood color) against a deep ink-black wall, single warm tungsten reading-lamp from upper-left throwing rim light along the lace contour, the fine champagne-gold hook closures catching highlight along the front line. Color: ink-black 55%, wood mannequin 15%, lace pattern shadow on wall 20%, gold hooks 10%. Mood: atelier reveal, refined and quiet, Carine Gilson workshop × Cadolle Paris atelier × Saint Laurent SS25 still life. Shallow depth of field, soft film grain. No extra words, no watermark, no figures, no faces.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of black Leavers floral lace pattern on a slightly translucent black silk lining, single champagne-gold hook closure crossing the frame diagonally, raking side-light from left revealing thread intricacy and gold polish. Pure material study. Color: deep black 75%, ivory skin-tone glimpse 15%, gold 10%. Style: La Perla macro × Calais lace catalog. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography 80-degree slight overhead, the black lace bodysuit folded onto champagne tissue inside an ivory presentation box, lid open, a folded ivory care leaflet and oxblood silk ribbon beside, wax-sealed AF monogram card. Soft window light. Color: ivory box 50%, ink-black lace 25%, champagne 15%, oxblood 10%. Style: La Perla × Smythson. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the black lace bodysuit draped across the back of a sage-green velvet armchair in a dimly-lit Parisian dressing-room, single tall taper candle burning on a marble side-table beside, a half-empty crystal coupe of champagne, walls in deep encre. Late-evening warm tungsten light from upper-right. Color: ink-black 35%, sage-green 20%, marble 15%, candle amber 15%, champagne flute glint 10%, oxblood drape 5%. Mood: Saint Laurent rive gauche evening × Pierre Yovanovitch interior. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

## 11 · KIMONO — Robe kimono soie

**Identité** : Soie sablée ivoire crème, ceinture nouée, manches longues fluides, bordure rouge laqué.
**Promesse** : Le geste du matin, la robe d'écriture.

### Vue 1 — Hero e-com
```
Editorial photography eye-level, ivory crème silk-sand kimono robe on a slim wooden hanger against creamy ivory linen wall, robe held open partially with the long sleeve drape visible, fine deep oxblood-rouge piping along collar and cuffs, sashed belt of same color hanging loose. Soft directional window light from left revealing silk sheen and drape folds. Garment empty. Color palette: ivory crème 70%, oxblood piping 15%, warm shadow 15%. Style: Toast magazine × Carolina Herrera robe × Le Bon Marché home. Shallow depth of field on piping detail. No extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle (draped, no body)
```
Editorial photography 3/4 angle slight low-angle, the same ivory silk-sand kimono robe now draped open on a tailor's wooden dress-form mannequin (no head, no figure, neutral wood color), the long sleeve falling naturally and the sash belt knotted softly at the waist of the form, revealing the V-neck line and oxblood-rouge piping along the collar and cuffs. Soft directional morning window light from left. Color: ivory crème 60%, oxblood piping 15%, wood mannequin 15%, soft shadow 10%. Mood: Sunday morning atelier, slow ritual, Sofia Coppola dressing-room × Marie Antoinette private chambers × Marie Daâge porcelain. Shallow depth of field, film grain. No extra words, no watermark, no logo drift, no figures, no faces.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of ivory silk-sand fabric weave meeting a precise oxblood-rouge piping seam, single thread of champagne-gold embroidered "AF" intaglio monogram (only readable mark, single instance, partially visible at frame edge), raking side-light from left revealing fabric grain. Pure material study. Color: ivory 70%, oxblood piping 20%, gold thread 10%. Style: Carolina Herrera robe macro × textile editorial. Ultra-shallow depth of field. No duplicate "AF", no extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography 80-degree slight overhead, the ivory kimono folded in three onto champagne tissue inside a long flat ivory cardboard presentation box, lid set aside, oxblood silk sash ribbon beside, wax-sealed AF care card. Soft window light. Color: ivory 65%, oxblood 15%, champagne 15%, gold 5%. Style: Toast unboxing × La Perla. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the ivory silk kimono casually draped over the back of a Thonet bistro chair in a Haussmann-era Parisian apartment, morning sunlight pouring through tall french windows, a small marble café table with espresso cup, an open hardcover novel face-down, a vase with single dried hydrangea. Color: ivory dominant 50%, walnut 20%, marble 15%, espresso 10%, mauve hydrangea 5%. Mood: 6th arrondissement Sunday morning, slow rise. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

## 12 · JARRETELLES — Set porte-jarretelles

**Identité** : Soie satin ivoire, bandes de soie noire structure, accroches or champagne, finition couture.
**Promesse** : Le geste structurant, la couture du désir.

### Vue 1 — Hero e-com
```
Editorial lingerie photography eye-level, ivory satin garter belt with structured black silk bands and four champagne-gold metal hook clasps, displayed flat on a creamy ivory linen surface, soft directional window light from upper-left. Garment shown as object only, no body. Color: ivory satin 50%, ink-black 35%, champagne gold 15%. Style: Carine Gilson catalog × La Perla product × Cadolle Paris. Shallow depth of field on hook detail. No extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle (draped, no body)
```
Editorial lingerie photography slight 3/4 angle, the same ivory-and-black garter belt now suspended on the lower section of a tailor's wooden dress-form mannequin (waist-and-hip section, no head, no figure, neutral wood color), the four champagne-gold clasps connecting downward to a sliver of black sheer stocking edge clipped onto the lower part of the form. Backdrop: deep ink-black wall, soft tungsten side-light from upper-left throwing rim light along the gold clasps. Color: ivory satin 30%, ink-black 40%, wood mannequin 15%, gold 15%. Mood: Cadolle Paris workshop × Carine Gilson atelier × Saint Laurent SS25 still life. Shallow depth of field. No extra words, no watermark, no figures, no faces.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of a single champagne-gold metal hook clasp engaging with a sliver of sheer black stocking welt, raking light from left revealing gold polish reflection and thread weave. Pure material study, no body parts. Color: gold 50%, black weave 35%, ivory background 15%. Style: Cadolle macro × jewelry-product photography. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography 80-degree slight overhead, the garter belt folded carefully onto champagne tissue inside a flat ivory cardboard presentation box, lid open, oxblood silk ribbon beside, wax-sealed AF care card. Soft window light. Color: ivory box 55%, black 20%, champagne 15%, gold 10%. Style: La Perla × Smythson. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the garter belt draped across the corner of an unmade bed of creamy ivory linen sheets, soft window light from upper-left, a folded ivory robe at the foot of the bed, no people. Atmosphere: dressing-room, before the evening. Color: ivory 65%, ink-black 20%, gold 10%, warm shadow 5%. Mood: Sofia Coppola Marie Antoinette × Cadolle dressing-room. Shallow depth of field. No people, no faces, no extra words, no watermark.
```

---

## 13 · BAS COUTURE — Bas couture autofixants

**Identité** : Bas voile noir mat 15-deniers, couture arrière, bande dentelle Calais champagne en haut.
**Promesse** : La couture qui guide le regard, sans l'imposer.

### Vue 1 — Hero e-com
```
Editorial lingerie photography eye-level, single pair of black sheer 15-denier hold-up stockings, displayed flat on a creamy ivory linen surface, the pair carefully folded showing both lace welts in champagne-gold Calais lace at the top, the back-seam line visible as a fine black stitch running down the leg, soft directional window light from upper-left. Garment as object only, no body. Color: ivory 55%, sheer black 30%, champagne gold lace 15%. Style: Cadolle Paris × Wolford catalog × La Perla product. Shallow depth of field on lace detail. No extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle (draped, no body)
```
Editorial lingerie photography slight 3/4 angle, the same pair of black sheer 15-denier hold-up stockings now draped over a vintage tailor's wooden mannequin leg-form (no foot, no figure, neutral wood color), the back-seam line visible running down the form, the champagne-gold Calais lace welt at the top catching warm tungsten side-light from upper-left. Backdrop: deep ink-black wall, soft directional light. Color: sheer black 50%, wood mannequin 25%, ink-black 15%, gold lace 10%. Mood: Cadolle workshop × Wolford catalog × Saint Laurent SS25 still life. Shallow depth of field, film grain. No extra words, no watermark, no figures, no faces.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of champagne-gold Calais lace welt meeting the sheer black stocking weave, transitioning into the fine vertical black back-seam stitch, raking side-light from left revealing lace intricacy and silicone non-slip band visible at the very edge. Pure material study, no body. Color: champagne gold 45%, sheer black 45%, single ivory thread accent 10%. Style: Wolford macro × textile editorial. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography 80-degree slight overhead, the pair of stockings folded onto champagne tissue inside a flat narrow ivory cardboard presentation box, lid open showing oxblood silk ribbon and a wax-sealed AF monogram care card. Soft window light. Color: ivory 60%, sheer black 15%, champagne 15%, oxblood 10%. Style: Cadolle × Smythson. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the pair of black hold-up stockings draped over the back of a vintage walnut vanity chair, beside a closed jewelry box and a single pair of velvet ivory pumps placed neatly on the parquet floor. Soft late-afternoon window light from left, Parisian dressing-room atmosphere. Color: walnut 30%, ivory 25%, ink-black 25%, parquet warm 20%. Mood: getting ready, Marie Antoinette dressing × Saint Laurent rive gauche. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

# CATÉGORIE 3 — COSMÉTIQUE INTIME (4 produits)

---

## 14 · SOURCE — Lubrifiant à base d'eau

**Identité** : Verre dépoli ivoire 100ml, étiquette letterpress sobre, pompe or champagne.
**Promesse** : La transparence essentielle.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single tall slim apothecary-style glass bottle (~100ml, frosted ivory glass #F2EADF), with a brushed champagne-gold #C9A36B pump dispenser, label in cream cotton paper letterpress with single line text "Source — fluide intime" Bodoni Moda serif and a horizontal hairline rule (the only readable text), placed centered on creamy travertine plinth. Soft directional window light from upper-left throwing soft elongated shadow right. Color: ivory 70%, champagne gold 20%, label cream 10%. Style: Aesop apothecary × Le Labo bottle × Byredo product. Shallow depth of field, no duplicate text, no extra words, no watermark, no logo drift.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same frosted ivory bottle with gold pump now rotated 35 degrees showing the curved profile, soft side-light from left revealing glass diffusion and gold polish on pump, label letterpress "Source — fluide intime" partially visible on the curved face. Backdrop: blurred creamy linen. Color: ivory 65%, champagne gold 20%, cream label 15%. Mood: Aesop catalog × Le Labo product. Shallow depth of field. No duplicate text, no extra words, no watermark.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of frosted ivory glass surface meeting the brushed champagne-gold pump collar, raking light from upper-left revealing fine glass micro-frost texture and gold brush-grain pattern, a single droplet of clear viscous fluid visible at the pump tip. Pure material study. Color: ivory 70%, champagne gold 25%, clear fluid highlight 5%. Style: Aesop macro × Le Labo product photography. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, ivory cardboard box (~14cm tall) with embossed AF monogram in champagne-gold foil Bodoni Moda serif (only readable mark, single instance), the bottle's neck visible peeking out of the open top. Box placed on creamy ivory linen surface beside a folded oxblood silk ribbon and a wax-sealed care leaflet. Soft window light. Color: ivory 60%, champagne gold 20%, oxblood 15%, frosted glass glimpse 5%. Style: Le Labo × Aesop unboxing. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on a marble bathroom shelf: the frosted ivory bottle of "Source" placed beside a folded ivory waffle towel, a single sprig of dried lavender, an open hardcover book with illegible cursive text, soft morning window light from left. Color: marble warm 35%, ivory 30%, sage 15%, lavender mauve 10%, soft amber light 10%. Mood: Aesop apothecary × home spa morning × Soho House bathroom. No people, no faces. Shallow depth of field on lavender. No extra words, no watermark.
```

---

## 15 · AURORE — Bougie de massage

**Identité** : Verre fumé ambré 200ml, mèche bois, cire 100% végétale, label letterpress, parfum vanille-musc.
**Promesse** : La cire qui devient huile, la flamme qui devient toucher.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single short cylindrical amber-smoked-glass candle vessel (~9cm tall, 8cm diameter, deep warm amber translucent glass revealing creamy wax interior), wooden wick visible at center, label in cream cotton paper letterpress reading "Aurore — bougie massage" Bodoni Moda serif single line + hairline rule (only readable text), placed on creamy travertine plinth, soft directional window light from upper-left revealing amber glass glow. Color: ivory background 50%, amber glass 35%, wax cream 10%, label 5%. Style: Diptyque catalog × Cire Trudon × Aesop. Shallow depth of field, no duplicate text, no extra words, no watermark, no logo drift.
```

### Vue 2 — 3/4 angle (lit)
```
Product photography 3/4 angle slight low, same amber candle now lit, wood wick burning with soft warm flame, the wax surface starting to melt revealing pool of warm liquid wax in foreground, light dim with candle as primary source, deep ambient shadow background. Color: amber glow 50%, deep ink shadow 30%, wax cream 15%, label 5%. Mood: evening ritual, Diptyque living-room × Wong Kar-wai blue-hour. Shallow depth of field on flame, glass crisp. No duplicate text, no extra words, no watermark.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of melting cream-colored massage wax pooling around a wooden wick, the deep amber-glass vessel wall visible at frame edge, raking light from above revealing the liquid surface tension and wood-grain wick char. Pure material study. Color: cream wax 50%, amber 35%, charred wood wick 15%. Style: Cire Trudon macro × material editorial. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, ivory cardboard box (~10cm) with embossed AF monogram in champagne-gold foil Bodoni serif (only readable mark, single instance), open top revealing the amber-glass candle nested in champagne tissue, oxblood silk ribbon beside, wax-sealed AF care card. Soft window light. Color: ivory 55%, amber 20%, champagne 15%, oxblood 10%. Style: Diptyque unboxing × Smythson. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on a marbled side-table in a dimly-lit bedroom: the amber-glass massage candle is burning warmly as the central light source, a small ivory ceramic dish beside (catching a drop of warm wax), a folded ivory waffle towel, two crystal coupes of champagne, a sprig of dried jasmine. Walls in deep encre. Color palette: amber glow 35%, ink-black 30%, marble warm 15%, ivory 10%, champagne flute glint 10%. Mood: blue-hour bedroom, slow evening, Cire Trudon living-room × Aesop apothecary night. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

## 16 · HUILE — Huile sensuelle pour le corps

**Identité** : Verre dépoli ambré 100ml, pipette or champagne, parfum bois de oud + rose poudrée, base jojoba/argan.
**Promesse** : Le geste long, la peau qui boit.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, single elegant tall apothecary-style frosted amber-glass bottle (~100ml) with a brushed champagne-gold pipette dropper top, label in cream cotton paper letterpress reading "Huile — corps sensuel" Bodoni Moda serif (only readable text, single instance), placed on creamy travertine plinth. Soft directional window light from upper-left, single droplet of golden oil visible suspended at the pipette tip. Color: ivory background 55%, amber glass 30%, champagne gold 10%, label 5%. Style: Aesop bottle × Le Labo apothecary × Susanne Kaufmann. Shallow depth of field, no duplicate text, no extra words, no watermark.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same amber-glass bottle with gold pipette held diagonally on creamy ivory linen surface, oil droplet just released falling toward fabric, soft side-light revealing glass diffusion. Color: ivory 50%, amber 35%, gold 15%. Mood: editorial product action. Shallow depth of field on droplet. No duplicate text, no extra words, no watermark.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of three glistening golden oil droplets falling from a brushed champagne-gold pipette dropper onto a smooth ivory ceramic dish surface, raking side-light from upper-right revealing oil viscosity reflections and droplet impact ripples. Pure material study, no figures. Color: ivory ceramic 50%, golden oil shine 40%, soft shadow 10%. Style: Susanne Kaufmann macro × Aesop product photography. Ultra-shallow depth of field. No extra words, no watermark, no figures, no body parts.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, ivory cardboard box (~14cm tall) with embossed AF monogram in champagne-gold foil Bodoni serif (only readable mark, single instance), the amber-glass bottle's neck and pipette dropper visible at the open top, folded ivory care leaflet and oxblood silk ribbon beside. Soft window light. Color: ivory 60%, amber 15%, champagne 15%, oxblood 10%. Style: Aesop unboxing × Le Labo presentation. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on a creamy linen-draped bedside table: the amber-glass oil bottle placed beside a folded ivory cashmere throw, a small ceramic dish with three drops of golden oil, a single dried damask rose stem, a closed leather book in cognac. Soft late-afternoon window light from left. Color: ivory 35%, walnut book 20%, amber 15%, dusty rose 15%, golden oil 15%. Mood: Sunday afternoon, Susanne Kaufmann × La Maison Plisson tea-time. No people, no faces. Shallow depth of field on rose. No extra words, no watermark.
```

---

## 17 · BAIN RITUEL — Sels de bain duo

**Identité** : Deux flacons verre dépoli (jour rose pâle + nuit ambré profond), bouchons or champagne, label letterpress.
**Promesse** : Deux temps, deux ambiances, un même rituel.

### Vue 1 — Hero e-com
```
Product photography eye-level 70-degree, two matched short squat apothecary-style frosted-glass bottles (~12cm each, ~250ml) standing side by side on creamy travertine plinth — left bottle in dusty pale-rose frosted glass, right bottle in deep amber frosted glass, both with brushed champagne-gold cork-and-metal stoppers, each with cream cotton letterpress labels reading respectively "Bain — jour" and "Bain — nuit" Bodoni Moda serif (the only readable text). Soft directional window light from upper-left throwing twin elongated shadows. Color palette: ivory background 45%, dusty rose 20%, amber 20%, champagne gold 15%. Style: Aesop duo × Le Labo bath × Susanne Kaufmann. Shallow depth of field, no duplicate text outside labels, no extra words, no watermark.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same two bottles slightly turned at 30 degrees, both labels visible at angle, dusty rose bottle slightly forward, amber bottle slightly back, soft side-light revealing glass frost diffusion on both. Color: ivory 40%, dusty rose 25%, amber 25%, gold 10%. Mood: pair editorial. Shallow depth of field on rose bottle, amber bottle slightly soft. No duplicate text, no extra words, no watermark.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm, extreme close-up of one bottle's frosted dusty-rose glass surface meeting the brushed champagne-gold metal cork stopper, single coarse pale crystal salt grain visible at frame edge, raking light from upper-right. Pure material study. Color: dusty rose 60%, gold 30%, ivory 10%. Style: Susanne Kaufmann macro. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, both bottles nested side by side inside a long flat ivory cardboard presentation box, on champagne tissue, lid open showing AF monogram embossed in champagne-gold foil (only readable mark, single instance). A folded oxblood silk ribbon beside, a wax-sealed care leaflet. Soft window light. Color: ivory 45%, dusty rose glimpse 15%, amber glimpse 15%, champagne 15%, oxblood 10%. Style: Aesop duo unboxing × Le Labo. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, on a marble bathroom ledge along a half-filled bathtub edge, both frosted-glass bottles ("rose" + "amber") side by side, a sprig of dried lavender between them, a folded ivory waffle towel, a single floating petal on the water surface. Soft morning window light from left. Color: marble warm 35%, ivory 20%, dusty rose 15%, amber 15%, sage towel 10%, water reflection 5%. Mood: home-spa Sunday morning × Susanne Kaufmann × Aesop bath. No people, no faces. Shallow depth of field on petal. No extra words, no watermark.
```

---

# CATÉGORIE 4 — ACCESSOIRES (3 produits)

---

## 18 · BANDEAU — Bandeau de soie

**Identité** : Soie satin ivoire crème 22 momme, doublure soie noire, attaches en velours noir.
**Promesse** : La privation choisie, l'écoute amplifiée.

### Vue 1 — Hero e-com
```
Editorial accessory photography eye-level slight overhead 75-degree, single ivory-crème silk-satin sleep mask blindfold with deep black silk lining (slight curl revealing dark interior at one edge), narrow black velvet ties extending out elegantly into the frame, displayed flat-relaxed on creamy travertine plinth, soft directional window light from upper-left revealing silk sheen on the front and matte velvet on the ties. Color palette: ivory crème 60%, ink-black 30%, soft shadow 10%. Style: La Perla × Hermès silk × Toast magazine. Shallow depth of field on tie detail, mask crisp. No extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle (suspended, no body)
```
Editorial accessory photography 3/4 angle slight low, the same ivory silk-satin sleep mask blindfold now suspended in a soft drape from a discreet brass hook on a creamy ivory plaster wall, the deep black silk lining showing where the mask curves, the narrow black velvet ties hanging long and loose, soft directional window light from left revealing silk sheen on the front and matte velvet on the ties. Color: ivory crème 55%, ink-black tie 30%, soft shadow 10%, brass hook accent 5%. Mood: still life accessory, Carine Gilson catalog × Toast magazine product editorial × Aesop wall-display. Shallow depth of field on silk fold, ties slightly out of focus. No extra words, no watermark, no figures, no faces.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of the ivory-crème silk satin front-fabric meeting the deep black silk lining at the seam edge, the narrow black velvet tie running across the frame diagonally, raking side-light from upper-right revealing silk sheen and velvet matte texture contrast. Pure material study. Color: ivory 50%, ink-black silk 25%, ink-black velvet 25%. Style: Carine Gilson macro × textile editorial. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, the ivory silk blindfold folded loosely onto champagne tissue inside a small flat ivory cardboard presentation box, lid open showing oxblood silk ribbon and a wax-sealed AF monogram care card. Soft window light. Color: ivory 60%, ink-black 20%, champagne 15%, oxblood 5%. Style: Carine Gilson unboxing × Smythson. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the ivory silk blindfold draped casually on a folded ivory cashmere pillow on an unmade bed of creamy linen, beside a closed leather-bound book and a single tall taper candle (unlit). Soft late-afternoon window light from left. Color: ivory dominant 60%, ink-black mask accent 15%, walnut book 15%, soft warm shadow 10%. Mood: evening preparation, Sofia Coppola interior. No people, no faces. Shallow depth of field. No extra words, no watermark.
```

---

## 19 · PLUME — Caresse plume

**Identité** : Plume d'autruche teintée oxblood, manche en bois ébène, virole or champagne.
**Promesse** : Le toucher qui n'en est pas un.

### Vue 1 — Hero e-com
```
Editorial accessory photography eye-level 70-degree, single elegant feather-tickler with a slim ebony-black wood handle (~25cm long), a brushed champagne-gold ferrule, and a tall plume of deep oxblood-rouge dyed ostrich feather (~15cm), placed standing upright leaning slightly against a creamy travertine plinth, soft directional window light from upper-left animating individual feather barbs. Color palette: ivory background 50%, oxblood feather 30%, ebony wood 15%, champagne gold 5%. Style: Cadolle Paris × Carine Gilson × theatrical editorial. Shallow depth of field on feather barb detail. No extra words, no watermark, no logo drift, no faces.
```

### Vue 2 — 3/4 angle
```
Product photography 3/4 angle eye-level, same feather tickler now lying horizontally on creamy ivory linen surface, the oxblood plume in foreground catching strong side-light from left animating individual barbs, ebony handle and gold ferrule receding into soft focus. Color: ivory 50%, oxblood 30%, ebony 15%, gold 5%. Mood: editorial accessory. Shallow depth of field on plume. No extra words, no watermark.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of individual oxblood-rouge ostrich-feather barbs splaying delicately, raking side-light from upper-left revealing thread-like fiber detail and dyed depth of color, single point of brushed champagne-gold visible at frame edge (the ferrule). Pure material study. Color: oxblood 75%, gold 15%, soft shadow 10%. Style: textile macro × theatrical-prop catalog. Ultra-shallow depth of field. No extra words, no watermark.
```

### Vue 4 — Packaging
```
Product photography slight overhead 80-degree, slim long ivory cardboard box (~30cm) with hinged side-flap open revealing the feather tickler nested in champagne tissue along its length, oxblood silk ribbon set aside, wax-sealed AF monogram care card. Soft window light. Color: ivory 50%, oxblood 25%, ebony 10%, champagne 10%, gold 5%. Style: theatrical-prop unboxing × Smythson. Shallow depth, no duplicate text, no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the oxblood feather tickler resting diagonally across an open vintage hardcover book of poetry (cover plain leather, illegible spine text) on a walnut writing desk, single tall taper candle burning softly upper-right, dried damask rose stem foreground, deep ink-black wall behind. Late-evening warm tungsten light. Color: ink-black 35%, walnut 25%, oxblood feather 20%, candle amber 10%, leather book cognac 10%. Mood: theatrical poetry, Saint Laurent rive gauche evening × Pierre Yovanovitch interior. No people, no faces. Shallow depth of field on feather. No extra words, no watermark.
```

---

## 20 · COFFRET RITUEL — Box cadeau couples Saint-Valentin

**Identité** : Coffret ivoire grand format, contenu : 1 bougie de massage Aurore + 1 huile + 1 plume + 1 carte handwritten.
**Promesse** : Le rituel offert, prêt à célébrer.

### Vue 1 — Hero e-com
```
Editorial product photography eye-level slight overhead 75-degree, large rectangular matte ivory cardboard presentation box (~30cm wide) with a magnetic flap fully open at 110 degrees, revealing four nested objects in champagne tissue paper compartments — a small amber-glass candle, an amber-glass dropper bottle, a folded ivory silk pouch, and a cream cotton handwritten note card with cursive sepia ink (illegible cursive). Box exterior in matte ivory with embossed AF monogram in champagne-gold foil Bodoni Moda serif (only readable mark, single instance). Hand-tied oxblood silk ribbon set aside. Placed on creamy ivory linen, soft directional window light from upper-left. Color palette: ivory 60%, champagne gold 15%, amber glass 10%, oxblood ribbon 10%, ink note 5%. Style: Hermès Birkin reveal × Smythson Bond Street × Le Bon Marché holiday counter. Shallow depth of field on note card, contents crisp. No duplicate text, no extra words, no watermark, no logo drift.
```

### Vue 2 — 3/4 angle (closed, hero gift shot)
```
Editorial product photography 3/4 angle slight low, the same large ivory presentation box now fully closed and tied with a hand-tied oxblood silk ribbon in a flat asymmetric bow on top, the embossed champagne-gold AF monogram catching the warm side-light from upper-left, placed on creamy ivory linen with a single dried Cécile Brunner rose stem laid diagonally beside. Color palette: ivory 65%, oxblood 20%, champagne gold 10%, dusty pink rose 5%. Mood: gift-ready, Hermès orange-box gravity × Smythson presentation. Shallow depth of field on rose, box crisp. No extra words, no duplicate "AF", no watermark.
```

### Vue 3 — Detail / Macro
```
Macro photography 100mm f/2.8, extreme close-up of the deep oxblood-rouge wax seal stamped on cream cotton paper care leaflet inside the box, the wax catching warm window highlight, intaglio embossed initials "AF" in Bodoni Moda serif (only readable mark, single instance, one face only), single drop of melted wax beside the seal as a craft detail. Pure material macro. Color: cream paper 50%, oxblood wax 45%, soft shadow 5%. Style: wax seal craft × Smythson stationery. Ultra-shallow depth of field. No duplicate "AF", no extra words, no watermark.
```

### Vue 4 — Packaging (overhead unboxing)
```
Editorial product photography overhead 90-degree flat-lay, the large ivory presentation box centered with magnetic flap fully open, revealing all four contents arranged with intentional negative space — small amber-glass candle top-left, amber-glass oil-dropper bottle top-right, ivory silk pouch (containing implied feather tickler, folded carefully) bottom-left, handwritten cream note card bottom-right. Champagne tissue paper crumpled artistically beside the box. Single dried hydrangea bloom in dusty mauve. Hand-tied oxblood ribbon trailing. On creamy ivory linen tablecloth. Soft window light from top. Color palette: ivory 50%, champagne 15%, amber 15%, dusty mauve 10%, oxblood 10%. Style: Hermès gift unboxing flat-lay × Le Bon Marché holiday × Anthropologie catalog. Shallow depth on hydrangea, contents crisp. No extra words, no duplicate "AF", no watermark.
```

### Vue 5 — Lifestyle / contexte
```
Editorial lifestyle 35mm grain, the large ivory presentation box (closed, tied with oxblood ribbon) placed on a creamy linen-draped bistro table for two in a Parisian apartment dining nook, two coupes of champagne, a single dried damask rose, two folded ivory napkins, soft golden hour evening window light from left. Color palette: ivory 50%, oxblood ribbon and rose 20%, champagne flute glints 15%, walnut table 10%, soft amber light 5%. Mood: Saint-Valentin dinner-for-two, Marie-Antoinette dining × Le Bristol private salon × Sofia Coppola interior. No people, no faces. Shallow depth of field on champagne. No extra words, no watermark, no logo drift.
```

---

## Synthèse — usage opérationnel

**Quantité** : 100 prompts (20 produits × 5 vues).

**Workflow recommandé pour le shoot virtuel** :
1. **Phase 1 (jour 1-2)** : générer les 20 vues Hero (vue 1) → décision SKU par SKU si l'objet "fonctionne" visuellement. C'est le bottleneck.
2. **Phase 2 (jour 3-4)** : générer les vues 3/4 + Detail/Macro pour les 20 SKUs validés.
3. **Phase 3 (jour 5)** : générer les vues Packaging + Lifestyle.

**Calibrage couleur** :
- Si la palette dérive (rose laqué tirant orange / champagne tirant jaune), passer en **mode `edit`** : `Preserve: composition, lighting, depth of field. Change: deep oxblood lacquer color shift toward #8B1424 darker, less orange tint.`
- Toujours valider en preview à 100% sur écran calibré avant approbation.

**Variantes saisonnières à générer** :
- **Saint-Valentin (jan-fév)** : ribbon oxblood + dried rose
- **Anniversaire (toute année)** : ribbon ivoire + dried lavender
- **Noël (déc)** : ribbon champagne + dried eucalyptus + matte gold detailing

**Conformité commerciale** :
- Aucun visage reconnaissable, aucune nudité explicite, intimité suggérée par la mise en scène.
- Compatible avec Pinterest, Meta Ads (en wellness/lifestyle), TikTok organique.
- Pour les ad networks adultes (TrafficJunky, ExoClick), des variantes "saturées" peuvent être générées en gardant la grammaire visuelle.

**Mapping vers le code** :
- Vue 1 (Hero e-com) → champ `images[0]` du produit (`Product.images`).
- Vue 2 (3/4) → `images[1]`.
- Vue 3 (Detail) → `images[2]`.
- Vue 4 (Packaging) → `images[3]` + utilisé pour OG image.
- Vue 5 (Lifestyle) → `images[4]` + utilisé pour Pinterest pin + collections heroes + journal.
