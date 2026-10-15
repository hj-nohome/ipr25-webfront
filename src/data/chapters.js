// One entry per chapter, read by chapter.js to fill in chapter.html#chapter-N.
// Each intro's first paragraph is the chapter's opening text from the report's
// Key Highlights page. `shortName` labels the Explore button; `background`
// replaces the site's video loop behind the page; `image` is the picture in
// the right-hand column. `transition` picks how `background` is revealed
// over `image` (see chapter.js); circle lines unless set. `transitionMs`
// sets how long a circle-lines transition takes; its default otherwise.
// `reverse` swaps the two: the column starts on `background` and reveals
// `image`. `rationale` explains the choice of imagery, under the column.
// Any text can be a { en, ms } pair for the BM toggle (src/i18n.js);
// plain text shows in both languages.
import chapter1Image from '../../images/chapter1-cover-1400.webp'
import chapter2Image from '../../images/chapter2-cover-1400.webp'
import chapter3Image from '../../images/chapter3-cover-1400.webp'
import chapter4Image from '../../images/chapter4-cover-1400.webp'
import chapter5Image from '../../images/chapter5-cover-1400.webp'
import chapter6Image from '../../images/chapter6-cover-1400.webp'
import chapter7Image from '../../images/chapter7-cover-1400.webp'
import chapter8Image from '../../images/chapter8-cover-1400.webp'
import chapter1Background from '../../images/chapter1-highlight-bg.webp'
import chapter2Background from '../../images/chapter2-highlight-bg.webp'
import chapter3Background from '../../images/chapter3-highlight-bg.webp'
import chapter4Background from '../../images/chapter4-highlight-bg.webp'
import chapter5Background from '../../images/chapter5-highlight-bg.webp'
import chapter6Background from '../../images/chapter6-highlight-bg.webp'
import chapter7Background from '../../images/chapter7-highlight-bg.webp'
import chapter8Background from '../../images/chapter8-highlight-bg.webp'

