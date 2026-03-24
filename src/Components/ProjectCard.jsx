import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({
  projectId,
  imgSrc,
  title,
  summary,
  tags,
  projectLink,
  classes = '',
  onVisible,
  onClick,
}) => {
  const cardRef = useRef(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!cardRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true;
            onVisible(projectId);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [onVisible, projectId]);

  return (
    <div
      ref={cardRef}
      className={`relative p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700/50 active:bg-zinc-700/60 ring-1 ring-inset ring-zinc-50/5 transition-colors ${classes}`}
    >
      <figure className="img-box aspect-[4/3] rounded-lg mb-4">
        <img src={imgSrc} alt={title} loading="lazy" className="img-cover" />
      </figure>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="title-1 mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm mb-4">{summary}</p>

          <div className="flex flex-wrap items-center gap-2">
            {tags.map((label) => (
              <span
                key={label}
                className="h-8 text-sm text-zinc-400 bg-zinc-50/5 grid items-center px-3 rounded-lg"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="w-11 h-11 rounded-lg grid place-items-center bg-sky-400 text-zinc-950 shrink-0">
          <span className="material-symbols-rounded" aria-hidden="true">
            arrow_outward
          </span>
        </div>
      </div>

      {projectLink ? (
        <a
          href={projectLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => onClick(projectId)}
          className="absolute inset-0"
          aria-label={`Open ${title}`}
        />
      ) : null}
    </div>
  );
};

ProjectCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectLink: PropTypes.string,
  classes: PropTypes.string,
  onVisible: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProjectCard;
