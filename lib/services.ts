export type Service = {
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  problem: { title: string; text: string };
  capabilities: { title: string; text: string }[];
  useCases: string[];
  approach: string;
  preparation: string;
  process: string[];
  projectIds: string[];
  related: string[];
};

export const services: readonly Service[] = [
  {
    slug: 'website-development', name: 'Website development', title: 'Website Design & Development in Sri Lanka',
    description: 'Custom website design and development by ASL in Sri Lanka. Responsive business websites with distinctive visuals, clear content and thoughtful interactions.',
    headline: 'A website with a world of its own.',
    intro: 'ASL designs and builds custom websites for businesses in Sri Lanka. We bring visual character and practical engineering together, giving people a clear way to understand your business and take the next step.',
    problem: { title: 'Make a first impression people can use.', text: 'A website needs to do more than look good. A café visitor wants the menu. A salon customer needs to understand the services. A business buyer wants to know what you offer and how to contact you. We shape the design around those journeys, with content and navigation that stay clear on a phone.' },
    capabilities: [
      { title: 'Custom design and responsive development', text: 'Brand-led layouts, readable typography and deliberate interaction design, adapted for small screens, keyboards and different motion preferences.' },
      { title: 'Business content and enquiry journeys', text: 'Service pages, project collections, menus and enquiry forms arranged around the information your visitors need. Content and editing requirements are agreed as part of the scope.' },
      { title: 'Motion with a purpose', text: 'Interactive visuals and Three.js experiences where they help tell the story. Essential information remains accessible while richer experiences load.' },
    ],
    useCases: ['Business and service websites for SMEs', 'Restaurant, café and salon experiences', 'Startup launches and product introductions'],
    approach: 'Our website work uses TypeScript, React and Next.js. We consider rendering, semantic content, image delivery and technical SEO alongside the visual direction. Hosting, content management and any booking or payment integration depend on the brief; a booking interface demonstration is not a live reservation system.',
    preparation: 'Share your existing website, brand material, important services, available content and the action you want visitors to take. Tell us who will update the site after launch and which existing tools it needs to connect to.',
    process: ['Map the audience, essential pages and enquiry journey.', 'Explore the visual direction and prototype the important interactions.', 'Build, review content and test the agreed journeys across devices.', 'Prepare launch and handover; agree any ongoing care separately.'],
    projectIds: ['ember', 'noir', 'nova'], related: ['ecommerce-development', 'seo-performance'],
  },
  {
    slug: 'ecommerce-development', name: 'E-commerce development', title: 'E-commerce Website Development in Sri Lanka',
    description: 'Plan a custom online store with ASL in Sri Lanka. E-commerce design and development around your catalogue, buying journey and order workflow.',
    headline: 'Give your products a place to belong.',
    intro: 'We build e-commerce experiences around your products and the people buying them. For Sri Lankan retailers and growing brands, that starts with a clear catalogue, useful product information and a considered journey from browsing to ordering.',
    problem: { title: 'Turn a product collection into a buying journey.', text: 'An online store connects more than a shopping bag and a checkout screen. Customers need to understand the product, availability, delivery and the next step. Your team needs a practical way to maintain the catalogue and handle orders. These decisions shape the store before visual development begins.' },
    capabilities: [
      { title: 'Product discovery', text: 'Catalogue structure, product detail layouts and filtering suited to the collection. We work through variants, images and product information so customers can compare the right details.' },
      { title: 'Cart and checkout experience', text: 'A coherent buying flow with clear totals, customer details and feedback when something needs attention. Payment methods and checkout integrations are selected during scoping.' },
      { title: 'Connected store operations', text: 'Plan how orders, stock and customer communications move between the storefront and your existing tools. Integration scope depends on available APIs and provider requirements.' },
    ],
    useCases: ['Retail brands bringing a catalogue online', 'Food businesses exploring an ordering storefront', 'SMEs replacing fragmented product enquiries with a structured store'],
    approach: 'We use custom web development to connect the brand experience with the store workflow. Payment provider eligibility, currencies, delivery regions, transaction fees and refund processes need confirmation before implementation. A concept shopping bag demonstrates an interface; it does not demonstrate a working payment integration or real orders.',
    preparation: 'Bring a sample product catalogue, variant and stock rules, delivery areas and intended payment methods. Include any existing stock or order system. We can then separate the essential launch scope from features that can follow later.',
    process: ['Define catalogue, delivery, payment and order requirements.', 'Design product discovery and the complete purchase journey.', 'Build and test agreed integrations, including failure and cancellation paths.', 'Prepare catalogue entry, operating guidance and launch checks.'],
    projectIds: ['burger'], related: ['website-development', 'custom-software', 'ai-automation'],
  },
  {
    slug: 'mobile-app-development', name: 'Mobile app development', title: 'Mobile App Development in Sri Lanka',
    description: 'ASL develops purposeful Flutter mobile apps for businesses in Sri Lanka. Shape your customer experience, core workflows and connected product.',
    headline: 'Your idea. In people’s hands.',
    intro: 'ASL builds Flutter mobile applications for businesses and startups in Sri Lanka. We focus on the task people return to, then shape the screens, interactions and connected services that make it useful.',
    problem: { title: 'Start with a reason to open the app.', text: 'A mobile app makes sense when customers or staff need to complete a recurring task, access a service or carry a workflow with them. If people only need to read information or make an occasional enquiry, a responsive website may be the better starting point. We help define the core journey before adding features.' },
    capabilities: [
      { title: 'Flutter product development', text: 'A shared application foundation with layouts and interactions considered for mobile use. Target devices and platform-specific behavior are confirmed during the brief.' },
      { title: 'Focused journeys and prototypes', text: 'Map navigation, forms, account flows and feedback states before development. A focused first version makes the important task easier to review and test.' },
      { title: 'Backend and tool connections', text: 'Connect the app to agreed APIs and business systems. Authentication, notifications, device features and offline requirements need individual scoping and testing.' },
    ],
    useCases: ['Startup product concepts with a defined first release', 'Repeat customer service and booking journeys', 'Mobile workflows for teams away from a desk'],
    approach: 'Flutter is represented in our existing service offering. We plan data flow, loading and error states alongside interface design. The app and any supporting platform have separate operational needs. App store accounts, review requirements, privacy information and third-party subscriptions are agreed before release; approval dates cannot be guaranteed.',
    preparation: 'Describe the main task, intended users and target platforms. Share existing APIs, account requirements and any device features you need. Examples of the workflow are more useful than a long feature wishlist.',
    process: ['Choose the core task and define the first release.', 'Prototype the screens and review the complete user journey.', 'Develop the Flutter app and test agreed device and API behavior.', 'Prepare release material and handover around the chosen platforms.'],
    projectIds: [], related: ['custom-software', 'website-development'],
  },
  {
    slug: 'ai-automation', name: 'AI agents & automation', title: 'AI Automation Services in Sri Lanka',
    description: 'Purpose-built AI agents and workflow automation by ASL in Sri Lanka. Connect business tools, support customer enquiries and reduce repetitive work.',
    headline: 'Make room for better work.',
    intro: 'We build AI agents and connected workflows for businesses in Sri Lanka. Start with a specific repetitive task, define what a useful result looks like, and keep people in control of the decisions that matter.',
    problem: { title: 'Connect the work between your tools.', text: 'An enquiry arrives in one place, details get copied into another, and the team has to work out what happens next. Automation can connect those steps. AI can help interpret a request or draft an answer, but it needs clear boundaries, appropriate information and a route back to a person when the answer is uncertain.' },
    capabilities: [
      { title: 'Enquiry assistants and AI chatbots', text: 'Explore assistants that organize incoming requests or help answer questions using approved business information. The channels, source material and handoff behavior are defined for each project.' },
      { title: 'Business workflow automation', text: 'Connect agreed forms, workspaces and APIs to move information through a repeatable process. Start with one workflow that can be tested from input to completion.' },
      { title: 'Drafting with human review', text: 'Turn notes or enquiries into structured drafts for a team to check. Approval steps, exception handling and who can trigger actions are part of the design.' },
    ],
    useCases: ['Preparing structured briefs from customer enquiries', 'Product assistance using an approved catalogue', 'Drafting team tasks from meeting notes'],
    approach: 'Our homepage workflow study illustrates these use cases with scripted examples; it has no live AI connection. A production implementation needs agreed integrations, permission boundaries, appropriate data access and testing against representative requests. Model usage costs, reliability limits and ongoing maintenance belong in the scope, not in an assumed outcome.',
    preparation: 'Share one repeated workflow, the tools involved and anonymized examples of inputs and expected outputs. Identify actions that always require human approval and any information the system must not receive.',
    process: ['Map the current workflow and define a measurable task outcome.', 'Agree sources, permissions, review steps and exception paths.', 'Build a focused integration and test representative requests.', 'Review behavior with your team and plan ongoing adjustments.'],
    projectIds: [], related: ['custom-software', 'ecommerce-development'],
  },
  {
    slug: 'custom-software', name: 'Custom software', title: 'Custom Software Development in Sri Lanka',
    description: 'ASL builds custom software and business platforms in Sri Lanka. Shape internal tools, connected workflows and API integrations around your team.',
    headline: 'Software that follows your way of working.',
    intro: 'ASL develops custom platforms for businesses in Sri Lanka. When a standard tool leaves your team working around its limits, we help turn the actual process into an interface and a connected system.',
    problem: { title: 'Give a complicated process a clear shape.', text: 'Spreadsheets and disconnected tools can be useful until the same information has to be entered repeatedly or a task depends on one person knowing what comes next. Custom software starts by understanding the people, information and decisions involved. The first version should solve a defined problem that your team can recognize.' },
    capabilities: [
      { title: 'Business platforms and internal tools', text: 'Interfaces for the workflows your team needs to manage. Roles, records, approval steps and reporting requirements are established through the project brief.' },
      { title: 'API integrations', text: 'Connect the platform with tools you already use, where those systems provide suitable access. We define what happens when information is missing or a third-party service is unavailable.' },
      { title: 'Product interfaces', text: 'Purposeful web interfaces that make complex tasks easier to follow. Prototypes help the people doing the work review the process before it becomes working software.' },
    ],
    useCases: ['A focused internal workflow replacing repeated data entry', 'Customer or team portals with defined access needs', 'A startup platform connecting a specific service and audience'],
    approach: 'We combine interface design with custom development and integrations. Technology choices follow the data, users and operating requirements. Existing data migration, permissions, backup responsibilities and ongoing hosting need an agreed scope. We do not assume a complete enterprise system is the right first release for every business.',
    preparation: 'Bring a walkthrough of the current process, sample records without sensitive data and the tools involved. Identify the people using the platform, who approves changes and which problem the first release needs to solve.',
    process: ['Map the process, users and data boundaries.', 'Prototype the workflow and define a practical release scope.', 'Build the platform and test its agreed integrations and access rules.', 'Prepare rollout and handover, with support responsibilities agreed.'],
    projectIds: [], related: ['mobile-app-development', 'ai-automation'],
  },
  {
    slug: 'seo-performance', name: 'Technical SEO & performance', title: 'Technical SEO & Performance Services in Sri Lanka',
    description: 'Technical SEO and website performance services from ASL in Sri Lanka. Improve crawlability, page structure and loading with evidence-led engineering.',
    headline: 'A stronger digital foundation.',
    intro: 'ASL helps businesses in Sri Lanka improve the technical foundations of their websites. We connect search visibility, useful content and loading performance with the experience your visitors actually need.',
    problem: { title: 'Make the website easier to find and use.', text: 'A visually strong website can still have unclear page titles, missing canonical URLs, inaccessible navigation or a slow first visit. Technical SEO identifies the barriers that prevent search engines and people from understanding the site. Performance work then examines the resources and interactions that make the experience feel slow.' },
    capabilities: [
      { title: 'Crawlability and page structure', text: 'Review rendering, public routes, internal links, metadata, canonical URLs, robots directives and sitemaps. Fix technical gaps around the site’s real content and service architecture.' },
      { title: 'Loading and interaction performance', text: 'Inspect images, fonts, JavaScript and animation work. Use browser and lab measurements to prioritize improvements while preserving the visual experience.' },
      { title: 'Measurement and ongoing care', text: 'Plan search and landing-page measurement around the enquiries that matter. Account access, analytics consent and ongoing reporting arrangements are agreed before configuration.' },
    ],
    useCases: ['An existing business website with weak search foundations', 'An interactive website that needs a loading and responsiveness review', 'A redesign that needs to preserve public URLs and search visibility'],
    approach: 'We distinguish lab measurements from real-user Core Web Vitals. A Lighthouse result can help diagnose a page; it cannot establish a field pass or guarantee rankings. Search Console data, where access is available, helps connect technical work with actual queries and landing pages. Content, competition and the wider business proposition also affect discovery.',
    preparation: 'Share the production URL, known problems and the pages that matter most. If available, include access to Search Console and existing measurement reports. Tell us which interactions and design elements need to be preserved.',
    process: ['Audit live responses, rendering and the important visitor journeys.', 'Prioritize fixes using reproducible evidence and business relevance.', 'Implement improvements and compare results under consistent conditions.', 'Review indexing and real enquiries over time without ranking guarantees.'],
    projectIds: [], related: ['website-development', 'ecommerce-development'],
  },
];

export const servicePath = (slug: string) => `/services/${slug}`;
export const findService = (slug: string) => services.find(service => service.slug === slug);
// Actual editorial update date; change only when public content materially changes.
export const contentUpdated = '2026-10-12';
