/**
 * Search-facing copy for the public template pages: the query each page
 * answers (used in its <title>) and who the template suits. The template's own
 * name and description live in lib/templates.ts and are shown as they are.
 */
import type { Language } from '@/store/types';
import type { TemplateId } from './templates';

export interface TemplateSeo {
  /** The <title> of the page, before the site name. Keep under ~45 characters. */
  title: string;
  /** Who this template is for, one or two sentences. */
  bestFor: Record<Language, string>;
}

export const TEMPLATE_SEO: Record<TemplateId, TemplateSeo> = {
  minimal: {
    title: 'Minimal GitHub Profile README Template',
    bestFor: {
      en: 'For developers who want a clean, fast profile: who you are, your stack, your work and how to reach you, with nothing that animates.',
      fr: 'Pour les développeurs qui veulent un profil sobre et rapide : qui vous êtes, votre stack, vos travaux et comment vous joindre, sans rien qui bouge.',
    },
  },
  terminal: {
    title: 'Terminal Hacker GitHub Profile README Template',
    bestFor: {
      en: 'For backend, systems and CLI people who live in a shell: a typed prompt, command-style headings, stats in phosphor green and the contribution snake.',
      fr: 'Pour les profils backend, systèmes et CLI qui vivent dans un shell : invite tapée, titres façon commandes, stats vert phosphore et serpent des contributions.',
    },
  },
  maintainer: {
    title: 'Open-Source Maintainer GitHub README Template',
    bestFor: {
      en: 'For maintainers who want their projects up front: pinned repositories with your own blurbs, contribution stats, an activity graph and a sponsor call.',
      fr: 'Pour les mainteneurs qui veulent leurs projets en vitrine : dépôts épinglés avec vos descriptions, stats de contributions, graphe d’activité et appel au sponsoring.',
    },
  },
  designer: {
    title: 'Designer GitHub Profile README Template',
    bestFor: {
      en: 'For designers and design engineers: a soft banner, what you are working on now, your tools, your best pieces and a quote.',
      fr: 'Pour les designers et design engineers : une bannière douce, ce sur quoi vous travaillez, vos outils, vos meilleures pièces et une citation.',
    },
  },
  student: {
    title: 'Student GitHub Profile README Template',
    bestFor: {
      en: 'For students and junior developers looking for an internship or a first job: what you are studying, a timeline of internships and projects, streak stats and a motivational quote.',
      fr: 'Pour les étudiant·e·s et développeurs juniors qui cherchent un stage ou un premier emploi : ce que vous étudiez, un parcours de stages et de projets, vos séries de contributions et une citation motivante.',
    },
  },
  'data-ml': {
    title: 'Data Science & ML GitHub README Template',
    bestFor: {
      en: 'For data scientists and ML engineers: your Python stack, summary cards, an activity graph, current experiments and pinned notebooks.',
      fr: 'Pour les data scientists et ingénieurs ML : votre stack Python, des cartes de synthèse, un graphe d’activité, vos expériences en cours et vos notebooks épinglés.',
    },
  },
  'indie-maker': {
    title: 'Indie Maker GitHub Profile README Template',
    bestFor: {
      en: 'For indie hackers and solo founders shipping in public: what you are building, your products, your latest posts and a tip jar.',
      fr: 'Pour les indie hackers et fondateurs solo qui construisent en public : ce que vous construisez, vos produits, vos derniers articles et un pot à pourboires.',
    },
  },
  'bilingual-fr': {
    title: 'Bilingual French/English GitHub README Template',
    bestFor: {
      en: 'For French-speaking developers who work with international teams: every heading and label in French and English, side by side.',
      fr: 'Pour les développeurs francophones qui travaillent avec des équipes internationales : chaque titre et libellé en français et en anglais, côte à côte.',
    },
  },
  'game-dev': {
    title: 'Game Developer GitHub Profile README Template',
    bestFor: {
      en: 'For game developers and jam regulars: a synthwave neon banner, a “Press START” prompt, your engines, what you are playing, trophies and the contribution snake.',
      fr: 'Pour les game devs et habitués des game jams : bannière néon synthwave, invite « Press START », vos moteurs, ce à quoi vous jouez, trophées et serpent des contributions.',
    },
  },
  recruiter: {
    title: 'Recruiter-Ready GitHub Profile README Template',
    bestFor: {
      en: 'For developers on the job market: a short pitch, your experience as a table, your stack, selected work and every way to contact you.',
      fr: 'Pour les développeurs en recherche d’emploi : un pitch court, votre expérience en tableau, votre stack, une sélection de travaux et tous les moyens de vous contacter.',
    },
  },
};
