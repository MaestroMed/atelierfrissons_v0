import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Déclaration d’accessibilité',
  alternates: { canonical: '/accessibilite' },
};

export default function AccessibilitePage() {
  return (
    <LegalLayout
      title="Déclaration d’accessibilité"
      intro="Atelier Frisson s'engage à rendre son site accessible conformément au RGAA 4.1."
      lastUpdated={new Date('2026-04-01')}
    >
      <h2>État de conformité</h2>
      <p>
        Le site atelierfrisson.fr est <strong>partiellement conforme</strong> au RGAA 4.1
        (Référentiel général d’amélioration de l’accessibilité). L’audit complet sera publié après
        la mise en production (Sprint 7).
      </p>

      <h2>Engagements</h2>
      <ul>
        <li>
          Conformité visée : <strong>WCAG 2.2 niveau AA</strong>
        </li>
        <li>Audit automatisé : Lighthouse CI à chaque PR</li>
        <li>Audit manuel : avant chaque release majeure (axe-core + Playwright)</li>
        <li>Test lecteurs d’écran : NVDA + VoiceOver</li>
      </ul>

      <h2>Mesures déjà en place</h2>
      <ul>
        <li>Structure HTML sémantique (landmarks, headings hiérarchisés)</li>
        <li>Contraste AA partout (ivoire/noir/or testés)</li>
        <li>Skip link « Aller au contenu principal »</li>
        <li>Focus ring or visible</li>
        <li>Tous les inputs avec label associé</li>
        <li>Tous les images avec alt descriptifs (ou aria-hidden si décoratives)</li>
        <li>
          Animations désactivées si <code>prefers-reduced-motion: reduce</code>
        </li>
        <li>Navigation entièrement clavier-accessible</li>
        <li>Boutons et liens avec aria-label explicites quand nécessaire</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Vous rencontrez une difficulté d’accès à un contenu ? Écrivez à{' '}
        <a href="mailto:contact@atelierfrisson.fr">contact@atelierfrisson.fr</a> — nous vous
        répondrons sous 48 heures et corrigerons dès que possible.
      </p>

      <h2>Voies de recours</h2>
      <p>
        Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu, vous
        pouvez :
      </p>
      <ul>
        <li>Nous contacter par email</li>
        <li>
          Saisir le Défenseur des droits (
          <a href="https://www.defenseurdesdroits.fr" target="_blank" rel="noopener noreferrer">
            defenseurdesdroits.fr
          </a>
          )
        </li>
      </ul>
    </LegalLayout>
  );
}
