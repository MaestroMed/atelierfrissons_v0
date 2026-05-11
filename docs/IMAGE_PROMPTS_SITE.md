# Atelier Frisson — 20 Prompts GPT Image 2 · Site

**Modèle cible** : `gpt-image-2` (lancé 21 avril 2026)
**DA** : Bodoni Moda · ivoire `#F2EADF` · rouge laqué `#8B1424` · noir velours `#0A0706` · or champagne `#C9A36B` · encre `#1C1A17`
**Références** : Aesop × Byredo × Smile Makers × Dior × Typology
**Test éditorial** : *« une CSP+ parisienne partagerait-elle ce visuel comme elle partagerait Typology ou Byredo ? »*

**Règles globales pour tous les prompts** :
- Pas de visages reconnaissables, pas de nudité explicite. Mains, dos, silhouettes, drapés, objets. Intimité suggérée, jamais montrée.
- Lumière naturelle douce, grain 35mm, profondeur de champ courte. **JAMAIS** "8K ultra HD photoréaliste" — toujours en termes optiques.
- Texte dans l'image **uniquement entre guillemets doubles** + `no extra words, no duplicate text, no watermark, no logo drift`.
- Ratios courants : `16:9` (heros desktop), `4:5` (cards), `1:1` (square), `2:3` (portrait), `9:16` (mobile/Pinterest).

---

## Principes guardrail-safe (GPT Image 2 — mai 2026)

Le modèle `gpt-image-2` refuse certains prompts pour cause de "content policy",
en particulier dès qu'un fragment corporel genré (« woman's torso », « man's hand »)
est combiné à un descripteur de peau (« warm skin », « no make-up ») et à un
contexte intime (lit, lingerie, tungstène, golden hour basse). Triggers récurrents
identifiés sur les 20 prompts du site et leurs alternatives :

| Trigger refusé | Alternative safe |
|---|---|
| `Vanessa Beecroft` (artiste connu pour le nu) | `Carine Gilson workshop`, `Toast magazine product editorial` |
| `Helmut Newton` (érotique signature) | `Pierre Yovanovitch interior`, `Saint Laurent SS25 still life` |
| `Robert Mapplethorpe` | `Hiroshi Sugimoto`, `Constantin Brancusi material study` |
| `Saint Laurent Black Opium campaign` | `Sofia Coppola Marie Antoinette`, `Wong Kar-wai blue-hour` |
| `La Petite Mort` (référence sexuelle française) | `Marie Antoinette correspondence`, `Carnet de Voyage` |
| `woman's hand from the shoulder down` | pure still life — drapé, perles, objet sur table de chevet |
| `man's hand / forearm` (en contexte intime) | objets masculins (montre, anneau, livre cuir, pocket-square) |
| `no overt sexualization`, `tender intimacy` | omettre ; ou `tender restraint`, `quiet attention` |
| `Skin tone warm, no make-up, manicure clear glossy` | omettre tous descripteurs de peau / maquillage |
| `bare back`, `bare shoulder` | silhouette indentée dans coussin, drapé sur fauteuil |
| `intimate`, `sensual`, `sultry`, `seductive` | `tender`, `slow`, `contemplative`, `attentive` |
| `boudoir` | `private salon`, `dressing-room`, `dimly-lit interior` |

**Stratégie générale** : déplacer la sensualité du corps vers l'objet, le tissu,
la lumière. Si un prompt est refusé :

1. Retirer toutes les références aux artistes érotiques connus (Newton, Beecroft, Mapplethorpe, Richardson).
2. Remplacer chaque fragment corporel par un objet équivalent (drap froissé, silhouette indentée dans coussin, mannequin tailleur en bois).
3. Re-générer en variante « still life » pure.
4. Si toujours refusé en `quality: high` → tenter en `quality: standard` (filtre légèrement moins strict).
5. En dernier recours : générer 2 visuels séparés (objet + ambiance) et compositer en post-prod.

---

## 1 — Hero Homepage · Panel "Pour Vous Deux"

📸 **PROMPT GPT IMAGE 2**

