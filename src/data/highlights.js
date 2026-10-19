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
// Any text can be a { en, ms } pair for the BM toggle (src/i18n.js);
// plain text shows in both languages.
import broadbandIcon from '../../images/chapter3-highlights-broadband.webp'
import jendelaIcon from '../../images/chapter3-highlights-Jendela.webp'
import mobileIcon from '../../images/chapter3-highlights-mobile.webp'
import fiveGIcon from '../../images/chapter3-highlights-5G_MY.webp'
import freeToAirPhoto from '../../images/chapter4-highlights-F2A_TV.webp'
import radioPhoto from '../../images/chapter4-highlights-Radio_broadcast.webp'
import payTvPhoto from '../../images/chapter4-highlights-Pay_TV.webp'
import adexPhoto from '../../images/chapter4-highlights-Ad_expenditure.webp'
import marketplaceLogos from '../../images/chapter5-highlight-Top_3_marketplace_logos.webp'
import mersLogo from '../../images/chapter7-highlights-Original_MERS_999_logo.webp'
import voiceIcon from '../../images/chapter7-highlights-voice_icon.svg'
import textIcon from '../../images/chapter7-highlights-text-icon.svg'
import imagesIcon from '../../images/chapter7-highlights-images_icon.svg'
import videoIcon from '../../images/chapter7-highlights-video_icon.svg'
import amlIcon from '../../images/chapter7-highlights-AML_icon.svg'
import onlineSafetyIcon from '../../images/chapter7-highlights-online_safety_icon.svg'
import postalIcon from '../../images/chapter7-highlights-postal_services_icon.svg'
import technicalStandardsIcon from '../../images/chapter7-highlights-original_technical_standards_icon.svg'

