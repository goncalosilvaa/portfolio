import PropTypes from 'prop-types';

function buildLinkProps(target, rel, download) {
  const props = {
    target,
    download,
  };

  if (target === '_blank') {
    props.rel = rel || 'noreferrer';
  } else if (rel) {
    props.rel = rel;
  }

  return props;
}

const ButtonPrimary = ({
  href,
  target = '_self',
  label,
  icon,
  classes = '',
  rel,
  onClick,
  download,
}) => {
  const content = (
    <>
      {label}
      {icon ? <span className="material-symbols-rounded" aria-hidden="true">{icon}</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`btn btn-primary ${classes}`}
        onClick={onClick}
        {...buildLinkProps(target, rel, download)}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={`btn btn-primary ${classes}`} onClick={onClick}>
      {content}
    </button>
  );
};

ButtonPrimary.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.string,
  classes: PropTypes.string,
  rel: PropTypes.string,
  onClick: PropTypes.func,
  download: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

const ButtonOutline = ({
  href,
  target = '_self',
  label,
  icon,
  classes = '',
  rel,
  onClick,
}) => {
  const content = (
    <>
      {label}
      {icon ? <span className="material-symbols-rounded" aria-hidden="true">{icon}</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`btn btn-outline ${classes}`}
        onClick={onClick}
        {...buildLinkProps(target, rel)}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={`btn btn-outline ${classes}`} onClick={onClick}>
      {content}
    </button>
  );
};

ButtonOutline.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.string,
  classes: PropTypes.string,
  rel: PropTypes.string,
  onClick: PropTypes.func,
};

export {
  ButtonPrimary,
  ButtonOutline,
};
