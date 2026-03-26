import crypto from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { adminSeed, analyticsSeed, contentSeed } from '../seed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', 'data');
const maxEvents = 5000;
const contentDocumentKey = 'site_content';
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  '';

const dataFiles = {
  admin: path.join(dataDir, 'admin.json'),
  analytics: path.join(dataDir, 'analytics.json'),
  content: path.join(dataDir, 'content.json'),
};

let initPromise;
let poolPromise;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value) {
  const normalized = `${value || ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (normalized) {
    return normalized;
  }

  return `item-${crypto.randomUUID().slice(0, 8)}`;
}

function sanitizeText(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }

  return value.trim();
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => sanitizeText(tag)).filter(Boolean).slice(0, 8);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => sanitizeText(tag))
      .filter(Boolean)
      .slice(0, 8);
  }

  return [];
}

function normalizePalette(value) {
  if (Array.isArray(value)) {
    return value.map((color) => sanitizeText(color)).filter(Boolean).slice(0, 8);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((color) => sanitizeText(color))
      .filter(Boolean)
      .slice(0, 8);
  }

  return [];
}

function normalizeTimeline(timeline = [], fallbackTitle) {
  const fallbackTimeline = [
    {
      phase: 'Discovery',
      period: 'Week 1',
      summary: `Framing the scope, references, and direction for ${fallbackTitle}.`,
    },
    {
      phase: 'Design',
      period: 'Week 2',
      summary: `Shaping the interface, hierarchy, and user journey for ${fallbackTitle}.`,
    },
    {
      phase: 'Build',
      period: 'Weeks 3-5',
      summary: `Implementing the experience, refining details, and preparing ${fallbackTitle} for launch.`,
    },
  ];

  if (!Array.isArray(timeline) || !timeline.length) {
    return fallbackTimeline;
  }

  return timeline
    .map((entry, index) => ({
      phase: sanitizeText(entry?.phase, `Phase ${index + 1}`),
      period: sanitizeText(entry?.period, 'In progress'),
      summary: sanitizeText(entry?.summary, 'More details coming soon.'),
    }))
    .filter((entry) => entry.phase || entry.period || entry.summary)
    .slice(0, 8);
}

function normalizeGallery(gallery = [], fallbackImage, fallbackTitle) {
  const fallbackGallery = [
    {
      src: fallbackImage,
      alt: `${fallbackTitle} hero preview`,
      caption: 'Primary showcase image for the project.',
    },
  ];

  if (!Array.isArray(gallery) || !gallery.length) {
    return fallbackGallery;
  }

  return gallery
    .map((entry, index) => ({
      src: sanitizeText(entry?.src, fallbackImage),
      alt: sanitizeText(entry?.alt, `${fallbackTitle} gallery image ${index + 1}`),
      caption: sanitizeText(entry?.caption, `Process image ${index + 1}`),
    }))
    .filter((entry) => entry.src)
    .slice(0, 12);
}

function normalizeProjects(projects = []) {
  const now = new Date().toISOString();
  const usedIds = new Set();

  return projects.map((project, index) => {
    const baseId = slugify(project.id || project.title || `project-${index + 1}`);
    let nextId = baseId;
    let suffix = 1;

    while (usedIds.has(nextId)) {
      nextId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(nextId);

    const title = sanitizeText(project.title, `Project ${index + 1}`);
    const summary = sanitizeText(project.summary, 'Project summary coming soon.');
    const image = sanitizeText(project.image, '/images/project-1.jpg');
    const tags = normalizeTags(project.tags);

    return {
      id: nextId,
      title,
      headline: sanitizeText(
        project.headline,
        `A closer look at how ${title} moved from concept to final build.`
      ),
      summary,
      overview: sanitizeText(
        project.overview,
        `${summary} This case study brings together the idea, the design decisions, and the final execution behind ${title}.`
      ),
      idea: sanitizeText(
        project.idea,
        `The goal for ${title} was to create a focused experience with clear value, confident interaction patterns, and a direction that could hold up from first concept to final delivery.`
      ),
      design: sanitizeText(
        project.design,
        `The design direction for ${title} balances clarity, hierarchy, and visual identity so the interface feels polished while still staying practical to build and maintain.`
      ),
      outcome: sanitizeText(
        project.outcome,
        `${title} was shaped into a portfolio-ready piece with a strong narrative, cohesive UI, and a structure that makes the work easy to understand for future clients or recruiters.`
      ),
      image,
      link: sanitizeText(project.link),
      year: sanitizeText(project.year, `${new Date().getFullYear()}`),
      duration: sanitizeText(project.duration, '4 to 6 weeks'),
      role: sanitizeText(project.role, 'Design and development'),
      tags,
      palette: normalizePalette(project.palette),
      timeline: normalizeTimeline(project.timeline, title),
      gallery: normalizeGallery(project.gallery, image, title),
      published: project.published !== false,
      createdAt: project.createdAt || now,
      updatedAt: now,
    };
  });
}

function normalizeSkills(skills = []) {
  const now = new Date().toISOString();
  const usedIds = new Set();

  return skills.map((skill, index) => {
    const baseId = slugify(skill.id || skill.name || `skill-${index + 1}`);
    let nextId = baseId;
    let suffix = 1;

    while (usedIds.has(nextId)) {
      nextId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(nextId);

    return {
      id: nextId,
      name: sanitizeText(skill.name, `Skill ${index + 1}`),
      description: sanitizeText(skill.description, 'Skill description'),
      icon: sanitizeText(skill.icon, '/images/react.svg'),
      category: sanitizeText(skill.category, 'General'),
      createdAt: skill.createdAt || now,
      updatedAt: now,
    };
  });
}

function normalizeReviews(reviews = []) {
  const now = new Date().toISOString();
  const usedIds = new Set();

  return reviews.map((review, index) => {
    const baseId = slugify(review.id || review.name || review.company || `review-${index + 1}`);
    let nextId = baseId;
    let suffix = 1;

    while (usedIds.has(nextId)) {
      nextId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(nextId);

    return {
      id: nextId,
      name: sanitizeText(review.name, `Client ${index + 1}`),
      company: sanitizeText(review.company, 'Client company'),
      content: sanitizeText(review.content, 'Client testimonial'),
      image: sanitizeText(review.image, '/images/people-1.jpg'),
      published: review.published !== false,
      createdAt: review.createdAt || now,
      updatedAt: now,
    };
  });
}

function normalizeContent(content = {}) {
  return {
    projects: normalizeProjects(content.projects || contentSeed.projects),
    skills: normalizeSkills(content.skills || contentSeed.skills),
    reviews: normalizeReviews(content.reviews || contentSeed.reviews),
  };
}

function buildDefaultContent() {
  return normalizeContent(clone(contentSeed));
}

function createPasswordHash(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyPassword(password, admin) {
  const hash = createPasswordHash(password, admin.salt);
  return safeCompare(hash, admin.passwordHash);
}

function createToken(admin) {
  const payload = Buffer.from(
    JSON.stringify({
      username: admin.username,
      exp: Date.now() + 1000 * 60 * 60 * 12,
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', `${admin.salt}:${admin.passwordHash}`)
    .update(payload)
    .digest('base64url');

  return `${payload}.${signature}`;
}

function verifyToken(token, admin) {
  if (!token || !token.includes('.')) {
    return false;
  }

  const [payload, signature] = token.split('.');
  const expectedSignature = crypto
    .createHmac('sha256', `${admin.salt}:${admin.passwordHash}`)
    .update(payload)
    .digest('base64url');

  if (!safeCompare(signature, expectedSignature)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded.username === admin.username && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function getStorageMode() {
  return connectionString ? 'postgres' : 'file';
}

async function ensureDataFile(filePath, seedValue) {
  if (!existsSync(filePath)) {
    await writeFile(filePath, `${JSON.stringify(seedValue, null, 2)}\n`, 'utf8');
  }
}

async function readJson(filePath, fallback) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return clone(fallback);
  }
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function ensureFileStorage() {
  await mkdir(dataDir, { recursive: true });
  await ensureDataFile(dataFiles.admin, clone(adminSeed));
  await ensureDataFile(dataFiles.analytics, clone(analyticsSeed));
  await ensureDataFile(dataFiles.content, buildDefaultContent());
}

async function getPool() {
  if (!poolPromise) {
    poolPromise = (async () => {
      const { Pool } = await import('pg');
      const useSsl = !/localhost|127\.0\.0\.1/.test(connectionString);

      return new Pool({
        connectionString,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      });
    })();
  }

  return poolPromise;
}

async function query(text, values = []) {
  const pool = await getPool();
  return pool.query(text, values);
}

async function ensurePostgresStorage() {
  const defaultContent = buildDefaultContent();

  await query(`
    create table if not exists portfolio_admins (
      id text primary key,
      username text not null unique,
      salt text not null,
      password_hash text not null,
      updated_at timestamptz not null default now()
    );
  `);

  await query(`
    create table if not exists portfolio_content (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    );
  `);

  await query(`
    create table if not exists portfolio_analytics_events (
      id text primary key,
      type text not null,
      visitor_id text not null,
      project_id text,
      pathname text not null,
      referrer text,
      user_agent text,
      language text,
      screen text,
      timezone text,
      created_at timestamptz not null default now()
    );
  `);

  await query(
    `
      insert into portfolio_admins (id, username, salt, password_hash, updated_at)
      values ('primary', $1, $2, $3, $4)
      on conflict (id) do nothing;
    `,
    [adminSeed.username, adminSeed.salt, adminSeed.passwordHash, adminSeed.updatedAt]
  );

  await query(
    `
      insert into portfolio_content (key, value, updated_at)
      values ($1, $2::jsonb, now())
      on conflict (key) do nothing;
    `,
    [contentDocumentKey, JSON.stringify(defaultContent)]
  );
}

async function ensureStorage() {
  if (!initPromise) {
    initPromise =
      getStorageMode() === 'postgres' ? ensurePostgresStorage() : ensureFileStorage();
  }

  await initPromise;
}

async function getAdminRecord() {
  await ensureStorage();

  if (getStorageMode() === 'postgres') {
    const { rows } = await query(
      `
        select id, username, salt, password_hash, updated_at
        from portfolio_admins
        where id = 'primary'
        limit 1;
      `
    );
    const admin = rows[0];

    return {
      id: admin.id,
      username: admin.username,
      salt: admin.salt,
      passwordHash: admin.password_hash,
      updatedAt: admin.updated_at,
    };
  }

  return readJson(dataFiles.admin, adminSeed);
}

async function saveAdminRecord(admin) {
  await ensureStorage();

  if (getStorageMode() === 'postgres') {
    await query(
      `
        insert into portfolio_admins (id, username, salt, password_hash, updated_at)
        values ('primary', $1, $2, $3, $4)
        on conflict (id)
        do update set
          username = excluded.username,
          salt = excluded.salt,
          password_hash = excluded.password_hash,
          updated_at = excluded.updated_at;
      `,
      [admin.username, admin.salt, admin.passwordHash, admin.updatedAt]
    );
    return;
  }

  await writeJson(dataFiles.admin, admin);
}

async function getContentRecord() {
  await ensureStorage();

  if (getStorageMode() === 'postgres') {
    const { rows } = await query(
      `
        select value
        from portfolio_content
        where key = $1
        limit 1;
      `,
      [contentDocumentKey]
    );

    return normalizeContent(rows[0]?.value || buildDefaultContent());
  }

  const content = await readJson(dataFiles.content, buildDefaultContent());
  return normalizeContent(content);
}

async function saveContentRecord(content) {
  const normalized = normalizeContent(content);

  await ensureStorage();

  if (getStorageMode() === 'postgres') {
    await query(
      `
        insert into portfolio_content (key, value, updated_at)
        values ($1, $2::jsonb, now())
        on conflict (key)
        do update set
          value = excluded.value,
          updated_at = excluded.updated_at;
      `,
      [contentDocumentKey, JSON.stringify(normalized)]
    );

    return normalized;
  }

  await writeJson(dataFiles.content, normalized);
  return normalized;
}

async function getAnalyticsEvents() {
  await ensureStorage();

  if (getStorageMode() === 'postgres') {
    const { rows } = await query(
      `
        select
          id,
          type,
          visitor_id,
          project_id,
          pathname,
          referrer,
          user_agent,
          language,
          screen,
          timezone,
          created_at
        from portfolio_analytics_events
        order by created_at desc
        limit $1;
      `,
      [maxEvents]
    );

    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      visitorId: row.visitor_id,
      projectId: row.project_id,
      pathname: row.pathname,
      referrer: row.referrer,
      userAgent: row.user_agent,
      language: row.language,
      screen: row.screen,
      timezone: row.timezone,
      timestamp: new Date(row.created_at).toISOString(),
    }));
  }

  const analytics = await readJson(dataFiles.analytics, analyticsSeed);
  return analytics.events || [];
}

async function saveAnalyticsEvent(event) {
  await ensureStorage();

  if (getStorageMode() === 'postgres') {
    await query(
      `
        insert into portfolio_analytics_events (
          id, type, visitor_id, project_id, pathname, referrer, user_agent, language, screen, timezone, created_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `,
      [
        event.id,
        event.type,
        event.visitorId,
        event.projectId,
        event.pathname,
        event.referrer,
        event.userAgent,
        event.language,
        event.screen,
        event.timezone,
        event.timestamp,
      ]
    );
    return;
  }

  const analytics = await readJson(dataFiles.analytics, analyticsSeed);
  const nextAnalytics = {
    events: [...(analytics.events || []), event].slice(-maxEvents),
  };

  await writeJson(dataFiles.analytics, nextAnalytics);
}

function normalizeEvent(body, headers = {}) {
  const allowedTypes = new Set(['visit', 'cv_download', 'project_view', 'project_click']);

  if (!allowedTypes.has(body.type)) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    type: body.type,
    visitorId: sanitizeText(body.visitorId, 'anonymous'),
    projectId: sanitizeText(body.projectId) || null,
    pathname: sanitizeText(body.pathname, '/'),
    referrer: sanitizeText(body.referrer),
    userAgent: sanitizeText(body.userAgent || headers['user-agent']),
    language: sanitizeText(body.language || headers['accept-language']),
    screen: sanitizeText(body.screen),
    timezone: sanitizeText(body.timezone),
    timestamp: new Date().toISOString(),
  };
}

function extractReferrerLabel(referrer) {
  if (!referrer) {
    return 'Direct / unknown';
  }

  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
}

function describeVisitor(userAgent = '', language = '') {
  const browser = /edg/i.test(userAgent)
    ? 'Edge'
    : /chrome|chromium/i.test(userAgent)
      ? 'Chrome'
      : /firefox/i.test(userAgent)
        ? 'Firefox'
        : /safari/i.test(userAgent) && !/chrome|chromium/i.test(userAgent)
          ? 'Safari'
          : 'Unknown browser';

  const operatingSystem = /windows/i.test(userAgent)
    ? 'Windows'
    : /mac os/i.test(userAgent)
      ? 'macOS'
      : /android/i.test(userAgent)
        ? 'Android'
        : /iphone|ipad|ios/i.test(userAgent)
          ? 'iOS'
          : /linux/i.test(userAgent)
            ? 'Linux'
            : 'Unknown OS';

  const locale = language ? language.split(',')[0] : 'Unknown locale';
  return `${browser} on ${operatingSystem} | ${locale}`;
}

function buildTimeline() {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let index = 6; index >= 0; index -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - index);
    const key = day.toISOString().slice(0, 10);

    days.push({
      key,
      label: day.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
      }),
      visits: 0,
      downloads: 0,
      projectViews: 0,
    });
  }

  return days;
}

function summarizeAnalytics(events, projects) {
  const timeline = buildTimeline();
  const timelineMap = new Map(timeline.map((item) => [item.key, item]));
  const visitors = new Map();
  const topProjects = new Map(
    projects.map((project) => [
      project.id,
      {
        id: project.id,
        title: project.title,
        views: 0,
        clicks: 0,
        uniqueVisitors: new Set(),
      },
    ])
  );

  const recentActivity = [];
  const totals = {
    uniqueVisitors: 0,
    visits: 0,
    cvDownloads: 0,
    projectViews: 0,
    projectClicks: 0,
  };

  events.forEach((event) => {
    const timelineKey = event.timestamp.slice(0, 10);
    const timelineEntry = timelineMap.get(timelineKey);
    const visitor = visitors.get(event.visitorId) || {
      id: event.visitorId,
      label: describeVisitor(event.userAgent, event.language),
      language: event.language,
      timezone: event.timezone,
      referrer: extractReferrerLabel(event.referrer),
      sessions: 0,
      downloads: 0,
      projectViews: 0,
      lastSeen: event.timestamp,
    };

    if (event.type === 'visit') {
      totals.visits += 1;
      visitor.sessions += 1;

      if (timelineEntry) {
        timelineEntry.visits += 1;
      }
    }

    if (event.type === 'cv_download') {
      totals.cvDownloads += 1;
      visitor.downloads += 1;

      if (timelineEntry) {
        timelineEntry.downloads += 1;
      }
    }

    if (event.type === 'project_view') {
      totals.projectViews += 1;
      visitor.projectViews += 1;

      if (timelineEntry) {
        timelineEntry.projectViews += 1;
      }
    }

    if (event.type === 'project_click') {
      totals.projectClicks += 1;
    }

    if (event.projectId && topProjects.has(event.projectId)) {
      const projectEntry = topProjects.get(event.projectId);

      if (event.type === 'project_view') {
        projectEntry.views += 1;
      }

      if (event.type === 'project_click') {
        projectEntry.clicks += 1;
      }

      projectEntry.uniqueVisitors.add(event.visitorId);
    }

    visitor.lastSeen = event.timestamp;
    visitors.set(event.visitorId, visitor);

    recentActivity.push({
      id: event.id,
      type: event.type,
      pathname: event.pathname,
      referrer: extractReferrerLabel(event.referrer),
      visitorLabel: describeVisitor(event.userAgent, event.language),
      timestamp: event.timestamp,
      projectTitle: event.projectId
        ? projects.find((project) => project.id === event.projectId)?.title || event.projectId
        : null,
    });
  });

  totals.uniqueVisitors = visitors.size;

  return {
    totals,
    timeline,
    topProjects: Array.from(topProjects.values())
      .filter((project) => project.views || project.clicks)
      .map((project) => ({
        ...project,
        uniqueVisitors: project.uniqueVisitors.size,
      }))
      .sort((left, right) => right.views - left.views || right.clicks - left.clicks)
      .slice(0, 5),
    recentVisitors: Array.from(visitors.values())
      .sort((left, right) => new Date(right.lastSeen) - new Date(left.lastSeen))
      .slice(0, 8),
    recentActivity: recentActivity
      .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
      .slice(0, 10),
  };
}

export async function authenticateWithCredentials({ username, password }) {
  const admin = await getAdminRecord();

  if (sanitizeText(username) !== admin.username || !verifyPassword(sanitizeText(password), admin)) {
    return null;
  }

  return {
    token: createToken(admin),
    admin: {
      username: admin.username,
    },
  };
}

export async function authenticateWithToken(token) {
  const admin = await getAdminRecord();
  return verifyToken(token, admin) ? admin : null;
}

export async function getPublicContent() {
  const content = await getContentRecord();

  return {
    content: {
      projects: content.projects.filter((project) => project.published !== false),
      skills: content.skills,
      reviews: content.reviews.filter((review) => review.published !== false),
    },
    storage: getStorageMode(),
  };
}

export async function getAdminContent() {
  const [admin, content] = await Promise.all([getAdminRecord(), getContentRecord()]);

  return {
    admin: {
      username: admin.username,
    },
    content,
    storage: getStorageMode(),
  };
}

export async function saveAdminContent(content) {
  const [admin, nextContent] = await Promise.all([getAdminRecord(), saveContentRecord(content)]);

  return {
    admin: {
      username: admin.username,
    },
    content: nextContent,
    storage: getStorageMode(),
  };
}

export async function updateAdminCredentials({ currentPassword, nextUsername, nextPassword }) {
  const admin = await getAdminRecord();

  if (!verifyPassword(sanitizeText(currentPassword), admin)) {
    throw new Error('Current password is incorrect.');
  }

  if (sanitizeText(nextPassword) && sanitizeText(nextPassword).length < 8) {
    throw new Error('New password must contain at least 8 characters.');
  }

  const salt = sanitizeText(nextPassword) ? crypto.randomBytes(16).toString('hex') : admin.salt;
  const passwordHash = sanitizeText(nextPassword)
    ? createPasswordHash(sanitizeText(nextPassword), salt)
    : admin.passwordHash;

  const nextAdmin = {
    username: sanitizeText(nextUsername, admin.username) || admin.username,
    salt,
    passwordHash,
    updatedAt: new Date().toISOString(),
  };

  await saveAdminRecord(nextAdmin);

  return {
    token: createToken(nextAdmin),
    admin: {
      username: nextAdmin.username,
    },
    storage: getStorageMode(),
  };
}

export async function recordAnalyticsEvent(body, headers = {}) {
  const event = normalizeEvent(body, headers);

  if (!event) {
    throw new Error('Unsupported analytics event type.');
  }

  await saveAnalyticsEvent(event);
  return { ok: true, storage: getStorageMode() };
}

export async function getAnalyticsSummary() {
  const [events, content] = await Promise.all([getAnalyticsEvents(), getContentRecord()]);

  return {
    summary: summarizeAnalytics(events, content.projects),
    storage: getStorageMode(),
  };
}

export async function initializeStorage() {
  await ensureStorage();
  return getStorageMode();
}
