// Key Highlights 2025 on chapter.html, keyed by chapter number and drawn by
// src/highlights.js. `layout` picks the design; the other keys are that
// layout's data. Chapters missing here hide the Key Highlights heading;
// `label` replaces its text.
//
// breakdown: cards of a total and the items it's made of, each with its
// `compareYear` value as `previous`.
//
// Headline values count up from 0: a figure's `value`, 'figures' items,
// stack `value` parts, banner stats and breakdown totals. Other numbers
// stay still.
//
// grid: `blocks` in two columns (one when narrow), each by its `type`.
// `variant: 'accent'` shows values in the chapter colour. `changeStyle`
// shows changes as 'badge' ("↑1.5%" by the value; the default), 'inline'
// ("+0.6% from 2024"; the accent default) or 'arrow' ("↓9.1%" over the
// previous value).
// - figure, every key optional, in this order: `label` (small caps, with
//   `sublabel`) or `title`, `intro`, `photo`, the `value` with `caption`
//   and its change (from `previous`, or `change` in % if set, with
//   `previousLabel` to word the previous value), then `description`,
//   `ratio`, `itemsLabel`, `items` (beside `icon` if set) and `source`.
//   `lists` replaces itemsLabel/items/itemStyle/icon for several lists,
//   each { label, style, icon, columns, items }.
//   Items take the same value keys, or `text` for one that isn't a
//   number, plus `heading` (above the value), `image` with `imageAlt`
//   (and `reveal` to fade it in on scroll), and `wide` (all columns).
//   `itemStyle` is 'list' (default), 'cards',
//   'stats', 'figures', 'bullets', 'pairs' or 'ranked'; `columns` sets
//   at most how many columns 'figures' uses; 'icons' (an image over each
//   label) and 'numbered' also work in stacks. `neutralValues` keeps the
//   block's numbers in the text colour. **bold** works in text.
// - stack: `title`, then `parts` top to bottom, each by its key: `value`
//   (with unit keys and a `label` under it), `heading`, `text` (`strong`
//   or `large`), `note` (italic), `image` (at its own size, or `size:
//   'logo'` for up to 100px tall; `alt`), `list` (an item style, or
//   'donut' for a Chart.js doughnut; donut items take `color`)
//   or `columns` (lists of parts, side by side). Items can add a `note`.
// - divider: a full-width rule between rows.
// - shares: `items` of `label`, `share` (%, the bar) and `value`.
// - banner: dark, full width; `label`, `source`, `stats` of `value` and
//   `text` (`inline` puts the text beside the number).
// - statement: full width; `label` beside `text`.
// - notes: full width; `items` of text.
// `unit` (a block's, inherited by its items) is 'count' (the default),
// 'percent', 'million', 'billion', 'mbps' or 'rmBillion', with `decimals` to
// override its own; see units in src/highlights.js. `tone` ('plain',
// 'tint', 'card', 'outline', 'dark') and `wide` override a type's defaults.
import broadbandIcon from '../../images/chapter3-highlights-broadband.png'
import jendelaIcon from '../../images/chapter3-highlights-Jendela.png'
import mobileIcon from '../../images/chapter3-highlights-mobile.png'
import fiveGIcon from '../../images/chapter3-highlights-5G_MY.png'
import freeToAirPhoto from '../../images/chapter4-highlights-F2A_TV.png'
import radioPhoto from '../../images/chapter4-highlights-Radio_broadcast.png'
import payTvPhoto from '../../images/chapter4-highlights-Pay_TV.png'
import adexPhoto from '../../images/chapter4-highlights-Ad_expenditure.png'
import marketplaceLogos from '../../images/chapter5-highlight-Top_3_marketplace_logos.png'
import mersLogo from '../../images/chapter7-highlights-Original_MERS_999_logo.png'
import voiceIcon from '../../images/chapter7-highlights-voice_icon.svg'
import textIcon from '../../images/chapter7-highlights-text-icon.svg'
import imagesIcon from '../../images/chapter7-highlights-images_icon.svg'
import videoIcon from '../../images/chapter7-highlights-video_icon.svg'
import amlIcon from '../../images/chapter7-highlights-AML_icon.svg'
import onlineSafetyIcon from '../../images/chapter7-highlights-online_safety_icon.svg'
import postalIcon from '../../images/chapter7-highlights-postal_services_icon.svg'
import technicalStandardsIcon from '../../images/chapter7-highlights-original_technical_standards_icon.svg'