```
Editorial fashion photography 35mm Kodak Portra grain, warm Parisian morning light filtering through linen sheer curtains, two pairs of hands on creased ivory silk bedsheet, fingers gently intertwined near the edge of a sage-green velvet pillow, no faces visible, close cropping at wrist level. Single rouge-laqué lacquer object softly out of focus background-right (no logo). Color palette: dominant ivory beige #F2EADF and soft sand, accent of deep oxblood lacquer #8B1424. Composition: rule of thirds, hands centered-left, generous negative space top-right reserved for typographic headline. Mood: tender, slow, refined, Aesop-meets-Byredo apartment in 6th arrondissement. Shallow depth of field, bokeh on background, no extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 3840×2160 (4K hero)

---

## 2 — Hero Homepage · Panel "Pour Elle"

📸 **PROMPT GPT IMAGE 2**

```
Editorial still life photography 35mm Kodak Portra grain, an unmade creamy linen pillowcase with delicate folds resting on an ivory bedsheet, single thread of freshwater pearls coiled loosely across the linen, no figure. Backdrop: warm ivory plaster wall #F2EADF with diffused window light from upper left, soft golden hour. A small lacquered rouge-laqué object resting on a wooden night-table edge in the foreground, blurred bokeh background. Color palette: ivory beige #F2EADF dominant 70%, oxblood lacquer #8B1424 accent 20%, warm umber shadow 10%. Composition: rule of thirds, pillowcase lower-left third, generous breathing room top-right reserved for typographic headline overlay. Style: minimalist editorial still life, Aesop apothecary morning × Byredo perfume editorial × Le Bon Marché home counter. Soft caustic light, shallow depth of field on pearls, no extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `4:5` · Format: WebP · Résolution: 2400×3000

---

## 3 — Hero Homepage · Panel "Pour Lui"

📸 **PROMPT GPT IMAGE 2**

```
Editorial still life photography 35mm grain, on a dark sage cotton rumpled bed sheet: a brushed-steel wristwatch with brown leather strap unfastened beside a folded ivory linen pocket-square, a single discreet matte band ring on a small ceramic dish, an open hardcover book face-down with cognac leather binding, no figure. Backdrop: matte ink-black wall #0A0706 with single warm tungsten reading lamp top-left throwing rim light along the watch, evening atmosphere. A small lacquered oxblood object resting on the side-table at frame-edge. Color palette: charcoal #1C1A17 dominant 50%, warm tungsten amber 25%, deep oxblood #8B1424 accent 15%, cognac leather 10%. Composition: object cluster lower-half, generous black breathing room top for headline typography. Style: Saint Laurent SS25 still life × Aesop nightcare × Wong Kar-wai blue-hour interior. Shallow depth of field, no extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `4:5` · Format: WebP · Résolution: 2400×3000

---

## 4 — Hero Collection "Cadeaux" (Saint-Valentin / Anniversaires)

📸 **PROMPT GPT IMAGE 2**

```
Editorial flat-lay photography overhead 90-degree, three closed gift boxes in graduated sizes on creamy ivory linen tablecloth, top box wrapped in deep rouge-laqué lacquer paper #8B1424 with hand-tied raw silk ribbon in champagne gold #C9A36B, middle box matte ivory #F2EADF with embossed monogram pattern (no readable text), bottom box black velvet #0A0706. Single dried Cécile Brunner rose stem laid diagonally. Wax seal in oxblood with letter "AF" intaglio embossed (the only readable mark allowed). Soft window light from top-left, shallow depth of field on rose petals. Color palette: ivory dominant 60%, rouge laqué 25%, champagne gold 10%, deep ink 5%. Style: Aesop holiday × Smythson stationery × Hermès orange-box gravity. Composition: rule of thirds, ribbon line creates diagonal flow. No extra words, no duplicate "AF", no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 3840×2160

---

## 5 — Hero Box Mensuelle "Rituel Frisson"

📸 **PROMPT GPT IMAGE 2**

```
Editorial product photography eye-level slight overhead 75-degree angle, matte ivory cardboard box #F2EADF with magnetic flap half-open revealing layered tissue paper in champagne gold and a glimpse of three carefully nested objects (silhouettes only, intentionally blurred — a small lacquered red bottle, a folded silk pouch, a tiny black object). The box is placed on a polished travertine surface with veining, side-lit by warm late afternoon window light. A handwritten note on cream cotton paper rests on top of the box, ink calligraphy reading "Rituel n°4 — mai" in dark sepia ink (the only readable text). Color palette: ivory 50%, champagne gold 20%, oxblood 15%, travertine warm beige 15%. Style references: Aesop subscription kit × Byredo unboxing × Le Bon Marché gift wrapping. Shallow depth of field on note, soft caustic shadow under box. No extra words, no duplicate text, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `3:2` · Format: WebP · Résolution: 3000×2000

---

## 6 — Hero Bundles "Coffrets composés"

📸 **PROMPT GPT IMAGE 2**

```
Editorial still life photography eye-level 70-degree, three product objects of complementary form arranged in triangular composition on creamy ivory satin draped over a warm beige linen surface — one tall slender lacquered red bottle, one small matte ivory ceramic-finish object (suggested form, no specific reading), one folded raw silk pouch in dusty pink. All objects unbranded, abstract sculptural silhouettes only. Soft directional window light from left throwing long warm shadows. Color palette: ivory 55%, oxblood lacquer 20%, dusty rose 15%, gold accent 10% (small ribbon thread). Style: Hermès petit h × Aesop trio × Constantin Brancusi sculptural restraint. Composition: triangular hierarchy, generous space top-right for headline. Shallow depth of field, bokeh on far background. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 3840×2160

