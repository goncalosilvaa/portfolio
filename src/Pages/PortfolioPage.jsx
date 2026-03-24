import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Header from '../Components/Header';
import Hero from '../Components/Hero';
import About from '../Components/About';
import Skill from '../Components/Skill';
import Work from '../Components/Work';
import Review from '../Components/Review';
import Contact from '../Components/Contact';
import Footer from '../Components/Footer';
import { contentSeed } from '../data/contentSeed';
import { getPublicContent } from '../lib/api';
import {
  trackCvDownload,
  trackProjectClick,
  trackProjectView,
  trackVisitOnce,
} from '../lib/analytics';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PortfolioPage = () => {
  const [content, setContent] = useState(contentSeed);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    let isMounted = true;

    trackVisitOnce();

    getPublicContent()
      .then((payload) => {
        if (isMounted) {
          setContent(payload.content);
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

  useGSAP(
    () => {
      const elements = gsap.utils.toArray('.reveal-up');

      elements.forEach((element) => {
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: '-200 bottom',
            end: 'bottom 80%',
            scrub: true,
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      });
    },
    { dependencies: [content.projects.length, content.skills.length, (content.reviews || []).length] }
  );

  return (
    <ReactLenis root>
      <Header />
      <main>
        <Hero onDownloadCv={trackCvDownload} />
        <About projectCount={content.projects.length} skillCount={content.skills.length} />
        <Skill skills={content.skills} />
        <Work
          projects={content.projects}
          dataError={dataError}
          onProjectView={trackProjectView}
          onProjectClick={trackProjectClick}
        />
        <Review reviews={content.reviews || []} />
        <Contact />
      </main>
      <Footer />
    </ReactLenis>
  );
};

export default PortfolioPage;
