import type { AchievementId, ReactSummitSpeaker } from '../types/speaker'
import { achievementScore } from '../lib/speakerHelpers'

/**
 * React Summit 2026 (Amsterdam) line-up, scraped from https://reactsummit.com.
 * Includes the main speaker line-up, MCs and the Program Committee.
 *
 * Photos are served from GitNation's imgix CDN (or GitHub avatars). The helper
 * below builds the imgix URL; the `?auto=format` param lets imgix serve a
 * browser-friendly format (handles .heic/.avif sources transparently).
 */
const gn = (path: string): string =>
  `https://gitnation.imgix.net/stichting-frontend-amsterdam/image/upload/${path}?auto=format,compress&fit=crop&w=400&h=400`

/** Raw line-up entries (rating + achievements are added deterministically below). */
type RawSpeaker = Omit<
  ReactSummitSpeaker,
  'rating' | 'achievements' | 'rankingPoints' | 'expertise'
>

const RAW_SPEAKERS: RawSpeaker[] = [
  {
    id: 'kitze',
    name: 'Kitze',
    photoUrl: gn('v1687197752/kitze_dijey7.jpg'),
    company: 'React Academy',
    country: 'Poland',
    talk: 'From Vibe Coding to Vibe Engineering',
    tags: ['AI assisted coding'],
    bio: 'Kitze loves to rant about webdev. He is the founder of Sizzy — the browser for developers. He created React Academy to teach web development and Zero To Shipped, an interactive video course for mastering fullstack development. He documents his journey on YouTube, streams on Twitch, and made Benji, Twizzy, ok-google.io, JSUI, Glink, showGPT and more.',
    socials: [
      { type: 'github', url: 'https://github.com/kitze' },
      { type: 'gitnation', url: 'https://gitnation.com/person/kitze' },
      { type: 'twitter', url: 'https://x.com/thekitze' },
    ],
  },
  {
    id: 'aurora-scharff',
    name: 'Aurora Scharff',
    photoUrl: gn('v1776259207/main_small_bwdhao.jpg'),
    company: 'Vercel',
    country: 'Norway',
    talk: 'What RSCs Can Do in Next.js Today',
    tags: ['React', 'Next.js'],
    bio: 'Aurora Scharff is a DX Engineer at Vercel and the React Certification Lead at certificates.dev. She specializes in education and community engagement around React and Next.js, developing high-quality learning resources, creating demo applications, and speaking at conferences worldwide to support and advance modern web development practices.',
    socials: [
      { type: 'github', url: 'https://github.com/aurorascharff' },
      { type: 'gitnation', url: 'https://gitnation.com/person/aurorascharff' },
      { type: 'twitter', url: 'https://x.com/aurorascharff' },
      { type: 'bluesky', url: 'https://bsky.app/profile/aurorascharff.no' },
    ],
  },
  {
    id: 'alex-russell',
    name: 'Alex Russell',
    photoUrl: gn('v1733830763/Alex_Russell_500px_squooshed_jmf3n1.jpg'),
    company: 'Microsoft',
    country: 'USA',
    talk: 'Building Bridges to a Post-SPA Future',
    tags: ['Performance'],
    bio: 'A key contributor to ES6, Service Workers and Web Components. The Partner PM for Edge at Microsoft and Blink API owner.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/alex_russell' },
      { type: 'bluesky', url: 'https://bsky.app/profile/infrequently.org' },
      { type: 'linkedin', url: 'https://linkedin.com/in/alexrussell' },
    ],
  },
  {
    id: 'scott-tolinski',
    name: 'Scott Tolinski',
    photoUrl: gn('v1695990321/Scott_Tolinski_k2z2ys.jpg'),
    company: 'Syntax.fm',
    country: 'USA',
    talk: 'This Component Could Have Been A Class',
    tags: ['React'],
    bio: 'Scott owns and makes video tutorials teaching web development for Level Up Tutorials, releasing a new premium series every month. He co-hosts Syntax.fm with Wes Bos — a popular, light-hearted web development podcast that teaches full stack topics while staying fun. He also enjoys breakdancing and has been dancing for over 15 years.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/scott_tolinski' },
      { type: 'twitter', url: 'https://x.com/stolinski' },
      { type: 'bluesky', url: 'https://bsky.app/profile/tolin.ski' },
      { type: 'website', url: 'https://tolin.ski/' },
    ],
  },
  {
    id: 'kadi-kraman',
    name: 'Kadi Kraman',
    photoUrl: gn('v1742909829/Kadi_okftyr.png'),
    company: 'Expo',
    country: 'UK',
    talk: 'The Evolution of App Development',
    tags: ['Expo', 'React Native'],
    bio: 'Kadi is a Software Developer at Expo, working on tools and experiences to help developers get the best out of building React Native apps with Expo. She is also an enthusiastic teacher, and has created React Native courses for Frontend Masters and Egghead.',
    socials: [
      { type: 'github', url: 'https://github.com/kadikraman' },
      { type: 'gitnation', url: 'https://gitnation.com/person/kadi_kraman' },
      { type: 'twitter', url: 'https://x.com/kadikraman' },
      { type: 'bluesky', url: 'https://bsky.app/profile/kadi.bsky.social' },
    ],
  },
  {
    id: 'aleksei-petrov',
    name: 'Aleksei Petrov',
    photoUrl: gn('v1778045960/Aleksei_Petrov_ClaudeCode_Workshop_uavkzo.png'),
    company: 'QuantFlow Studio',
    country: 'Montenegro',
    talk: 'Advanced Claude Code — Production Workflows, Subagents, and Autonomous Execution',
    tags: ['AI'],
    bio: 'Aleksei Petrov is a CTO and the co-founder of QuantFlow Studio and an Anthropic Claude Community Ambassador. He uses Claude Code daily to ship production software, and is the author of Pilot — a top-rated open-source autonomous coding agent — and Navigator, a Claude Code plugin for context engineering. Based in Podgorica, Montenegro.',
    socials: [
      { type: 'github', url: 'https://github.com/alekspetrov' },
      { type: 'gitnation', url: 'https://gitnation.com/person/aleksei_petrov' },
      { type: 'website', url: 'https://quantflow.studio/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/alekspetrov' },
    ],
  },
  {
    id: 'manuel-schiller',
    name: 'Manuel Schiller',
    photoUrl: gn('v1775141601/unnamed_8_i5w6q0.jpg'),
    company: 'TanStack',
    country: '',
    talk: 'Tanstack Start and How It Supports React Server Components',
    tags: ['React Server Components'],
    bio: 'Manuel is a full-stack software engineer and TypeScript specialist, and a core contributor to TanStack Router and TanStack Start.',
    socials: [
      { type: 'github', url: 'https://github.com/schiller-manuel' },
      { type: 'gitnation', url: 'https://gitnation.com/person/schanuelmiller' },
      { type: 'twitter', url: 'https://x.com/schanuelmiller' },
    ],
  },
  {
    id: 'adrian-hajdin',
    name: 'Adrian Hajdin',
    photoUrl: 'https://avatars.githubusercontent.com/u/24898559?v=4',
    company: 'JS Mastery',
    country: 'Croatia',
    talk: 'How I use AI as a Technical Educator',
    tags: ['AI'],
    bio: 'JavaScript Mastery YouTube Channel author.',
    socials: [
      { type: 'github', url: 'https://github.com/adrianhajdin' },
      { type: 'gitnation', url: 'https://gitnation.com/person/adrian_hajdin_js_mastery' },
      { type: 'twitter', url: 'https://x.com/jsmasterypro' },
      { type: 'website', url: 'https://jsmastery.pro/' },
    ],
  },
  {
    id: 'alex-garrett-smith',
    name: 'Alex Garrett-Smith',
    photoUrl: gn('v1778680191/95B3C87F-FE21-416E-ACFB-B8309113C707_2_bsu9me.png'),
    company: 'BitterBrains',
    country: 'UK',
    talk: 'We Need More Than Prompts',
    tags: ['AI'],
    bio: 'Alex is a full-stack software engineer, founder with a successful exit, and Tech Education Lead at BitterBrains.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/alex_garrettsmith' },
      { type: 'twitter', url: 'https://x.com/alexdotgs' },
      { type: 'website', url: 'https://alex.gs/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/alexgarrettsmith' },
    ],
  },
  {
    id: 'ryan-skinner',
    name: 'Ryan Skinner',
    photoUrl: gn('v1771504309/LUVE1534_j1fp27.jpg'),
    company: 'Rari',
    country: 'Canada',
    talk: 'Building RSCs Framework on Rust: Architecture Decisions That Delivered 45x Performance',
    tags: ['Fullstack', 'Rust', 'Performance'],
    bio: 'Ryan has been building for the web for 25 years. He created rari, a React Server Components framework running on a Rust runtime that delivers 46.5x higher throughput and 9.1x faster response times than Next.js. He believes performance shouldn\u2019t be an afterthought and that the web deserves frameworks that are both fast and beautiful to work with.',
    socials: [
      { type: 'github', url: 'https://github.com/skiniks' },
      { type: 'gitnation', url: 'https://gitnation.com/person/ryan_skinner_155589' },
      { type: 'bluesky', url: 'https://bsky.app/profile/ryanskinner.com' },
      { type: 'website', url: 'https://ryanskinner.com/' },
    ],
  },
  {
    id: 'abbey-perini',
    name: 'Abbey Perini',
    photoUrl: gn('v1748037792/Y5D1Yg9yEVDVhaE01NEaPu0a1gzhewKrtjk2ZvIWWJs%403D.jpg'),
    company: 'Hygiena',
    country: 'USA',
    talk: 'What the First Rule of ARIA Really Means',
    tags: ['Accessibility'],
    bio: 'Abbey Perini is a metro Atlanta native, full-stack web developer, accessibility advocate, international speaker, and technical writer with over 500,000 views. She is full-stack in the truest sense — happiest problem solving across front-end, back-end and all the APIs and microservices in between. Passionate about accessibility, she has worked in Vue, React, and even AngularJS, and spent her development career rectifying tech debt in existing codebases.',
    socials: [
      { type: 'github', url: 'https://github.com/abbeyperini' },
      { type: 'gitnation', url: 'https://gitnation.com/person/abbey_perini' },
      { type: 'twitter', url: 'https://x.com/AbbeyPerini' },
      { type: 'bluesky', url: 'https://bsky.app/profile/abbeyperini.dev' },
    ],
  },
  {
    id: 'david-haz',
    name: 'David Haz',
    photoUrl: gn('v1770885283/dh1_emngms.png'),
    company: 'React Bits',
    country: 'Romania',
    talk: 'React Bits: The Art of Standout UI',
    tags: ['React'],
    bio: 'David is a design engineer and creator of React Bits, building animated, highly customizable React components and contributing actively to open source tools that help developers build faster and more creatively.',
    socials: [
      { type: 'github', url: 'https://github.com/DavidHDev' },
      { type: 'gitnation', url: 'https://gitnation.com/person/david_haz' },
      { type: 'twitter', url: 'https://x.com/davidhdev' },
      { type: 'website', url: 'https://davidhaz.com/' },
    ],
  },
  {
    id: 'sam-selikoff',
    name: 'Sam Selikoff',
    photoUrl: gn('v1761563186/Sam_Selikoff_vyuqpf.jpg'),
    company: 'Vercel',
    country: 'USA',
    talk: 'Panel Discussion: Fullstack is Eating Frontend — Should FE Engineers Adapt?',
    tags: ['Panel discussion'],
    bio: 'Sam Selikoff is a software engineer on the Next.js team at Vercel. Previously he taught frontend development for over eight years through his podcast, in-person trainings, conference talks, and videos on Egghead, YouTube, and Build UI. He\u2019s also a software consultant and was previously a frontend engineer at TED Conferences.',
    socials: [
      { type: 'github', url: 'https://github.com/samselikoff' },
      { type: 'gitnation', url: 'https://gitnation.com/person/sam_selikoff' },
      { type: 'twitter', url: 'https://x.com/samselikoff' },
      { type: 'website', url: 'https://samselikoff.com/' },
    ],
  },
  {
    id: 'erik-rasmussen',
    name: 'Erik Rasmussen',
    photoUrl: gn('v1750944529/Erik_re1kti.jpg'),
    company: 'Attio',
    country: 'Spain',
    talk: 'Ripple: the Good Parts of React, Svelte, and Solid',
    tags: ['Frameworks'],
    bio: 'American expat living in Spain, author of Redux Form, Final Form, and currently building the best CRM in the world at Attio.',
    socials: [
      { type: 'github', url: 'https://github.com/erikras' },
      { type: 'gitnation', url: 'https://gitnation.com/person/erik_rasmussen' },
      { type: 'twitter', url: 'https://x.com/erikras' },
      { type: 'bluesky', url: 'https://bsky.app/profile/erikras.com' },
    ],
  },
  {
    id: 'dominik-dorfmeister',
    name: 'Dominik Dorfmeister',
    photoUrl: 'https://avatars.githubusercontent.com/u/1021430?v=4',
    company: 'Sentry',
    country: 'Austria',
    talk: 'React Query - Beyond the Basics',
    tags: ['React Query', 'React', 'TypeScript'],
    bio: 'Dominik is a Frontend Engineer and React-Query maintainer working at Sentry, who blogs about all things React and TypeScript at tkdodo.eu/blog.',
    socials: [
      { type: 'github', url: 'https://github.com/TkDodo' },
      { type: 'gitnation', url: 'https://gitnation.com/person/dominik_dorfmeister' },
      { type: 'twitter', url: 'https://x.com/TkDodo' },
      { type: 'bluesky', url: 'https://bsky.app/profile/tkdodo.eu' },
    ],
  },
  {
    id: 'kiril-peyanski',
    name: 'Kiril Peyanski',
    photoUrl: gn('v1724852087/T2Zhg-NA_400x400_lokjv4.jpg'),
    company: 'Progress',
    country: 'Bulgaria',
    talk: 'The UI That Builds Itself: Exploring the Generative Front-End',
    tags: ['Advanced', 'AI'],
    bio: 'Kiril Peyanski is a Principal Software Engineer focused on the intersection of design systems, user experience, and AI-assisted interface design. He explores how both humans and LLMs can shape the next generation of front-end architecture.',
    socials: [
      { type: 'github', url: 'https://github.com/kirchoni' },
      { type: 'gitnation', url: 'https://gitnation.com/person/kiril_peyanski_114263' },
      { type: 'twitter', url: 'https://x.com/kirchoni' },
      { type: 'linkedin', url: 'https://linkedin.com/in/kspeyanski' },
    ],
  },
  {
    id: 'daniel-avila',
    name: 'Daniel \u00c1vila',
    photoUrl: gn('v1772547929/Daniel_Avila_nhwqj4.jpg'),
    company: 'Hedgineer',
    country: 'USA',
    talk: 'Skills in Claude Code Desktop: Architecture and Execution Runtime',
    tags: ['AI'],
    bio: 'Claude Code Templates creator and AI Tech Lead at Hedgineer.',
    socials: [
      { type: 'github', url: 'https://github.com/davila7' },
      { type: 'gitnation', url: 'https://gitnation.com/person/daniel_avila' },
      { type: 'twitter', url: 'https://x.com/dani_avila7' },
      { type: 'website', url: 'https://danielavila.me/' },
    ],
  },
  {
    id: 'jemima',
    name: 'Jemima',
    photoUrl: gn('v1764881355/VQdnthzCXI3SFCE1dL50UC1tYUJpmpq6A1sLL6m6k3M%403D.jpg'),
    company: 'CAIS',
    country: 'United Kingdom',
    talk: "Your React App Doesn't Need All That JavaScript",
    tags: ['Web development'],
    bio: 'Jemima Abu is a self-taught front-end developer, Google Developer Expert, Microsoft MVP, and Certified Professional in Accessibility Core Competencies. She is passionate about diversity in technology and accessibility in web development.',
    socials: [
      { type: 'github', url: 'https://github.com/jemimaabu' },
      { type: 'gitnation', url: 'https://gitnation.com/person/jemima' },
      { type: 'twitter', url: 'https://x.com/jemimaabu' },
      { type: 'website', url: 'https://jemimaabu.com/' },
    ],
  },
  {
    id: 'maurice-de-beijer',
    name: 'Maurice de Beijer',
    photoUrl: 'https://avatars.githubusercontent.com/u/3197730?v=4',
    company: 'Independent Software Consultant and Trainer',
    country: 'Netherlands',
    talk: 'Building Fullstack Apps with Cursor',
    tags: ['AI assisted coding'],
    bio: 'Maurice de Beijer is an independent software consultant and trainer specializing in TypeScript, ECMAScript, React and Svelte. His work includes popular collaboration software and a large, global safety application for the oil and gas industry. Active in the open source community, he teaches ECMAScript, TypeScript, React, Cypress, Playwright and RxJS courses, and has received Microsoft\u2019s yearly MVP award since 2005.',
    socials: [
      { type: 'github', url: 'https://github.com/mauricedb' },
      { type: 'gitnation', url: 'https://gitnation.com/person/maurice_de_beijer' },
      { type: 'twitter', url: 'https://x.com/MauriceDB' },
      { type: 'website', url: 'https://theproblemsolver.dev/' },
    ],
  },
  {
    id: 'mark-erikson',
    name: 'Mark Erikson',
    photoUrl: gn('v1647589299/c7hrlxamsxzlkrh2rn7p.jpg'),
    company: 'Replay.io',
    country: 'USA',
    talk: 'A Guide to React Compiler Rendering',
    tags: ['React'],
    bio: 'Mark Erikson is a Senior Front-End Engineer at Replay, living in southwest Ohio, USA. He is a Redux maintainer, creator of Redux Toolkit, and general keeper of the Redux docs. He spends much of his time answering questions about React and Redux anywhere there\u2019s a comment box on the internet, and usually hangs out in the Reactiflux chat channels.',
    socials: [
      { type: 'github', url: 'https://github.com/markerikson' },
      { type: 'gitnation', url: 'https://gitnation.com/person/mark_erikson' },
      { type: 'twitter', url: 'https://x.com/acemarke' },
      { type: 'website', url: 'https://blog.isquaredsoftware.com/' },
    ],
  },
  {
    id: 'cesar-alberca',
    name: 'C\u00e9sar Alberca',
    photoUrl: gn('v1769949709/MtasCO45yORvALv9kRUCLDvCgtwpeKtg%402FvYKNwZIxu4%403D.png'),
    company: 'Freelance Frontend Architect',
    country: 'Spain',
    talk: 'FWD: Urgent Opportunity to Claim Your React + MDX Newsletter Inheritance',
    tags: ['MDX'],
    bio: 'Freelance Frontend Architect and digital nomad from Spain. He designs and builds robust, maintainable applications using React, Angular and Vue, with a strong focus on architecture, testing, and software craftsmanship. He specializes in DDD, Hexagonal Architecture, and Modular Design Systems. International speaker, Codemotion committee member and ambassador, and a published book author.',
    socials: [
      { type: 'github', url: 'https://github.com/cesalberca' },
      { type: 'gitnation', url: 'https://gitnation.com/person/cesar_alberca' },
      { type: 'twitter', url: 'https://x.com/cesalberca' },
      { type: 'bluesky', url: 'https://bsky.app/profile/cesalberca.com' },
    ],
  },
  {
    id: 'kristiyan-velkov',
    name: 'Kristiyan Velkov',
    photoUrl: gn('v1766158315/LfvgT%402FxYxOhmLk0P2wbwJzlJl8boDQMgVyuW5Y2KDYc%403D.jpg'),
    company: 'Docker',
    country: 'Bulgaria',
    talk: 'DevOps for Front-end Developers: From Local Code to Production by Docker Captain',
    tags: ['DevOps', 'React', 'Next.js', 'Angular'],
    bio: 'Tech Lead, Front-End Advocate, Mentor & Educator, Tech Blogger, published author, Docker Captain and Cursor Ambassador with 10+ years of expertise in JavaScript and open-source development. His skill set spans JavaScript, TypeScript, React.js, Angular, Vue.js, Next.js, DevOps, web accessibility and security. A lifelong learner with 100+ IT certifications and a significant following: 30,000 LinkedIn connections, 7,000 Medium subscribers, 100,000+ monthly readers and 4 IT books.',
    socials: [
      { type: 'github', url: 'https://github.com/kristiyan-velkov' },
      { type: 'gitnation', url: 'https://gitnation.com/person/kristiyan_velkov' },
      { type: 'twitter', url: 'https://x.com/krisvelkov' },
      { type: 'bluesky', url: 'https://bsky.app/profile/kristiyanvelkov.bsky.social' },
    ],
  },
  {
    id: 'krasimir-tsonev',
    name: 'Krasimir Tsonev',
    photoUrl: gn('v1708683234/avatar2020_pjjjue.jpg'),
    company: 'Antidote.me',
    country: 'Bulgaria',
    talk: 'From Zero to Streaming: Implementing React Server Components Yourself',
    tags: ['React Server Components'],
    bio: 'Krasimir Tsonev is a coder with over 20 years of experience in web development. Author of books on JavaScript, he works at Antidote.me where he helps people reaching clinical trials. Loves React and its ecosystem.',
    socials: [
      { type: 'github', url: 'https://github.com/krasimir' },
      { type: 'gitnation', url: 'https://gitnation.com/person/krasimir_tsonev' },
      { type: 'twitter', url: 'https://x.com/KrasimirTsonev' },
      { type: 'bluesky', url: 'https://bsky.app/profile/krasimir.bsky.social' },
    ],
  },
  {
    id: 'younes-jaaidi',
    name: 'Younes Jaaidi',
    photoUrl: gn('v1772123066/6jkftk5SNqdirL5JJCNdGDGdY5h3dtZyc3dm2T%402BXgpU%403D.jpg'),
    company: 'Marmicode',
    country: 'France',
    talk: 'Ashes to Ashes, Spec to Spec: The Rebirth of Modern Testing',
    tags: ['Testing'],
    bio: 'Younes Jaaidi is a Software Cook who enjoys whipping code until tests pass. Raised in the eXtreme Programming kitchen some 20 years ago, he now teaches and coaches teams to cook better software using ingredients such as Test-Driven Development, Charted Coding, and Collective Ownership. He\u2019s an Angular Google Developer Expert, an Nx Champion, and a mediocre sailor.',
    socials: [
      { type: 'github', url: 'https://github.com/yjaaidi' },
      { type: 'gitnation', url: 'https://gitnation.com/person/younes_jaaidi' },
      { type: 'twitter', url: 'https://x.com/yjaaidi' },
      { type: 'bluesky', url: 'https://bsky.app/profile/younesjd.dev' },
    ],
  },
  {
    id: 'vitor-alencar',
    name: 'Vitor Alencar',
    photoUrl: gn('v1748444761/gPit%402Fl2WLOfB9JsrcD6bRFtnyfE%402BUbilrGJ3oO4P%402B4s%403D.jpg'),
    company: 'Chilipiper',
    country: 'Germany',
    talk: 'Modernizing Your React App: Compiler, useEffectEvent, Activity & Friends',
    tags: ['React'],
    bio: 'Frontend engineer at Chilipiper, based in Berlin. @vitormalencar.',
    socials: [
      { type: 'github', url: 'https://github.com/vitormalencar' },
      { type: 'gitnation', url: 'https://gitnation.com/person/vitor' },
      { type: 'twitter', url: 'https://x.com/vitormalencar' },
      { type: 'website', url: 'https://vitormalencar.com/' },
    ],
  },
  {
    id: 'ariel-shulman',
    name: 'Ariel Shulman',
    photoUrl: gn('v1770484376/UuYnS%402B1yTOu3jcNZqX59bge3eFa67goMCDLtNzIELbE%403D.jpg'),
    company: 'Factify',
    country: 'Israel',
    talk: 'Conquering React Concurrency',
    tags: ['React'],
    bio: 'Senior Full Stack Engineer at Factify with a great passion for designing for scale, understanding how things work and public speaking. He enjoys building systems that are both elegant and performant. When not behind a keyboard, he\u2019s probably surfing or playing guitar.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/ariel_shulman' },
      { type: 'linkedin', url: 'https://www.linkedin.com/in/ariel-shulman' },
    ],
  },
  {
    id: 'alem-tuzlak',
    name: 'Alem Tuzlak',
    photoUrl: gn('v1768991063/Alem_Tuzlak_mcudbo.jpg'),
    company: 'Code Forge',
    country: 'Bosnia and Herzegovina',
    talk: 'Building AI-Powered Apps with TanStack AI - From Setup to Chat Tools',
    tags: ['AI', 'React'],
    bio: 'Maintainer at TanStack, working on TanStack AI and TanStack Devtools.',
    socials: [
      { type: 'github', url: 'https://github.com/AlemTuzlak' },
      { type: 'gitnation', url: 'https://gitnation.com/person/alem_tuzlak' },
    ],
  },
  {
    id: 'faris-aziz',
    name: 'Faris Aziz',
    photoUrl: '',
    company: 'Smallpdf',
    country: 'Switzerland',
    talk: "Designing for Failure: The Senior React Dev's Production Toolkit",
    tags: ['Best practices'],
    bio: 'Faris Aziz is a Staff Frontend Engineer specializing in React, Next.js, monetization systems, and resilient web architecture. He has led teams in early-stage startups and scaling companies, built career ladders from scratch, and shipped systems used by millions across Fintech, SaaS, Fitness, and Connected TV, with companies like Smallpdf, Fiit, Discovery, GCN, and Navro. He co-organizes ZurichJS and contributes to tools like Raycast.',
    socials: [
      { type: 'github', url: 'https://github.com/farisaziz12' },
      { type: 'gitnation', url: 'https://gitnation.com/person/faris_aziz' },
      { type: 'twitter', url: 'https://x.com/farisaziz12' },
      { type: 'bluesky', url: 'https://bsky.app/profile/farisaziz12.bsky.social' },
    ],
  },
  {
    id: 'shubham-gautam',
    name: 'Shubham Gautam',
    photoUrl: gn('v1759671428/9YXFayRw3m1%402B%402FGQforA7et7Mj2wiSFb%402BfBCwv5mdVMg%403D.heic'),
    company: 'Headout',
    country: 'India',
    talk: 'React vs. Real-Time: Build Real-Time Features Without Fighting the Framework',
    tags: ['Architecture'],
    bio: 'Shubham builds web and mobile experiences. Senior Software Engineer at Headout, diving into the rabbit holes of frontend architecture and performance optimization. Also tinkering with developer tooling. Lives in Bangalore.',
    socials: [
      { type: 'github', url: 'https://github.com/ishubham21' },
      { type: 'gitnation', url: 'https://gitnation.com/person/shubham_gautam' },
      { type: 'website', url: 'https://shubhamgautam.in/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/ishubham21' },
    ],
  },
  {
    id: 'gaauwe-rombouts',
    name: 'Gaauwe Rombouts',
    photoUrl: gn('v1775138880/IMG_0170_1_mr78w2.png'),
    company: 'Zed',
    country: 'Netherlands',
    talk: "Speed, Quality, and AI: You Can't Have It All (Or Can You?)",
    tags: ['AI'],
    bio: 'Gaauwe is a Frontend Engineer at Zed, where he builds the web experience around a code editor made for speed and AI collaboration. As one of the few TypeScript developers in a Rust shop, he holds down the frontend fort.',
    socials: [
      { type: 'github', url: 'https://github.com/gaauwe' },
      { type: 'gitnation', url: 'https://gitnation.com/person/gaauwe_rombouts_157270' },
      { type: 'website', url: 'https://gaauwe.nl/' },
    ],
  },
  {
    id: 'rachel-kaufman',
    name: 'Rachel Kaufman',
    photoUrl: gn('v1770004089/FodTt5zZgcyizPp92oAMYSUXqCMtn7%402FF8rl58JVjrTI%403D.jpg'),
    company: 'Attentive',
    country: 'USA',
    talk: 'Gotta Go Fast: React at 60 FPS',
    tags: ['React', 'Performance'],
    bio: 'Rachel Kaufman is a full-stack software engineer working in the martech space. She loves writing unit tests (seriously), strongly-typed languages, and the Oxford comma. She\u2019s also a lead organizer with Women and Gender eXpansive Coders DC.',
    socials: [
      { type: 'github', url: 'https://github.com/rkaufman13' },
      { type: 'gitnation', url: 'https://gitnation.com/person/rachel_kaufman' },
      { type: 'website', url: 'https://readwriterachel.com/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/rachelkaufman13' },
    ],
  },
  {
    id: 'mohamad-shiralizadeh',
    name: 'Mohamad Shiralizadeh',
    photoUrl: 'https://avatars.githubusercontent.com/u/9346771?v=4',
    company: 'ING',
    country: 'Netherlands',
    talk: 'Protecting Your Cookies from Hackers and Hungry Developers!',
    tags: ['Security'],
    bio: 'Passionate Code Wizard at ING, AI & JavaScript enthusiast, lifelong learner, public speaker and family lover.',
    socials: [
      { type: 'github', url: 'https://github.com/shiralizadeh' },
      { type: 'gitnation', url: 'https://gitnation.com/person/mohamad_shiralizadeh' },
      { type: 'twitter', url: 'https://x.com/shiralizadeh' },
    ],
  },
  {
    id: 'raju-dandigam',
    name: 'Raju Dandigam',
    photoUrl: gn('v1768933356/iadZ4sGXV8dVlTs54bRTBCafXYRR1O2NQVvg%402BIPc9fA%403D.jpg'),
    company: 'Navan',
    country: 'USA',
    talk: 'Real-World Hydration and Rendering Patterns in Modern React Apps',
    tags: ['React'],
    bio: 'Raju Dandigam is an Engineering Manager and Staff Engineer with over 15 years of experience in web and frontend engineering, scalable application architecture, and AI-powered product development. At Navan he leads and builds large-scale web platforms used by millions of users. He is an active conference speaker, published technical author, Docker Captain and Cypress Ambassador.',
    socials: [
      { type: 'github', url: 'https://github.com/rajudandigam' },
      { type: 'gitnation', url: 'https://gitnation.com/person/raju_dandigam' },
      { type: 'twitter', url: 'https://x.com/raju_dandigam' },
      { type: 'website', url: 'https://rajudandigam.com/' },
    ],
  },
  {
    id: 'trust-jamin',
    name: 'Trust Jamin',
    photoUrl: gn('v1739870486/m7OBcTmCbAfzFjp4GYhhDfEym5IDKO%402FVB8YvxV42yF0%403D.png'),
    company: 'Uploadcare',
    country: 'United Kingdom',
    talk: 'Replacing Form Libraries With Native Web APIs',
    tags: ['React'],
    bio: 'Trust Jamin Okpukoro is a developer advocate and senior technical writer with a strong background in software engineering, community building, video creation, and public speaking. Over the past few years he has consistently enhanced developer experiences across various developer products by creating impactful technical content and leading strategic initiatives.',
    socials: [
      { type: 'github', url: 'https://github.com/codejagaban' },
      { type: 'gitnation', url: 'https://gitnation.com/person/jamin' },
      { type: 'twitter', url: 'https://x.com/codejagaban' },
      { type: 'website', url: 'https://jamin.sh/' },
    ],
  },
  {
    id: 'julian-burr',
    name: 'Julian Burr',
    photoUrl: gn('v1724934973/profile_x8lfmb.jpg'),
    company: 'Sonar',
    country: 'Australia',
    talk: 'The Web is Your A11y — Building Accessible Web Apps By Using the Platform',
    tags: ['Accessibility'],
    bio: 'Senior Developer from Germany with over 15 years of experience building web apps and leading frontend teams, currently living and working in Brisbane, Australia. A pragmatic perfectionist, always looking for opportunities to learn and grow.',
    socials: [
      { type: 'github', url: 'https://github.com/julianburr' },
      { type: 'gitnation', url: 'https://gitnation.com/person/julian_burr' },
      { type: 'bluesky', url: 'https://bsky.app/profile/julianburr.de' },
      { type: 'website', url: 'https://julianburr.de/' },
    ],
  },
  {
    id: 'ameer-sami',
    name: 'Ameer Sami',
    photoUrl: gn('v1768081762/D6bfwIvWpkS7msHd7uKKTcN2Z6a4pLLKGbrz2G3R33U%403D.jpg'),
    company: 'S&C Electric',
    country: 'USA',
    talk: 'React on the Edge',
    tags: ['React'],
    bio: 'Ameer is a Staff Software Engineer with 15+ years of experience. Behind the keyboard he is passionate about developer experience, design systems, React, and building cool stuff. AFK he loves to bake and pick up heavy circles.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/ameer_sami' },
      { type: 'twitter', url: 'https://x.com/ameercodes' },
      { type: 'bluesky', url: 'https://bsky.app/profile/ameersami.com' },
      { type: 'website', url: 'https://ameersami.com/' },
    ],
  },
  {
    id: 'ohans-emmanuel',
    name: 'Ohans Emmanuel',
    photoUrl: gn('v1779193193/em2_qwfbxk.jpg'),
    company: 'HelloFresh',
    country: 'Germany',
    talk: "Don't Build Agents, Build Agent Skills Instead (in React)",
    tags: ['AI'],
    bio: 'Staff software engineer and technical author with 5+ published books. Since 2017 he has written extensively about software and product development, with his work reaching 5M+ readers. He specialises in turning complex problems into simple, reliable systems and building delightful user interfaces that hold up in the real world. Based in Berlin.',
    socials: [
      { type: 'github', url: 'https://github.com/ohansemmanuel' },
      { type: 'gitnation', url: 'https://gitnation.com/person/ohans_emmanuel' },
      { type: 'twitter', url: 'https://x.com/OhansEmmanuel' },
      { type: 'website', url: 'https://ohansemmanuel.com/' },
    ],
  },
  {
    id: 'ayodele-aransiola',
    name: 'Ayodele Aransiola',
    photoUrl: gn('v1770690528/mbaKmS3q4190U94PXjcQ48eUVDDeWiQlL%402FeWhCQ1BKU%403D.jpg'),
    company: 'Gopaddi',
    country: 'United Kingdom',
    talk: 'Global-Scale React: Architecting for Localization, Multi-Tenancy, and Dynamic Markets',
    tags: ['Web development'],
    bio: 'Ayodele is a solution architect passionate about developer education and product adoption. He\u2019s passionate about learning, building, and teaching web technologies and tools that can help developers succeed in their role.',
    socials: [
      { type: 'github', url: 'https://github.com/CodeLeom' },
      { type: 'gitnation', url: 'https://gitnation.com/person/ayodele_aransiola' },
      { type: 'twitter', url: 'https://x.com/leomofthings' },
      { type: 'linkedin', url: 'https://linkedin.com/in/aransiolaayo' },
    ],
  },
  {
    id: 'violina-popova',
    name: 'Violina Popova',
    photoUrl: gn('v1746730065/tZlFlVZKspIsTa0yRNKN4wlJU2gtdLQ%402BKHTyjSLuCVg%403D.jpg'),
    company: 'ClipMyHorse.TV',
    country: 'Bulgaria',
    talk: 'Stop Guessing Your API: Contract-First React with OpenAPI',
    tags: ['Architecture'],
    bio: 'With a passion for creating seamless cross-platform experiences, Violina\u2019s journey in tech started as a consultant before shifting to software development, particularly mobile app development. Co-founding Frontend Queens was a natural extension of this journey, inspired by a commitment to inclusivity in tech and empowering women to thrive in technology.',
    socials: [
      { type: 'github', url: 'https://github.com/violinapopova' },
      { type: 'gitnation', url: 'https://gitnation.com/person/violina' },
      { type: 'twitter', url: 'https://x.com/PopovaViolina' },
      { type: 'bluesky', url: 'https://bsky.app/profile/popovaviolina.bsky.social' },
    ],
  },
  {
    id: 'martin-mladenov',
    name: 'Martin Asenov Mladenov',
    photoUrl: gn('v1739525001/vVdZTNqaAQZ36I%402F05ijv6WQo0Y9RK5CuMjTI0oCKAVk%403D.jpg'),
    company: 'Sesame Online',
    country: 'Bulgaria',
    talk: 'Effective Strategies for Managing Remote Frontend Teams',
    tags: ['Team productivity'],
    bio: 'Martin Mladenov is a Front-End Team Lead with more than 7 years in the management of FE teams. With a remarkable background in software development and a deep passion for WordPress, he has led projects that bridge complex technology and user-friendly solutions, leading international teams for prominent Bulgarian and UK-based companies including GlobalData Plc and New Statesman Media Group. Currently driving the development of a next-generation gaming platform at Sesame Online.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/martin_mladenov' },
      { type: 'website', url: 'https://reactjs.bg/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/mladenovdev' },
    ],
  },
  {
    id: 'rajni-gediya',
    name: 'Rajni Gediya',
    photoUrl: gn('v1747274026/3KNDgnamk9p6c%402F5M4ZsaUq%402FJHm1oFK9TWdeso2LSCYI%403D.jpg'),
    company: 'Hinge Health',
    country: 'USA',
    talk: 'Architecting Reliable React Systems in Unreliable Environments',
    tags: ['Architecture', 'React Native'],
    bio: 'As a Staff Software Engineer at Hinge Health, Rajni contributes to developing patient-centered digital musculoskeletal solutions by leveraging expertise in Bluetooth Low Energy (BLE) technology and cross-platform mobile development. With over three years at Hinge Health, she specializes in crafting scalable, user-friendly mobile applications using React Native.',
    socials: [
      { type: 'github', url: 'https://github.com/bmr11' },
      { type: 'gitnation', url: 'https://gitnation.com/person/rajni_gediya' },
      { type: 'twitter', url: 'https://x.com/rajnimgedia' },
      { type: 'bluesky', url: 'https://bsky.app/profile/rajnigediya.bsky.social' },
    ],
  },
  {
    id: 'angel-pichardo',
    name: 'Angel Pichardo',
    photoUrl: gn('v1774544671/image_zv0bx9.jpg'),
    company: 'ImageKit.io',
    country: 'USA',
    talk: "I Did Everything Wrong So You Don't Have To",
    tags: ['Agentic workflow', 'AI'],
    bio: 'Angel Pichardo is a Senior Developer Advocate at ImageKit with 10+ years of engineering experience and a background in developer education. He builds at the intersection of AI agents and developer tooling, and his talks are known for making complex workflows click through live demos that start with the problem and work backward to the fix.',
    socials: [
      { type: 'github', url: 'https://github.com/gitpichardo' },
      { type: 'gitnation', url: 'https://gitnation.com/person/angel_pichardo' },
      { type: 'twitter', url: 'https://x.com/_AngelPichardo' },
    ],
  },
  {
    id: 'bogdan-plieshka',
    name: 'Bogdan Plieshka',
    photoUrl: gn('v1780316209/AQQjyoUz1b2%402FxUEHqq1qjCxfr2px2LBOBbkf%402FMN68vA%403D.jpg'),
    company: 'Zattoo',
    country: 'Germany',
    talk: 'The Fourth Platform: How Vega Got Us Surprisingly Close to "Write Once, Run Everywhere"',
    tags: ['Cross-platform'],
    bio: 'Principal Frontend Engineer at Zattoo and React Berlin Meetup Organizer, crafting symbols for over a decade.',
    socials: [
      { type: 'github', url: 'https://github.com/gotbahn' },
      { type: 'gitnation', url: 'https://gitnation.com/person/bogdan_plieshka' },
      { type: 'twitter', url: 'https://x.com/gotbahn' },
      { type: 'instagram', url: 'https://instagram.com/gotbahn' },
    ],
  },
  {
    id: 'artemis-leonardou',
    name: 'Artemis Leonardou',
    photoUrl: gn('v1771328494/PN10XjgakFJt3tcJtN7T3KC31Dc6PTzPUje%402Fv5nU0OE%403D.jpg'),
    company: 'Kanoparty',
    country: 'Greece',
    talk: 'University is My Side Hustle: How Gen Z Builders Ship to Production',
    tags: ['Inspiration'],
    bio: 'Artemis has been building digital products since she was 14, driven by a deep curiosity to turn ideas into tools that solve real problems. One of her first projects was an AI tutor she built to prepare for Greece\u2019s national exams, which helped her score in the top 0.1% nationwide. She has contributed to open-source projects, shipped production-ready tools for startups, and participated in 10+ hackathons with several first-place finishes.',
    socials: [
      { type: 'github', url: 'https://github.com/artemisln' },
      { type: 'gitnation', url: 'https://gitnation.com/person/artemis_leonardou' },
      { type: 'website', url: 'https://artemiscodes.com/' },
      { type: 'instagram', url: 'https://instagram.com/artemis.codes' },
    ],
  },
  {
    id: 'frederic-barthelet',
    name: 'Fr\u00e9d\u00e9ric Barthelet',
    photoUrl: gn('v1771426848/1qOYQUitkg2pQVnVarNInJzVct9NRB584dWgAab7wdc%403D.jpg'),
    company: 'Alpic',
    country: 'France',
    talk: 'Build ChatGPT Apps with Skybridge',
    tags: ['Open-source', 'AI'],
    bio: 'Fred is a passionate and (very) opinionated builder. He\u2019s been in the infrastructure space, in particular serverless technologies. He built Lift to help people ship infrastructure without previous knowledge, and Revant to help reduce infra cost. An AWS community builder for 5 years, he\u2019s now building Alpic — the missing infrastructure layer for the agentic internet — and Skybridge, an open-source framework to build ChatGPT and MCP Apps.',
    socials: [
      { type: 'github', url: 'https://github.com/fredericbarthelet' },
      { type: 'gitnation', url: 'https://gitnation.com/person/frederic_barthelet' },
      { type: 'twitter', url: 'https://x.com/bartheletf' },
      { type: 'linkedin', url: 'https://linkedin.com/in/frederic-barthelet' },
    ],
  },
  {
    id: 'seungho-park',
    name: 'Seungho Park',
    photoUrl: gn('v1681804122/dev/Seungho_Park_ucn3eg.jpg'),
    company: 'LG Electronics',
    country: 'South Korea',
    talk: 'From Figma to TV & Beyond: Scaling React UI with Design Tokens & MCP',
    tags: ['Design systems'],
    bio: 'Seungho is a Research Fellow at LG Electronics, leading Web Engine and Web Framework development. He is the organization owner and maintainer of Enact, a React-based framework optimized for embedded devices. He focuses on building scalable, cross-platform UI architectures and AI-powered web platforms for next-generation consumer electronics.',
    socials: [
      { type: 'github', url: 'https://github.com/seunghoh' },
      { type: 'gitnation', url: 'https://gitnation.com/person/seungho_park' },
      { type: 'twitter', url: 'https://x.com/hohpark' },
      { type: 'website', url: 'https://enactjs.com/' },
    ],
  },
  {
    id: 'michal-ziso',
    name: 'Michal Ziso',
    photoUrl: gn('v1768319703/f5jykO5Tf%402FmU35qIz2QiWXwbYLpGJ7sK0NW1FhAtZKM%403D.jpg'),
    company: 'theZISO Creative Disruption Platform',
    country: 'Israel',
    talk: 'Operating at the Edge: What Extreme Environments Teach Us About AI Systems',
    tags: ['Design systems', 'AI'],
    bio: 'Michal Ziso is an Earth & Space architect and systems thinker focused on how humans operate inside complex, high-risk environments. Her work explores responsibility, leadership, and human performance in chaotic systems operating at the edge. She is the founder of theZISO Creative Disruption platform and a global speaker reaching over 200K people on stages such as TEDx, NASA, Dubai Future Forum and YPO.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/michal_ziso' },
      { type: 'website', url: 'https://theziso.com/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/michal-ziso' },
    ],
  },
  {
    id: 'tathagat-thapliyal',
    name: 'Tathagat Thapliyal',
    photoUrl: gn('v1756650569/Ks7gzmQh0bZNhswUHviQkDBewYZS3PfSZMsDRzniwbE%403D.png'),
    company: 'Simbian',
    country: 'India',
    talk: 'Scaling React: What Actually Matters',
    tags: ['React'],
    bio: 'Tathagat builds engineering teams and frontend systems that scale, having spent years doing it at some of India\u2019s most demanding product companies. Currently heading frontend engineering at Simbian AI, building the UI layer for security infrastructure for the agentic era. He led the full migration from Django to React at CRED, cut load times by 83%, and scaled CRED Garage from 2M to 10M+ customers.',
    socials: [
      { type: 'github', url: 'https://github.com/tathagat2006' },
      { type: 'gitnation', url: 'https://gitnation.com/person/tathagat_thapliyal' },
      { type: 'twitter', url: 'https://x.com/tathagat2006' },
      { type: 'instagram', url: 'https://instagram.com/tathagat.thapliyal' },
    ],
  },
  {
    id: 'himanshu-srivastava',
    name: 'Himanshu Srivastava',
    photoUrl: gn('v1770044395/HlbkgX5QfYcBGjPs%402BmCSlC9Er%402Fw0iW6FC2JmAOEkGCA%403D.jpg'),
    company: 'BIK.ai',
    country: 'India',
    talk: 'React Performance Patterns That Break Down in Long-Running Production Apps',
    tags: ['Performance'],
    bio: 'Himanshu Srivastava is a software engineer working on production web applications using React, Next.js, and backend systems. His work focuses on frontend performance, developer experience, and building systems that remain maintainable as applications scale. He enjoys deeply understanding how frameworks behave beyond surface-level abstractions.',
    socials: [
      { type: 'github', url: 'https://github.com/himanshuSri24' },
      { type: 'gitnation', url: 'https://gitnation.com/person/himanshu_srivastava' },
      { type: 'website', url: 'https://devwithcoffee.com/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/himanshuSri24' },
    ],
  },
  {
    id: 'kaleb-garner',
    name: 'Kaleb Garner',
    photoUrl: gn('v1769222441/lgaC3nF5WpPecnZaxIwa36aRmKyvDMQ8801XRKg%402Fv1M%403D.jpg'),
    company: 'HaloMD',
    country: 'USA',
    talk: 'Mess to Modern: Refactoring a React Nightmare',
    tags: ['React'],
    bio: 'Developer specializing in building human-centered applications in healthcare. His experience spans from leading design direction for large medical sites serving over 40,000+ patients daily to creating full-stack applications that directly impact thousands of practitioners across the nation.',
    socials: [
      { type: 'github', url: 'https://github.com/kgarner-dev' },
      { type: 'gitnation', url: 'https://gitnation.com/person/kaleb_garner' },
      { type: 'website', url: 'https://kalebgarner.dev/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/kalebgarner' },
    ],
  },
  {
    id: 'vishnudhasan-govindarajan',
    name: 'Vishnudhasan Govindarajan',
    photoUrl: gn('v1766584012/BXSfqDHXzl65iT%402FIFK53hzJBFFXejJhnePRXwUXqHSQ%403D.png'),
    company: 'CareStack',
    country: 'India',
    talk: "Debugging What React DevTools Can't See",
    tags: ['Devtools'],
    bio: 'I built cool stuff from India for the World!',
    socials: [
      { type: 'github', url: 'https://github.com/GVishnudhasan' },
      { type: 'gitnation', url: 'https://gitnation.com/person/vishnudhasan_govindarajan' },
      { type: 'twitter', url: 'https://x.com/vishnudhasan10' },
      { type: 'website', url: 'https://vishnudhasan.com/' },
    ],
  },
  {
    id: 'mikkel-malmberg',
    name: 'Mikkel Malmberg',
    photoUrl: gn('v1778770789/_Z5A5687_fp8zxb.jpg'),
    company: 'Tether',
    country: '',
    talk: 'P2P React: Local-First State, Shared Truth',
    tags: ['P2P'],
    bio: 'Mikkel is a programmer and app builder who stumbled into p2p and was excited to find that everything was suddenly possible.',
    socials: [
      { type: 'github', url: 'https://github.com/mikker' },
      { type: 'gitnation', url: 'https://gitnation.com/person/mikkel_malmberg' },
      { type: 'twitter', url: 'https://x.com/mikker' },
      { type: 'website', url: 'https://mikkelmalmberg.com/' },
    ],
  },
  {
    id: 'david-mark-clements',
    name: 'David Mark Clements',
    photoUrl: gn('v1715848075/David_Mark_Clements_xwq3sb.png'),
    company: 'Holepunch',
    country: '',
    talk: 'No Servers, No Cloud, No Masters: Make P2P Apps with Pear',
    tags: ['P2P'],
    bio: 'David Mark Clements is a co-presenter of the Pear peer-to-peer workshop, building production P2P apps with the Pear runtime.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/david_mark_clements' },
    ],
  },
  {
    id: 'kathryn-grayson-nanz',
    name: 'Kathryn Grayson Nanz',
    photoUrl: gn('v1635191787/jhlzdo2xk9zfgyrrsnzr.jpg'),
    company: 'Progress Software',
    country: 'USA',
    talk: 'Panel Discussion: Fullstack is Eating Frontend — Should FE Engineers Adapt?',
    tags: ['Panel discussion'],
    bio: 'In 2013, Kathryn graduated with a BFA and took her first job as a Junior Graphic Designer. Her Creative Director warned her to never let anyone find out she could code, or she\u2019d be stuck doing it forever. She ignored the warning. She currently works as a developer advocate, helping people build web applications in React, designing and maintaining UI component libraries, and trying to stop back-end devs from writing any more CSS.',
    socials: [
      { type: 'github', url: 'https://github.com/kathryngraysonnanz' },
      { type: 'gitnation', url: 'https://gitnation.com/person/kathryn_grayson_nanz' },
      { type: 'twitter', url: 'https://x.com/kathryngrayson' },
      { type: 'website', url: 'https://kgrayson.com/' },
    ],
  },
  {
    id: 'kevin-ball',
    name: 'Kevin Ball',
    photoUrl: gn('v1695039554/kball-headshot-cropped_mbegy6.jpg'),
    company: 'Mento',
    country: 'USA',
    talk: 'Panel Discussion: Fullstack is Eating Frontend — Should FE Engineers Adapt?',
    tags: ['Panel discussion'],
    bio: 'Kevin Ball is VP of engineering at Mento, focused on helping modern workers grow in their careers via a combination of coaching and mentorship. He is also a trained coach, a panelist on the JSParty podcast, and publishes Human Skills. An experienced engineer, manager and entrepreneur, he has co-founded and acted as CTO for 2 companies and founded the San Diego JavaScript Meetup.',
    socials: [
      { type: 'github', url: 'https://github.com/kball' },
      { type: 'gitnation', url: 'https://gitnation.com/person/kevin_ball' },
      { type: 'twitter', url: 'https://x.com/kbal11' },
      { type: 'linkedin', url: 'https://linkedin.com/in/kbal11' },
    ],
  },
  {
    id: 'santosh-yadav',
    name: 'Santosh Yadav',
    photoUrl: gn('v1779285278/68747470733a2f2f696d616765732e6374666173736574732e6e65742f7335756f39356e66366e6a682f3247574b4a6b454839355345774d6f71784542526f582f33343133643664346338663035303730623964396335343930373562353337632f53616e746f73685f59616461765f30372e30312e323_ilwkgg.avif'),
    company: 'CodeRabbit',
    country: 'Germany',
    talk: 'CLI, GUI, or Just Blind Trust? A Tour of Code Review Styles',
    tags: ['Code quality'],
    bio: 'Santosh is a Principal Developer Advocate at CodeRabbit, a GDE for Angular, GitHub Star, Nx Champion and Microsoft MVP. He loves contributing to Angular and its ecosystem and loves monorepos.',
    socials: [
      { type: 'github', url: 'https://github.com/santoshyadavdev' },
      { type: 'gitnation', url: 'https://gitnation.com/person/santosh_yadav_159112' },
      { type: 'twitter', url: 'https://x.com/SantoshYadavDev' },
      { type: 'bluesky', url: 'https://bsky.app/profile/santoshyadav.dev' },
    ],
  },
  {
    id: 'stephen-cooper',
    name: 'Stephen Cooper',
    photoUrl: gn('v1688981064/Stephen_Cooper_wzhmfz.png'),
    company: 'AG Grid',
    country: 'UK',
    talk: 'Framework Native Rendering Without Code Duplication?',
    tags: ['Performance'],
    bio: 'Stephen is the Team Lead for AG Grid and loves sharing practical, experience-based tips, tricks, and case studies from years in the codebase. He\u2019s gone deep into grid performance and framework integrations, and has spent more time than he\u2019d like profiling render cycles. Outside of work, life revolves around family — four kids and two dogs.',
    socials: [
      { type: 'github', url: 'https://github.com/StephenCooper' },
      { type: 'gitnation', url: 'https://gitnation.com/person/stephen_cooper' },
      { type: 'twitter', url: 'https://x.com/scooperdev' },
      { type: 'bluesky', url: 'https://bsky.app/profile/scooper.dev' },
    ],
  },
  {
    id: 'mike-grabowski',
    name: 'Mike Grabowski',
    photoUrl: gn('v1773669787/Mike_Grabowski_zlnwgl.png'),
    company: 'Callstack',
    country: 'Poland',
    talk: 'Giving AI Agents Hands: Mobile Feedback Loops with Agent Device',
    tags: ['AI', 'React Native'],
    bio: 'Codex Ambassador, React Native contributor and CTO.',
    socials: [
      { type: 'github', url: 'https://github.com/grabbou' },
      { type: 'gitnation', url: 'https://gitnation.com/person/mike_grabowski' },
      { type: 'twitter', url: 'https://x.com/grabbou' },
    ],
  },
  {
    id: 'jo-franchetti',
    name: 'Jo Franchetti',
    photoUrl: gn('v1734617922/Jo_Franchetti_vn8lga.jpg'),
    company: 'PayPal',
    country: 'UK',
    talk: 'Personalisation Without the Price Tag - Local LLMs for JavaScript Developers',
    tags: ['AI', 'Workshop'],
    bio: 'Jo is a Software Engineer and Developer Advocate at PayPal. She is passionate about improving developer experience, advocating for TypeScript and teaching good use of the web. She mentors junior developers, advocates for mental health awareness and is devoted to improving the diversity and inclusivity of the tech industry.',
    socials: [
      { type: 'github', url: 'https://github.com/thisisjofrank' },
      { type: 'gitnation', url: 'https://gitnation.com/person/jo_franchetti' },
      { type: 'twitter', url: 'https://x.com/thisisjofrank' },
      { type: 'bluesky', url: 'https://bsky.app/profile/thisisjofrank.bsky.social' },
    ],
  },
  {
    id: 'rosario-fernandes',
    name: 'Rosario Fernandes',
    photoUrl: gn('v1781038639/rosario_headshot_rufpxs.png'),
    company: 'Google',
    country: 'UK',
    talk: 'Taming the Flicker: Firebase Patterns for React Server Components',
    tags: ['React Server Components', 'Firebase'],
    bio: 'Ros\u00e1rio P. Fernandes (@thatfiredev) is a Developer Relations Engineer on the Firebase team at Google, focused on helping developers integrate Firebase and Generative AI into their mobile apps. With a passion for developer communities, he can often be found hanging out with Android, Firebase or Flutter developers.',
    socials: [
      { type: 'github', url: 'https://github.com/thatfiredev' },
      { type: 'gitnation', url: 'https://gitnation.com/person/rosario_fernandes' },
      { type: 'twitter', url: 'https://x.com/thatfiredev' },
      { type: 'bluesky', url: 'https://bsky.app/profile/thatfire.dev' },
    ],
  },
  // --- MCs ---
  {
    id: 'jessie-auguste',
    name: 'Jessie Auguste',
    photoUrl: gn('v1774945152/Z0IHkZHARgAFnNn6IopnMNuYbO1l6X97nW9XLC0veOQ%403D.jpg'),
    company: 'CybSafe',
    country: 'UK',
    role: 'MC',
    tags: ['MC'],
    bio: 'Jessie Auguste is an award-winning Software Engineer at CybSafe and co-founder of Glowing in Tech, a community platform empowering underrepresented voices in technology. As a sought-after speaker and conference host, she has delivered talks globally for LeadDev, codebar, Docker, and conferences including React Miami and DevConf South Africa. She is completing her MSc in Computer Science at the University of Bath.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/jessie_auguste_157217' },
      { type: 'website', url: 'https://glowingintech.com/' },
      { type: 'linkedin', url: 'https://linkedin.com/in/jessie-auguste-80a883178' },
    ],
  },
  {
    id: 'nathaniel-okenwa',
    name: 'Nathaniel Okenwa',
    photoUrl: gn('v1686733319/dev/Nathaniel_Okenwa_q1mixi.jpg'),
    company: 'Twilio',
    country: 'UK',
    role: 'MC',
    tags: ['MC'],
    bio: 'Developer Evangelist at Twilio.',
    socials: [
      { type: 'gitnation', url: 'https://gitnation.com/person/nathaniel_okenwa' },
      { type: 'twitter', url: 'https://twitter.com/chatterboxCoder' },
      { type: 'website', url: 'https://anchor.fm/chatterboxcoder' },
    ],
  },
  {
    id: 'cj-reynolds',
    name: 'CJ Reynolds',
    photoUrl: gn('v1718039023/4WhmThjG6Ce7VLVP6WYIp4hYJKYTN3%402F1n67JkoSCzF0%403D.jpg'),
    company: 'Syntax.fm / Sentry',
    country: 'USA',
    role: 'MC',
    tags: ['MC'],
    bio: 'Senior Creator at Syntax.fm / Sentry.',
    socials: [
      { type: 'github', url: 'https://github.com/w3cj' },
      { type: 'gitnation', url: 'https://gitnation.com/person/cj_111068' },
      { type: 'twitter', url: 'https://x.com/CodingGarden' },
      { type: 'bluesky', url: 'https://bsky.app/profile/w3cj.com' },
    ],
  },
  {
    id: 'mettin-parzinski',
    name: 'Mettin Parzinski',
    photoUrl: gn('v1692715676/Mettin_Parzinski_fjznqj.jpg'),
    company: 'Miro',
    country: 'Netherlands',
    role: 'MC',
    tags: ['MC'],
    bio: 'React (Native) guy and serial development conference MC.',
    socials: [
      { type: 'github', url: 'https://github.com/mettin' },
      { type: 'gitnation', url: 'https://gitnation.com/person/mettin_parzinski' },
      { type: 'twitter', url: 'https://twitter.com/mettinparzinski' },
    ],
  },
  // --- Program Committee ---
  {
    id: 'rita-castro',
    name: 'Rita Castro',
    photoUrl: gn('v1700670009/lVIYbYStXG5FnOOG9bqISqQhmgx2O8KF2p7bmwMYD5M%403D.png'),
    company: 'Volkswagen Group Digital Solutions',
    country: 'Portugal',
    role: 'Program Committee',
    tags: ['Program Committee'],
    bio: 'Software Engineer that used to build standalone applications for data processing and mission planning systems, turned into a Full-Stack Developer. A fan of Test Driven Development, XP and Pair Programming. Also a mom now.',
    socials: [
      { type: 'github', url: 'https://github.com/ritamcastro' },
      { type: 'gitnation', url: 'https://gitnation.com/person/rita_castro' },
      { type: 'twitter', url: 'https://x.com/ritamcastro83' },
      { type: 'website', url: 'https://ritamcastro.dev/' },
    ],
  },
  {
    id: 'konstantin-klimashevich',
    name: 'Konstantin Klimashevich',
    photoUrl: 'https://avatars.githubusercontent.com/u/6384121?v=4',
    company: 'Uber',
    country: 'Netherlands',
    role: 'Program Committee',
    tags: ['Program Committee'],
    bio: 'Engineer at Uber, building the platform that powers its systems. Enjoys creating spaces where developers connect and share ideas.',
    socials: [
      { type: 'github', url: 'https://github.com/mrkosima' },
      { type: 'gitnation', url: 'https://gitnation.com/person/konstantin_klimashevich' },
      { type: 'twitter', url: 'https://x.com/mrkosima' },
      { type: 'website', url: 'https://mrkosima.com/' },
    ],
  },
  {
    id: 'daniel-afonso',
    name: 'Daniel Afonso',
    photoUrl: gn('v1691080299/Daniel_Afonso_svlvjm.jpg'),
    company: 'PagerDuty',
    country: 'Portugal',
    role: 'Program Committee',
    tags: ['Program Committee'],
    bio: 'Daniel Afonso is a Senior Developer Advocate at PagerDuty, SolidJS DX team member, Instructor at Egghead.io, and author of State Management with React Query. He has a full-stack background, having worked with different languages and frameworks on various projects from IoT to Fraud Detection, and is passionate about learning and teaching.',
    socials: [
      { type: 'github', url: 'https://github.com/danieljcafonso' },
      { type: 'gitnation', url: 'https://gitnation.com/person/daniel_afonso' },
      { type: 'twitter', url: 'https://x.com/danieljcafonso' },
      { type: 'bluesky', url: 'https://bsky.app/profile/danieljcafonso.bsky.social' },
    ],
  },
  {
    id: 'johannes-goslar',
    name: 'Johannes Goslar',
    photoUrl: gn('v1627906860/ujn4npwc50ao7pl4kuw7.jpg'),
    company: 'Synthesia',
    country: 'Germany',
    role: 'Program Committee',
    tags: ['Program Committee'],
    bio: 'Johnny loves (board|electronic) games, programming with a lot of parentheses and cycling. After receiving his MSc from Oxford, a short stint in San Francisco and an even shorter one in London, he ended up home near Frankfurt. He famously got fired from Twitter in 2022, worked as Staff Engineer for Sizzle.gg, and is now building the editor at Synthesia.',
    socials: [
      { type: 'github', url: 'https://github.com/ksjogo' },
      { type: 'gitnation', url: 'https://gitnation.com/person/johannes_goslar' },
      { type: 'twitter', url: 'https://x.com/ksjogo' },
      { type: 'website', url: 'https://kronberger-spiele.de/' },
    ],
  },
  {
    id: 'tobbe-lundberg',
    name: 'Tobbe Lundberg',
    photoUrl: gn('v1724266847/tobbe-portrait-800_hqc2og.jpg'),
    company: 'CedarJS',
    country: 'Sweden',
    role: 'Program Committee',
    tags: ['Program Committee'],
    bio: 'Tech Lead at Aerafarms and CedarJS maintainer. Lives out in the middle-of-nowhere in Sweden. Likes everything on two wheels and loves to travel.',
    socials: [
      { type: 'github', url: 'https://github.com/Tobbe' },
      { type: 'gitnation', url: 'https://gitnation.com/person/tobbe_lundberg' },
      { type: 'twitter', url: 'https://x.com/tobbedotdev' },
      { type: 'bluesky', url: 'https://bsky.app/profile/tobbe.dev' },
    ],
  },
]

