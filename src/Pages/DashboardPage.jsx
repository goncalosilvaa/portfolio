import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  adminSession,
  getAdminAnalytics,
  getAdminContent,
  loginAdmin,
  logoutAdmin,
  saveAdminContent,
  updateAdminCredentials,
} from '../lib/api';

const defaultAnalytics = {
  totals: {
    uniqueVisitors: 0,
    visits: 0,
    cvDownloads: 0,
    projectViews: 0,
    projectClicks: 0,
  },
  timeline: [],
  topProjects: [],
  recentVisitors: [],
  recentActivity: [],
};

function buildEmptyProject() {
  return {
    id: '',
    title: '',
    summary: '',
    image: '/images/project-1.jpg',
    link: '',
    tagsInput: '',
    published: true,
  };
}

function buildEmptySkill() {
  return {
    id: '',
    name: '',
    description: '',
    icon: '/images/react.svg',
    category: 'Frontend',
  };
}

function buildEmptyReview() {
  return {
    id: '',
    name: '',
    company: '',
    content: '',
    image: '/images/people-1.jpg',
    published: true,
  };
}

function hydrateContentForForm(content) {
  return {
    projects: (content.projects || []).map((project) => ({
      ...project,
      tagsInput: Array.isArray(project.tags) ? project.tags.join(', ') : '',
    })),
    skills: (content.skills || []).map((skill) => ({ ...skill })),
    reviews: (content.reviews || []).map((review) => ({ ...review })),
  };
}

function serializeContent(content) {
  return {
    projects: content.projects.map(({ tagsInput, ...project }) => ({
      ...project,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })),
    skills: content.skills.map((skill) => ({ ...skill })),
    reviews: content.reviews.map((review) => ({ ...review })),
  };
}

function formatDateTime(value) {
  if (!value) {
    return 'No data yet';
  }

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

const Panel = ({ title, description, actions, children, className = '' }) => (
  <section className={`dashboard-panel ${className}`}>
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
          Dashboard
        </p>
        <h2 className="dashboard-title mt-2">{title}</h2>
        {description ? <p className="dashboard-muted mt-2 max-w-[65ch]">{description}</p> : null}
      </div>
      {actions}
    </div>
    {children}
  </section>
);

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const MetricCard = ({ label, value, hint }) => (
  <div className="dashboard-panel p-5">
    <p className="text-sm text-zinc-400">{label}</p>
    <p className="mt-4 text-4xl font-semibold text-zinc-50">{value}</p>
    <p className="mt-2 text-sm text-zinc-500">{hint}</p>
  </div>
);

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hint: PropTypes.string.isRequired,
};