export const highlights = {
  1: {
    layout: 'breakdown',
    compareYear: 2024,
    groups: [
      {
        title: 'Individual Licences',
        value: 485,
        previous: 480,
        items: [
          { label: 'NFP (I)', description: 'Network Facilities Provider', value: 269, previous: 265 },
          { label: 'NSP (I)', description: 'Network Service Provider', value: 181, previous: 178 },
          { label: 'CASP (I)', description: 'Content Applications Service Provider', value: 35, previous: 37 },
        ],
      },
      {
        title: 'Class Licences',
        value: 593,
        previous: 586,
        items: [
          { label: 'NFP (C)', description: 'Network Facilities Provider', value: 19, previous: 18 },
          { label: 'NSP (C)', description: 'Network Service Provider', value: 23, previous: 18 },
          { label: 'ASP (C)', description: 'Application Service Provider', value: 539, previous: 536 },
          { label: 'CASP (C)', description: 'Content Applications Service Provider', value: 12, previous: 14 },
        ],
      },
    ],
  },
  2: {
    layout: 'grid',
    compareYear: 2024,
    blocks: [
      {
        type: 'figure',
        tone: 'outline',
        label: 'Market Capitalisation',
        unit: 'rmBillion',
        value: 110.63,
        description: "Representing **5.4%** of Bursa Malaysia's Total Market Capitalisation of **RM2,064.41 billion**",
        source: 'Bloomberg',
      },
      {
        type: 'shares',
        label: 'Sector Breakdown',
        unit: 'rmBillion',
        items: [
          { label: 'Telecommunications Sector', share: 98.2, value: 108.62 },
          { label: 'Broadcasting Sector', share: 1.0, value: 1.14 },
          { label: 'Postal & Courier Sector', share: 0.8, value: 0.87 },
        ],
      },
      {
        type: 'figure',
        tone: 'outline',
        label: 'Revenue',
        unit: 'rmBillion',
        value: 49.45,
        previous: 48.72,
        items: [
          { label: 'Telecommunications Sector', value: 43.56, previous: 42.55 },
          { label: 'Broadcasting Sector', value: 3.63, previous: 3.9 },
          { label: 'Postal & Courier Sector', value: 2.26, previous: 2.27 },
        ],
        source: 'Industry',
      },
      {
        type: 'figure',
        tone: 'tint',
        label: 'Total Capital Expenditure',
        sublabel: '(Telecommunications Sector)',
        unit: 'rmBillion',
        value: 4.84,
        previous: 4.95,
        ratio: { label: 'Capex-to-Revenue', value: 12.9, previous: 13.4 },
        itemStyle: 'cards',
        items: [
          {
            label: 'Mobile Service Providers',
            value: 2.56,
            previous: 3.04,
            ratio: { label: 'Capex-to-Revenue', value: 10.8, previous: 13.1 },
          },
          {
            label: 'Fixed Service Providers',
            value: 2.28,
            previous: 1.91,
            ratio: { label: 'Capex-to-Revenue', value: 16.4, previous: 13.9 },
          },
        ],
      },
      {
        type: 'banner',
        label: 'ACE Market',
        source: 'Bursa Malaysia, Industry, MCMC',
        stats: [
          { value: 7, text: 'ACE Market-listed companies which are licensees under the CMA 1998', inline: true },
          { value: 2.9, unit: 'percent', text: 'of total ACE listings' },
        ],
      },
      {
        type: 'notes',
        items: [
          'Totals may not add up due to rounding',
          'The revenue figure comprises service and non-service revenue',
        ],
      },
    ],
  },
  3: {
    layout: 'grid',
    variant: 'accent',
    compareYear: 2024,
    blocks: [
      {
        type: 'figure',
        tone: 'tint',
        label: 'Total Broadband Subscriptions',
        unit: 'million',
        value: 49.91,
        change: 0.6,
        icon: broadbandIcon,
        itemStyle: 'stats',
        items: [
          { label: 'Mobile Broadband Subscriptions', value: 44.87 },
          { label: 'Fixed Broadband Subscriptions', value: 5.04 },
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        intro: 'JENDELA surpassed its fibre target while continuing to strengthen nationwide mobile broadband coverage and speeds.',
        icon: jendelaIcon,
        itemStyle: 'stats',
        items: [
          { label: 'Premises Passed with Fibre', value: 9.81, unit: 'million' },
          { label: '4G LTE Coverage in Populated Areas', value: 99.71, unit: 'percent', decimals: 2 },
          { label: 'Median Mobile Broadband Speed', value: 143.7, unit: 'mbps' },
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        label: 'Mobile Cellular Subscriptions',
        unit: 'million',
        value: 49.79,
        change: 0.3,
        icon: mobileIcon,
        itemStyle: 'stats',
        items: [
          { label: 'Prepaid Subscriptions', value: 32.94 },
          { label: 'Postpaid Subscriptions', value: 16.85 },
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        label: '5G Subscriptions',
        unit: 'million',
        decimals: 1,
        value: 29.0,
        previous: 18.2,
        description: 'Penetration rate of 84.6 per 100 inhabitants',
        itemsLabel: 'Coverage of Populated Areas (CoPA)',
        icon: fiveGIcon,
        itemStyle: 'bullets',
        items: [
          { label: 'Digital Nasional Berhad', value: 82.4, unit: 'percent' },
          { label: 'U Mobile', value: 67.8, unit: 'percent' },
        ],
      },
    ],
  },
  4: {
    layout: 'grid',
    variant: 'accent',
    blocks: [
      {
        type: 'figure',
        tone: 'tint',
        title: 'Free-to-Air Television',
        photo: freeToAirPhoto,
        unit: 'percent',
        value: 99.5,
        caption: 'Population Coverage',
        description: '30 Television and Radio Channels on MYTV Platform',
      },
      {
        type: 'figure',
        tone: 'card',
        title: 'Radio Broadcasting',
        photo: radioPhoto,
        unit: 'million',
        decimals: 1,
        value: 21.9,
        caption: 'Weekly Radio Listeners',
        itemStyle: 'figures',
        items: [{ label: 'Average Listening Time per Week', text: '12h 47m' }],
      },
      {
        type: 'figure',
        tone: 'tint',
        title: 'Pay-TV',
        photo: payTvPhoto,
        unit: 'percent',
        value: 62.9,
        caption: 'Pay-TV Penetration Rate',
        itemsLabel: 'Market Share',
        itemStyle: 'pairs',
        items: [
          { label: 'Astro', value: 84, decimals: 0 },
          { label: 'Unifi TV', value: 16, decimals: 0 },
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        title: 'Advertising Expenditure',
        photo: adexPhoto,
        description:
          'Digital media remains the primary driver of advertising market growth, reflecting the continued shift of adex towards digital platforms.',
      },
      {
        type: 'statement',
        label: 'National Broadcasting Policy',
        text: "The National Broadcasting Policy progressed in 2025 to strengthen the competitiveness, sustainability and future readiness of Malaysia's broadcasting industry.",
      },
    ],
  },
  5: {
    layout: 'grid',
    variant: 'accent',
    blocks: [
      {
        type: 'figure',
        tone: 'card',
        wide: true,
        title: 'National Information Dissemination Centre (NADI)',
        unit: 'million',
        lists: [
          {
            style: 'figures',
            columns: 2,
            items: [
              { value: 1098, unit: 'count', label: 'NADI centres Nationwide' },
              { value: 1.9, label: 'Registered NADI Users Nationwide' },
              { value: 1.23, label: 'Participations Under NADI SMART Services' },
            ],
          },
        ],
        source: 'MCMC',
      },
      {
        type: 'figure',
        tone: 'card',
        wide: true,
        title: 'E-Commerce',
        lists: [
          {
            style: 'figures',
            columns: 2,
            items: [
              { heading: 'e-commerce Revenue:', value: 937.5, unit: 'rmBillion', decimals: 1 },
              {
                heading: 'Top 3 Marketplaces:',
                image: marketplaceLogos,
                imageAlt: 'Shopee, TikTok Shop and Lazada',
                reveal: true,
              },
              {
                heading: 'Most purchased items online:',
                label: 'Fashion, Home Care Products and Groceries',
                wide: true,
              },
            ],
          },
        ],
      },
      {
        type: 'figure',
        tone: 'tint',
        wide: true,
        title: 'Public Key Infrastructure',
        unit: 'million',
        decimals: 1,
        lists: [
          {
            style: 'figures',
            columns: 2,
            items: [
              { value: 34.6, label: 'Digital Certificates Issued' },
              { value: 70.4, unit: 'percent', label: 'local government sector as largest contributor' },
              { value: 23.2, label: 'Digital certificates issued by Pos Digicert Sdn Bhd' },
            ],
          },
        ],
        source: 'MCMC, DOSM, IPSOS Malaysia',
      },
    ],
  },
  6: {
    layout: 'grid',
    variant: 'accent',
    changeStyle: 'arrow',
    compareYear: 2024,
    blocks: [
      {
        type: 'figure',
        tone: 'card',
        title: 'Postal Services',
        intro: 'Maintaining universal service and nationwide access',
        lists: [
          {
            style: 'figures',
            items: [
              { heading: 'Postal Traffic in 2025', value: 279.36, unit: 'million', previous: 307.16 },
              { heading: 'Postal Infrastructure Nationwide', value: 1159 },
              { heading: 'Employees in Postal Services Sector', value: 15039 },
            ],
          },
          {
            label: 'Top 3 Postal Traffic in 2025:',
            style: 'ranked',
            items: [
              { label: 'Letter Post Items', value: 87.8, unit: 'percent' },
              { label: 'Registered Items', value: 7.1, unit: 'percent' },
              { label: 'Advertising Items', value: 1.4, unit: 'percent' },
            ],
          },
        ],
        source: 'Pos Malaysia',
      },
      {
        type: 'figure',
        tone: 'tint',
        neutralValues: true,
        title: 'Courier Services',
        intro: 'Strong growth driven by e-commerce and logistics expansion',
        lists: [
          {
            style: 'figures',
            items: [
              // Change from the unrounded totals (1,575.25 and 1,263.32 million).
              { heading: 'Courier Traffic in 2025', value: 1.58, unit: 'billion', previous: 1.26, change: 24.7 },
              {
                heading: 'Courier Infrastructure Nationwide',
                value: 27626,
                previous: 15291,
                previousLabel: '15,291 facilities',
              },
              { heading: 'Employees in Courier Services Sector', value: 120256 },
              {
                heading: 'Packages and Parcels',
                value: 1.53,
                unit: 'billion',
                label: '97.2% of total courier traffic',
              },
            ],
          },
        ],
        source: 'MCMC',
      },
      {
        type: 'figure',
        tone: 'card',
        wide: true,
        neutralValues: true,
        title: 'Parcel per Capita',
        intro: 'Malaysia surpasses the PAKEJ target, reflecting strong demand and digital economy growth',
        lists: [
          {
            label: 'Parcels per Capita in 2025:',
            style: 'figures',
            columns: 3,
            items: [
              { value: 45.9, decimals: 1, label: 'Surpassing the PAKEJ target of 30 parcels per capita by 2025' },
              { value: 28592, label: 'Service points under Rangkaian PAKEJ nationwide' },
              { value: 511, label: 'NADI sites equipped with PUDO facilities' },
            ],
          },
        ],
      },
    ],
  },
  7: {
    layout: 'grid',
    variant: 'accent',
    blocks: [
      {
        type: 'stack',
        title: 'Consumer Protection and Complaint Management',
        parts: [
          { value: 71919, label: 'Consumer Complaints Received in 2025' },
          { heading: 'Breakdown by Service:' },
          {
            list: 'donut',
            items: [
              { label: 'Broadcasting', value: 1, color: '#cfd1e2' },
              { label: 'MCMC Subsidiary Matters', value: 1, color: '#9da0bb' },
              { label: 'Postal & Courier', value: 12, color: '#2f3787' },
              { label: 'Online Content', value: 40, color: '#5c609f' },
              { label: 'Telecommunications', value: 46, color: '#232963' },
            ],
          },
          { heading: 'Complaint Resolution Rate:' },
          {
            value: 96,
            unit: 'percent',
            decimals: 0,
            label: '69,070 complaints successfully resolved and closed as at 31 December 2025.',
          },
          { note: 'Supporting effective consumer redress and dispute resolution across the sector.' },
        ],
      },
      {
        type: 'stack',
        tone: 'tint',
        title: 'Next Generation Malaysian Emergency Response Service 999',
        parts: [
          { image: mersLogo, size: 'logo', alt: 'MERS 999 Emergency Response' },
          { text: 'Fully Operational Since' },
          { text: '16 November 2025', large: true },
          { heading: 'Key Features:' },
          {
            list: 'icons',
            items: [
              { label: 'Voice', image: voiceIcon },
              { label: 'Text', image: textIcon },
              { label: 'Images', image: imagesIcon },
              { label: 'Video', image: videoIcon },
              { label: 'AML', image: amlIcon, note: 'Advanced Mobile Location', wide: true },
            ],
          },
          {
            text: 'Enhancing emergency response through advanced digital communications and location-based services.',
          },
        ],
      },
      { type: 'divider' },
      {
        type: 'stack',
        title: 'Online Safety Act 2025',
        parts: [
          { image: onlineSafetyIcon },
          { text: 'Online Safety Act 2025', strong: true },
          { text: 'Effective: 1 January 2026' },
          { text: "Strengthening online safety and platform accountability in Malaysia's digital ecosystem." },
        ],
      },
      {
        type: 'stack',
        title: 'Code of Practice for Postal Services (CPPS)',
        parts: [
          { image: postalIcon },
          { text: 'Launched During Hari Kurier Negara 2025', strong: true },
          { text: "Malaysia's first industry-wide self-regulatory framework for the postal and courier sector." },
          { heading: 'Focus Area:' },
          {
            list: 'numbered',
            items: [
              { label: 'Service Standards' },
              { label: 'Consumer Protection' },
              { label: 'Complaint Handling' },
              { label: 'Industry Accountability' },
            ],
          },
        ],
      },
      {
        type: 'stack',
        wide: true,
        title: 'Technical Standards Development',
        parts: [
          {
            columns: [
              [{ image: technicalStandardsIcon }, { value: 11, label: '**New Technical Codes Registered in 2025**' }],
              [
                { heading: 'Covering Areas Such As:' },
                {
                  list: 'numbered',
                  items: [
                    { label: 'Internet of Things (IoT)' },
                    { label: 'Cybersecurity' },
                    { label: 'Digital Identity' },
                    { label: 'IPv6' },
                    { label: 'VoLTE' },
                    { label: 'C-V2X' },
                    { label: 'Fixed Network Facilities' },
                  ],
                },
              ],
            ],
          },
          { note: 'Supporting interoperability, technology innovation and industry readiness.' },
        ],
      },
      {
        type: 'stack',
        wide: true,
        title: 'Strengthening Industry Governance Through Co-Regulation',
        parts: [
          {
            text: 'CFM, CMCF, Postal Forum and MTSFB continued to support consumer protection, responsible content practices, industry self-regulation and technical standardisation through industry codes, stakeholder engagement and collaborative governance initiatives.',
          },
        ],
      },
    ],
  },
  // The report has no Key Highlights for the Outlook: its subtitle (p.192)
  // and the chapter's six outlook areas instead.
  8: {
    label: "What's Shaping the Outlook",
    layout: 'grid',
    blocks: [
      {
        type: 'figure',
        tone: 'tint',
        wide: true,
        label: 'Outlook',
        intro: 'Connectivity, cloud, AI, content and logistics are moving towards higher-value, technology-enabled and sustainable growth.',
      },
      {
        type: 'stack',
        title: 'Telecommunications',
        parts: [
          {
            text: 'A maturing market shifts growth towards higher data use, fibre uptake, 5G migration and enterprise services.',
          },
        ],
      },
      {
        type: 'stack',
        title: '5G and Network Evolution',
        parts: [
          {
            text: 'Users move away from 4G and 2G, with 5G-Advanced, private 5G networks and RedCap opening new use cases.',
          },
        ],
      },
      {
        type: 'stack',
        title: 'Cybersecurity and Digital Trust',
        parts: [
          {
            text: 'AI-enabled threats and post-quantum readiness raise the bar for governance, monitoring and cyber resilience.',
          },
        ],
      },
      {
        type: 'stack',
        title: 'Cloud, Data Centres and AI',
        parts: [
          {
            text: 'Sovereign cloud, edge computing and GPU-as-a-Service drive the next wave of infrastructure demand.',
          },
        ],
      },
      {
        type: 'stack',
        title: 'Broadcasting and Content',
        parts: [
          {
            text: 'A multi-platform mix of streaming, micro-dramas, AI-assisted production and digital advertising.',
          },
        ],
      },
      {
        type: 'stack',
        title: 'Postal and Courier',
        parts: [
          {
            text: 'Competition moves from parcel volume to efficiency, automation and greener last-mile delivery.',
          },
        ],
      },
    ],
  },
}
