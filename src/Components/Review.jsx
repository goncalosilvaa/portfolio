import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import ReviewCard from './ReviewCard';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Review = ({ reviews }) => {
  const publishedReviews = reviews.filter((review) => review.published !== false);

  useGSAP(
    () => {
      if (!publishedReviews.length) {
        return;
      }

      gsap.to('.scrub-slide', {
        scrollTrigger: {
          trigger: '.scrub-slide',
          start: '-200% 80%',
          end: '400% 80%',
          scrub: true,
        },
        x: '-1000',
      });
    },
    { dependencies: [publishedReviews.length] }
  );

  return (
    <section id="reviews" className="section overflow-hidden">
      <div className="container">
        <h2 className="headline-2 mb-8 reveal-up">What my customers say</h2>

        {publishedReviews.length ? (
          <div className="scrub-slide flex items-stretch gap-3 w-fit">
            {publishedReviews.map(({ id, content, name, image, company }) => (
              <ReviewCard
                key={id}
                name={name}
                imgSrc={image}
                company={company}
                content={content}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">Reviews from clients will appear here once you publish them.</div>
        )}
      </div>
    </section>
  );
};

Review.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Review;
