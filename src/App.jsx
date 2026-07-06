import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  Globe2,
  Hand,
  Heart,
  Home,
  Info,
  Library,
  Link as LinkIcon,
  Lock,
  LogOut,
  Moon,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  SquarePlay,
  Sun,
  Trash2,
  Upload,
  Users,
  Volume2,
  Zap,
  X,
} from 'lucide-react';

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'hearme2026';

const datasetMediaMap = Object.fromEntries(
  Object.entries(import.meta.glob('../dataset/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })).map(([path, url]) => [path.split('/').pop().toLowerCase(), url]),
);

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');
export const seedCategories = ['Alphabet', 'Numbers', 'Words'];
const DATASET_WORDS = [
  ['and', 'And', 'Bring both hands together and move them outward.'],
  ['are', 'Are', 'Use a questioning handshape with a slight tilt.'],
  ['black', 'Black', 'Trace a downward line with the dominant hand.'],
  ['bye', 'Bye', 'Wave the hand outward in a friendly motion.'],
  ['call', 'Call', 'Open palm taps the ear or the hand is cupped.'],
  ['doctor', 'Doctor', 'Make a small cross shape near the chest.'],
  ['food', 'Food', 'Tap fingertips toward the mouth.'],
  ['for', 'For', 'Open hands sweep forward with a gentle motion.'],
  ['hello', 'Hello', 'Open palm near the shoulder, then move outward.'],
  ['how', 'How', 'Hands turn outward and curve slightly.'],
  ['me', 'Me', 'Point to yourself with your index finger.'],
  ['morning', 'Morning', 'Open hand lifts upward as if greeting the sun.'],
  ['need', 'Need', 'Use a clasped hand motion toward the body.'],
  ['night', 'Night', 'Lower the hand in a closing motion toward the body.'],
  ['no', 'No', 'Use a small side-to-side motion with the hand.'],
  ['please', 'Please', 'Circle the hand near the chest with a gentle motion.'],
  ['red', 'Red', 'Point the index finger downward and trace a small line.'],
  ['thank', 'Thank', 'Move the fingertips forward from the chin.'],
  ['time', 'Time', 'Show a small clock shape with the hands.'],
  ['understand', 'Understand', 'Tap the forehead and then open the hand.'],
  ['water', 'Water', 'Tap the fingertips near the lips.'],
  ['what', 'What', 'Open the hand with a questioning motion.'],
  ['when', 'When', 'Use an open hand and small circular motion.'],
  ['where', 'Where', 'Point outward and then turn the hand.'],
  ['white', 'White', 'Sweep the hand outward with a light motion.'],
  ['yes', 'Yes', 'Nod the hand downward twice in a small motion.'],
  ['you', 'You', 'Point toward the other person.'],
];

const makeCardClip = (label, color = 'cobalt') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="${color === 'sky' ? '#38bdf8' : '#2563eb'}"/>
        <stop offset="1" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" rx="36" fill="url(#g)"/>
    <circle cx="495" cy="92" r="82" fill="#ffffff" opacity=".16"/>
    <circle cx="128" cy="286" r="104" fill="#7dd3fc" opacity=".18"/>
    <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-size="118" font-family="Arial, sans-serif" font-weight="800" fill="#fff">${label}</text>
    <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" fill="#dbeafe">ISL reference placeholder</text>
  </svg>`)}`

export function mergeCategories(...groups) {
  return Array.from(
    new Set(
      groups
        .flat()
        .map((category) => String(category || '').trim())
        .filter(Boolean),
    ),
  );
}

function buildDatasetLibrary() {
  return [
    ...LETTERS.map((letter) => ({
      id: `dataset-letter-${letter}`,
      term: letter,
      category: 'Alphabet',
      description: `Indian Sign Language alphabet reference for the letter ${letter}.`,
      mediaUrl: datasetMediaMap[`${letter.toLowerCase()}.png`] || makeCardClip(letter),
    })),
    ...NUMBERS.map((number) => ({
      id: `dataset-number-${number}`,
      term: number,
      category: 'Numbers',
      description: `Indian Sign Language number reference for ${number}.`,
      mediaUrl: datasetMediaMap[`${number}.png`] || makeCardClip(number, 'sky'),
    })),
    ...DATASET_WORDS.map(([fileName, term, description], index) => ({
      id: `dataset-word-${index}`,
      term,
      category: 'Words',
      description,
      mediaUrl: datasetMediaMap[`${fileName}.png`] || makeCardClip(term),
    })),
  ];
}

export const seedLibrary = buildDatasetLibrary();

export const seedSources = [
  {
    id: 'source-1',
    title: 'Indian Sign Language alphabet practice',
    url: 'https://www.youtube.com/watch?v=J7hUlVRw4jI',
    description: 'Starter reference for alphabet learning and handshape practice.',
  },
  {
    id: 'source-2',
    title: 'Common signs and phrases',
    url: 'https://www.youtube.com/watch?v=9tRkic7Zwew',
    description: 'Practice-oriented source for everyday ISL communication.',
  },
  {
    id: 'source-3',
    title: 'ISL accessibility awareness',
    url: 'https://www.youtube.com/watch?v=fnFWAzd3Kfw',
    description: 'Background resource for inclusion and accessibility workflows.',
  },
];

export const seedClips = [
  {
    id: 'clip-how-are-you',
    phrase: 'How are you',
    description: 'Everyday greeting phrase clip.',
    mediaUrl: makeCardClip('How are you', 'sky'),
  },
  {
    id: 'clip-whats-up',
    phrase: "What's up",
    description: 'Casual conversation opener.',
    mediaUrl: makeCardClip("What's up"),
  },
  {
    id: 'clip-good-morning',
    phrase: 'Good morning',
    description: 'Morning greeting phrase clip.',
    mediaUrl: makeCardClip('Morning', 'sky'),
  },
  {
    id: 'clip-need-help',
    phrase: 'I need help',
    description: 'Urgent assistance phrase clip.',
    mediaUrl: makeCardClip('Help'),
  },
];

const pages = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'translate', label: 'Translate', icon: Volume2 },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'sources', label: 'Sources', icon: LinkIcon },
  { id: 'about', label: 'About', icon: Info },
];

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson(key, fallback) {
  try {
    if (!hasStorage()) return fallback;
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readBoolean(key, fallback) {
  const value = readJson(key, fallback);
  return typeof value === 'boolean' ? value : fallback;
}

function readArray(key, fallback) {
  const value = readJson(key, fallback);
  return Array.isArray(value) ? value : fallback;
}

function normalizeLibraryState(items = []) {
  const datasetEntries = buildDatasetLibrary();
  const seenTerms = new Set(datasetEntries.map((entry) => entry.term.toLowerCase()));
  const customItems = items.filter((item) => {
    if (!item || typeof item.term !== 'string') return false;
    const trimmed = item.term.trim();
    return Boolean(trimmed) && !/\s/.test(trimmed) && !seenTerms.has(trimmed.toLowerCase());
  });

  return [
    ...datasetEntries,
    ...customItems.map((item) => ({
      ...item,
      term: item.term.trim(),
      category: item.category || 'Words',
      mediaUrl: item.mediaUrl || makeCardClip(item.term.trim()),
    })),
  ];
}

function writeJson(key, value) {
  try {
    if (hasStorage()) localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore unavailable storage, such as strict privacy modes.
  }
}

function createId(prefix) {
  const random = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

export function normalizeTerm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function matchEntry(items, key, value) {
  const normalized = normalizeTerm(value);
  return items.find((item) => normalizeTerm(item[key]) === normalized);
}

export function buildTextToSignSequence(text, clips, library) {
  const words = normalizeTerm(text).split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const sequence = [];
  let cursor = 0;
  const maxPhraseLength = Math.min(6, words.length);

  while (cursor < words.length) {
    let matched = null;
    for (let size = Math.min(maxPhraseLength, words.length - cursor); size > 0; size -= 1) {
      const phrase = words.slice(cursor, cursor + size).join(' ');
      const clip = matchEntry(clips, 'phrase', phrase);
      if (clip) {
        matched = { ...clip, term: clip.phrase, matchedBy: 'clip-gallery' };
        cursor += size;
        break;
      }
      if (size === 1) {
        const libraryItem = matchEntry(library, 'term', phrase);
        if (libraryItem) {
          matched = { ...libraryItem, matchedBy: 'library-word' };
          cursor += 1;
          break;
        }
      }
    }

    if (matched) {
      sequence.push(matched);
      continue;
    }

    const rawWord = words[cursor];
    rawWord
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .split('')
      .forEach((char) => {
        const item = library.find((entry) => entry.term === char);
        if (item) sequence.push({ ...item, matchedBy: 'fingerspell', sourceWord: rawWord });
      });
    cursor += 1;
  }

  return sequence;
}

export function youtubeId(url) {
  const patterns = [/youtu\.be\/([^?&]+)/, /youtube\.com\/watch\?v=([^?&]+)/, /youtube\.com\/embed\/([^?&]+)/, /youtube\.com\/shorts\/([^?&]+)/];
  return patterns.map((pattern) => url.match(pattern)?.[1]).find(Boolean) || '';
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
        <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-glow dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-black">HearMe could not load</h1>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            Saved browser data may be damaged. Resetting local app data will restore the seeded library and sources.
          </p>
          <button
            className="mt-5 rounded-xl bg-cobalt-600 px-4 py-2 font-bold text-white hover:bg-cobalt-700"
            onClick={() => {
              if (hasStorage()) localStorage.clear();
              window.location.reload();
            }}
          >
            Reset and reload
          </button>
        </section>
      </main>
    );
  }
}

function SourcePreview({ source }) {
  const id = youtubeId(source.url);
  if (!id) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <ExternalLink aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className="video-shell aspect-video overflow-hidden rounded-2xl bg-slate-950">
      <iframe
        title={source.title}
        src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function isVideoMedia(url = '') {
  return /^data:video\//.test(url) || /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

function MediaPreview({ src, alt, className = 'h-full w-full object-cover' }) {
  if (isVideoMedia(src)) {
    return <video className={className} src={src} controls muted playsInline />;
  }
  return <img className={className} src={src} alt={alt} />;
}

function ZoomableImage({ src, alt }) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function reset() {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }

  function handleWheel(e) {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.12 : 0.88;
    setScale((s) => {
      const next = clamp(s * factor, 1, 3);
      // if scaling down below 1, reset translate
      if (next === 1) setTranslate({ x: 0, y: 0 });
      return next;
    });
  }

  function handleMouseDown(e) {
    if (scale <= 1) return;
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e) {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
  }

  function handleMouseUp() {
    draggingRef.current = false;
  }

  function handleTouchStart(e) {
    if (e.touches?.length === 1 && scale > 1) {
      const t = e.touches[0];
      lastPosRef.current = { x: t.clientX, y: t.clientY };
    }
  }

  function handleTouchMove(e) {
    if (e.touches?.length === 1 && scale > 1) {
      const t = e.touches[0];
      const dx = t.clientX - lastPosRef.current.x;
      const dy = t.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: t.clientX, y: t.clientY };
      setTranslate((t0) => ({ x: t0.x + dx, y: t0.y + dy }));
      e.preventDefault();
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="w-full h-auto overflow-hidden touch-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onDoubleClick={reset}
      style={{ cursor: scale > 1 ? 'grab' : 'auto' }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transformOrigin: 'center center' }}
        className="mx-auto block max-h-[80vh] max-w-[90vw] object-contain"
      />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', rows }) {
  const classes =
    'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none ring-cobalt-500/25 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      {rows ? (
        <textarea className={classes} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      ) : (
        <input className={classes} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      )}
    </label>
  );
}

