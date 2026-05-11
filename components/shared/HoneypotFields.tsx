'use client';

import { useId, useState, useEffect } from 'react';

/**
 * Champs honeypot pour les forms publics.
 *
 * À inclure dans tous les forms accessibles sans auth (waitlist, ambassadrice,
 * gift card, candidature DPO).
 *
 * Comportement :
 *   - `_hp` : champ texte visuellement caché mais accessible dans le DOM
 *     (les bots le remplissent par habitude car il est dans la liste des inputs)
 *   - `_t` : timestamp rendu mounted (pour détecter les soumissions trop rapides)
 *
 * Sécurité visuelle :
 *   - tabindex=-1 pour exclure du flux de tab keyboard
 *   - aria-hidden pour exclure des lecteurs d'écran
 *   - autocomplete=off pour éviter le pré-remplissage navigateur
 *   - position absolute + opacity 0 (pas display:none — détectable)
 */
export function HoneypotFields() {
  const hpId = useId();
  const [mountedAt, setMountedAt] = useState<number>(0);

  useEffect(() => {
    setMountedAt(Date.now());
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Field 1 : honeypot text */}
      <label htmlFor={hpId}>Si vous êtes humain, ne remplissez pas ce champ</label>
      <input
        id={hpId}
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />

      {/* Field 2 : timestamp d'affichage */}
      <input
        type="hidden"
        name="_t"
        value={mountedAt > 0 ? String(mountedAt) : ''}
        readOnly
      />
    </div>
  );
}
