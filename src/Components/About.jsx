import PropTypes from 'prop-types';

const About = ({ projectCount, skillCount }) => {
  const aboutItems = [
    {
      label: 'Published projects',
      number: projectCount,
    },
    {
      label: 'Core skills',
      number: skillCount,
    },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="bg-zinc-800/50 p-7 rounded-2xl md:p-12 reveal-up">
          <p className="text-zinc-300 mb-4 md:mb-8 md:text-xl md:max-w-[60ch]">
            Welcome! I&apos;m Goncalo, a web developer focused on creating fast, polished, and
            practical digital experiences. I combine thoughtful design with clean implementation
            to turn ideas into websites and products that feel sharp, modern, and reliable.
          </p>

          <div className="flex flex-wrap items-center gap-4 md:gap-7">
            {aboutItems.map(({ label, number }) => (
              <div key={label}>
                <div className="flex items-center md:mb-2">
                  <span className="text-2xl font-semibold md:text-4xl">{number}</span>
                  <span className="text-sky-400 font-semibold md:text-3xl">+</span>
                </div>

                <p className="text-sm text-zinc-400">{label}</p>
              </div>
            ))}

            <img
              src="/images/logo.svg"
              alt="Logo"
              width={30}
              height={30}
              className="ml-auto md:w-[40px] md:h-[40px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

About.propTypes = {
  projectCount: PropTypes.number.isRequired,
  skillCount: PropTypes.number.isRequired,
};

export default About;