/** Stable hash from a speaker id so ratings/achievements never change between renders. */
function seed(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Deterministic audience rating in the 8.40 – 9.99 range (world-class line-up). */
function ratingFor(id: string): number {
  const value = 8.4 + (seed(id) % 160) / 100
  return Math.round(value * 100) / 100
}

/**
 * Placeholder ranking points (UI only for now). Aggregated from the audience
 * rating, achievements and a stand-in "endorsement / awards" bonus so points
 * correlate with the speaker's standing. The real weighting — big-tech
 * endorsements, awards, etc. — will be plugged in later.
 */
function rankingPointsFor(
  id: string,
  rating: number,
  achievements: AchievementId[],
): number {
  const ratingPoints = Math.round(rating * 600) // up to ~6,000
  const achievementPoints = achievementScore(achievements) * 20 // up to ~6,000
  const endorsementBonus = seed(`${id}-endorse`) % 1500 // placeholder factor
  return ratingPoints + achievementPoints + endorsementBonus
}

/** Deterministic achievement set: a conference-count tier for everyone + bonus awards. */
function achievementsFor(id: string, rating: number): AchievementId[] {
  const hash = seed(id)
  const earned: AchievementId[] = []

  if (rating >= 9.7 || hash % 6 === 0) earned.push('best-speaker-2025')
  if (hash % 4 === 0) earned.push('best-speaker-2024')
  if (hash % 7 === 0) earned.push('best-speaker-2023')

  const tier = hash % 10
  if (tier >= 8) earned.push('conferences-100')
  else if (tier >= 4) earned.push('conferences-50')
  else earned.push('conferences-10')

  return earned
}

const FALLBACK_EXPERTISE = (name: string): string =>
  `${name} is a respected voice in the React community, recognized for deep technical craft and a track record of sharing hard-won lessons with developers around the world.`

/**
 * Editorial blurbs describing how strong each speaker is in their field.
 * Generated from each speaker's bio, talk and focus areas.
 */
const EXPERTISE: Record<string, string> = {
  kitze:
    'A relentless product builder and one of the most recognizable indie hackers in webdev. Kitze has shipped a small empire of developer tools (Sizzy chief among them) and turned his obsession with great DX into one of the sharpest voices on AI-assisted engineering.',
  'aurora-scharff':
    'One of the clearest explainers of React Server Components working today. As Vercel’s DX Engineer and React Certification Lead, Aurora operates at the bleeding edge of Next.js and turns genuinely hard concepts into resources thousands of developers learn from.',
  'alex-russell':
    'A genuine architect of the modern web. Alex helped shape ES6, Service Workers and Web Components, owns Blink APIs, and is arguably the industry’s most authoritative — and uncompromising — voice on web performance.',
  'scott-tolinski':
    'A master teacher who has helped a generation of developers level up. Through Level Up Tutorials and the Syntax.fm podcast, Scott reaches hundreds of thousands of engineers with a rare gift for making full-stack React approachable and fun.',
  'kadi-kraman':
    'A go-to authority on React Native and Expo. Kadi builds the tooling that makes mobile development delightful and teaches it brilliantly through Frontend Masters and Egghead courses trusted across the ecosystem.',
  'aleksei-petrov':
    'A leading practitioner of autonomous AI coding. As an Anthropic Claude Community Ambassador shipping production software with Claude Code daily, Aleksei is at the absolute frontier of agentic engineering workflows.',
  'manuel-schiller':
    'A TypeScript specialist of rare depth and a core contributor to TanStack Router and Start. Manuel’s fingerprints are on the type-safe, full-stack tools a huge slice of the React community now relies on.',
  'adrian-hajdin':
    'One of the most-watched developer educators on the planet. Through JavaScript Mastery, Adrian has taught millions of developers how to build real projects, and he’s now pioneering how AI fits into technical education.',
  'alex-garrett-smith':
    'A seasoned full-stack engineer and founder with a successful exit behind him. As Tech Education Lead at BitterBrains, Alex pairs real production experience with a knack for teaching the hard parts of AI-era development.',
  'ryan-skinner':
    'A 25-year veteran pushing the limits of what the web can do. Ryan built rari — an RSC framework on a Rust runtime delivering 45x performance gains — proving he operates where deep systems knowledge meets frontend craft.',
  'abbey-perini':
    'A true full-stack engineer and a leading accessibility advocate. Abbey’s technical writing has been read over half a million times, and few people are better at making inclusive, robust web apps feel achievable.',
  'david-haz':
    'A design engineer with an exceptional eye for motion and detail. As the creator of React Bits, David ships some of the most-loved animated React components in open source and sets a high bar for standout UI.',
  'sam-selikoff':
    'A Next.js engineer at Vercel and one of the most respected frontend educators around. After eight-plus years teaching through Build UI and beyond, Sam has an almost unmatched ability to demystify advanced React.',
  'erik-rasmussen':
    'The mind behind Redux Form and Final Form — libraries that powered form handling for a generation of React apps. Erik’s framework-level thinking and craft make him a genuine authority on UI state.',
  'dominik-dorfmeister':
    'The definitive voice on React Query. As maintainer (TkDodo) and prolific writer, Dominik has shaped how the entire community thinks about data fetching, caching and TypeScript in React.',
  'kiril-peyanski':
    'A Principal Engineer working at the cutting edge of generative, AI-assisted interfaces. Kiril blends design systems, UX and LLMs to explore what the next generation of front-end architecture looks like.',
  'daniel-avila':
    'A builder at the frontier of AI tooling. As creator of Claude Code Templates and an AI Tech Lead, Daniel turns emerging agent capabilities into practical workflows developers can actually ship with.',
  jemima:
    'A self-taught developer turned Google Developer Expert and Microsoft MVP. Jemima is a certified accessibility professional and a powerful advocate for performant, inclusive web development.',
  'maurice-de-beijer':
    'A Microsoft MVP every year since 2005 and an elite independent trainer. Maurice’s mastery of TypeScript, React, Svelte and testing has shaped countless teams building mission-critical software worldwide.',
  'mark-erikson':
    'The keeper of Redux and creator of Redux Toolkit. Mark is one of the most generous and knowledgeable people in the React world — if you’ve searched a Redux or React question, you’ve probably learned from him.',
  'cesar-alberca':
    'A frontend architect obsessed with software craftsmanship. César brings deep expertise in DDD, hexagonal architecture and design systems across React, Angular and Vue, backed by international speaking and a published book.',
  'kristiyan-velkov':
    'A Docker Captain and Cursor Ambassador with 10+ years and 100+ certifications behind him. Kristiyan’s reach — 100K+ monthly readers and four books — makes him one of the most prolific frontend and DevOps educators around.',
  'krasimir-tsonev':
    'A 20-year veteran and author who understands React’s internals deeply enough to rebuild Server Components from scratch on stage. Krasimir is a true engineer’s engineer with a gift for explaining the why.',
  'younes-jaaidi':
    'An Angular Google Developer Expert and Nx Champion who has championed Test-Driven Development for two decades. Younes is one of the most credible names in modern testing and software quality.',
  'vitor-alencar':
    'A frontend engineer with a sharp focus on keeping React apps modern. Vitor stays on top of the newest React features and helps teams adopt them pragmatically and confidently.',
  'ariel-shulman':
    'A senior full-stack engineer who thrives on designing for scale. Ariel goes deep on the toughest corners of React — like concurrency — and has a real talent for making elegant, performant systems understandable.',
  'alem-tuzlak':
    'A TanStack maintainer building the tools the React community will rely on next. Alem works at the intersection of AI and React, contributing to TanStack AI and Devtools at the framework level.',
  'faris-aziz':
    'A Staff Frontend Engineer who has shipped systems used by millions across fintech, SaaS and connected TV. Faris specializes in resilient architecture and is exactly who you want designing for failure in production.',
  'shubham-gautam':
    'A senior engineer who lives in the rabbit holes of frontend architecture and performance. Shubham builds real-time experiences that work with React rather than against it, and shares the hard lessons openly.',
  'gaauwe-rombouts':
    'The frontend engineer holding down the web experience at Zed — a speed-obsessed, AI-native editor. As a lone TypeScript developer in a Rust shop, Gaauwe’s standards for performance and quality are exceptionally high.',
  'rachel-kaufman':
    'A full-stack engineer with a genuine love of testing, strong typing and 60-FPS React. Rachel pairs rigorous engineering discipline with community leadership, and knows how to make React fast and keep it fast.',
  'mohamad-shiralizadeh':
    'A security-minded engineer at ING and an AI & JavaScript enthusiast. Mohamad is the person you want explaining how to actually protect your app from real-world attacks, without slowing developers down.',
  'raju-dandigam':
    'An Engineering Manager and Staff Engineer with 15+ years building platforms used by millions. A Docker Captain and Cypress Ambassador, Raju combines deep React expertise with the scale lessons only large systems teach.',
  'trust-jamin':
    'A developer advocate and senior technical writer who has elevated DX across multiple developer products. Trust pairs solid engineering with exceptional communication, making complex platform ideas land cleanly.',
  'julian-burr':
    'A senior developer with 15+ years building web apps and leading frontend teams. A pragmatic perfectionist, Julian is a leading advocate for accessibility done right by leaning on the platform itself.',
  'ameer-sami':
    'A Staff Software Engineer with 15+ years and a deep passion for developer experience and design systems. Ameer builds at the edge of React and brings hard-earned senior-level perspective to everything he ships.',
  'ohans-emmanuel':
    'A Staff Engineer and author of 5+ books whose writing has reached over 5 million readers. Ohans has a rare talent for turning complex problems into simple, reliable systems — and explaining how.',
  'ayodele-aransiola':
    'A solution architect focused on developer education and product adoption. Ayodele specializes in architecting global-scale React for localization and multi-tenancy, and loves teaching teams to succeed.',
  'violina-popova':
    'A cross-platform engineer and co-founder of Frontend Queens. Violina brings strong architectural instincts — like contract-first API design — together with a mission to make tech more inclusive.',
  'martin-mladenov':
    'A Front-End Team Lead with 7+ years managing international teams for prominent UK and Bulgarian companies. Martin is an authority on running effective, high-performing remote frontend teams.',
  'rajni-gediya':
    'A Staff Software Engineer specializing in reliable React Native apps and BLE-powered healthcare products. Rajni excels at architecting systems that stay dependable even in genuinely unreliable environments.',
  'angel-pichardo':
    'A Senior Developer Advocate with 10+ years building at the intersection of AI agents and developer tooling. Angel is known for talks that make complex agentic workflows click through sharp live demos.',
  'bogdan-plieshka':
    'A Principal Frontend Engineer and React Berlin organizer who has been crafting interfaces for over a decade. Bogdan pushes the boundaries of true cross-platform, write-once-run-everywhere React.',
  'artemis-leonardou':
    'A prodigious Gen Z builder shipping production software since 14, with multiple hackathon wins and a top-0.1% exam result powered by an AI tutor she built herself. Artemis is a glimpse of the next generation of engineering talent.',
  'frederic-barthelet':
    'A serverless and infrastructure expert, AWS Community Builder for five years, building the missing infra layer for the agentic internet. Fred turns deep platform knowledge into open-source tools others build on.',
  'seungho-park':
    'A Research Fellow at LG Electronics leading Web Engine and Framework development, and maintainer of Enact. Seungho operates at the intersection of design systems, AI and cross-platform UI for next-gen devices.',
  'michal-ziso':
    'An Earth & Space architect and systems thinker who has spoken on stages from TEDx to NASA. Michal brings a singular perspective on how humans and AI systems perform in extreme, high-risk environments.',
  'tathagat-thapliyal':
    'A frontend leader who migrated CRED from Django to React, cut load times by 83% and scaled a product from 2M to 10M+ users. Tathagat knows what actually matters when scaling React under pressure.',
  'himanshu-srivastava':
    'A software engineer with a deep focus on React performance and long-running production apps. Himanshu loves understanding how frameworks behave beneath the abstractions, and builds systems that stay maintainable at scale.',
  'kaleb-garner':
    'A developer building human-centered healthcare applications used by 40,000+ patients daily. Kaleb excels at taming legacy React codebases and turning messy systems into modern, maintainable ones.',
  'vishnudhasan-govindarajan':
    'An engineer who goes where React DevTools can’t — debugging the problems most developers never see. Vishnudhasan builds genuinely useful things and shares the deep debugging craft behind them.',
  'mikkel-malmberg':
    'A programmer and app builder pioneering local-first, peer-to-peer React. Mikkel makes the once-impossible feel approachable, bringing shared state and offline-first thinking to everyday app development.',
  'david-mark-clements':
    'A peer-to-peer specialist building production P2P apps on the Pear runtime. David is one of the people defining what serverless, decentralized application development can really look like.',
  'kathryn-grayson-nanz':
    'A developer advocate who turned a design background into deep React and design-system expertise. Kathryn builds and maintains UI component libraries and is a clear, compelling voice on the frontend craft.',
  'kevin-ball':
    'A VP of Engineering, trained coach and two-time founder. Kevin pairs serious engineering leadership with a gift for developing people, and brings that dual perspective to the future of frontend.',
  'santosh-yadav':
    'A GitHub Star, Angular GDE, Nx Champion and Microsoft MVP — a genuine pillar of the open-source community. As a Principal DevRel at CodeRabbit, Santosh is a trusted authority on code quality and review.',
  'stephen-cooper':
    'The Team Lead for AG Grid, who has spent years profiling render cycles most developers never touch. Stephen is a deep expert on grid performance and framework-native rendering at scale.',
  'mike-grabowski':
    'A React Native core contributor, Codex Ambassador and CTO at Callstack. Mike is one of the most influential figures in React Native, now pushing into AI agents that act on real devices.',
  'jo-franchetti':
    'A Software Engineer and Developer Advocate at PayPal and a passionate TypeScript champion. Jo is brilliant at teaching practical, real-world web skills — including running local LLMs for everyday JS developers.',
  'rosario-fernandes':
    'A Developer Relations Engineer on Google’s Firebase team, helping developers blend Firebase and generative AI into their apps. Rosário is a trusted guide for production-grade RSC and Firebase patterns.',
  'jessie-auguste':
    'An award-winning Software Engineer and co-founder of Glowing in Tech, and a sought-after conference host for LeadDev, Docker and more. Jessie pairs strong engineering with exceptional stage presence.',
  'nathaniel-okenwa':
    'A Developer Evangelist at Twilio with a natural talent for connecting with audiences. Nathaniel makes developer-facing technology engaging and is a confident, charismatic host.',
  'cj-reynolds':
    'A Senior Creator at Syntax.fm / Sentry and the face of Coding Garden. CJ has taught a huge community of developers live, and brings infectious energy and clarity to everything he hosts.',
  'mettin-parzinski':
    'A React and React Native developer and a serial conference MC. Mettin keeps the energy high and the stage running smoothly, with the technical depth to back up the banter.',
  'rita-castro':
    'A full-stack engineer who moved from mission-planning systems to the web, and a committed advocate of TDD, XP and pair programming. Rita brings disciplined engineering values to the program committee.',
  'konstantin-klimashevich':
    'An engineer at Uber building the platform that powers its systems, who loves creating spaces for developers to connect. Konstantin pairs large-scale platform experience with genuine community spirit.',
  'daniel-afonso':
    'A Senior Developer Advocate at PagerDuty, SolidJS DX team member and author of “State Management with React Query.” Daniel’s full-stack range and teaching make him a valued voice across frameworks.',
  'johannes-goslar':
    'An Oxford-trained engineer who has built at Twitter, Sizzle.gg and now Synthesia’s editor. Johannes brings serious systems chops — and a love of well-parenthesized code — to the program committee.',
  'tobbe-lundberg':
    'A Tech Lead and CedarJS maintainer who helps steer a full-stack React framework. Tobbe combines hands-on open-source maintenance with the perspective to help shape a great conference lineup.',
}

export const REACT_SUMMIT_SPEAKERS: ReactSummitSpeaker[] = RAW_SPEAKERS.map(
  (speaker) => {
    const rating = ratingFor(speaker.id)
    const achievements = achievementsFor(speaker.id, rating)
    return {
      ...speaker,
      rating,
      achievements,
      rankingPoints: rankingPointsFor(speaker.id, rating, achievements),
      expertise: EXPERTISE[speaker.id] ?? FALLBACK_EXPERTISE(speaker.name),
    }
  },
).sort((a, b) => b.rankingPoints - a.rankingPoints)

/** Distinct tags across the line-up, sorted for the filter MultiSelect. */
export const SPEAKER_TAGS: string[] = Array.from(
  new Set(REACT_SUMMIT_SPEAKERS.flatMap((speaker) => speaker.tags)),
).sort((a, b) => a.localeCompare(b))

/** Look up a single speaker by id. */
export function getSpeakerById(id: string): ReactSummitSpeaker | undefined {
  return REACT_SUMMIT_SPEAKERS.find((speaker) => speaker.id === id)
}

/**
 * Global 1-based rank by ranking points. The list is already sorted by points,
 * so the position is the rank. Returns 0 when the speaker is not found.
 */
export function getSpeakerRank(id: string): number {
  return REACT_SUMMIT_SPEAKERS.findIndex((speaker) => speaker.id === id) + 1
}