function Modal({ title, children, onClose }) {
  const modal = (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-4 shadow-glow dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
          <button className="shrink-0 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose} aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return modal;
  return createPortal(modal, document.body);
}

function AdminPanel({ isAdmin, setIsAdmin }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function login(event) {
    event.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      if (hasStorage()) localStorage.setItem('hearme-admin', 'true');
      setIsAdmin(true);
      setOpen(false);
      setError('');
      setPassword('');
      return;
    }
    setError('Invalid admin credentials.');
  }

  if (isAdmin) {
    return (
      <button
        className="inline-flex items-center gap-2 rounded-xl border border-cobalt-200 bg-cobalt-50 px-3 py-2 text-sm font-semibold text-cobalt-700 dark:border-cobalt-500/40 dark:bg-cobalt-950 dark:text-sky-200"
        onClick={() => {
          if (hasStorage()) localStorage.removeItem('hearme-admin');
          setIsAdmin(false);
        }}
      >
        <LogOut size={16} aria-hidden="true" /> Admin
      </button>
    );
  }

  return (
    <>
      <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cobalt-700" onClick={() => setOpen(true)}>
        <Lock size={16} aria-hidden="true" /> Admin
      </button>
      {open && (
        <Modal title="Admin login" onClose={() => setOpen(false)}>
          <form className="grid gap-4" onSubmit={login}>
            <Field label="Username" value={username} onChange={setUsername} placeholder="admin" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="hearme2026" />
            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
            <button className="rounded-xl bg-cobalt-600 px-4 py-2 font-semibold text-white hover:bg-cobalt-700">Sign in</button>
          </form>
        </Modal>
      )}
    </>
  );
}