export const chapters = [
  {
    number: 1,
    name: { en: 'Licensing', ms: 'Pelesenan' },
    shortName: { en: 'Licensing', ms: 'Pelesenan' },
    image: chapter1Image,
    background: chapter1Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: [
      'This chapter presents Malaysia\'s communications and multimedia licensing landscape in 2025. It covers the growth of Individual and Class Licences, licensing activity and renewals, compliance with licence conditions, cloud service provision and the ownership structure of Individual Licensees.',
      'Malaysia\'s technology-neutral licensing framework continues to support participation and investment across network infrastructure, services, applications and content as the industry evolves alongside 5G, cloud computing, artificial intelligence and the Internet of Things.',
    ],
    rationale: {
      title: 'The Foundation of Digital Connectivity',
      text: [
        'The image illustrates a high-capacity fibre optic network infrastructure, representing the core systems that support telecommunications services and digital connectivity. The arrangement of cables and network ports reflects the complexity, scale and reliability required to support Malaysia’s communications ecosystem.',
        'The visual was selected to symbolise the regulatory foundation that underpins the industry. Through licensing and oversight, MCMC enables the development of network infrastructure and service provision, ensuring that the communications and multimedia sector operates within a structured and trusted framework.',
      ],
    },
  },
  {
    number: 2,
    name: { en: 'Economic Performance of the C&M Industry', ms: 'Prestasi Ekonomi Industri K&M' },
    shortName: { en: 'Industry Performance', ms: 'Prestasi Industri' },
    image: chapter2Image,
    background: chapter2Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: [
      'This chapter examines the economic performance of Malaysia\'s communications and multimedia industry across telecommunications, broadcasting, and postal and courier services. It highlights market capitalisation, industry revenue, capital expenditure, average revenue per user and the performance of communications and multimedia companies listed on the ACE Market.',
      'In 2025, the industry demonstrated resilience amid evolving market conditions, supported by strong demand for broadband, mobile connectivity, enterprise solutions and digital infrastructure.',
    ],
    rationale: {
      title: 'Progress Through Connectivity',
      text: [
        "The image illustrates an elevated highway cutting through the lush rainforest of Rawang, symbolising Malaysia's economic progress achieved in harmony with its natural environment. The modern transport infrastructure reflects connectivity, mobility and sustainable development, highlighting the nation's commitment to balancing economic advancement with environmental stewardship.",
        "The visual was selected to represent the communications and multimedia industry's role as a key driver of economic growth, connecting businesses, communities and markets across the country. It complements the chapter's focus on industry performance, investment, market development and the sector's contribution to Malaysia's sustainable economic transformation.",
      ],
    },
  },
  {
    number: 3,
    // BM checked against the sources in src/data/ui-text.js.
    // draft: "Kesalinghubungan" confirmed by Gov portal; the title awaits the official edition
    name: { en: 'Services and Connectivity', ms: 'Perkhidmatan dan Kesalinghubungan' },
    shortName: { en: 'Connectivity', ms: 'Kesalinghubungan' }, // confirmed: Gov portal
    image: chapter3Image,
    background: chapter3Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: {
      en: [
        'This chapter presents the state of connectivity in Malaysia, covering fixed broadband, mobile broadband, mobile cellular services, satellite broadband and 5G development. It also highlights the continued progress of JENDELA in strengthening high-speed broadband infrastructure and widening access to reliable digital connectivity nationwide.',
        "Malaysia's connectivity landscape advanced further in 2025 through higher subscriptions, wider network coverage and continued public-private collaboration.",
      ],
      // draft
      ms: [
        'Bab ini membentangkan status kesalinghubungan di Malaysia, merangkumi jalur lebar talian tetap, jalur lebar mudah alih, perkhidmatan selular mudah alih, jalur lebar satelit dan pembangunan 5G. Bab ini turut mengetengahkan kemajuan berterusan JENDELA dalam memperkukuh infrastruktur jalur lebar berkelajuan tinggi dan memperluas akses kepada kesalinghubungan digital yang boleh diharap di seluruh negara.',
        'Landskap kesalinghubungan Malaysia terus maju pada tahun 2025 melalui peningkatan langganan, liputan rangkaian yang lebih meluas dan kerjasama awam-swasta yang berterusan.',
      ],
    },
    rationale: {
      title: { en: 'Extending the Nation’s Reach', ms: 'Memperluas Jangkauan Negara' }, // draft
      text: {
        en: [
          'The image illustrates a telecommunications tower silhouetted against a warm sunset, representing the extensive communications infrastructure that enables seamless connectivity across Malaysia. As a familiar feature throughout the country, telecommunications towers form the foundation of mobile and wireless services, ensuring that individuals, businesses and communities remain connected regardless of location.',
          "The visual was selected to symbolise the essential role of communications infrastructure in delivering reliable services and expanding nationwide connectivity. It complements the chapter's focus on service availability, network coverage and the continuous enhancement of communications services that support Malaysia's digital transformation and an increasingly connected society.",
        ],
        // draft
        ms: [
          'Imej ini memaparkan siluet menara telekomunikasi berlatarbelakangkan matahari terbenam, melambangkan infrastruktur komunikasi yang meluas yang membolehkan kesalinghubungan lancar di seluruh Malaysia. Sebagai pemandangan biasa di seluruh negara, menara telekomunikasi menjadi asas kepada perkhidmatan mudah alih dan tanpa wayar, memastikan individu, perniagaan dan komuniti kekal berhubung tanpa mengira lokasi.',
          'Visual ini dipilih bagi melambangkan peranan penting infrastruktur komunikasi dalam menyampaikan perkhidmatan yang boleh diharap dan memperluas kesalinghubungan di seluruh negara. Ia melengkapi fokus bab ini terhadap ketersediaan perkhidmatan, liputan rangkaian dan penambahbaikan berterusan perkhidmatan komunikasi yang menyokong transformasi digital Malaysia serta masyarakat yang semakin terhubung.',
        ],
      },
    },
  },
  {
    number: 4,
    name: { en: 'Content Services', ms: 'Perkhidmatan Kandungan' },
    shortName: { en: 'Content Services', ms: 'Perkhidmatan Kandungan' },
    image: chapter4Image,
    background: chapter4Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: [
      "This chapter explores the changing broadcasting and content landscape in Malaysia as audiences move between television, radio, streaming services, mobile applications and social platforms. It highlights developments in audience behaviour, local content, digital distribution, advertising and the National Broadcasting Policy.",
      "As media consumption becomes increasingly multi-platform, broadcasters are expanding their digital presence, strengthening audience engagement and developing new approaches to content monetisation.",
    ],
    rationale: {
      title: 'Powering the Content Ecosystem',
      text: [
        'The image presents an audio mixing console, representing the technical environment behind media production, broadcasting and content delivery. It reflects the systems and expertise required to create, manage and distribute content across different communication platforms.',
        'The visual was selected to symbolise the evolving content services ecosystem. As audiences increasingly access content across television, radio, streaming and digital platforms, MCMC continues to oversee a dynamic media landscape that supports access, relevance and industry development.',
      ],
    },
  },
  {
    number: 5,
    name: { en: 'Online and Community Services', ms: 'Perkhidmatan Dalam Talian dan Komuniti' },
    shortName: { en: 'Online and Community Services', ms: 'Perkhidmatan Dalam Talian dan Komuniti' },
    image: chapter5Image,
    background: chapter5Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: [
      "This chapter highlights Malaysia's online and community services ecosystem, focusing on digital inclusion, community empowerment, e-commerce, cashless adoption, online safety and trusted digital transactions.",
      'Through NADI, Public Key Infrastructure and wider digital participation, communities across Malaysia gained greater access to connectivity, digital learning, entrepreneurship support and secure online services.',
    ],
    rationale: {
      title: 'Empowering Participation in the Digital Space',
      text: [
        'The image captures a live digital interaction through a smartphone, representing the growing role of online platforms in communication, commerce and community participation. It reflects how digital services have become part of everyday life, enabling users to create, share, engage and transact online.',
        'The visual was selected to represent the rise of online community services in Malaysia. Through initiatives that support digital inclusion, access and responsible participation, MCMC helps create an environment where individuals and communities can benefit from the opportunities of the online ecosystem.',
      ],
    },
  },
  {
    number: 6,
    name: { en: 'Postal and Courier', ms: 'Pos dan Kurier' },
    shortName: { en: 'Postal and Courier', ms: 'Pos dan Kurier' },
    image: chapter6Image,
    background: chapter6Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: [
      'This chapter reviews the performance and transformation of Malaysia\'s postal and courier sector in 2025. It covers postal and courier traffic, infrastructure expansion, technology adoption, sustainability initiatives and the conclusion of the five-year Pelan Accelerator Kurier Negara.',
      "Driven by e-commerce and logistics demand, courier traffic continued to expand while service providers strengthened their networks, adopted smarter operational solutions and widened access to delivery services nationwide.",
    ],
    rationale: {
      title: 'Connecting Through Every Delivery',
      text: [
        'The image illustrates an unmanned aerial vehicle (drone) transporting a parcel, representing the future of postal and courier services driven by technological innovation. As logistics continues to evolve, autonomous delivery solutions have the potential to enhance delivery speed, improve operational efficiency and expand service accessibility, particularly in remote and hard-to-reach areas.',
        "The visual was selected to symbolise the industry's transformation towards smarter, technology-enabled logistics and future-ready delivery networks. It complements the chapter's focus on innovation, operational excellence and the continued evolution of postal and courier services in supporting Malaysia's growing digital economy.",
      ],
    },
  },
  {
    number: 7,
    name: { en: 'Quality of Services', ms: 'Kualiti Perkhidmatan' },
    shortName: { en: 'Quality of Services', ms: 'Kualiti Perkhidmatan' },
    image: chapter7Image,
    background: chapter7Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: [
      "This chapter examines service quality, consumer protection and regulatory governance across Malaysia's communications and multimedia ecosystem. It covers complaint management, consumer safeguards, network and service quality, market and content regulation, technical standards and the role of industry forums in strengthening accountability.",
      'In 2025, service quality evolved beyond network performance to encompass consumer redress, online safety, platform responsiveness and trusted digital services.',
    ],
    rationale: {
      title: 'Maintaining Reliable Service Standards',
      text: [
        "The image illustrates telecommunications technicians working on a communications tower, representing the continuous efforts required to build, maintain and enhance Malaysia's nationwide communications infrastructure. Set against a clear blue sky, the tower symbolises the extensive network coverage that has become a familiar feature across the country, supporting reliable connectivity for individuals, businesses and communities.",
        "The visual was selected to highlight the commitment to delivering high-quality, resilient and dependable communications services. It complements the chapter's focus on service quality, network performance, infrastructure maintenance and the ongoing efforts to meet the evolving expectations of consumers and industry.",
      ],
    },
  },
  {
    number: 8,
    name: { en: 'Outlook', ms: 'Tinjauan' },
    shortName: { en: 'The Industry Outlook', ms: 'Tinjauan Industri' },
    image: chapter8Image,
    background: chapter8Background,
    reverse: true,
    transition: 'circle-lines-smooth',
    intro: [
      "This chapter looks ahead to the technologies, market shifts and new opportunities expected to shape Malaysia's communications and multimedia industry. It explores the future of telecommunications, cybersecurity, cloud and data centres, AI-enabled services, broadcasting, digital content, and postal and courier services.",
      'Malaysia\'s next phase of digital growth will be driven by high-capacity connectivity, wider cloud adoption, trusted AI, resilient digital infrastructure and an increasingly integrated multi-platform content ecosystem.',
    ],
    rationale: {
      title: 'Advancing Towards a Connected Future',
      text: [
        "The image illustrates a modern architectural space viewed from below, where clean geometric lines converge towards the sky, symbolising vision, progress and the limitless possibilities of the future. The contemporary design reflects innovation, resilience and the forward momentum that continues to shape Malaysia's communications and multimedia landscape.",
        "The visual was selected to represent the industry's outlook as it embraces emerging technologies, digital transformation and evolving consumer needs. Its abstract composition conveys optimism and continuous advancement, complementing the chapter's focus on future trends, strategic opportunities and the long-term development of a connected and digitally empowered Malaysia.",
      ],
    },
  },
]