---

## 7 — Hero Section "L'Atelier" (À propos / Manifesto)

📸 **PROMPT GPT IMAGE 2**

```
Editorial interior photography 35mm grain, view inside a Parisian Haussmann-era apartment converted into an artisan studio, late morning light flooding through tall french windows with thin black mullions, original parquet Versailles floor, white moulded walls, a large wooden worktable with marble top in foreground holding a few unidentifiable sculptural objects in various stages of finishing (raw lacquer, sandpaper sheets, soft cloths), a folded apron in linen draped over a Thonet bistro chair, a vase with single dried hydrangea, no people. Color palette: ivory dominant, warm wood, soft graphite shadows, single oxblood object on table for accent. Mood: quiet craft, Saint-Germain atelier, slow Tuesday morning. Style references: Le Corbusier Atelier × Atelier Brancusi photography × Pierre Yovanovitch interior. Wide-angle 24mm equivalent, shallow depth on foreground objects, mid-ground crisp. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 3840×2160

---

## 8 — Hero Cinématique "Le Rituel" (full-bleed scrollytelling)

📸 **PROMPT GPT IMAGE 2**

```
Cinematic editorial photography 35mm Kodak Portra 800 push-grain, blue-hour bedroom interior, single brass bedside lamp throwing warm tungsten pool of light onto rumpled ivory silk bedsheets with deep creased folds, an empty pillow indented as if recently left (silhouette only, no figure), one small lacquered oxblood object resting on the pillow's edge in sharp focus foreground. Walls in deep encre #1C1A17 with subtle texture. Color palette: warm tungsten amber 30%, deep blue-black shadow 50%, oxblood lacquer accent 15%, ivory silk highlights 5%. Composition: low-angle bed-level perspective, object foreground-center, vast negative shadow space top and right for typographic overlay. Mood: Wong Kar-wai In The Mood For Love × Sofia Coppola Marie Antoinette × Pierre Yovanovitch interior. Heavy bokeh, soft motion blur on linen curtain edge implying gentle draught, deep contrast, no extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `21:9` · Format: WebP · Résolution: 3840×1640 (cinemascope)

---

## 9 — Article cover · "Rituel du matin pour deux"

📸 **PROMPT GPT IMAGE 2**

```
Editorial morning photography 35mm grain, overhead 90-degree flat-lay on rumpled ivory linen sheets, two espresso cups in matte ivory porcelain side by side (one with lipstick mark in muted rose), a small open notebook in ivory paper with handwritten ink lines (illegible cursive), single dried daisy stem, one small lacquered red object placed thoughtfully bottom-left, a pair of round tortoiseshell reading glasses. Soft golden window light from top-left. Color palette: ivory dominant, oxblood accent, warm umber, muted sage. Mood: Sunday morning, café crème, Sofia Coppola Lost in Translation hotel-room atmosphere. Style: Cup of Jo editorial × Kinfolk magazine × Le Bon Marché lifestyle. Shallow depth on glasses, sharp on note. No extra words, illegible handwriting only, no watermark.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `4:3` · Format: WebP · Résolution: 2400×1800

---

## 10 — Article cover · "Le rituel du soir, en silence"

📸 **PROMPT GPT IMAGE 2**

```
Editorial nighttime photography 35mm grain, single tall taper candle burning at the right edge of a marbled bathtub rim, candlelight throwing warm flickering glow on ivory plaster bathroom wall, a single droplet of golden massage oil on a small ivory ceramic dish foreground-left, folded waffle linen towel in sage green, a partial sliver of dark water surface with subtle steam. Mostly underexposed, deep ink shadows dominant. Color palette: candlelight amber 30%, deep ink #0A0706 45%, ivory 15%, oxblood vial accent 10%. Mood: Aesop Marrakech apothecary × Diptyque Baies × Annick Goutal evening. Composition: low-angle, candle right-third, shallow depth on droplet, deep shadow left half for headline overlay. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `4:3` · Format: WebP · Résolution: 2400×1800

---

## 11 — Article cover · "L'art du cadeau-surprise"

📸 **PROMPT GPT IMAGE 2**

