import PropTypes from 'prop-types';

import SkillCard from './SkillCard';

const Skill = ({ skills }) => {
  return (
    <section className="section">
      <div className="container">
        <h2 className="headline-2 reveal-up">Core tools behind my work</h2>

        <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] reveal-up">
          These are the technologies and tools I rely on to design, build, and ship modern web
          experiences.
        </p>

        <div className="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
          {skills.map(({ id, icon, name, description }) => (
            <SkillCard
              key={id}
              imgSrc={icon}
              label={name}
              desc={description}
              classes=" reveal-up"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

Skill.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Skill;