function Header({ page, setPage, darkMode, setDarkMode, isAdmin, setIsAdmin }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button className="flex items-center gap-3" onClick={() => setPage('home')}>
          <span className="grid size-11 place-items-center rounded-2xl bg-cobalt-600 text-white shadow-glow">
            <Volume2 size={22} aria-hidden="true" />
          </span>
          <span className="text-left">
            <span className="block text-lg font-black text-slate-950 dark:text-white">HearMe</span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-cobalt-600 dark:text-sky-300">ISL access platform</span>
          </span>
        </button>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-2 md:w-auto">
          {pages.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  page === item.id
                    ? 'bg-cobalt-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="order-2 flex items-center gap-2 md:order-3">
          <button
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setDarkMode((value) => !value)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <AdminPanel isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        </div>
      </div>
    </header>
  );
}

function HomePage({ setPage }) {
  const featureCards = [
    {
      title: 'Instant Translation',
      body: 'Type any text - see it signed instantly with pre-recorded ISL clips.',
      icon: Zap,
    },
    {
      title: 'Curated Library',
      body: 'A-Z alphabets, numbers and everyday phrases, all searchable.',
      icon: BookOpen,
    },
    {
      title: 'Trusted Sources',
      body: 'Curated YouTube tutorials that play inline. No hopping tabs.',
      icon: SquarePlay,
    },
    {
      title: 'No Login Required',
      body: 'Every feature is open. Admin login is only for content curation.',
      icon: ShieldCheck,
    },
  ];
  const objectives = [
    {
      title: 'Bridge Barriers',
      body: 'Connect deaf and hearing communities through accessible tech.',
    },
    {
      title: 'Foster Learning',
      body: 'Make ISL discoverable for students, families and educators.',
    },
    {
      title: 'Empower Community',
      body: 'Support independence and confidence in everyday communication.',
    },
    {
      title: 'Drive Inclusion',
      body: 'Push the web toward a more inclusive digital landscape.',
    },
  ];

  return (
    <main>
      <section className="overflow-hidden bg-[linear-gradient(115deg,#f8fbff_0%,#edf7ff_48%,#d7ebff_100%)] dark:bg-[linear-gradient(115deg,#020617_0%,#071735_52%,#0a1744_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-118px)] max-w-7xl items-center gap-10 px-6 md:px-8 py-12 sm:py-14 lg:grid-cols-[.95fr_1.05fr]">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cobalt-700 shadow-sm dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200">
              <Sparkles size={16} aria-hidden="true" /> Indian Sign Language, for everyone
            </p>
            <h1 className="text-5xl font-black leading-[1.05] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Say it. See it.
              <span className="block text-cobalt-600 dark:text-sky-300">Sign it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              HearMe turns everyday text into Indian Sign Language visuals instantly. Learn, translate, and explore ISL without a single signup.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-cobalt-600 px-6 py-4 font-bold text-white shadow-glow hover:bg-cobalt-700" onClick={() => setPage('translate')}>
                Start translating <ArrowRight size={20} aria-hidden="true" />
              </button>
              <button className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white/80 px-6 py-4 font-bold text-slate-900 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-900" onClick={() => setPage('library')}>
                <BookOpen size={19} aria-hidden="true" /> Explore library
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              <p>
                <span className="font-black text-slate-950 dark:text-white">70M+</span> Deaf people use sign languages worldwide
              </p>
              <span className="hidden h-6 w-px bg-slate-300 dark:bg-slate-700 sm:block" aria-hidden="true" />
              <p>
                <span className="font-black text-slate-950 dark:text-white">A-Z</span> alphabets included
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="relative aspect-[1.18] rounded-[3rem] border-[10px] border-sky-500 bg-white shadow-[0_30px_90px_rgba(37,99,235,0.22)] dark:border-sky-400 dark:bg-slate-950">
              <div className="absolute inset-0 grid place-items-center p-8">
                <div className="relative grid place-items-center">
                  <Hand className="h-44 w-44 text-cobalt-600 dark:text-sky-300 sm:h-60 sm:w-60" strokeWidth={1.8} aria-hidden="true" />
                  <span className="absolute -right-12 top-6 rounded-full bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-lg dark:bg-sky-300">Hello</span>
                  <span className="absolute -bottom-8 -left-14 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Thank you</span>
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
                {['51 signs', 'Word match', 'Video sources'].map((item) => (
                  <span key={item} className="rounded-xl bg-slate-50 px-2 py-3 text-center text-xs font-black text-cobalt-700 dark:bg-slate-900 dark:text-sky-200 sm:text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-6 md:px-8 py-16 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cobalt-600 dark:text-sky-300">What HearMe Does</p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">A gentle, powerful gateway to ISL.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Built with accessibility at the core. Every interaction is keyboard-friendly, screen-reader-aware and free to use.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="min-h-72 rounded-xl border border-cobalt-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-glow dark:border-cobalt-500/20 dark:bg-slate-900">
                  <span className="grid size-16 place-items-center rounded-3xl bg-cobalt-100 text-cobalt-600 dark:bg-cobalt-950 dark:text-sky-300">
                    <Icon size={27} strokeWidth={2.3} aria-hidden="true" />
                  </span>
                  <h3 className="mt-8 text-xl font-black text-slate-950 dark:text-white">{feature.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{feature.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-sky-50/60 px-6 md:px-8 py-16 dark:bg-slate-900/70 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cobalt-600 dark:text-sky-300">Our Objectives</p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">Small tool. Bigger mission.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              More than 70 million Deaf people worldwide use sign languages. HearMe is a small but honest step toward a web that respects visual language too.
            </p>
            <button className="mt-8 inline-flex items-center gap-3 text-lg font-bold text-cobalt-600 hover:text-cobalt-700 dark:text-sky-300" onClick={() => setPage('about')}>
              Read our story <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {objectives.map((objective) => (
              <article key={objective.title} className="min-h-40 rounded-xl border border-cobalt-100 bg-white p-6 shadow-sm dark:border-cobalt-500/20 dark:bg-slate-950">
                <h3 className="text-xl font-black text-slate-950 dark:text-white">{objective.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{objective.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-6 md:px-8 py-20 text-center dark:bg-slate-950 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">Ready to make yourself heard?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Jump into the translator - no signup, no downloads. Just meaningful communication.
          </p>
          <button className="mt-10 inline-flex items-center gap-3 rounded-full bg-cobalt-600 px-8 py-4 text-lg font-bold text-white shadow-glow hover:bg-cobalt-700" onClick={() => setPage('translate')}>
            Start translating <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="bg-slate-50 px-6 md:px-8 py-16 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <section>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cobalt-600 dark:text-sky-300">About HearMe</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.05] text-slate-950 dark:text-white md:text-7xl">
            A quiet toolkit for loud conversations.
          </h1>
          <p className="mt-10 max-w-5xl text-xl leading-9 text-slate-600 dark:text-slate-300 md:text-2xl">
            HearMe was built on a simple belief: sign language belongs on the web as much as any other language. We turn everyday words into visual ISL signs, and gather the best learning resources into one calm, searchable place.
          </p>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-2">
          <article className="rounded-xl border border-cobalt-100 bg-white p-8 shadow-sm dark:border-cobalt-500/20 dark:bg-slate-900 md:p-10">
            <span className="grid size-16 place-items-center rounded-3xl bg-cobalt-100 text-cobalt-600 dark:bg-cobalt-950 dark:text-sky-300">
              <Heart size={30} aria-hidden="true" />
            </span>
            <h2 className="mt-8 text-3xl font-black text-slate-950 dark:text-white">Our mission</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              To make Indian Sign Language ambient - visible in classrooms, hospitals, offices and homes. No paywalls, no barriers, no friction.
            </p>
          </article>
          <article className="rounded-xl border border-cobalt-100 bg-white p-8 shadow-sm dark:border-cobalt-500/20 dark:bg-slate-900 md:p-10">
            <span className="grid size-16 place-items-center rounded-3xl bg-sky-100 text-cobalt-600 dark:bg-sky-950 dark:text-sky-300">
              <Users size={30} aria-hidden="true" />
            </span>
            <h2 className="mt-8 text-3xl font-black text-slate-950 dark:text-white">Who it's for</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Deaf and hard-of-hearing individuals, families, teachers, healthcare workers, and every curious learner who wants to communicate more inclusively.
            </p>
          </article>
        </section>

        <section className="mt-20 rounded-2xl bg-cobalt-600 px-8 py-12 text-white shadow-glow md:px-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <Globe2 className="mt-1 shrink-0" size={38} aria-hidden="true" />
            <div>
              <h2 className="text-3xl font-black md:text-4xl">About Indian Sign Language</h2>
              <p className="mt-6 text-lg font-medium leading-8 text-cobalt-50 md:text-xl">
                Indian Sign Language (ISL) is a visual-gestural language used by the deaf community across India. It has its own grammar and syntax and serves as the primary means of communication for an estimated 5 million deaf individuals nationwide. Recognising ISL is a step towards recognising the millions who rely on it every day.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-4xl font-black text-slate-950 dark:text-white">How we built it</h2>
          <div className="mt-8 space-y-6 text-xl leading-9 text-slate-600 dark:text-slate-300">
            <p>
              HearMe is a purposefully small app. The translator matches your input against a curated library of pre-recorded ISL clips - starting with alphabets, numbers and everyday greetings - and falls back to letter-by-letter fingerspelling for unknown words.
            </p>
            <p>
              The library and sources pages are editable by an admin who can add, update or remove entries. Everyone else can browse and use every feature without ever creating an account.
            </p>
          </div>
        </section>

        <section className="mt-20 rounded-xl border border-dashed border-cobalt-300 bg-cobalt-50/60 p-8 dark:border-cobalt-500/40 dark:bg-cobalt-950/40 md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <Sparkles className="shrink-0 text-cobalt-600 dark:text-sky-300" size={34} aria-hidden="true" />
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Want to contribute a sign?</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Reach out to our team - we're actively expanding the library with community-approved clips for phrases, names and regional variations.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function clipPredictionLabel(match) {
  if (!match) return 'No prediction yet';
  return `${match.label} (${Math.round(match.confidence * 100)}%)`;
}

function extractFrameFeatures(video) {
  if (!video?.videoWidth || !video?.videoHeight) return null;
  const canvas = document.createElement('canvas');
  const size = 16;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(video, 0, 0, size, size);
  const data = context.getImageData(0, 0, size, size).data;
  const features = [];
  for (let index = 0; index < data.length; index += 16) {
    const r = data[index] / 255;
    const g = data[index + 1] / 255;
    const b = data[index + 2] / 255;
    features.push(Number(((r + g + b) / 3).toFixed(4)));
  }
  return features;
}

function distanceBetween(a = [], b = []) {
  if (!a.length || a.length !== b.length) return Number.POSITIVE_INFINITY;
  const sum = a.reduce((total, value, index) => total + (value - b[index]) ** 2, 0);
  return Math.sqrt(sum / a.length);
}

function predictSign(features, examples) {
  const verified = examples.filter((item) => item.verified && item.features?.length);
  if (!features || !verified.length) return null;
  const ranked = verified
    .map((item) => ({ label: item.label, distance: distanceBetween(features, item.features) }))
    .sort((a, b) => a.distance - b.distance);
  const best = ranked[0];
  return { label: best.label, confidence: Math.max(0, Math.min(1, 1 - best.distance)) };
}

function ClipForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { phrase: '', description: '', mediaUrl: '' });
  const [fileStatus, setFileStatus] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  function useFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setFileStatus('Choose an image, GIF, or video file for the clip.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update('mediaUrl', String(reader.result || ''));
      setFileStatus(`${file.name} added. Review it before saving.`);
    };
    reader.onerror = () => setFileStatus('Could not read that file.');
    reader.readAsDataURL(file);
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ ...form, mediaUrl: form.mediaUrl || makeCardClip(form.phrase || 'Clip') });
      }}
    >
      <Field label="Line or phrase" value={form.phrase} onChange={(value) => update('phrase', value)} placeholder="How are you" />
      <Field label="Video, GIF, or image URL" value={form.mediaUrl} onChange={(value) => update('mediaUrl', value)} placeholder="https://..." />
      <label
        className="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-cobalt-200 bg-slate-50 px-4 py-6 text-center transition hover:border-cobalt-400 hover:bg-cobalt-50 dark:border-cobalt-500/30 dark:bg-slate-950 dark:hover:bg-cobalt-950/40"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          useFile(event.dataTransfer.files?.[0]);
        }}
      >
        <input className="sr-only" type="file" accept="image/*,video/*,.gif" onChange={(event) => useFile(event.target.files?.[0])} />
        <Upload className="mb-3 text-cobalt-600 dark:text-sky-300" size={28} aria-hidden="true" />
        <span className="font-bold text-slate-950 dark:text-white">Drop a small sign video here</span>
        <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to search your files</span>
      </label>
      {fileStatus && <p className="rounded-xl bg-cobalt-50 px-3 py-2 text-sm font-semibold text-cobalt-700 dark:bg-cobalt-950 dark:text-sky-200">{fileStatus}</p>}
      <Field label="Description" value={form.description} onChange={(value) => update('description', value)} placeholder="Where this phrase is used" rows={3} />
      <div className="flex justify-end gap-2">
        <button type="button" className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={onCancel}>
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-4 py-2 font-bold text-white hover:bg-cobalt-700">
          <Check size={17} aria-hidden="true" /> Save
        </button>
      </div>
    </form>
  );
}

function ClipGallery({ clips, setClips, isAdmin }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const filtered = clips.filter((clip) => `${clip.phrase} ${clip.description}`.toLowerCase().includes(query.toLowerCase()));

  function saveClip(clip) {
    if (clip.id) {
      setClips((current) => current.map((entry) => (entry.id === clip.id ? clip : entry)));
    } else {
      setClips((current) => [{ ...clip, id: createId('clip') }, ...current]);
    }
    setEditing(null);
  }

  return (
    <section className="grid gap-5">
      
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_auto] md:items-center">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-950 outline-none ring-cobalt-500/25 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clips" />
        </label>
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">{filtered.length} clips</span>
          {isAdmin && (
            <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-3 py-2 text-sm font-bold text-white hover:bg-cobalt-700" onClick={() => setEditing({})}>
              <Plus size={16} aria-hidden="true" /> Add clip
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((clip) => (
          <article key={clip.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900">
            {isAdmin && (
              <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                <button className="grid size-9 place-items-center rounded-xl bg-white text-cobalt-700 shadow" onClick={() => setEditing(clip)} aria-label={`Edit ${clip.phrase}`}>
                  <Edit3 size={16} aria-hidden="true" />
                </button>
                <button className="grid size-9 place-items-center rounded-xl bg-white text-red-600 shadow" onClick={() => setClips((current) => current.filter((entry) => entry.id !== clip.id))} aria-label={`Delete ${clip.phrase}`}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            )}
            <div className="aspect-video bg-slate-950">
              <button type="button" className="h-full w-full" onClick={() => setPreview({ src: clip.mediaUrl, alt: `${clip.phrase} clip` })} aria-label={`Open ${clip.phrase}`}>
                <MediaPreview src={clip.mediaUrl} alt={`${clip.phrase} clip`} />
              </button>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{clip.phrase}</h3>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit clip' : 'Add clip'} onClose={() => setEditing(null)}>
          <ClipForm initial={editing.id ? editing : undefined} onSave={saveClip} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {preview && (
        <Modal title="Preview" onClose={() => setPreview(null)}>
          <div className="max-w-[90vw]">
            <ZoomableImage src={preview.src} alt={preview.alt} />
          </div>
        </Modal>
      )}
    </section>
  );
}

function WebcamTrainer({ examples, setExamples, isAdmin }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [label, setLabel] = useState('');
  const [correctLabel, setCorrectLabel] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [status, setStatus] = useState('Start the webcam to recognize signs.');

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setStatus('Camera running. Hold a sign inside the frame.');
    } catch {
      setStatus('Camera access was blocked or unavailable.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    setPrediction(null);
    setStatus('Camera stopped.');
  }

  function captureExample(exampleLabel, verified = true) {
    const clean = exampleLabel.trim();
    const features = extractFrameFeatures(videoRef.current);
    if (!clean || !features) {
      setStatus('Start the camera and enter a label before saving an example.');
      return;
    }
    setExamples((current) => [
      {
        id: createId('training'),
        label: clean,
        features,
        verified,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setStatus(`${clean} example saved for future predictions.`);
  }

  function runPrediction() {
    const features = extractFrameFeatures(videoRef.current);
    const result = predictSign(features, examples);
    setPrediction(result);
    setStatus(result ? `Recognized ${clipPredictionLabel(result)}.` : 'Train at least one verified example before predicting.');
  }

  useEffect(() => {
    if (!cameraOn) return undefined;
    const timer = window.setInterval(runPrediction, 900);
    return () => window.clearInterval(timer);
  }, [cameraOn, examples]);

  useEffect(() => () => stopCamera(), []);

  const labels = Array.from(new Set(examples.map((item) => item.label)));

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Webcam</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Position your sign in frame</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-4 py-2 text-sm font-bold text-white hover:bg-cobalt-700" onClick={cameraOn ? stopCamera : startCamera}>
            <Camera size={18} aria-hidden="true" /> {cameraOn ? 'Stop' : 'Start'}
          </button>
        </div>
        <div className="relative flex-1 min-h-80 bg-slate-950">
          <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
          <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-white/25" aria-hidden="true" />
          <span className={`absolute left-4 top-4 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wide ${cameraOn ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-white'}`}>
            {cameraOn ? 'Live' : 'Offline'}
          </span>
        </div>
        <div className="grid gap-3 bg-cobalt-50 p-5 dark:bg-cobalt-950/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cobalt-700 dark:text-sky-200">Live text</p>
              <p className="text-2xl font-black text-slate-950 dark:text-white">{prediction?.label || '...'}</p>
            </div>
            <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-cobalt-700 shadow-sm dark:bg-slate-900 dark:text-sky-200">{clipPredictionLabel(prediction)}</span>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{status}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isAdmin ? (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                <BrainCircuit size={26} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Admin training</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{examples.length} examples • {labels.length} labels</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <Field label="Training label" value={label} onChange={setLabel} placeholder="Hello" />
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-cobalt-600 px-4 py-3 font-bold text-white hover:bg-cobalt-700" onClick={() => captureExample(label, true)}>
                <Save size={18} aria-hidden="true" /> Save verified example
              </button>
              <Field label="Correct answer" value={correctLabel} onChange={setCorrectLabel} placeholder={prediction?.label || 'Correct label'} />
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-cobalt-200 bg-white px-4 py-3 font-bold text-cobalt-700 hover:bg-cobalt-50 dark:border-cobalt-500/40 dark:bg-slate-900 dark:text-sky-200" onClick={() => captureExample(correctLabel, true)}>
                <RefreshCw size={18} aria-hidden="true" /> Save correction
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">Training locked</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Admins can add verified webcam examples and corrections after signing in.</p>
          </section>
        )}
        <section className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">Model memory</h3>
            <span className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">{labels.length} labels</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {labels.length ? labels.map((item) => <span key={item} className="rounded-xl bg-sky-100 px-3 py-2 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-200">{item}</span>) : <p className="text-sm text-slate-500 dark:text-slate-400">No labels trained yet.</p>}
          </div>
          {isAdmin && examples.length > 0 && (
            <button className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-200" onClick={() => setExamples([])}>
              Clear training data
            </button>
          )}
        </section>
      </div>
    </section>
  );
}

function TranslatePage({ library, clips, setClips, examples, setExamples, isAdmin }) {
  const [text, setText] = useState('Hello thank you');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState('text');
  const [showIntro, setShowIntro] = useState(() => !hasStorage() || localStorage.getItem('hearme-translate-intro') !== 'seen');
  const mainRef = useRef(null);

  const sequence = useMemo(() => buildTextToSignSequence(text, clips, library), [text, clips, library]);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [text]);

  useEffect(() => {
    if (!playing || sequence.length <= 1) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % sequence.length), 1400);
    return () => window.clearInterval(timer);
  }, [playing, sequence.length]);

  useEffect(() => {
    const scrollAmount = 150;
    const scrollDuration = 600; // milliseconds
    const startTime = Date.now();
    const startScrollPosition = window.scrollY;
    
    const animateScroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      window.scrollTo(0, startScrollPosition + scrollAmount * progress);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, [mode]);

  const current = sequence[index];
  const modeMeta = {
    text: ['Text-to-Sign', 'Sentence clips, word signs, and fingerspelling in one playback flow.'],
    webcam: ['Webcam AI', 'Recognize trained signs from the camera and improve the model with corrections.'],
    clips: ['Clip Gallery', 'Manage full sentence and line videos for Text-to-Sign.'],
  };

  return (
    <main ref={mainRef} className="mx-auto max-w-7xl px-6 md:px-8 py-4 sm:py-5">
      {showIntro && (
        <Modal
          title="How text-to-ISL works"
          onClose={() => {
            if (hasStorage()) localStorage.setItem('hearme-translate-intro', 'seen');
            setShowIntro(false);
          }}
        >
          <div className="space-y-3 text-slate-700 dark:text-slate-200">
            <p>Type a word or sentence. HearMe first checks the Clip Gallery for complete sentence or line clips.</p>
            <p>Remaining single words are matched in the Sign Library. Unknown words fall back to A-Z and 0-9 fingerspelling.</p>
            <p>Use Webcam AI for real-time sign-to-text recognition after an admin trains examples.</p>
            <button className="rounded-xl border border-cobalt-600 px-4 py-2 font-semibold text-cobalt-600 hover:bg-cobalt-50 dark:text-sky-300" onClick={() => {
              if (hasStorage()) localStorage.setItem('hearme-translate-intro', 'seen');
              setShowIntro(false);
            }}
            >
              Got it
            </button>
          </div>
        </Modal>
      )}
      <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 bg-slate-50 px-4 py-3 dark:bg-slate-950/70 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cobalt-600 dark:text-sky-300">Translate workspace</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-white">{modeMeta[mode][0]}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{modeMeta[mode][1]}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {[
              ['text', 'Text', Volume2],
              ['webcam', 'AI', Camera],
              ['clips', 'Clips', SquarePlay],
            ].map(([id, label, Icon]) => (
              <button key={id} className={`inline-flex min-w-20 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${mode === id ? 'bg-cobalt-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`} onClick={() => setMode(id)}>
                <Icon size={17} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'text' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Your text</h2>
            <textarea
              className="mt-4 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-950 outline-none ring-cobalt-500/25 focus:ring-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Try 'Hello, how are you?' or 'ABC 123'"
            />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">TRY THESE</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Hello', 'Thank You', 'How are you', 'Please help', 'ABC 123'].map((sample) => (
                <button key={sample} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setText(sample)}>
                  {sample}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-cobalt-600 px-6 py-3 font-bold text-white hover:bg-cobalt-700" onClick={() => setPlaying((value) => !value)} disabled={!sequence.length}>
                {playing ? (
                  <>
                    <Pause size={18} aria-hidden="true" /> Pause
                  </>
                ) : (
                  <>
                    <Play size={18} aria-hidden="true" /> Play
                  </>
                )}
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => { setIndex(0); setPlaying(false); }} disabled={!sequence.length}>
                <RefreshCw size={18} aria-hidden="true" /> Replay
              </button>
            </div>
          </section>

          <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">ISL output</h2>
            <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-950 min-h-80">
              {current ? (
                <div className="grid w-full h-full gap-3 p-3">
                  <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden">
                    <MediaPreview
                      src={current.mediaUrl}
                      alt={`${current.term} ISL reference`}
                      className={`h-full w-full ${['Alphabet', 'Numbers'].includes(current.category) ? 'object-contain' : 'object-cover'}`}
                    />
                  </div>
                  <div className="grid gap-2 rounded-xl bg-white p-3 dark:bg-slate-900">
                    <p className="text-sm font-black text-slate-950 dark:text-white">{current.term}</p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {sequence.map((item, itemIndex) => (
                        <button key={`${item.id}-${itemIndex}`} className={`min-w-10 rounded-xl px-3 py-2 text-xs font-bold ${itemIndex === index ? 'bg-cobalt-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`} onClick={() => setIndex(itemIndex)}>
                          {item.term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Sparkles size={32} className="mx-auto mb-3 text-cobalt-400" aria-hidden="true" />
                  <p className="text-lg font-black text-slate-950 dark:text-white">Your signs will appear here</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Start typing on the left to see live ISL translation.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      {mode === 'webcam' && <WebcamTrainer examples={examples} setExamples={setExamples} isAdmin={isAdmin} />}
      {mode === 'clips' && <ClipGallery clips={clips} setClips={setClips} isAdmin={isAdmin} />}
    </main>
  );
}

function LibraryForm({ initial, onSave, onCancel, categories }) {
  const [form, setForm] = useState(initial || { term: '', category: 'Words', description: '', mediaUrl: '' });
  const [fileStatus, setFileStatus] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const categoryOptions = mergeCategories(categories, [form.category]);

  function useFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setFileStatus('Choose an image, GIF, or video file for the library media.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update('mediaUrl', String(reader.result || ''));
      setFileStatus(`${file.name} added to the media URL field. Review it before saving.`);
    };
    reader.onerror = () => setFileStatus('Could not read that file.');
    reader.readAsDataURL(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    useFile(event.dataTransfer.files?.[0]);
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const cleanTerm = form.term.trim();
        if (!cleanTerm || /\s/.test(cleanTerm)) {
          setFileStatus('Library items must be a single word only.');
          return;
        }
        onSave({ ...form, term: cleanTerm, mediaUrl: form.mediaUrl || makeCardClip(cleanTerm) });
      }}
    >
      <Field label="Single word" value={form.term} onChange={(value) => update('term', value)} placeholder="Hello" />
      <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
        Category
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none ring-cobalt-500/25 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          value={form.category}
          onChange={(event) => update('category', event.target.value)}
        >
          {categoryOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <Field label="Video, GIF, or image URL" value={form.mediaUrl} onChange={(value) => update('mediaUrl', value)} placeholder="https://..." />
      <label
        className="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-cobalt-200 bg-slate-50 px-4 py-6 text-center transition hover:border-cobalt-400 hover:bg-cobalt-50 dark:border-cobalt-500/30 dark:bg-slate-950 dark:hover:bg-cobalt-950/40"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input className="sr-only" type="file" accept="image/*,video/*,.gif" onChange={(event) => useFile(event.target.files?.[0])} />
        <Upload className="mb-3 text-cobalt-600 dark:text-sky-300" size={28} aria-hidden="true" />
        <span className="font-bold text-slate-950 dark:text-white">Drop a sign image, GIF, or video here</span>
        <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to search your files</span>
      </label>
      {fileStatus && <p className="rounded-xl bg-cobalt-50 px-3 py-2 text-sm font-semibold text-cobalt-700 dark:bg-cobalt-950 dark:text-sky-200">{fileStatus}</p>}
      <Field label="Description" value={form.description} onChange={(value) => update('description', value)} placeholder="How to perform this sign" rows={3} />
      <div className="flex justify-end gap-2">
        <button type="button" className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={onCancel}>
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-4 py-2 font-bold text-white hover:bg-cobalt-700">
          <Check size={17} aria-hidden="true" /> Save
        </button>
      </div>
    </form>
  );
}

function CategoryManager({ categories, library, onRename, onAdd, onDelete }) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [message, setMessage] = useState('');

  function addCategory(event) {
    event.preventDefault();
    const clean = newCategory.trim();
    if (!clean) return;
    onAdd(clean);
    setNewCategory('');
    setMessage(`${clean} added.`);
  }

  return (
    <div className="grid gap-5">
      <form className="flex flex-col gap-2 sm:flex-row" onSubmit={addCategory}>
        <input
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none ring-cobalt-500/25 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
          placeholder="New category"
        />
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-cobalt-600 px-4 py-2 font-bold text-white hover:bg-cobalt-700">
          <Plus size={17} aria-hidden="true" /> Add
        </button>
      </form>
      <div className="grid gap-2">
        {categories.map((item) => {
          const inUse = library.some((entry) => entry.category === item);
          const isEditing = editingCategory === item;
          return (
            <div key={item} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center">
              {isEditing ? (
                <input
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none ring-cobalt-500/25 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  value={editingValue}
                  onChange={(event) => setEditingValue(event.target.value)}
                  autoFocus
                />
              ) : (
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-950 dark:text-white">{item}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{inUse ? 'Used by library items' : 'Unused'}</p>
                </div>
              )}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="rounded-xl bg-cobalt-600 px-3 py-2 text-sm font-bold text-white hover:bg-cobalt-700"
                      onClick={() => {
                        const clean = editingValue.trim();
                        if (!clean) return;
                        onRename(item, clean);
                        setEditingCategory('');
                        setMessage(`${item} renamed to ${clean}.`);
                      }}
                    >
                      Save
                    </button>
                    <button type="button" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => setEditingCategory('')}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-xl bg-white text-cobalt-700 shadow-sm dark:bg-slate-900 dark:text-sky-200"
                      onClick={() => {
                        setEditingCategory(item);
                        setEditingValue(item);
                      }}
                      aria-label={`Edit ${item}`}
                    >
                      <Edit3 size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-xl bg-white text-red-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-900 dark:text-red-200"
                      onClick={() => {
                        if (inUse) {
                          setMessage('Rename categories that are in use, or move items before deleting them.');
                          return;
                        }
                        onDelete(item);
                        setMessage(`${item} deleted.`);
                      }}
                      aria-label={`Delete ${item}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {message && <p className="rounded-xl bg-cobalt-50 px-3 py-2 text-sm font-semibold text-cobalt-700 dark:bg-cobalt-950 dark:text-sky-200">{message}</p>}
    </div>
  );
}

function LibraryPage({ library, setLibrary, categories, setCategories, isAdmin }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [editing, setEditing] = useState(null);
  const [editingCategories, setEditingCategories] = useState(false);
  const [preview, setPreview] = useState(null);
  const categoryOptions = mergeCategories(categories, library.map((item) => item.category));
  const filterCategories = ['All', ...categoryOptions];
  const filtered = library.filter((item) => {
    const matchesSearch = `${item.term} ${item.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (category === 'All' || item.category === category);
  });

  function saveItem(item) {
    if (item.id) {
      setLibrary((current) => current.map((entry) => (entry.id === item.id ? item : entry)));
    } else {
      setLibrary((current) => [{ ...item, id: createId('custom') }, ...current]);
    }
    setEditing(null);
  }

  function addCategory(value) {
    setCategories((current) => mergeCategories(current, [value]));
  }

  function renameCategory(from, to) {
    setCategories((current) => mergeCategories(current.map((item) => (item === from ? to : item))));
    setLibrary((current) => current.map((item) => (item.category === from ? { ...item, category: to } : item)));
    if (category === from) setCategory(to);
  }

  function deleteCategory(value) {
    setCategories((current) => current.filter((item) => item !== value));
    if (category === value) setCategory('All');
  }

  return (
    <main className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cobalt-600 dark:text-sky-300">ISL Library</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">A quiet library of signs.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Browse Indian Sign Language for alphabets, numbers and everyday single words. Filter by category or search directly.</p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-cobalt-200 bg-white px-4 py-2 font-bold text-cobalt-700 hover:bg-cobalt-50 dark:border-cobalt-500/40 dark:bg-slate-900 dark:text-sky-200" onClick={() => setEditingCategories(true)}>
              <Edit3 size={18} aria-hidden="true" /> Edit categories
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-4 py-2 font-bold text-white hover:bg-cobalt-700" onClick={() => setEditing({})}>
              <Plus size={18} aria-hidden="true" /> Add item
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-950 outline-none ring-cobalt-500/25 focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search signs" />
        </label>
        <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={category} onChange={(event) => setCategory(event.target.value)}>
          {filterCategories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <article key={item.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="aspect-video bg-slate-950">
                <button type="button" className="h-full w-full" onClick={() => setPreview({ src: item.mediaUrl, alt: `${item.term} ISL reference` })} aria-label={`Open ${item.term}`}>
                  <MediaPreview src={item.mediaUrl} alt={`${item.term} ISL reference`} />
                </button>
              </div>
            {isAdmin && (
              <div className="absolute right-3 top-3 flex translate-y-1 gap-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <button className="grid size-9 place-items-center rounded-xl bg-white text-cobalt-700 shadow" onClick={() => setEditing(item)} aria-label={`Edit ${item.term}`}>
                  <Edit3 size={16} aria-hidden="true" />
                </button>
                <button className="grid size-9 place-items-center rounded-xl bg-white text-red-600 shadow" onClick={() => setLibrary((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Delete ${item.term}`}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-slate-950 dark:text-white">{item.term}</h2>
                <span className="rounded-xl bg-sky-100 px-2 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-200">{item.category}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit library item' : 'Add library item'} onClose={() => setEditing(null)}>
          <LibraryForm initial={editing.id ? editing : undefined} categories={categoryOptions} onSave={saveItem} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {editingCategories && (
        <Modal title="Edit categories" onClose={() => setEditingCategories(false)}>
          <CategoryManager categories={categoryOptions} library={library} onAdd={addCategory} onRename={renameCategory} onDelete={deleteCategory} />
        </Modal>
      )}
      {preview && (
        <Modal title="Preview" onClose={() => setPreview(null)}>
          <div className="max-w-[90vw]">
            <ZoomableImage src={preview.src} alt={preview.alt} />
          </div>
        </Modal>
      )}
    </main>
  );
}

function SourceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', url: '', description: '' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(form);
      }}
    >
      <Field label="Title" value={form.title} onChange={(value) => update('title', value)} placeholder="ISL lesson" />
      <Field label="YouTube URL" value={form.url} onChange={(value) => update('url', value)} placeholder="https://www.youtube.com/watch?v=..." />
      <Field label="Description" value={form.description} onChange={(value) => update('description', value)} placeholder="Why this source is useful" rows={3} />
      <div className="flex justify-end gap-2">
        <button type="button" className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={onCancel}>
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-4 py-2 font-bold text-white hover:bg-cobalt-700">
          <Check size={17} aria-hidden="true" /> Save
        </button>
      </div>
    </form>
  );
}

function SourcesPage({ sources, setSources, isAdmin }) {
  const [editing, setEditing] = useState(null);

  function saveSource(source) {
    if (source.id) {
      setSources((current) => current.map((entry) => (entry.id === source.id ? source : entry)));
    } else {
      setSources((current) => [{ ...source, id: createId('source') }, ...current]);
    }
    setEditing(null);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-950 dark:text-white">Sources</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Curated YouTube resources play inline with automatic embed previews.</p>
        </div>
        {isAdmin && (
          <button className="inline-flex items-center gap-2 rounded-xl bg-cobalt-600 px-4 py-2 font-bold text-white hover:bg-cobalt-700" onClick={() => setEditing({})}>
            <Plus size={18} aria-hidden="true" /> Add source
          </button>
        )}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {sources.map((source) => (
          <article key={source.id} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <SourcePreview source={source} />
            <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">{source.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{source.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <a className="inline-flex items-center gap-2 text-sm font-bold text-cobalt-600 hover:text-cobalt-700 dark:text-sky-300" href={source.url} target="_blank" rel="noreferrer">
                <ExternalLink size={16} aria-hidden="true" /> Open
              </a>
              {isAdmin && (
                <div className="flex gap-2">
                  <button className="grid size-9 place-items-center rounded-xl bg-cobalt-50 text-cobalt-700 dark:bg-cobalt-950 dark:text-sky-200" onClick={() => setEditing(source)} aria-label={`Edit ${source.title}`}>
                    <Edit3 size={16} aria-hidden="true" />
                  </button>
                  <button className="grid size-9 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-200" onClick={() => setSources((current) => current.filter((entry) => entry.id !== source.id))} aria-label={`Delete ${source.title}`}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit source' : 'Add source'} onClose={() => setEditing(null)}>
          <SourceForm initial={editing.id ? editing : undefined} onSave={saveSource} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(() => readBoolean('hearme-dark-mode', false));
  const [isAdmin, setIsAdmin] = useState(() => hasStorage() && localStorage.getItem('hearme-admin') === 'true');
  const [library, setLibrary] = useState(() => normalizeLibraryState(readArray('hearme-library', seedLibrary)));
  const [sources, setSources] = useState(() => readArray('hearme-sources', seedSources));
  const [clips, setClips] = useState(() => readArray('hearme-clips', seedClips));
  const [trainingExamples, setTrainingExamples] = useState(() => readArray('hearme-training-examples', []));
  const [categories, setCategories] = useState(() => mergeCategories(readArray('hearme-categories', seedCategories), seedLibrary.map((item) => item.category)));
  const [persistReady, setPersistReady] = useState(false);

  useEffect(() => {
    let active = true;

    fetch('/api/state')
      .then(async (response) => {
        if (!response.ok) throw new Error('api unavailable');
        const payload = await response.json();
        if (!active) return;
        if (typeof payload.darkMode === 'boolean') setDarkMode(payload.darkMode);
        if (Array.isArray(payload.library) && payload.library.length > 0) {
          setLibrary(normalizeLibraryState(payload.library));
        }
        if (Array.isArray(payload.sources) && payload.sources.length > 0) {
          setSources(payload.sources);
        }
        if (Array.isArray(payload.clips) && payload.clips.length > 0) {
          setClips(payload.clips);
        }
        if (Array.isArray(payload.trainingExamples) && payload.trainingExamples.length > 0) {
          setTrainingExamples(payload.trainingExamples);
        }
        if (Array.isArray(payload.categories) && payload.categories.length > 0) {
          setCategories(payload.categories);
        }
      })
      .catch(() => {
        // Fall back to local storage when the API is unavailable.
      })
      .finally(() => {
        if (active) setPersistReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    writeJson('hearme-dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!persistReady) return;
    fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        darkMode,
        library,
        sources,
        clips,
        trainingExamples,
        categories,
      }),
    }).catch(() => {
      // Fall back to local storage when the API is unavailable.
    });
  }, [persistReady, darkMode, library, sources, clips, trainingExamples, categories]);

  useEffect(() => writeJson('hearme-library', library), [library]);
  useEffect(() => writeJson('hearme-sources', sources), [sources]);
  useEffect(() => writeJson('hearme-clips', clips), [clips]);
  useEffect(() => writeJson('hearme-training-examples', trainingExamples), [trainingExamples]);
  useEffect(() => writeJson('hearme-categories', categories), [categories]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        <Header page={page} setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'about' && <AboutPage />}
        {page === 'translate' && <TranslatePage library={library} clips={clips} setClips={setClips} examples={trainingExamples} setExamples={setTrainingExamples} isAdmin={isAdmin} />}
        {page === 'library' && <LibraryPage library={library} setLibrary={setLibrary} categories={categories} setCategories={setCategories} isAdmin={isAdmin} />}
        {page === 'sources' && <SourcesPage sources={sources} setSources={setSources} isAdmin={isAdmin} />}
        <footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          HearMe keeps translation, learning, and sources open to everyone. Admin-only controls appear after login.
        </footer>
      </div>
    </ErrorBoundary>
  );
}