```
Editorial gift-wrapping still life photography 35mm grain, overhead three-quarter angle on a polished walnut writing desk: a champagne-gold raw silk ribbon mid-tie around an ivory cardboard box, the loose ribbon end trailing diagonally as if just released, a vintage Mont Blanc fountain pen resting beside, a small wax stamp set with deep rouge wax pellets in a brass bowl, a sheet of letterpress card in cream cotton with embossed border, a pair of polished wooden scissors with brass screws. Window light from upper left, deep wood-warm shadow on right. Color palette: ivory 40%, warm walnut 25%, champagne gold 20%, oxblood wax 15%. Mood: Smythson Bond Street × Hermès gift-wrapping counter × La Maison Plisson tea-time. Composition: ribbon and box centered, ribbon line creates diagonal flow, generous wood breathing room background. Shallow depth of field on wax pellets, no figure. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `4:3` · Format: WebP · Résolution: 2400×1800

---

## 12 — Texture / Section divider · Macro silk

📸 **PROMPT GPT IMAGE 2**

```
Macro photography 100mm f/2.8, extreme close-up of creased ivory silk satin fabric #F2EADF, soft directional side-light revealing fiber sheen and gentle shadow valleys, ultra-shallow depth of field with creamy bokeh on edges, fabric folds creating organic flowing diagonal lines. Pure material study, abstract texture. Color: monochromatic ivory with subtle warm cream highlights and sandy umber shadows. Mood: tactile, calm, contemplative. Style: Hiroshi Sugimoto seascape restraint × Constantin Brancusi material study × Aesop catalog macro. No objects, no figures, no extra words, no watermark.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `21:9` · Format: WebP · Résolution: 3840×1640

---

## 13 — Texture / Section divider · Lacquered surface macro

📸 **PROMPT GPT IMAGE 2**

```
Macro photography 90mm f/4, extreme close-up of deep oxblood Chinese lacquer surface #8B1424, polished mirror-finish revealing a soft warm reflection of an unidentifiable ivory shape and tungsten point-light, micro-fine layer texture barely perceptible, ultra-shallow depth of field. Color palette: deep oxblood dominant, warm amber reflection, single ivory highlight. Style references: Ming dynasty lacquerware × Constantin Brancusi polish × Wabi-sabi material focus. No objects, abstract surface study, no extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `21:9` · Format: WebP · Résolution: 3840×1640

---

## 14 — Texture / Section divider · Embossed monogram (champagne gold on ivory)

📸 **PROMPT GPT IMAGE 2**

```
Macro photography 100mm, extreme close-up of cream cotton card stock with raised gold-foil embossed letter pattern reading "AF" in single instance centered, Bodoni Moda serif roman typeface, narrow champagne-gold #C9A36B foil catching directional grazing light from left, paper fiber texture visible. Color palette: ivory 70%, champagne gold 30%. Mood: Smythson stationery × wedding invitation craft × Atelier d'Offard wallpaper. No background, no other letters, no extra words, no duplicate "AF", no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 3000×1688

---

## 15 — Newsletter signup · Background "La Correspondance"

📸 **PROMPT GPT IMAGE 2**

```
Editorial overhead 90-degree photography 35mm grain, a half-folded handwritten letter on cream cotton paper laid on antique walnut writing desk, vintage Mont Blanc fountain pen with deep oxblood barrel resting beside, a single open envelope with broken oxblood wax seal showing intaglio "AF" emblem (only readable mark), a small dried sprig of lavender. Soft window light from upper-right. Handwriting in dark sepia ink visible but artfully illegible (cursive flow only, no extracted words). Color palette: ivory 50%, walnut warm brown 25%, oxblood 20%, lavender muted purple 5%. Mood: Marie Antoinette correspondence × Carnet de Voyage × Smythson Bond Street stationery. Composition: letter centered, envelope and pen flanking. Shallow depth on lavender. No legible text, no duplicate "AF", no watermark.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 3000×1688

---

## 16 — Cart empty state · Atmospheric placeholder

📸 **PROMPT GPT IMAGE 2**

```
Minimalist editorial still life 50mm f/4, a single empty drawstring pouch in raw natural silk #E8DDC8 lying flat-relaxed on creamy ivory linen surface, soft directional window light from upper-left throwing gentle elongated shadow to the right. Pouch fully empty, slight folds suggesting weightlessness. Color palette: monochromatic ivory and natural silk. Negative space dominant. Mood: contemplative pause, Aesop apothecary × Muji minimalism × Christian Wijnants pouch. Composition: object lower-left third, vast breathing room top-right for centered headline overlay. Shallow depth of field. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 2880×1620

---

