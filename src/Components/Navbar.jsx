import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const navItems = [
  {
    label: 'Home',
    link: '/#home',
    className: 'nav-link active',
  },
  {
    label: 'About',
    link: '/#about',
    className: 'nav-link',
  },
  {
    label: 'Work',
    link: '/#work',
    className: 'nav-link',
  },
  {
    label: 'Reviews',
    link: '/#reviews',
    className: 'nav-link',
  },
  {
    label: 'Contact',
    link: '/#contact',
    className: 'nav-link md:hidden',
  },
];

const Navbar = ({ navOpen, onNavigate }) => {
  const lastActiveLink = useRef(null);
  const activeBox = useRef(null);

  useEffect(() => {
    const linkNode = lastActiveLink.current;
    const activeNode = activeBox.current;

    if (!linkNode || !activeNode) {
      return undefined;
    }

    const syncActiveBox = () => {
      activeNode.style.top = `${linkNode.offsetTop}px`;
      activeNode.style.left = `${linkNode.offsetLeft}px`;
      activeNode.style.width = `${linkNode.offsetWidth}px`;
      activeNode.style.height = `${linkNode.offsetHeight}px`;
    };

    syncActiveBox();
    window.addEventListener('resize', syncActiveBox);

    return () => window.removeEventListener('resize', syncActiveBox);
  }, []);

  const activateCurrentLink = (event) => {
    if (!activeBox.current) {
      return;
    }

    lastActiveLink.current?.classList.remove('active');
    event.currentTarget.classList.add('active');
    lastActiveLink.current = event.currentTarget;

    activeBox.current.style.top = `${event.currentTarget.offsetTop}px`;
    activeBox.current.style.left = `${event.currentTarget.offsetLeft}px`;
    activeBox.current.style.width = `${event.currentTarget.offsetWidth}px`;
    activeBox.current.style.height = `${event.currentTarget.offsetHeight}px`;

    onNavigate();
  };

  return (
    <nav className={`navbar ${navOpen ? 'active' : ''}`}>
      {navItems.map(({ label, link, className }, index) => (
        <a
          href={link}
          key={label}
          ref={index === 0 ? lastActiveLink : undefined}
          className={className}
          onClick={activateCurrentLink}
        >
          {label}
        </a>
      ))}
      <div className="active-box" ref={activeBox} />
    </nav>
  );
};

Navbar.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Navbar;
