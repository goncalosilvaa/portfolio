function buildTimeline(entries) {
  return entries.map(([phase, period, summary]) => ({
    phase,
    period,
    summary,
  }));
}

function buildGallery(entries) {
  return entries.map(([src, caption, alt]) => ({
    src,
    caption,
    alt,
  }));
}

export const contentSeed = {
  projects: [
    {
      id: 'musify',
      title: 'Full stack music app',
      headline: 'Building a music discovery product with playlists, authentication, and a polished listening flow.',
      summary:
        'Music discovery platform with authentication, playlists, and a polished responsive UI.',
      overview:
        'Musify was approached as a full stack product rather than a simple showcase build. The goal was to make music discovery feel lively, personal, and easy to use across desktop and mobile while keeping the interface clean enough for fast everyday browsing.',
      idea:
        'The original idea was to create a lightweight music experience where users could search, explore, and save tracks without feeling overwhelmed by noisy layouts. The focus was on clarity, rhythm, and reducing friction around playlist building.',
      design:
        'The design direction combines dark surfaces, strong contrast, and accent lighting to reinforce the feeling of an immersive music player. Layout decisions favored quick scanning, visible artwork, and components that scale well between landing sections, results, and personal collections.',
      outcome:
        'The final result is a portfolio-ready product that communicates both interface craft and backend capability. It showcases authentication, content organization, responsive layouts, and a stronger product narrative than a simple single-page experiment.',
      image: '/images/project-1.jpg',
      tags: ['API', 'MVC', 'Development'],
      link: 'https://musify-5al0.onrender.com/',
      year: '2026',
      duration: '6 weeks',
      role: 'Product design, frontend development, backend integration',
      palette: ['#0ea5e9', '#111827', '#f4f4f5', '#22c55e'],
      timeline: buildTimeline([
        ['Discovery', 'Week 1', 'Mapped the core flows around search, track browsing, and playlist creation.'],
        ['UX direction', 'Week 2', 'Defined the player-inspired layout, navigation rhythm, and component hierarchy.'],
        ['Build', 'Weeks 3-5', 'Implemented the frontend, authentication flow, and the core playlist interactions.'],
        ['Polish', 'Week 6', 'Improved responsive behavior, refined spacing, and tightened the visual finish.'],
      ]),
      gallery: buildGallery([
        ['/images/project-1.jpg', 'Early references and UI direction for the listening experience.', 'Musify moodboard and early UI exploration'],
        ['/images/project-1.jpg', 'Main interface pass focused on artwork, hierarchy, and responsive layout.', 'Musify interface layout pass'],
        ['/images/project-1.jpg', 'Final pass used for launch visuals and product presentation.', 'Musify final showcase'],
      ]),
      published: true,
    },
    {
      id: 'pixstock',
      title: 'Free stock photo app',
      headline: 'Designing a fast image discovery experience driven by external APIs and clean browsing patterns.',
      summary:
        'Image search experience powered by external APIs with a clean single-page flow.',
      overview:
        'Pixstock was built around speed and visual clarity. The project focuses on helping users find photography quickly while keeping the interface unobtrusive, lightweight, and image-first from the very first interaction.',
      idea:
        'The idea was to strip the experience down to the essentials: search intent, clear results, and fast visual feedback. Instead of over-designing the product, the interface was shaped to let the imagery carry the experience.',
      design:
        'The layout uses generous spacing, subtle cards, and a restrained visual system so the results grid remains the hero. Typography and filters were kept simple to preserve flow and reduce cognitive overload while browsing large sets of content.',
      outcome:
        'The finished app demonstrates API integration, front-end state handling, and a mature sense of restraint in UI design. It reads as a focused utility product with a strong visual baseline and a clear user journey.',
      image: '/images/project-2.jpg',
      tags: ['API', 'SPA'],
      link: 'https://pixstock-official.vercel.app/',
      year: '2026',
      duration: '4 weeks',
      role: 'UX design, interface design, frontend implementation',
      palette: ['#f8fafc', '#0f172a', '#38bdf8', '#64748b'],
      timeline: buildTimeline([
        ['Research', 'Week 1', 'Benchmarked image search products and defined the leanest browsing flow.'],
        ['Interface system', 'Week 2', 'Established cards, search controls, and grid behavior for multiple breakpoints.'],
        ['API integration', 'Week 3', 'Connected the search experience to the image source and refined loading states.'],
        ['Refinement', 'Week 4', 'Polished result density, spacing, and detail handling across devices.'],
      ]),
      gallery: buildGallery([
        ['/images/project-2.jpg', 'Reference pass to shape the search-first experience.', 'Pixstock discovery and wireframe phase'],
        ['/images/project-2.jpg', 'Grid and card refinements focused on visual browsing.', 'Pixstock gallery layout refinement'],
        ['/images/project-2.jpg', 'Final interface showcase with an emphasis on clean search flow.', 'Pixstock final interface'],
      ]),
      published: true,
    },
    {
      id: 'recipe-app',
      title: 'Recipe app',
      headline: 'Creating a recipe browsing product that feels practical, quick, and visually organised.',
      summary:
        'Recipe browsing interface focused on fast filtering, saved ideas, and easy exploration.',
      overview:
        'This recipe app was imagined as a compact product for everyday inspiration. Instead of turning recipes into cluttered content pages, the experience was shaped around quick discovery, category scanning, and intuitive browsing.',
      idea:
        'The main idea was to help users move from “I need an idea” to “I found something useful” with as little friction as possible. The product needed to feel organized, visual, and friendly for repeat use.',
      design:
        'The interface leans into warm contrast, readable cards, and modular browsing sections. The design system supports recipe imagery, meta information, and filter controls without making the page feel dense or content-heavy.',
      outcome:
        'The project became a good example of designing around browsing behavior rather than only decoration. It highlights how layout, hierarchy, and visual grouping can improve usability even in content-rich categories.',
      image: '/images/project-3.jpg',
      tags: ['Development', 'API'],
      link: '',
      year: '2026',
      duration: '5 weeks',
      role: 'UX planning, UI design, frontend development',
      palette: ['#fb7185', '#18181b', '#fef3c7', '#ffffff'],
      timeline: buildTimeline([
        ['Planning', 'Week 1', 'Defined the content structure for categories, saved recipes, and quick browsing.'],
        ['Visual system', 'Week 2', 'Explored warmer tones and food-focused card patterns.'],
        ['Implementation', 'Weeks 3-4', 'Built the main browsing experience, filtering logic, and reusable UI patterns.'],
        ['Final review', 'Week 5', 'Adjusted density, responsive spacing, and card hierarchy for better readability.'],
      ]),
      gallery: buildGallery([
        ['/images/project-3.jpg', 'Exploring recipe card structures and search priorities.', 'Recipe app card exploration'],
        ['/images/project-3.jpg', 'Design pass focused on content hierarchy and filtering.', 'Recipe app filtering and layout pass'],
        ['/images/project-3.jpg', 'Final visual presentation of the product direction.', 'Recipe app final presentation'],
      ]),
      published: true,
    },
    {
      id: 'wealthome',
      title: 'Real estate website',
      headline: 'Shaping a more editorial real estate experience with strong hierarchy and premium visual cues.',
      summary:
        'Marketing website concept for real estate listings with an editorial visual direction.',
      overview:
        'Wealthome was treated as a premium marketing website rather than a utility dashboard. The ambition was to make listings feel aspirational and curated while still keeping navigation and information easy to digest.',
      idea:
        'The core idea was to position properties through storytelling. Instead of relying only on grid density, the site gives more space to photography, highlights, and a carefully paced presentation that feels more high-end.',
      design:
        'The visual language uses strong contrast, open spacing, and confident typography to create an editorial feel. Listing cards, feature sections, and calls to action were designed to support both trust and aspiration.',
      outcome:
        'The concept reads as a mature marketing site with a distinct point of view. It shows the ability to design for premium positioning, content pacing, and higher-value visual presentation.',
      image: '/images/project-4.jpg',
      tags: ['Web Design', 'Development'],
      link: 'https://github.com/codewithsadee-org/wealthome',
      year: '2025',
      duration: '4 weeks',
      role: 'Creative direction, UI design, frontend build',
      palette: ['#e7c873', '#0a0a0a', '#fafafa', '#3f3f46'],
      timeline: buildTimeline([
        ['Positioning', 'Week 1', 'Defined the premium tone and editorial content approach for the site.'],
        ['Layouts', 'Week 2', 'Built out hero sections, listing modules, and supporting marketing blocks.'],
        ['Frontend build', 'Week 3', 'Translated the design direction into responsive landing pages and listing views.'],
        ['Refinement', 'Week 4', 'Polished imagery treatment, section pacing, and CTA visibility.'],
      ]),
      gallery: buildGallery([
        ['/images/project-4.jpg', 'Editorial direction and mood references for the brand tone.', 'Wealthome creative direction'],
        ['/images/project-4.jpg', 'Listing presentation and marketing block exploration.', 'Wealthome listing layout exploration'],
        ['/images/project-4.jpg', 'Final marketing site visuals for the concept.', 'Wealthome final concept'],
      ]),
      published: true,
    },
    {
      id: 'anon-commerce',
      title: 'eCommerce website',
      headline: 'Designing a storefront experience that keeps products central while improving conversion flow.',
      summary:
        'Storefront experience with strong product presentation and conversion-focused layouts.',
      overview:
        'Anon Commerce was built as a presentation-heavy storefront with a strong emphasis on product hierarchy. The challenge was to make the catalog feel rich and brand-led while still keeping the purchasing journey clear and efficient.',
      idea:
        'The idea was to combine strong merchandising with accessible shopping behavior. Product cards, feature callouts, and landing sections were designed to support discovery and decision-making without overcomplicating checkout intent.',
      design:
        'The visual system mixes clean framing with stronger emphasis on product imagery and promotional moments. The layout prioritises scans, category movement, and visual rhythm so the storefront feels energetic without becoming noisy.',
      outcome:
        'The final concept communicates a good understanding of commerce UX, visual merchandising, and modular landing-page design. It works well as a portfolio example for both UI craft and product thinking.',
      image: '/images/project-5.jpg',
      tags: ['eCommerce', 'Development'],
      link: 'https://github.com/codewithsadee/anon-ecommerce-website',
      year: '2025',
      duration: '5 weeks',
      role: 'UI design, frontend architecture, responsive implementation',
      palette: ['#22c55e', '#09090b', '#fafafa', '#a1a1aa'],
      timeline: buildTimeline([
        ['Structure', 'Week 1', 'Defined key merchandising sections and storefront priorities.'],
        ['UI system', 'Week 2', 'Created reusable components for products, categories, and promotions.'],
        ['Build', 'Weeks 3-4', 'Implemented catalog sections, responsive behaviors, and core navigation patterns.'],
        ['Launch polish', 'Week 5', 'Improved CTA hierarchy, spacing consistency, and storefront pacing.'],
      ]),
      gallery: buildGallery([
        ['/images/project-5.jpg', 'Initial storefront direction and product merchandising references.', 'Anon commerce planning phase'],
        ['/images/project-5.jpg', 'Catalog and promotional block system in progress.', 'Anon commerce storefront system'],
        ['/images/project-5.jpg', 'Final storefront presentation with product-led hierarchy.', 'Anon commerce final showcase'],
      ]),
      published: true,
    },
    {
      id: 'vcard-portfolio',
      title: 'vCard personal portfolio',
      headline: 'Turning a personal site into a stronger case-study style portfolio with clearer storytelling.',
      summary:
        'Personal site concept built to showcase projects, credibility, and contact paths.',
      overview:
        'This personal portfolio concept focused on clarity, trust, and personal positioning. Instead of only listing work, the goal was to create a site that could present projects, reinforce credibility, and move visitors toward contact with confidence.',
      idea:
        'The idea was to make the portfolio feel more intentional than a static showcase. Sections needed to communicate personality, capability, and proof of work while maintaining a structure that feels easy to scan for recruiters or clients.',
      design:
        'The design uses layered cards, confident contrast, and compact sections to balance personality with structure. It was shaped to work well as both a portfolio and a flexible personal landing page that can evolve over time.',
      outcome:
        'The result is a strong portfolio concept with a clear conversion path, better storytelling, and a visual system that supports future growth. It works well as a case study because it reflects both self-branding and interface design choices.',
      image: '/images/project-6.jpg',
      tags: ['Web Design', 'Development'],
      link: 'https://github.com/codewithsadee/vcard-personal-portfolio',
      year: '2025',
      duration: '3 weeks',
      role: 'Brand direction, UI design, frontend development',
      palette: ['#38bdf8', '#18181b', '#fafafa', '#facc15'],
      timeline: buildTimeline([
        ['Direction', 'Week 1', 'Defined the structure for identity, projects, credibility, and contact.'],
        ['UI build', 'Week 2', 'Designed the card system, section rhythms, and portfolio presentation.'],
        ['Refinement', 'Week 3', 'Polished interactions, spacing, and final storytelling details.'],
      ]),
      gallery: buildGallery([
        ['/images/project-6.jpg', 'Planning the personal brand direction and content priorities.', 'Portfolio concept planning'],
        ['/images/project-6.jpg', 'Building the section system and visual hierarchy.', 'Portfolio layout system'],
        ['/images/project-6.jpg', 'Final concept ready for presentation and iteration.', 'Portfolio final concept'],
      ]),
      published: true,
    },
  ],
  reviews: [
    {
      id: 'pixelforge',
      content:
        'Exceptional web development. Delivered a seamless, responsive site with clean code and great UX.',
      name: 'Sophia Ramirez',
      image: '/images/people-1.jpg',
      company: 'PixelForge',
      published: true,
    },
    {
      id: 'nexawave',
      content:
        'Impressive work with fast loading times, intuitive design, and solid backend integration.',
      name: 'Ethan Caldwell',
      image: '/images/people-2.jpg',
      company: 'NexaWave',
      published: true,
    },
    {
      id: 'codecraft',
      content:
        'Outstanding developer. Built a robust site with excellent functionality and attention to detail.',
      name: 'Liam Bennett',
      image: '/images/people-3.jpg',
      company: 'CodeCraft',
      published: true,
    },
    {
      id: 'brightweb',
      content:
        'Creative and skilled. Produced a modern, user-friendly site that exceeded expectations.',
      name: 'Noah Williams',
      image: '/images/people-4.jpg',
      company: 'BrightWeb',
      published: true,
    },
    {
      id: 'techmosaic',
      content:
        'Professional work delivered on time with a polished design and a smooth user experience.',
      name: 'Ava Thompson',
      image: '/images/people-5.jpg',
      company: 'TechMosaic',
      published: true,
    },
    {
      id: 'skyline-digital',
      content:
        'Excellent project execution, high-quality code, responsive design, and great problem-solving.',
      name: 'Jonathan',
      image: '/images/people-6.jpg',
      company: 'Skyline Digital',
      published: true,
    },
  ],
  skills: [
    {
      id: 'figma',
      name: 'Figma',
      description: 'Design systems and interface prototyping',
      icon: '/images/figma.svg',
      category: 'Design',
    },
    {
      id: 'css',
      name: 'CSS',
      description: 'Responsive user interface styling',
      icon: '/images/css3.svg',
      category: 'Frontend',
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'Interactive client-side experiences',
      icon: '/images/javascript.svg',
      category: 'Frontend',
    },
    {
      id: 'nodejs',
      name: 'NodeJS',
      description: 'Backend services and APIs',
      icon: '/images/nodejs.svg',
      category: 'Backend',
    },
    {
      id: 'expressjs',
      name: 'ExpressJS',
      description: 'REST APIs and server architecture',
      icon: '/images/expressjs.svg',
      category: 'Backend',
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      description: 'Document database modeling',
      icon: '/images/mongodb.svg',
      category: 'Database',
    },
    {
      id: 'react',
      name: 'React',
      description: 'Component-based frontend development',
      icon: '/images/react.svg',
      category: 'Frontend',
    },
    {
      id: 'tailwindcss',
      name: 'TailwindCSS',
      description: 'Rapid UI styling and design systems',
      icon: '/images/tailwindcss.svg',
      category: 'Frontend',
    },
  ],
};