export const highlights = {
  // BM: draft throughout.
  1: {
    layout: 'breakdown',
    compareYear: 2024,
    groups: [
      {
        title: { en: 'Individual Licences', ms: 'Lesen Individu' },
        value: 485,
        previous: 480,
        items: [
          {
            label: 'NFP (I)',
            description: { en: 'Network Facilities Provider', ms: 'Pemberi Kemudahan Rangkaian' },
            value: 269,
            previous: 265,
          },
          {
            label: 'NSP (I)',
            description: { en: 'Network Service Provider', ms: 'Pemberi Perkhidmatan Rangkaian' },
            value: 181,
            previous: 178,
          },
          {
            label: 'CASP (I)',
            description: { en: 'Content Applications Service Provider', ms: 'Pemberi Perkhidmatan Aplikasi Kandungan' },
            value: 35,
            previous: 37,
          },
        ],
      },
      {
        title: { en: 'Class Licences', ms: 'Lesen Kelas' },
        value: 593,
        previous: 586,
        items: [
          {
            label: 'NFP (C)',
            description: { en: 'Network Facilities Provider', ms: 'Pemberi Kemudahan Rangkaian' },
            value: 19,
            previous: 18,
          },
          {
            label: 'NSP (C)',
            description: { en: 'Network Service Provider', ms: 'Pemberi Perkhidmatan Rangkaian' },
            value: 23,
            previous: 18,
          },
          {
            label: 'ASP (C)',
            description: { en: 'Application Service Provider', ms: 'Pemberi Perkhidmatan Aplikasi' },
            value: 539,
            previous: 536,
          },
          {
            label: 'CASP (C)',
            description: { en: 'Content Applications Service Provider', ms: 'Pemberi Perkhidmatan Aplikasi Kandungan' },
            value: 12,
            previous: 14,
          },
        ],
      },
    ],
  },
  // BM: draft unless marked.
  2: {
    layout: 'grid',
    compareYear: 2024,
    blocks: [
      {
        type: 'figure',
        tone: 'outline',
        label: { en: 'Market Capitalisation', ms: 'Permodalan Pasaran' }, // confirmed: Pocket Book
        unit: 'rmBillion',
        value: 110.63,
        description: {
          en: "Representing **5.4%** of Bursa Malaysia's Total Market Capitalisation of **RM2,064.41 billion**",
          ms: 'Mewakili **5.4%** daripada Jumlah Permodalan Pasaran Bursa Malaysia sebanyak **RM2,064.41 bilion**',
        },
        source: 'Bloomberg',
      },
      {
        type: 'shares',
        label: { en: 'Sector Breakdown', ms: 'Pecahan Mengikut Sektor' },
        unit: 'rmBillion',
        items: [
          { label: { en: 'Telecommunications Sector', ms: 'Sektor Telekomunikasi' }, share: 98.2, value: 108.62 },
          { label: { en: 'Broadcasting Sector', ms: 'Sektor Penyiaran' }, share: 1.0, value: 1.14 },
          { label: { en: 'Postal & Courier Sector', ms: 'Sektor Pos & Kurier' }, share: 0.8, value: 0.87 },
        ],
      },
      {
        type: 'figure',
        tone: 'outline',
        label: { en: 'Revenue', ms: 'Hasil' }, // confirmed: SKMM statement
        unit: 'rmBillion',
        value: 49.45,
        previous: 48.72,
        items: [
          { label: { en: 'Telecommunications Sector', ms: 'Sektor Telekomunikasi' }, value: 43.56, previous: 42.55 },
          { label: { en: 'Broadcasting Sector', ms: 'Sektor Penyiaran' }, value: 3.63, previous: 3.9 },
          { label: { en: 'Postal & Courier Sector', ms: 'Sektor Pos & Kurier' }, value: 2.26, previous: 2.27 },
        ],
        source: { en: 'Industry', ms: 'Industri' },
      },
      {
        type: 'figure',
        tone: 'tint',
        label: { en: 'Total Capital Expenditure', ms: 'Jumlah Perbelanjaan Modal' },
        sublabel: { en: '(Telecommunications Sector)', ms: '(Sektor Telekomunikasi)' },
        unit: 'rmBillion',
        value: 4.84,
        previous: 4.95,
        ratio: { label: { en: 'Capex-to-Revenue', ms: 'Nisbah Capex kepada Hasil' }, value: 12.9, previous: 13.4 },
        itemStyle: 'cards',
        items: [
          {
            label: { en: 'Mobile Service Providers', ms: 'Penyedia Perkhidmatan Mudah Alih' },
            value: 2.56,
            previous: 3.04,
            ratio: { label: { en: 'Capex-to-Revenue', ms: 'Nisbah Capex kepada Hasil' }, value: 10.8, previous: 13.1 },
          },
          {
            label: { en: 'Fixed Service Providers', ms: 'Penyedia Perkhidmatan Talian Tetap' },
            value: 2.28,
            previous: 1.91,
            ratio: { label: { en: 'Capex-to-Revenue', ms: 'Nisbah Capex kepada Hasil' }, value: 16.4, previous: 13.9 },
          },
        ],
      },
      {
        type: 'banner',
        label: { en: 'ACE Market', ms: 'Pasaran ACE' },
        source: { en: 'Bursa Malaysia, Industry, MCMC', ms: 'Bursa Malaysia, Industri, SKMM' },
        stats: [
          {
            value: 7,
            text: {
              en: 'ACE Market-listed companies which are licensees under the CMA 1998',
              ms: 'syarikat tersenarai di Pasaran ACE yang merupakan pemegang lesen di bawah AKM 1998',
            },
            inline: true,
          },
          { value: 2.9, unit: 'percent', text: { en: 'of total ACE listings', ms: 'daripada jumlah penyenaraian ACE' } },
        ],
      },
      {
        type: 'notes',
        items: [
          { en: 'Totals may not add up due to rounding', ms: 'Jumlah mungkin tidak sama disebabkan pembundaran' },
          {
            en: 'The revenue figure comprises service and non-service revenue',
            ms: 'Angka hasil merangkumi hasil perkhidmatan dan bukan perkhidmatan',
          },
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
        // BM checked against the sources in src/data/ui-text.js.
        label: { en: 'Total Broadband Subscriptions', ms: 'Jumlah Langganan Jalur Lebar' }, // confirmed: Pocket Book
        unit: 'million',
        value: 49.91,
        change: 0.6,
        icon: broadbandIcon,
        itemStyle: 'stats',
        items: [
          // confirmed: Pocket Book
          { label: { en: 'Mobile Broadband Subscriptions', ms: 'Langganan Jalur Lebar Mudah Alih' }, value: 44.87 },
          // confirmed: Pocket Book ("Jalur Lebar Tetap")
          { label: { en: 'Fixed Broadband Subscriptions', ms: 'Langganan Jalur Lebar Tetap' }, value: 5.04 },
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        intro: {
          en: 'JENDELA surpassed its fibre target while continuing to strengthen nationwide mobile broadband coverage and speeds.',
          ms: 'JENDELA melepasi sasaran gentian optiknya sambil terus memperkukuh liputan dan kelajuan jalur lebar mudah alih di seluruh negara.', // draft
        },
        icon: jendelaIcon,
        itemStyle: 'stats',
        items: [
          // draft: JENDELA reports say "premis tersedia dengan capaian gentian optik"
          { label: { en: 'Premises Passed with Fibre', ms: 'Premis Dilalui Gentian Optik' }, value: 9.81, unit: 'million' },
          {
            // confirmed: JENDELA progress ("Liputan 4G di kawasan berpenduduk")
            label: { en: '4G LTE Coverage in Populated Areas', ms: 'Liputan 4G LTE di Kawasan Berpenduduk' },
            value: 99.71,
            unit: 'percent',
            decimals: 2,
          },
          {
            // draft: JENDELA progress reports the average ("purata"), not the median
            label: { en: 'Median Mobile Broadband Speed', ms: 'Kelajuan Median Jalur Lebar Mudah Alih' },
            value: 143.7,
            unit: 'mbps',
          },
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        label: { en: 'Mobile Cellular Subscriptions', ms: 'Langganan Selular Mudah Alih' }, // confirmed: Pocket Book
        unit: 'million',
        value: 49.79,
        change: 0.3,
        icon: mobileIcon,
        itemStyle: 'stats',
        items: [
          { label: { en: 'Prepaid Subscriptions', ms: 'Langganan Prabayar' }, value: 32.94 }, // confirmed: Pocket Book
          { label: { en: 'Postpaid Subscriptions', ms: 'Langganan Pascabayar' }, value: 16.85 }, // confirmed: Pocket Book
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        label: { en: '5G Subscriptions', ms: 'Langganan 5G' }, // confirmed: Pocket Book
        unit: 'million',
        decimals: 1,
        value: 29.0,
        previous: 18.2,
        description: {
          en: 'Penetration rate of 84.6 per 100 inhabitants',
          ms: 'Kadar penembusan 84.6 bagi 100 penduduk', // confirmed: Pocket Book ("kadar penembusan bagi 100 penduduk")
        },
        // confirmed: JENDELA progress ("kawasan berpenduduk")
        itemsLabel: { en: 'Coverage of Populated Areas (CoPA)', ms: 'Liputan Kawasan Berpenduduk (CoPA)' },
        icon: fiveGIcon,
        itemStyle: 'bullets',
        items: [
          { label: 'Digital Nasional Berhad', value: 82.4, unit: 'percent' },
          { label: 'U Mobile', value: 67.8, unit: 'percent' },
        ],
      },
    ],
  },
  // BM: draft unless marked.
  4: {
    layout: 'grid',
    variant: 'accent',
    blocks: [
      {
        type: 'figure',
        tone: 'tint',
        title: { en: 'Free-to-Air Television', ms: 'Televisyen Percuma' },
        photo: freeToAirPhoto,
        unit: 'percent',
        value: 99.5,
        caption: { en: 'Population Coverage', ms: 'Liputan Penduduk' },
        description: {
          en: '30 Television and Radio Channels on MYTV Platform',
          ms: '30 Saluran Televisyen dan Radio di Platform MYTV',
        },
      },
      {
        type: 'figure',
        tone: 'card',
        title: { en: 'Radio Broadcasting', ms: 'Penyiaran Radio' },
        photo: radioPhoto,
        unit: 'million',
        decimals: 1,
        value: 21.9,
        caption: { en: 'Weekly Radio Listeners', ms: 'Pendengar Radio Mingguan' },
        itemStyle: 'figures',
        items: [
          {
            label: { en: 'Average Listening Time per Week', ms: 'Purata Masa Mendengar Seminggu' },
            text: { en: '12h 47m', ms: '12j 47m' },
          },
        ],
      },
      {
        type: 'figure',
        tone: 'tint',
        title: { en: 'Pay-TV', ms: 'TV Berbayar' }, // confirmed: Pocket Book
        photo: payTvPhoto,
        unit: 'percent',
        value: 62.9,
        caption: { en: 'Pay-TV Penetration Rate', ms: 'Kadar Penembusan TV Berbayar' }, // confirmed: Pocket Book
        itemsLabel: { en: 'Market Share', ms: 'Bahagian Pasaran' },
        itemStyle: 'pairs',
        items: [
          { label: 'Astro', value: 84, decimals: 0 },
          { label: 'Unifi TV', value: 16, decimals: 0 },
        ],
      },
      {
        type: 'figure',
        tone: 'card',
        title: { en: 'Advertising Expenditure', ms: 'Perbelanjaan Pengiklanan' },
        photo: adexPhoto,
        description: {
          en: 'Digital media remains the primary driver of advertising market growth, reflecting the continued shift of adex towards digital platforms.',
          ms: 'Media digital kekal sebagai pemacu utama pertumbuhan pasaran pengiklanan, mencerminkan peralihan berterusan perbelanjaan pengiklanan (adex) ke platform digital.',
        },
      },
      {
        type: 'statement',
        label: { en: 'National Broadcasting Policy', ms: 'Dasar Penyiaran Negara' },
        text: {
          en: "The National Broadcasting Policy progressed in 2025 to strengthen the competitiveness, sustainability and future readiness of Malaysia's broadcasting industry.",
          ms: 'Dasar Penyiaran Negara terus dimajukan pada tahun 2025 bagi memperkukuh daya saing, kemampanan dan kesiapsiagaan masa depan industri penyiaran Malaysia.',
        },
      },
    ],
  },
  // BM: draft unless marked.
  5: {
    layout: 'grid',
    variant: 'accent',
    blocks: [
      {
        type: 'figure',
        tone: 'card',
        wide: true,
        title: {
          en: 'National Information Dissemination Centre (NADI)',
          ms: 'Pusat Penyebaran Maklumat Nasional (NADI)',
        },
        unit: 'million',
        lists: [
          {
            style: 'figures',
            columns: 2,
            items: [
              { value: 1098, unit: 'count', label: { en: 'NADI centres Nationwide', ms: 'Pusat NADI di Seluruh Negara' } },
              {
                value: 1.9,
                label: { en: 'Registered NADI Users Nationwide', ms: 'Pengguna NADI Berdaftar di Seluruh Negara' },
              },
              {
                value: 1.23,
                label: {
                  en: 'Participations Under NADI SMART Services',
                  ms: 'Penyertaan di Bawah Perkhidmatan NADI SMART',
                },
              },
            ],
          },
        ],
        source: { en: 'MCMC', ms: 'SKMM' },
      },
      {
        type: 'figure',
        tone: 'card',
        wide: true,
        title: { en: 'E-Commerce', ms: 'E-Dagang' },
        lists: [
          {
            style: 'figures',
            columns: 2,
            items: [
              {
                heading: { en: 'e-commerce Revenue:', ms: 'Hasil e-dagang:' },
                value: 937.5,
                unit: 'rmBillion',
                decimals: 1,
              },
              {
                heading: { en: 'Top 3 Marketplaces:', ms: '3 Pasaran Dalam Talian Teratas:' },
                image: marketplaceLogos,
                imageAlt: { en: 'Shopee, TikTok Shop and Lazada', ms: 'Shopee, TikTok Shop dan Lazada' },
                reveal: true,
              },
              {
                heading: { en: 'Most purchased items online:', ms: 'Barangan paling banyak dibeli dalam talian:' },
                label: {
                  en: 'Fashion, Home Care Products and Groceries',
                  ms: 'Fesyen, Produk Penjagaan Rumah dan Barangan Runcit',
                },
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
        title: { en: 'Public Key Infrastructure', ms: 'Infrastruktur Kunci Awam' },
        unit: 'million',
        decimals: 1,
        lists: [
          {
            style: 'figures',
            columns: 2,
            items: [
              {
                value: 34.6,
                // draft: Pocket Book has "Bilangan Sijil Terkumpul Yang Dikeluarkan"
                label: { en: 'Digital Certificates Issued', ms: 'Sijil Digital Dikeluarkan' },
              },
              {
                value: 70.4,
                unit: 'percent',
                label: {
                  en: 'local government sector as largest contributor',
                  ms: 'sektor kerajaan tempatan sebagai penyumbang terbesar',
                },
              },
              {
                value: 23.2,
                label: {
                  en: 'Digital certificates issued by Pos Digicert Sdn Bhd',
                  ms: 'Sijil digital dikeluarkan oleh Pos Digicert Sdn Bhd',
                },
              },
            ],
          },
        ],
        source: { en: 'MCMC, DOSM, IPSOS Malaysia', ms: 'SKMM, DOSM, IPSOS Malaysia' },
      },
    ],
  },
  // BM: draft unless marked.
  6: {
    layout: 'grid',
    variant: 'accent',
    changeStyle: 'arrow',
    compareYear: 2024,
    blocks: [
      {
        type: 'figure',
        tone: 'card',
        title: { en: 'Postal Services', ms: 'Perkhidmatan Pos' },
        intro: {
          en: 'Maintaining universal service and nationwide access',
          ms: 'Mengekalkan perkhidmatan sejagat dan akses di seluruh negara',
        },
        lists: [
          {
            style: 'figures',
            items: [
              {
                heading: { en: 'Postal Traffic in 2025', ms: 'Trafik Pos pada 2025' },
                value: 279.36,
                unit: 'million',
                previous: 307.16,
              },
              {
                heading: { en: 'Postal Infrastructure Nationwide', ms: 'Infrastruktur Pos di Seluruh Negara' },
                value: 1159,
              },
              {
                heading: { en: 'Employees in Postal Services Sector', ms: 'Pekerja dalam Sektor Perkhidmatan Pos' },
                value: 15039,
              },
            ],
          },
          {
            label: { en: 'Top 3 Postal Traffic in 2025:', ms: '3 Trafik Pos Teratas pada 2025:' },
            style: 'ranked',
            items: [
              { label: { en: 'Letter Post Items', ms: 'Item Pos Surat' }, value: 87.8, unit: 'percent' },
              { label: { en: 'Registered Items', ms: 'Item Berdaftar' }, value: 7.1, unit: 'percent' },
              { label: { en: 'Advertising Items', ms: 'Item Pengiklanan' }, value: 1.4, unit: 'percent' },
            ],
          },
        ],
        source: 'Pos Malaysia',
      },
      {
        type: 'figure',
        tone: 'tint',
        neutralValues: true,
        title: { en: 'Courier Services', ms: 'Perkhidmatan Kurier' },
        intro: {
          en: 'Strong growth driven by e-commerce and logistics expansion',
          ms: 'Pertumbuhan kukuh dipacu oleh perkembangan e-dagang dan logistik',
        },
        lists: [
          {
            style: 'figures',
            items: [
              // Change from the unrounded totals (1,575.25 and 1,263.32 million).
              {
                heading: { en: 'Courier Traffic in 2025', ms: 'Trafik Kurier pada 2025' },
                value: 1.58,
                unit: 'billion',
                previous: 1.26,
                change: 24.7,
              },
              {
                heading: { en: 'Courier Infrastructure Nationwide', ms: 'Infrastruktur Kurier di Seluruh Negara' },
                value: 27626,
                previous: 15291,
                previousLabel: { en: '15,291 facilities', ms: '15,291 kemudahan' },
              },
              {
                heading: { en: 'Employees in Courier Services Sector', ms: 'Pekerja dalam Sektor Perkhidmatan Kurier' },
                value: 120256,
              },
              {
                heading: { en: 'Packages and Parcels', ms: 'Paket dan Bungkusan' },
                value: 1.53,
                unit: 'billion',
                label: { en: '97.2% of total courier traffic', ms: '97.2% daripada jumlah trafik kurier' },
              },
            ],
          },
        ],
        source: { en: 'MCMC', ms: 'SKMM' },
      },
      {
        type: 'figure',
        tone: 'card',
        wide: true,
        neutralValues: true,
        title: { en: 'Parcel per Capita', ms: 'Bungkusan Per Kapita' }, // confirmed: MCMC data
        intro: {
          en: 'Malaysia surpasses the PAKEJ target, reflecting strong demand and digital economy growth',
          ms: 'Malaysia melepasi sasaran PAKEJ, mencerminkan permintaan yang kukuh dan pertumbuhan ekonomi digital',
        },
        lists: [
          {
            label: { en: 'Parcels per Capita in 2025:', ms: 'Bungkusan Per Kapita pada 2025:' }, // confirmed: MCMC data
            style: 'figures',
            columns: 3,
            items: [
              {
                value: 45.9,
                decimals: 1,
                label: {
                  en: 'Surpassing the PAKEJ target of 30 parcels per capita by 2025',
                  ms: 'Melepasi sasaran PAKEJ sebanyak 30 bungkusan per kapita menjelang 2025',
                },
              },
              {
                value: 28592,
                label: {
                  en: 'Service points under Rangkaian PAKEJ nationwide',
                  ms: 'Titik perkhidmatan di bawah Rangkaian PAKEJ di seluruh negara',
                },
              },
              {
                value: 511,
                label: {
                  en: 'NADI sites equipped with PUDO facilities',
                  ms: 'Lokasi NADI yang dilengkapi kemudahan PUDO',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // BM: draft unless marked.
  7: {
    layout: 'grid',
    variant: 'accent',
    blocks: [
      {
        type: 'stack',
        title: { en: 'Consumer Protection and Complaint Management', ms: 'Perlindungan Pengguna dan Pengurusan Aduan' },
        parts: [
          {
            value: 71919,
            label: { en: 'Consumer Complaints Received in 2025', ms: 'Aduan Pengguna Diterima pada 2025' },
          },
          { heading: { en: 'Breakdown by Service:', ms: 'Pecahan Mengikut Perkhidmatan:' } },
          {
            list: 'donut',
            items: [
              { label: { en: 'Broadcasting', ms: 'Penyiaran' }, value: 1, color: '#cfd1e2' },
              { label: { en: 'MCMC Subsidiary Matters', ms: 'Hal Ehwal Anak Syarikat SKMM' }, value: 1, color: '#9da0bb' },
              // confirmed: MCMC site, Pocket Book
              { label: { en: 'Postal & Courier', ms: 'Pos & Kurier' }, value: 12, color: '#2f3787' },
              { label: { en: 'Online Content', ms: 'Kandungan Dalam Talian' }, value: 40, color: '#5c609f' },
              { label: { en: 'Telecommunications', ms: 'Telekomunikasi' }, value: 46, color: '#232963' },
            ],
          },
          { heading: { en: 'Complaint Resolution Rate:', ms: 'Kadar Penyelesaian Aduan:' } },
          {
            value: 96,
            unit: 'percent',
            decimals: 0,
            label: {
              en: '69,070 complaints successfully resolved and closed as at 31 December 2025.',
              ms: '69,070 aduan berjaya diselesaikan dan ditutup setakat 31 Disember 2025.',
            },
          },
          {
            note: {
              en: 'Supporting effective consumer redress and dispute resolution across the sector.',
              ms: 'Menyokong remedi pengguna dan penyelesaian pertikaian yang berkesan di seluruh sektor.',
            },
          },
        ],
      },
      {
        type: 'stack',
        tone: 'tint',
        title: {
          en: 'Next Generation Malaysian Emergency Response Service 999',
          ms: 'Perkhidmatan Tindak Balas Kecemasan Malaysia 999 Generasi Baharu',
        },
        parts: [
          {
            image: mersLogo,
            size: 'logo',
            alt: { en: 'MERS 999 Emergency Response', ms: 'Tindak Balas Kecemasan MERS 999' },
          },
          { text: { en: 'Fully Operational Since', ms: 'Beroperasi Sepenuhnya Sejak' } },
          { text: '16 November 2025', large: true },
          { heading: { en: 'Key Features:', ms: 'Ciri Utama:' } },
          {
            list: 'icons',
            items: [
              { label: { en: 'Voice', ms: 'Suara' }, image: voiceIcon },
              { label: { en: 'Text', ms: 'Teks' }, image: textIcon },
              { label: { en: 'Images', ms: 'Imej' }, image: imagesIcon },
              { label: 'Video', image: videoIcon },
              {
                label: 'AML',
                image: amlIcon,
                note: { en: 'Advanced Mobile Location', ms: 'Lokasi Mudah Alih Termaju' },
                wide: true,
              },
            ],
          },
          {
            text: {
              en: 'Enhancing emergency response through advanced digital communications and location-based services.',
              ms: 'Meningkatkan tindak balas kecemasan melalui komunikasi digital termaju dan perkhidmatan berasaskan lokasi.',
            },
          },
        ],
      },
      { type: 'divider' },
      {
        type: 'stack',
        title: { en: 'Online Safety Act 2025', ms: 'Akta Keselamatan Dalam Talian 2025' },
        parts: [
          { image: onlineSafetyIcon },
          { text: { en: 'Online Safety Act 2025', ms: 'Akta Keselamatan Dalam Talian 2025' }, strong: true },
          { text: { en: 'Effective: 1 January 2026', ms: 'Berkuat kuasa: 1 Januari 2026' } },
          {
            text: {
              en: "Strengthening online safety and platform accountability in Malaysia's digital ecosystem.",
              ms: 'Memperkukuh keselamatan dalam talian dan akauntabiliti platform dalam ekosistem digital Malaysia.',
            },
          },
        ],
      },
      {
        type: 'stack',
        title: {
          en: 'Code of Practice for Postal Services (CPPS)',
          ms: 'Kod Amalan bagi Perkhidmatan Pos (CPPS)',
        },
        parts: [
          { image: postalIcon },
          {
            text: {
              en: 'Launched During Hari Kurier Negara 2025',
              ms: 'Dilancarkan Sempena Hari Kurier Negara 2025',
            },
            strong: true,
          },
          {
            text: {
              en: "Malaysia's first industry-wide self-regulatory framework for the postal and courier sector.",
              ms: 'Rangka kerja kawal selia kendiri pertama Malaysia yang merangkumi seluruh industri bagi sektor pos dan kurier.',
            },
          },
          { heading: { en: 'Focus Area:', ms: 'Bidang Tumpuan:' } },
          {
            list: 'numbered',
            items: [
              { label: { en: 'Service Standards', ms: 'Standard Perkhidmatan' } },
              { label: { en: 'Consumer Protection', ms: 'Perlindungan Pengguna' } },
              { label: { en: 'Complaint Handling', ms: 'Pengendalian Aduan' } },
              { label: { en: 'Industry Accountability', ms: 'Akauntabiliti Industri' } },
            ],
          },
        ],
      },
      {
        type: 'stack',
        wide: true,
        title: { en: 'Technical Standards Development', ms: 'Pembangunan Standard Teknikal' },
        parts: [
          {
            columns: [
              [
                { image: technicalStandardsIcon },
                {
                  value: 11,
                  label: {
                    en: '**New Technical Codes Registered in 2025**',
                    ms: '**Kod Teknikal Baharu Didaftarkan pada 2025**',
                  },
                },
              ],
              [
                { heading: { en: 'Covering Areas Such As:', ms: 'Merangkumi Bidang Seperti:' } },
                {
                  list: 'numbered',
                  items: [
                    { label: { en: 'Internet of Things (IoT)', ms: 'Internet Benda (IoT)' } },
                    { label: { en: 'Cybersecurity', ms: 'Keselamatan Siber' } },
                    { label: { en: 'Digital Identity', ms: 'Identiti Digital' } },
                    { label: 'IPv6' },
                    { label: 'VoLTE' },
                    { label: 'C-V2X' },
                    { label: { en: 'Fixed Network Facilities', ms: 'Kemudahan Rangkaian Tetap' } },
                  ],
                },
              ],
            ],
          },
          {
            note: {
              en: 'Supporting interoperability, technology innovation and industry readiness.',
              ms: 'Menyokong kebolehoperasian, inovasi teknologi dan kesiapsiagaan industri.',
            },
          },
        ],
      },
      {
        type: 'stack',
        wide: true,
        title: {
          en: 'Strengthening Industry Governance Through Co-Regulation',
          ms: 'Memperkukuh Tadbir Urus Industri Melalui Kawal Selia Bersama',
        },
        parts: [
          {
            text: {
              en: 'CFM, CMCF, Postal Forum and MTSFB continued to support consumer protection, responsible content practices, industry self-regulation and technical standardisation through industry codes, stakeholder engagement and collaborative governance initiatives.',
              ms: 'CFM, CMCF, Forum Pos dan MTSFB terus menyokong perlindungan pengguna, amalan kandungan yang bertanggungjawab, kawal selia kendiri industri dan pempiawaian teknikal melalui kod industri, penglibatan pihak berkepentingan dan inisiatif tadbir urus secara kolaboratif.',
            },
          },
        ],
      },
    ],
  },
  // The report has no Key Highlights for the Outlook: its subtitle (p.192)
  // and the chapter's six outlook areas instead.
  // BM: draft unless marked.
  8: {
    label: { en: "What's Shaping the Outlook", ms: 'Faktor yang Membentuk Tinjauan' },
    layout: 'grid',
    blocks: [
      {
        type: 'figure',
        tone: 'tint',
        wide: true,
        label: { en: 'Outlook', ms: 'Tinjauan' },
        intro: {
          en: 'Connectivity, cloud, AI, content and logistics are moving towards higher-value, technology-enabled and sustainable growth.',
          ms: 'Kesalinghubungan, awan, AI, kandungan dan logistik sedang bergerak ke arah pertumbuhan yang bernilai lebih tinggi, berteraskan teknologi dan mampan.',
        },
      },
      {
        type: 'stack',
        title: { en: 'Telecommunications', ms: 'Telekomunikasi' },
        parts: [
          {
            text: {
              en: 'A maturing market shifts growth towards higher data use, fibre uptake, 5G migration and enterprise services.',
              ms: 'Pasaran yang semakin matang mengalihkan pertumbuhan kepada penggunaan data yang lebih tinggi, langganan gentian optik, peralihan ke 5G dan perkhidmatan perusahaan.',
            },
          },
        ],
      },
      {
        type: 'stack',
        title: { en: '5G and Network Evolution', ms: '5G dan Evolusi Rangkaian' },
        parts: [
          {
            text: {
              en: 'Users move away from 4G and 2G, with 5G-Advanced, private 5G networks and RedCap opening new use cases.',
              ms: 'Pengguna beralih daripada 4G dan 2G, dengan 5G-Advanced, rangkaian 5G persendirian dan RedCap membuka kes penggunaan baharu.',
            },
          },
        ],
      },
      {
        type: 'stack',
        title: { en: 'Cybersecurity and Digital Trust', ms: 'Keselamatan Siber dan Kepercayaan Digital' },
        parts: [
          {
            text: {
              en: 'AI-enabled threats and post-quantum readiness raise the bar for governance, monitoring and cyber resilience.',
              ms: 'Ancaman berasaskan AI dan kesiapsiagaan pasca-kuantum meningkatkan tuntutan terhadap tadbir urus, pemantauan dan daya tahan siber.',
            },
          },
        ],
      },
      {
        type: 'stack',
        title: { en: 'Cloud, Data Centres and AI', ms: 'Awan, Pusat Data dan AI' },
        parts: [
          {
            text: {
              en: 'Sovereign cloud, edge computing and GPU-as-a-Service drive the next wave of infrastructure demand.',
              ms: 'Awan berdaulat, pengkomputeran pinggir dan GPU-sebagai-Perkhidmatan memacu gelombang seterusnya permintaan infrastruktur.',
            },
          },
        ],
      },
      {
        type: 'stack',
        title: { en: 'Broadcasting and Content', ms: 'Penyiaran dan Kandungan' },
        parts: [
          {
            text: {
              en: 'A multi-platform mix of streaming, micro-dramas, AI-assisted production and digital advertising.',
              ms: 'Gabungan pelbagai platform merangkumi penstriman, drama mikro, penerbitan berbantukan AI dan pengiklanan digital.',
            },
          },
        ],
      },
      {
        type: 'stack',
        title: { en: 'Postal and Courier', ms: 'Pos dan Kurier' }, // confirmed: MCMC site, Pocket Book
        parts: [
          {
            text: {
              en: 'Competition moves from parcel volume to efficiency, automation and greener last-mile delivery.',
              ms: 'Persaingan beralih daripada jumlah bungkusan kepada kecekapan, automasi dan penghantaran batu terakhir yang lebih hijau.',
            },
          },
        ],
      },
    ],
  },
}