const TimelineChart = ({ timeline }) => {
  const maxValue = timeline.reduce((highest, day) => {
    return Math.max(highest, day.visits, day.downloads, day.projectViews);
  }, 1);
  const getBarHeight = (value) => (value ? `${Math.max(8, (value / maxValue) * 100)}%` : '0%');

  if (!timeline.length) {
    return <div className="dashboard-empty">No activity recorded yet.</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-5">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-400" />
          Visits
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          CV downloads
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-300" />
          Project views
        </span>
      </div>

      <div className="grid grid-cols-7 gap-3 items-end h-52">
        {timeline.map((day) => (
          <div key={day.key} className="flex flex-col items-center gap-3">
            <div className="w-full flex items-end justify-center gap-1 h-40 rounded-2xl border border-zinc-800/70 bg-zinc-950/50 px-2 py-3">
              <span
                className="w-3 rounded-full bg-sky-400 transition-all"
                style={{ height: getBarHeight(day.visits) }}
                title={`${day.visits} visits`}
              />
              <span
                className="w-3 rounded-full bg-emerald-400 transition-all"
                style={{ height: getBarHeight(day.downloads) }}
                title={`${day.downloads} downloads`}
              />
              <span
                className="w-3 rounded-full bg-amber-300 transition-all"
                style={{ height: getBarHeight(day.projectViews) }}
                title={`${day.projectViews} project views`}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-zinc-300">{day.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TimelineChart.propTypes = {
  timeline: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ProjectLeaderboard = ({ projects }) => {
  if (!projects.length) {
    return <div className="dashboard-empty">Project performance will appear here after the first views.</div>;
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-zinc-100">{project.title}</p>
              <p className="text-sm text-zinc-500 mt-1">Project ID: {project.id}</p>
            </div>

            <div className="text-right text-sm text-zinc-300">
              <p>{project.views} views</p>
              <p>{project.clicks} clicks</p>
              <p>{project.uniqueVisitors} unique visitors</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ProjectLeaderboard.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const RecentVisitors = ({ visitors }) => {
  if (!visitors.length) {
    return <div className="dashboard-empty">No visitor sessions have been captured yet.</div>;
  }

  return (
    <div className="space-y-3">
      {visitors.map((visitor) => (
        <div
          key={visitor.id}
          className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-zinc-100">{visitor.label}</p>
              <p className="text-sm text-zinc-500 mt-1">
                {visitor.language || 'Unknown language'} | {visitor.timezone || 'Unknown timezone'}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                Referrer: {visitor.referrer || 'Direct / unknown'}
              </p>
            </div>

            <div className="text-right text-sm text-zinc-300">
              <p>{visitor.sessions} visits</p>
              <p>{visitor.projectViews} project views</p>
              <p>{visitor.downloads} CV downloads</p>
              <p className="text-zinc-500 mt-1">{formatDateTime(visitor.lastSeen)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

RecentVisitors.propTypes = {
  visitors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const RecentActivity = ({ items }) => {
  if (!items.length) {
    return <div className="dashboard-empty">Activity events will be listed here.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold capitalize text-zinc-100">
                {item.type.replaceAll('_', ' ')}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {item.projectTitle || item.pathname || 'General site activity'}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {item.visitorLabel} | {item.referrer || 'Direct / unknown'}
              </p>
            </div>

            <p className="text-sm text-zinc-400">{formatDateTime(item.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

RecentActivity.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ProjectEditor = ({ project, index, onChange, onRemove }) => (
  <article className="rounded-[24px] border border-zinc-800/70 bg-zinc-950/40 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div>
        <p className="text-sm font-semibold text-zinc-100">Project {index + 1}</p>
        <p className="text-sm text-zinc-500 mt-1">
          {project.id ? `ID: ${project.id}` : 'ID will be generated automatically on save.'}
        </p>
      </div>

      <button type="button" className="btn btn-outline" onClick={onRemove}>
        Remove
      </button>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="label">Title</label>
        <input
          className="text-field"
          type="text"
          value={project.title}
          onChange={(event) => onChange('title', event.target.value)}
          placeholder="Portfolio redesign"
        />
      </div>

      <div>
        <label className="label">Project URL</label>
        <input
          className="text-field"
          type="url"
          value={project.link}
          onChange={(event) => onChange('link', event.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="md:col-span-2">
        <label className="label">Short summary</label>
        <textarea
          className="text-field min-h-28"
          value={project.summary}
          onChange={(event) => onChange('summary', event.target.value)}
          placeholder="A clear one or two line description for the public card."
        />
      </div>

      <div>
        <label className="label">Image path or URL</label>
        <input
          className="text-field"
          type="text"
          value={project.image}
          onChange={(event) => onChange('image', event.target.value)}
          placeholder="/images/project-1.jpg"
        />
      </div>

      <div>
        <label className="label">Tags</label>
        <input
          className="text-field"
          type="text"
          value={project.tagsInput}
          onChange={(event) => onChange('tagsInput', event.target.value)}
          placeholder="React, Node.js, API"
        />
      </div>
    </div>

    <label className="mt-5 flex items-center gap-3 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={project.published}
        onChange={(event) => onChange('published', event.target.checked)}
        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-sky-400 focus:ring-sky-400"
      />
      Published on the public portfolio
    </label>
  </article>
);

ProjectEditor.propTypes = {
  project: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const SkillEditor = ({ skill, index, onChange, onRemove }) => (
  <article className="rounded-[24px] border border-zinc-800/70 bg-zinc-950/40 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div>
        <p className="text-sm font-semibold text-zinc-100">Skill {index + 1}</p>
        <p className="text-sm text-zinc-500 mt-1">
          {skill.id ? `ID: ${skill.id}` : 'ID will be generated automatically on save.'}
        </p>
      </div>

      <button type="button" className="btn btn-outline" onClick={onRemove}>
        Remove
      </button>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="label">Name</label>
        <input
          className="text-field"
          type="text"
          value={skill.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="React"
        />
      </div>

      <div>
        <label className="label">Category</label>
        <input
          className="text-field"
          type="text"
          value={skill.category}
          onChange={(event) => onChange('category', event.target.value)}
          placeholder="Frontend"
        />
      </div>

      <div>
        <label className="label">Icon path or URL</label>
        <input
          className="text-field"
          type="text"
          value={skill.icon}
          onChange={(event) => onChange('icon', event.target.value)}
          placeholder="/images/react.svg"
        />
      </div>

      <div>
        <label className="label">Description</label>
        <input
          className="text-field"
          type="text"
          value={skill.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="Component-based frontend development"
        />
      </div>
    </div>
  </article>
);

SkillEditor.propTypes = {
  skill: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const ReviewEditor = ({ review, index, onChange, onRemove }) => (
  <article className="rounded-[24px] border border-zinc-800/70 bg-zinc-950/40 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div>
        <p className="text-sm font-semibold text-zinc-100">Review {index + 1}</p>
        <p className="text-sm text-zinc-500 mt-1">
          {review.id ? `ID: ${review.id}` : 'ID will be generated automatically on save.'}
        </p>
      </div>

      <button type="button" className="btn btn-outline" onClick={onRemove}>
        Remove
      </button>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="label">Client name</label>
        <input
          className="text-field"
          type="text"
          value={review.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="label">Company</label>
        <input
          className="text-field"
          type="text"
          value={review.company}
          onChange={(event) => onChange('company', event.target.value)}
          placeholder="Acme Studio"
        />
      </div>

      <div className="md:col-span-2">
        <label className="label">Testimonial</label>
        <textarea
          className="text-field min-h-28"
          value={review.content}
          onChange={(event) => onChange('content', event.target.value)}
          placeholder="Describe the impact of the project and the quality of the work."
        />
      </div>

      <div className="md:col-span-2">
        <label className="label">Avatar path or URL</label>
        <input
          className="text-field"
          type="text"
          value={review.image}
          onChange={(event) => onChange('image', event.target.value)}
          placeholder="/images/people-1.jpg"
        />
      </div>
    </div>

    <label className="mt-5 flex items-center gap-3 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={review.published}
        onChange={(event) => onChange('published', event.target.checked)}
        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-sky-400 focus:ring-sky-400"
      />
      Published on the public portfolio
    </label>
  </article>
);

ReviewEditor.propTypes = {
  review: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const LoginScreen = ({ form, loading, error, onChange, onSubmit }) => (
  <main className="dashboard-shell min-h-screen flex items-center">
    <div className="container">
      <div className="max-w-xl mx-auto dashboard-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
          Private area
        </p>
        <h1 className="headline-2 mt-4">Portfolio dashboard</h1>
        <p className="dashboard-muted mt-3">
          Manage projects, skills, and reviews, then review visits, CV downloads, and project
          interest from the same place.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              className="text-field"
              type="text"
              value={form.username}
              onChange={(event) => onChange('username', event.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              className="text-field"
              type="password"
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Signing in...' : 'Open dashboard'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-zinc-800/70 bg-zinc-950/50 px-4 py-4 text-sm text-zinc-400">
          First access credentials can be changed later in the security panel.
        </div>

        <a href="/" className="inline-flex mt-6 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          Back to portfolio
        </a>
      </div>
    </div>
  </main>
);

LoginScreen.propTypes = {
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const DashboardPage = () => {
  const [authState, setAuthState] = useState(adminSession.getToken() ? 'checking' : 'logged_out');
  const [username, setUsername] = useState('');
  const [storageMode, setStorageMode] = useState('loading');
  const [content, setContent] = useState({ projects: [], skills: [], reviews: [] });
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [credentialsForm, setCredentialsForm] = useState({
    currentPassword: '',
    nextUsername: 'admin',
    nextPassword: '',
    confirmPassword: '',
  });
  const [dashboardError, setDashboardError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [refreshingAnalytics, setRefreshingAnalytics] = useState(false);
  const [updatingCredentials, setUpdatingCredentials] = useState(false);
  const [contentNotice, setContentNotice] = useState('');
  const [securityNotice, setSecurityNotice] = useState('');

  async function syncDashboard() {
    const [contentResponse, analyticsResponse] = await Promise.all([
      getAdminContent(),
      getAdminAnalytics(),
    ]);

    setContent(hydrateContentForForm(contentResponse.content));
    setAnalytics(analyticsResponse.summary || defaultAnalytics);
    setStorageMode(contentResponse.storage || analyticsResponse.storage || 'unknown');
    setUsername(contentResponse.admin.username);
    setCredentialsForm((current) => ({
      ...current,
      nextUsername: contentResponse.admin.username,
    }));
    setDashboardError('');
  }

  useEffect(() => {
    if (authState !== 'checking') {
      return;
    }

    syncDashboard()
      .then(() => {
        setAuthState('authenticated');
      })
      .catch((error) => {
        logoutAdmin();
        setDashboardError(error.message);
        setAuthState('logged_out');
      });
  }, [authState]);

  function updateProject(index, field, value) {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project, itemIndex) =>
        itemIndex === index ? { ...project, [field]: value } : project
      ),
    }));
  }

  function updateSkill(index, field, value) {
    setContent((current) => ({
      ...current,
      skills: current.skills.map((skill, itemIndex) =>
        itemIndex === index ? { ...skill, [field]: value } : skill
      ),
    }));
  }

  function updateReview(index, field, value) {
    setContent((current) => ({
      ...current,
      reviews: current.reviews.map((review, itemIndex) =>
        itemIndex === index ? { ...review, [field]: value } : review
      ),
    }));
  }

  function removeProject(index) {
    setContent((current) => ({
      ...current,
      projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function removeSkill(index) {
    setContent((current) => ({
      ...current,
      skills: current.skills.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function removeReview(index) {
    setContent((current) => ({
      ...current,
      reviews: current.reviews.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginLoading(true);
    setDashboardError('');

    try {
      const payload = await loginAdmin(loginForm);
      setStorageMode(payload.storage || storageMode);
      await syncDashboard();
      setAuthState('authenticated');
      setLoginForm((current) => ({ ...current, password: '' }));
    } catch (error) {
      setDashboardError(error.message);
      setAuthState('logged_out');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSaveContent() {
    setSavingContent(true);
    setContentNotice('');

    try {
      const response = await saveAdminContent(serializeContent(content));
      setContent(hydrateContentForForm(response.content));
      setStorageMode(response.storage || storageMode);
      setUsername(response.admin.username);
      setContentNotice('Projects, skills, and reviews saved successfully.');
    } catch (error) {
      setContentNotice(error.message);
    } finally {
      setSavingContent(false);
    }
  }

  async function handleRefreshAnalytics() {
    setRefreshingAnalytics(true);

    try {
      const response = await getAdminAnalytics();
      setAnalytics(response.summary || defaultAnalytics);
      setStorageMode(response.storage || storageMode);
    } catch (error) {
      setDashboardError(error.message);
    } finally {
      setRefreshingAnalytics(false);
    }
  }

  async function handleCredentialsUpdate(event) {
    event.preventDefault();
    setSecurityNotice('');

    if (credentialsForm.nextPassword && credentialsForm.nextPassword !== credentialsForm.confirmPassword) {
      setSecurityNotice('The new password confirmation does not match.');
      return;
    }

    setUpdatingCredentials(true);

    try {
      const response = await updateAdminCredentials({
        currentPassword: credentialsForm.currentPassword,
        nextUsername: credentialsForm.nextUsername,
        nextPassword: credentialsForm.nextPassword,
      });

      setStorageMode(response.storage || storageMode);
      setUsername(response.admin.username);
      setSecurityNotice('Credentials updated successfully.');
      setCredentialsForm({
        currentPassword: '',
        nextUsername: response.admin.username,
        nextPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setSecurityNotice(error.message);
    } finally {
      setUpdatingCredentials(false);
    }
  }

  function handleLogout() {
    logoutAdmin();
    setAuthState('logged_out');
    setContent({ projects: [], skills: [], reviews: [] });
    setAnalytics(defaultAnalytics);
    setDashboardError('');
    setContentNotice('');
    setSecurityNotice('');
  }

  if (authState === 'checking') {
    return (
      <main className="dashboard-shell min-h-screen flex items-center">
        <div className="container">
          <div className="max-w-xl mx-auto dashboard-panel text-center">
            <p className="text-sm text-zinc-400">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (authState !== 'authenticated') {
    return (
      <LoginScreen
        form={loginForm}
        loading={loginLoading}
        error={dashboardError}
        onChange={(field, value) => setLoginForm((current) => ({ ...current, [field]: value }))}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <main className="dashboard-shell min-h-screen pb-12">
      <div className="container pt-8 space-y-6">
        <section className="dashboard-panel">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Private area
              </p>
              <h1 className="headline-2 mt-3">Portfolio control center</h1>
              <p className="dashboard-muted mt-3 max-w-[65ch]">
                Signed in as <span className="text-zinc-200">{username}</span>. Update portfolio
                content, client reviews, and monitor anonymous traffic from one dashboard.
              </p>
              <p className="dashboard-muted mt-2">
                Active storage mode: <span className="text-zinc-200">{storageMode}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a href="/" className="btn btn-outline">
                View public site
              </a>
              <button type="button" className="btn btn-primary" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </section>

        <section className="dashboard-grid xl:grid-cols-5">
          <MetricCard
            label="Unique visitors"
            value={analytics.totals.uniqueVisitors}
            hint="Distinct visitor IDs tracked across sessions."
          />
          <MetricCard
            label="Visits"
            value={analytics.totals.visits}
            hint="New sessions recorded on the public site."
          />
          <MetricCard
            label="CV downloads"
            value={analytics.totals.cvDownloads}
            hint="Download clicks tracked from the hero section."
          />
          <MetricCard
            label="Project views"
            value={analytics.totals.projectViews}
            hint="Projects seen on screen at least once per session."
          />
          <MetricCard
            label="Project clicks"
            value={analytics.totals.projectClicks}
            hint="Outbound clicks on project links."
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
          <Panel
            title="Activity timeline"
            description="Last 7 days of recorded traffic across visits, CV downloads, and project views."
            actions={
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleRefreshAnalytics}
                disabled={refreshingAnalytics}
              >
                {refreshingAnalytics ? 'Refreshing...' : 'Refresh analytics'}
              </button>
            }
          >
            <TimelineChart timeline={analytics.timeline} />
          </Panel>

          <Panel
            title="Top projects"
            description="Best performing projects by visibility and click-through activity."
          >
            <ProjectLeaderboard projects={analytics.topProjects} />
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel
            title="Recent visitors"
            description="Anonymous visitor snapshots based on language, browser, referrer, and timezone."
          >
            <RecentVisitors visitors={analytics.recentVisitors} />
          </Panel>

          <Panel
            title="Recent activity"
            description="Latest tracked actions happening on the site."
          >
            <RecentActivity items={analytics.recentActivity} />
          </Panel>
        </div>

        <Panel
          title="Projects"
          description="Add, remove, or update the portfolio projects that appear on the public site."
          actions={
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    projects: [...current.projects, buildEmptyProject()],
                  }))
                }
              >
                Add project
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveContent}
                disabled={savingContent}
              >
                {savingContent ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {content.projects.map((project, index) => (
              <ProjectEditor
                key={project.id || `project-${index}`}
                project={project}
                index={index}
                onChange={(field, value) => updateProject(index, field, value)}
                onRemove={() => removeProject(index)}
              />
            ))}

            {!content.projects.length ? (
              <div className="dashboard-empty">No projects yet. Add your first one to start populating the site.</div>
            ) : null}
          </div>

          {contentNotice ? (
            <div className="mt-5 rounded-2xl border border-zinc-800/70 bg-zinc-950/50 px-4 py-4 text-sm text-zinc-300">
              {contentNotice}
            </div>
          ) : null}
        </Panel>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel
            title="Skills"
            description="Keep your stack current and control how each skill appears on the site."
            actions={
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    skills: [...current.skills, buildEmptySkill()],
                  }))
                }
              >
                Add skill
              </button>
            }
          >
            <div className="space-y-4">
              {content.skills.map((skill, index) => (
                <SkillEditor
                  key={skill.id || `skill-${index}`}
                  skill={skill}
                  index={index}
                  onChange={(field, value) => updateSkill(index, field, value)}
                  onRemove={() => removeSkill(index)}
                />
              ))}

              {!content.skills.length ? (
                <div className="dashboard-empty">No skills yet. Add the technologies you want to highlight.</div>
              ) : null}
            </div>
          </Panel>

          <Panel
            title="Reviews"
            description="Publish client testimonials directly from the private area."
            actions={
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    reviews: [...current.reviews, buildEmptyReview()],
                  }))
                }
              >
                Add review
              </button>
            }
          >
            <div className="space-y-4">
              {content.reviews.map((review, index) => (
                <ReviewEditor
                  key={review.id || `review-${index}`}
                  review={review}
                  index={index}
                  onChange={(field, value) => updateReview(index, field, value)}
                  onRemove={() => removeReview(index)}
                />
              ))}

              {!content.reviews.length ? (
                <div className="dashboard-empty">No reviews yet. Add testimonials to build trust on the public site.</div>
              ) : null}
            </div>
          </Panel>
        </div>

        <Panel
          title="Security"
          description="Change the dashboard username and password after the first login."
        >
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCredentialsUpdate}>
            <div>
              <label htmlFor="currentPassword" className="label">
                Current password
              </label>
              <input
                id="currentPassword"
                className="text-field"
                type="password"
                autoComplete="current-password"
                value={credentialsForm.currentPassword}
                onChange={(event) =>
                  setCredentialsForm((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="nextUsername" className="label">
                New username
              </label>
              <input
                id="nextUsername"
                className="text-field"
                type="text"
                autoComplete="username"
                value={credentialsForm.nextUsername}
                onChange={(event) =>
                  setCredentialsForm((current) => ({
                    ...current,
                    nextUsername: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="nextPassword" className="label">
                New password
              </label>
              <input
                id="nextPassword"
                className="text-field"
                type="password"
                autoComplete="new-password"
                value={credentialsForm.nextPassword}
                onChange={(event) =>
                  setCredentialsForm((current) => ({
                    ...current,
                    nextPassword: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                className="text-field"
                type="password"
                autoComplete="new-password"
                value={credentialsForm.confirmPassword}
                onChange={(event) =>
                  setCredentialsForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updatingCredentials}
              >
                {updatingCredentials ? 'Updating...' : 'Update credentials'}
              </button>

              {securityNotice ? <p className="text-sm text-zinc-300">{securityNotice}</p> : null}
            </div>
          </form>
        </Panel>
      </div>
    </main>
  );
};

export default DashboardPage;
