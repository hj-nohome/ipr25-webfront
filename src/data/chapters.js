// One entry per chapter, read by chapter.js to fill in chapter.html#chapter-N.
// Each intro's first paragraph is the chapter's opening text from the report's
// Key Highlights page. `shortName` labels the Explore button; `background`
// replaces the site's video loop behind the page; `image` is the picture in
// the right-hand column.
import chapter1Image from '../../images/chapter1-cover-480.jpg'
import chapter2Image from '../../images/chapter2-cover-480.jpg'
import chapter3Image from '../../images/chapter3-cover-480.jpg'
import chapter4Image from '../../images/chapter4-cover-480.jpg'
import chapter5Image from '../../images/chapter5-cover-480.jpg'
import chapter6Image from '../../images/chapter6-cover-480.jpg'
import chapter7Image from '../../images/chapter7-cover-480.jpg'
import chapter8Image from '../../images/chapter8-cover-480.jpg'
import chapter1Background from '../../images/chapter1-highlight-bg.jpg'
import chapter2Background from '../../images/chapter2-highlight-bg.jpg'
import chapter3Background from '../../images/chapter3-highlight-bg.jpg'
import chapter4Background from '../../images/chapter4-highlight-bg.jpg'
import chapter5Background from '../../images/chapter5-highlight-bg.jpg'
import chapter6Background from '../../images/chapter6-highlight-bg.jpg'
import chapter7Background from '../../images/chapter7-highlight-bg.jpg'
import chapter8Background from '../../images/chapter8-highlight-bg.jpg'

export const chapters = [
  {
    number: 1,
    name: 'Licensing',
    shortName: 'Licensing',
    image: chapter1Image,
    background: chapter1Background,
    intro: [
      'This chapter presents Malaysia\'s communications and multimedia licensing landscape in 2025. It covers the growth of Individual and Class Licences, licensing activity and renewals, compliance with licence conditions, cloud service provision and the ownership structure of Individual Licensees.',
      'Malaysia\'s technology-neutral licensing framework continues to support participation and investment across network infrastructure, services, applications and content as the industry evolves alongside 5G, cloud computing, artificial intelligence and the Internet of Things.',
    ],
  },
  {
    number: 2,
    name: 'Economic Performance of the C&M Industry',
    shortName: 'Industry Performance',
    image: chapter2Image,
    background: chapter2Background,
    intro: [
      'This chapter examines the economic performance of Malaysia\'s communications and multimedia industry across telecommunications, broadcasting, and postal and courier services. It highlights market capitalisation, industry revenue, capital expenditure, average revenue per user and the performance of communications and multimedia companies listed on the ACE Market.',
      'In 2025, the industry demonstrated resilience amid evolving market conditions, supported by strong demand for broadband, mobile connectivity, enterprise solutions and digital infrastructure.',
    ],
  },
  {
    number: 3,
    name: 'Services and Connectivity',
    shortName: 'Connectivity',
    image: chapter3Image,
    background: chapter3Background,
    intro: [
      'This chapter presents the state of connectivity in Malaysia, covering fixed broadband, mobile broadband, mobile cellular services, satellite broadband and 5G development. It also highlights the continued progress of JENDELA in strengthening high-speed broadband infrastructure and widening access to reliable digital connectivity nationwide.',
      "Malaysia's connectivity landscape advanced further in 2025 through higher subscriptions, wider network coverage and continued public-private collaboration.",
    ],
  },
  {
    number: 4,
    name: 'Content Services',
    shortName: 'Content Services',
    image: chapter4Image,
    background: chapter4Background,
    intro: [
      "This chapter explores the changing broadcasting and content landscape in Malaysia as audiences move between television, radio, streaming services, mobile applications and social platforms. It highlights developments in audience behaviour, local content, digital distribution, advertising and the National Broadcasting Policy.",
      "As media consumption becomes increasingly multi-platform, broadcasters are expanding their digital presence, strengthening audience engagement and developing new approaches to content monetisation.",
    ],
  },
  {
    number: 5,
    name: 'Online and Community Services',
    shortName: 'Online and Community Services',
    image: chapter5Image,
    background: chapter5Background,
    intro: [
      "This chapter highlights Malaysia's online and community services ecosystem, focusing on digital inclusion, community empowerment, e-commerce, cashless adoption, online safety and trusted digital transactions.",
      'Through NADI, Public Key Infrastructure and wider digital participation, communities across Malaysia gained greater access to connectivity, digital learning, entrepreneurship support and secure online services.',
    ],
  },
  {
    number: 6,
    name: 'Postal and Courier',
    shortName: 'Postal and Courier',
    image: chapter6Image,
    background: chapter6Background,
    intro: [
      'This chapter reviews the performance and transformation of Malaysia\'s postal and courier sector in 2025. It covers postal and courier traffic, infrastructure expansion, technology adoption, sustainability initiatives and the conclusion of the five-year Pelan Accelerator Kurier Negara.',
      "Driven by e-commerce and logistics demand, courier traffic continued to expand while service providers strengthened their networks, adopted smarter operational solutions and widened access to delivery services nationwide.",
    ],
  },
  {
    number: 7,
    name: 'Quality of Services',
    shortName: 'Quality of Services',
    image: chapter7Image,
    background: chapter7Background,
    intro: [
      "This chapter examines service quality, consumer protection and regulatory governance across Malaysia's communications and multimedia ecosystem. It covers complaint management, consumer safeguards, network and service quality, market and content regulation, technical standards and the role of industry forums in strengthening accountability.",
      'In 2025, service quality evolved beyond network performance to encompass consumer redress, online safety, platform responsiveness and trusted digital services.',
    ],
  },
  {
    number: 8,
    name: 'Outlook',
    shortName: 'The Industry Outlook',
    image: chapter8Image,
    background: chapter8Background,
    intro: [
      "This chapter looks ahead to the technologies, market shifts and new opportunities expected to shape Malaysia's communications and multimedia industry. It explores the future of telecommunications, cybersecurity, cloud and data centres, AI-enabled services, broadcasting, digital content, and postal and courier services.",
      'Malaysia\'s next phase of digital growth will be driven by high-capacity connectivity, wider cloud adoption, trusted AI, resilient digital infrastructure and an increasingly integrated multi-platform content ecosystem.',
    ],
  },
]
