import PropTypes from 'prop-types';

import ProjectCard from './ProjectCard';

const Work = ({ projects, dataError, onProjectView, onProjectClick }) => {
  const publishedProjects = projects.filter((project) => project.published !== false);

  return (
    <section id="work" className="section">
      <div className="container">
        <div className="mb-8 reveal-up">
          <h2 className="headline-2">Selected projects</h2>
          <p className="text-zinc-400 mt-3 max-w-[60ch]">
            A curated selection of projects, experiments, and production work currently published
            on the portfolio.
          </p>
          {dataError ? (
            <p className="text-sm text-amber-200/80 mt-3">
              Live content is currently unavailable, so the site is showing local fallback data.
            </p>
          ) : null}
        </div>

        {publishedProjects.length ? (
          <div className="grid gap-x-4 gap-y-5 grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]">
            {publishedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                projectId={project.id}
                imgSrc={project.image}
                title={project.title}
                summary={project.summary}
                tags={project.tags}
                projectLink={project.link}
                classes="reveal-up"
                onVisible={onProjectView}
                onClick={onProjectClick}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            No published projects yet. Add one from the dashboard to make it appear here.
          </div>
        )}
      </div>
    </section>
  );
};

Work.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataError: PropTypes.string.isRequired,
  onProjectView: PropTypes.func.isRequired,
  onProjectClick: PropTypes.func.isRequired,
};

export default Work;
