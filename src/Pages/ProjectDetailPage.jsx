import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { ButtonOutline, ButtonPrimary } from '../Components/Button';
import { contentSeed } from '../data/contentSeed';
import { getPublicContent } from '../lib/api';
import { trackProjectClick, trackProjectView, trackVisitOnce } from '../lib/analytics';

function getProjectIdFromPath() {
  if (typeof window === 'undefined') {
    return '';
  }

  const segments = window.location.pathname.split('/').filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] || '');
}

function findProject(projects, projectId) {
  return projects.find((project) => project.id === projectId) || null;
}

const ProjectDetailPage = () => {
  const [projectId] = useState(getProjectIdFromPath);
  const [projects, setProjects] = useState(contentSeed.projects);
  const [dataError, setDataError] = useState('');

  const project = findProject(projects, projectId);

  useEffect(() => {
    let isMounted = true;

    trackVisitOnce();

    getPublicContent()
      .then((payload) => {
        if (isMounted) {
          setProjects(payload.content.projects || []);
          setDataError('');
        }
      })
      .catch((error) => {
        if (isMounted) {
          setDataError(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!project?.id) {
      return;
    }

    trackProjectView(project.id);
  }, [project?.id]);

  if (!project) {
    return (
      <ReactLenis root>
        <Header />
        <main className="pt-28">
          <section className="section">
            <div className="container">
              <div className="dashboard-panel max-w-3xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                  Project
                </p>
                <h1 className="headline-2 mt-4">Project not found</h1>
                <p className="dashboard-muted mt-4">
                  This case study is not available yet, or the project ID does not exist.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonOutline href="/#work" label="Back to portfolio" />
                  <ButtonPrimary href="/" label="Go home" icon="north_west" />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </ReactLenis>
    );
  }

  return (
    <ReactLenis root>
      <Header />
      <main className="pt-28">
        <section className="section">
          <div className="container">
            <a
              href="/#work"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
                arrow_back
              </span>
              Back to selected projects
            </a>

            <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start mt-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">
                  Case Study
                </p>
                <h1 className="headline-1 mt-4 max-w-[16ch]">{project.title}</h1>
                <p className="text-zinc-300 text-lg mt-5 max-w-[60ch]">{project.headline}</p>
                <p className="text-zinc-400 mt-6 max-w-[65ch]">{project.summary}</p>

                <div className="flex flex-wrap gap-2 mt-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="h-9 text-sm text-zinc-300 bg-zinc-50/5 grid items-center px-4 rounded-xl"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  {project.link ? (
                    <ButtonPrimary
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      label="Visit project"
                      icon="arrow_outward"
                      onClick={() => trackProjectClick(project.id)}
                    />
                  ) : null}
                  <ButtonOutline href="/#contact" label="Start a similar project" />
                </div>

                {dataError ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 mt-8">
                    Live project data is currently unavailable, so this page is showing local
                    fallback content.
                  </div>
                ) : null}
              </div>

              <div className="rounded-[32px] border border-zinc-800/70 bg-zinc-950/40 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <figure className="img-box aspect-[4/3] rounded-[24px] overflow-hidden">
                  <img src={project.image} alt={project.title} className="img-cover" />
                </figure>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-10">
              <div className="dashboard-panel p-5">
                <p className="text-sm text-zinc-400">Year</p>
                <p className="mt-3 text-2xl font-semibold text-zinc-50">{project.year}</p>
              </div>
              <div className="dashboard-panel p-5">
                <p className="text-sm text-zinc-400">Duration</p>
                <p className="mt-3 text-2xl font-semibold text-zinc-50">{project.duration}</p>
              </div>
              <div className="dashboard-panel p-5">
                <p className="text-sm text-zinc-400">Role</p>
                <p className="mt-3 text-2xl font-semibold text-zinc-50">{project.role}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="dashboard-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Overview
              </p>
              <h2 className="headline-2 mt-4">What the project is about</h2>
              <p className="text-zinc-300 mt-5 leading-8">{project.overview}</p>
            </div>

            <div className="dashboard-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Palette
              </p>
              <h2 className="headline-2 mt-4">Color direction</h2>

              {project.palette?.length ? (
                <div className="grid gap-3 mt-6">
                  {project.palette.map((color) => (
                    <div
                      key={color}
                      className="rounded-[22px] border border-zinc-800/70 bg-zinc-950/40 p-3 flex items-center gap-3"
                    >
                      <span
                        className="block w-12 h-12 rounded-2xl border border-white/10"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm text-zinc-400">Color</p>
                        <p className="font-medium text-zinc-100">{color}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty mt-6">No palette defined for this project yet.</div>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container grid gap-6 xl:grid-cols-3">
            <div className="dashboard-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Idea
              </p>
              <h2 className="headline-2 mt-4">The concept</h2>
              <p className="text-zinc-300 mt-5 leading-8">{project.idea}</p>
            </div>

            <div className="dashboard-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Design
              </p>
              <h2 className="headline-2 mt-4">Visual direction</h2>
              <p className="text-zinc-300 mt-5 leading-8">{project.design}</p>
            </div>

            <div className="dashboard-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Outcome
              </p>
              <h2 className="headline-2 mt-4">Final result</h2>
              <p className="text-zinc-300 mt-5 leading-8">{project.outcome}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Timeline
              </p>
              <h2 className="headline-2 mt-4">From idea to build</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {project.timeline?.map((entry) => (
                <article
                  key={`${entry.phase}-${entry.period}`}
                  className="rounded-[24px] border border-zinc-800/70 bg-zinc-950/40 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                    {entry.period}
                  </p>
                  <h3 className="title-1 mt-3">{entry.phase}</h3>
                  <p className="text-zinc-400 text-sm mt-4 leading-7">{entry.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
                Process
              </p>
              <h2 className="headline-2 mt-4">Build gallery</h2>
              <p className="text-zinc-400 mt-4 max-w-[60ch]">
                A visual walkthrough of the concept, layout refinement, and final presentation.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {project.gallery?.map((entry) => (
                <article
                  key={`${entry.src}-${entry.caption}`}
                  className="rounded-[28px] border border-zinc-800/70 bg-zinc-950/40 overflow-hidden"
                >
                  <figure className="img-box aspect-[4/3]">
                    <img src={entry.src} alt={entry.alt} className="img-cover" />
                  </figure>
                  <div className="p-5">
                    <p className="text-zinc-100 font-medium">{entry.caption}</p>
                    <p className="text-sm text-zinc-500 mt-3">{entry.alt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ReactLenis>
  );
};

export default ProjectDetailPage;