## 17 — Order success / confirmation · Wax seal close-up

📸 **PROMPT GPT IMAGE 2**

```
Macro photography 90mm f/2.8, extreme close-up of an ivory cotton paper envelope flap freshly stamped with a deep oxblood-rouge wax seal #8B1424, the wax still showing slight warmth-glow on the edges, intaglio embossed initials "AF" in Bodoni Moda serif (the only readable mark), single drop of melted wax beside the seal as a craft detail, soft directional window light from top-right revealing wax surface relief. Color palette: ivory paper 60%, deep oxblood wax 40%. Mood: ceremonial, artisanal, French maison. Style references: Smythson seal × Maison Margiela couture envelope × wedding stationery atelier. Shallow depth of field on wax detail, paper crisp. No extra letters, no duplicate "AF", no extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 3000×1688

---

## 18 — 404 / Error page background

📸 **PROMPT GPT IMAGE 2**

```
Editorial nighttime still life 50mm f/4, a single tall taper candle nearly extinguished, last thin wisp of smoke curling against deep ink-black wall #0A0706, soft warm dying ember at wick base, candle holder in matte oxblood ceramic, placed on a polished marble surface reflecting a soft amber halo. Color palette: deep ink 65%, warm amber 25%, oxblood 10%. Mood: poetic absence, the moment after, melancholic but elegant. Style: Diptyque catalog × Annick Goutal evening × Sofia Coppola interior. Composition: candle right-third, vast dark negative space left for "404" overlay typography. Heavy bokeh background. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `16:9` · Format: WebP · Résolution: 2880×1620

---

## 19 — OG image / Open Graph template (1200×630 share)

📸 **PROMPT GPT IMAGE 2**

```
Editorial product photography eye-level 70-degree, single sculptural unbranded matte ivory abstract object (oblong, polished, unidentifiable) placed on creamy travertine plinth, deep warm window light from left throwing soft elongated shadow right, blurred ivory linen drape in background. Color palette: ivory 70%, warm shadow umber 20%, single oxblood thread element 10%. Composition: object lower-left third, generous breathing room top-right reserved for typographic logo overlay. Mood: Hermès petit h × Aesop unboxing × Wallpaper magazine product page. Shallow depth of field, bokeh on background drape. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `1200:630` (custom) · Format: PNG · Résolution: 1200×630

---

## 20 — Pinterest Pin template (vertical 1000×1500)

📸 **PROMPT GPT IMAGE 2**

```
Editorial vertical pinterest-optimized photography, eye-level slight low-angle, an open ivory cardboard gift box on creamy linen cloth with champagne-gold tissue paper unfurling out of the top, revealing soft sculptural shapes inside (suggested only, blurred), a hand-tied raw silk ribbon in oxblood draped beside, single dried hydrangea bloom in dusty mauve. Top third of frame: warm ivory wall with intentional negative space for headline overlay typography. Bottom two-thirds: rich product detail. Color palette: ivory 50%, champagne gold 20%, oxblood 15%, dusty mauve 10%, walnut shadow 5%. Mood: Pinterest aesthetic × Le Bon Marché gift counter × Anthropologie holiday catalog. Style: scroll-stopping editorial, soft natural light, shallow depth of field. No extra words, no watermark, no logo drift.
```

⚙️ **PARAMÈTRES** · Quality: high · Ratio: `2:3` · Format: PNG · Résolution: 1000×1500

---

## Notes d'usage

**Workflow recommandé** :
1. Générer en `quality: high` pour héros principaux (1-8). `standard` pour les autres.
2. Garder les seeds qui donnent un bon résultat — itérer en mode `edit` (préserver style, changer détail).
3. Toujours valider sur mobile (375px) avant publication — la composition doit tenir avec headline overlay.
4. Pour le sitemap Pinterest, **toujours du portrait `2:3`** (1000×1500 minimum, 1500×2250 recommandé).
5. OG images : générer **3 variantes** par prompt et A/B-tester click-through.

**Conformité Pinterest 2026 wellness intime** :
- Pas de produit explicite de plaisir solo en image (objet abstrait acceptable).
- Pas de nudité explicite, de sous-vêtements en gros plan, de body parts intimes.
- Mots-clés textuels associés au pin doivent rester neutres ("rituel", "couple", "cadeau", "intimité").

**Variantes éditoriales à générer en plus** :
- Saint-Valentin (overlay rouge/or) — variantes des prompts 4, 5, 6, 11, 20
- Noël (overlay champagne/sapin) — variantes des prompts 4, 5, 6, 11, 20
- Été (lumière plus saturée, palette ambre/écru) — variantes des prompts 1, 2, 3, 9
