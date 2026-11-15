
export const projects = {
  WEB: [
    {
      id: 4,
      title: "Tuchi Digital – Web Development Business",
      projectType: "Personal Business",
      description:
        "Designed and developed the website for my own web development business, presenting services and digital solutions for clients, including websites, landing pages, and e-commerce platforms.",
      longDescription:
        "Built Tuchi Digital using React and TypeScript, with reusable components, responsive layouts, custom CSS animations, and GSAP with ScrollTrigger. Developed service pages, interactive sections, and a contact form with backend integration. The platform represents my independent web development business, where I work directly with clients, taking projects from initial requirements and development through deployment and maintenance.",
      image: "./projects/tuchidigital.webp",
      technologies: [
        "React",
        "TypeScript",
        "CSS",
        "GSAP",
        "ScrollTrigger",
        "Vercel"
      ],
      category: "Web",
      playable: false,
      gameUrl: "",
      liveUrl: "https://tuchidigital.com/",
      githubUrl: "https://github.com/edjuarez/tuchidigital",
      previewVideo: "./projects/previews/tuchi-digital-preview.mp4",
    },
    {
      id: 3,
      title: "Noventitre – Custom Handmade Products",
      projectType: "Client Project",
      description:
        "A custom e-commerce platform for a handmade brand specializing in personalized bags, wallets, and accessories, with an online product catalog and payment integration.",
      longDescription:
        "Designed and developed a responsive e-commerce experience using React, TypeScript, and Tailwind CSS. Implemented product browsing, a custom product gallery, and an administration panel for managing products and stock. Integrated Supabase for database and backend functionality, along with Stripe for payment processing. Focused on delivering a complete shopping experience, from product discovery to checkout.",
      image: "./projects/noventitre.webp",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Supabase",
        "Stripe"
      ],
      category: "Web",
      playable: false,
      gameUrl: "",
      liveUrl: "https://noventitre.com/",
      githubUrl: "https://github.com/edjuarez/noventitre",
      previewVideo: "./projects/previews/noventitre-preview.mp4",
    },
    {
      id: 5,
      title: "Sophie Art Tattoo – Artist Portfolio",
      projectType: "Client Project",
      description:
        "A custom website for a tattoo artist, designed to showcase her artwork, portfolio, and personal brand through a distinctive visual identity.",
      longDescription:
        "Designed and developed a responsive website using React, TypeScript, and Tailwind CSS. Implemented an artwork portfolio, artist presentation, FAQ section, contact options, and social media integration. Focused on visual presentation, typography, responsive layouts, and reusable components to create a consistent experience across devices.",
      image: "./projects/sophiearttattoo.webp",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Cloudflare",
        "SQL"
      ],
      category: "Web",
      playable: false,
      gameUrl: "",
      liveUrl: "https://sophiearttattoo.com/",
      githubUrl: "https://github.com/edjuarez/ink-studio",
      previewVideo: "./projects/previews/sophie-art-preview.mp4",
    },
    {
      id: 1,
      title: "Event Hub – Event Management Dashboard",
      projectType: "Technical Demonstration",
      description:
        "A React and TypeScript event management application designed to handle large datasets efficiently. Features a data grid, virtualized timeline, and accessible event management workflows.",
      longDescription:
        "Built as a technical demonstration focused on frontend performance, component reusability, and accessibility. Handles a dataset of 100,000 events generated through a Web Worker to keep the main thread responsive. Implements a configurable data grid using TanStack Table, with client-side pagination, sorting, filtering, column visibility, and debounced search. Includes a virtualized timeline with progressive data loading in batches of 10,000 events, keyboard navigation, and screen reader support. Also features reusable event forms built with React Hook Form, including validation, accessible error handling, and focus management. The application follows a modular architecture with separated services, custom hooks, and reusable UI components.",
      image: "./projects/eventhub.webp",
      technologies: [
        "React",
        "TypeScript",
        "Vite",
        "TanStack Table",
        "CSS"
      ],
      category: "Web",
      playable: false,
      gameUrl: "",
      liveUrl: "https://event-hub-ruby.vercel.app/",
      githubUrl: "https://github.com/edjuarez/event-hub"
    },
    {
      id: 2,
      title: "Podcast App – Podcast Discovery Platform",
      projectType: "Technical Demonstration",
      description:
        "A React and TypeScript podcast discovery application integrating Apple's APIs and RSS feeds. Features client-side routing, data caching, global loading management, and automated testing.",
      longDescription:
        "Developed as a technical demonstration focused on API integration, state management, and frontend architecture. Integrates Apple's Top 100 Podcasts feed and iTunes Lookup API to retrieve podcast information and episode details, including RSS feed parsing and audio playback. Uses React Router 7 for navigation between podcast listings, podcast details, and individual episodes. Implements React Context for global loading state management, custom hooks for data handling, and a service layer to centralize API requests and data transformation. Includes a client-side caching strategy using LocalStorage with a 24-hour expiration, API error handling, and a fallback mechanism for cross-origin RSS requests. Automated tests with Vitest and MSW cover services, hooks, and application flows.",
      image: "./projects/podcastapp.webp",
      technologies: [
        "React",
        "TypeScript",
        "Vite",
        "React Router",
        "Vitest",
        "MSW",
        "iTunes API"
      ],
      category: "Web",
      playable: false,
      gameUrl: "",
      liveUrl: "https://podcast-app-edujuarezcba.vercel.app/",
      githubUrl: "https://github.com/edjuarez/podcast-app"
    },
    {
      id: 10,
      title: "Mobile Store – Mobile Phone Catalog",
      projectType: "Technical Demonstration",
      description:
        "A mobile phone catalog application built with React, featuring API integration, product details, shopping cart functionality, and pagination.",
      longDescription:
        "Developed as a technical demonstration focused on API integration, state management, and component reusability. Retrieves mobile phone data from an external API and displays products in a paginated catalog. Includes individual product detail views and shopping cart functionality. Uses React Context API to manage shared application state, including cart operations, across different sections of the application. Built with a modular component structure and responsive layouts.",
      image: "./projects/mobile-catalog.webp",
      technologies: [
        "React",
        "JavaScript",
        "Vite",
        "Context API",
        "REST API",
        "SCSS"
      ],
      category: "Web",
      playable: false,
      gameUrl: "",
      liveUrl: "https://mobile-catalog-liart.vercel.app/",
      githubUrl: "https://github.com/edjuarez/mobile-catalog"
    },

  ],

  GAME: [
    {
      id: 7,
      title: "Master Elba – Arcade Survival Game",
      projectType: "Academic Project",
      description:
        "An arcade-style survival game developed in Construct, featuring enemy encounters, mouse-based controls, and a high-score system.",
      longDescription:
        "Developed for web browsers using Construct. Players navigate the game environment using mouse controls, avoiding enemy attacks and shooting to survive. The gameplay focuses on reflexes, survival mechanics, and score accumulation.",
      image: "./projects/masterelba.webp",
      technologies: [
        "Construct",
        "HTML5",
        "Pixel Art",
        "Webpack"
      ],
      category: "Game",
      playable: true,
      gameUrl: "/games/master-elba/index.html",
      previewVideo: "./projects/previews/master-elba-preview.mp4",
      liveUrl: "",
      //githubUrl: "https://github.com/edjuarez/master-elba-videogame"
    },
    {
      id: 8,
      title: "Synesthesia – 2D Action Platformer",
      projectType: "Academic Project · Real Client",
      description:
        "A 2D action platformer developed as a university thesis project for Synesthesia, a local rock band. Created as an interactive promotional experience, the game featured the band's music, original pixel art environments, and a scoring system.",
      longDescription:
        "Developed as a university thesis in collaboration with Synesthesia, a local rock band, this project aimed to promote the band through an original browser-based game. Built with Construct 2, it features side-scrolling action, zombie enemies, collectible weapons, multiple levels, and progressive difficulty, all accompanied by the band's music.\n\nOriginally launched on Facebook, the game included a scoring system that allowed players to share their scores and engage with the band's audience. Today, it is showcased in my portfolio with all levels unlocked, allowing visitors to freely explore every environment, soundtrack, and visual design without needing to progress through the game.",
      image: "./projects/synesthesia.webp",
      technologies: [
        "Construct 2",
        "HTML5",
        "Pixel Art",
        "Game Design"
      ],
      category: "Game",
      playable: true,
      gameUrl: "/games/synesthesia-the-game/index.html",
      previewVideo: "./projects/previews/synesthesia-demo.mp4",
    },
    {
      id: 9,
      title: "Penality",
      projectType: "Academic Project",
      description:
        "A hilarious 2D football game inspired by the infamous Neuer vs. Higuaín incident at the 2014 World Cup.",

      longDescription:
        "Remember Neuer's infamous collision with Pipita Higuaín during the 2014 World Cup? Well, this time you're in Neuer's shoes! Your mission is to commit as many penalties as possible against the Pipitas running across the pitch. As the game progresses, more and more Pipitas appear, making it harder to keep up with the chaos. Luckily, the referee seems to have a serious eyesight problem and conveniently ignores every foul. How many penalties can you get away with before the match turns into complete madness?",

      image: "./projects/penality1.webp",

      technologies: [
        "Construct",
        "HTML5",
        "Pixel Art",
        "Webpack"
      ],
      category: "Web",
      playable: true,
      gameUrl: "/games/penality/index.html",
      previewVideo: "./projects/previews/penality-preview.mp4",
    },
    {
      id: 6,
      title: "Rupert – Environmental Awareness Game",
      projectType: "Academic Project",
      description:
        "A multi-platform game for web and mobile, combining arcade-style gameplay with an environmental awareness message about ocean pollution.",
      longDescription:
        "Developed in ActionScript for web and mobile platforms. Players must protect marine life by preventing fish from being overwhelmed by toxic waste. The project combines fast-paced gameplay, visual storytelling, and pixel art to communicate an environmental message through an interactive experience.",
      image: "./projects/rupert.webp",
      technologies: [
        "ActionScript",
        "Adobe Flash",
        "Pixel Art"
      ],
      category: "Game",
      playable: true,
      gameUrl: "/games/rupert/index.html",
      previewVideo: "./projects/previews/rupert-preview.mp4",
    },
  ]
};
