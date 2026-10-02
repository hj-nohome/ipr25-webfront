// Placeholder data — extend this array with the real Figures
// swap in real datasets once available; the grid/modal/search/chart all
// read from it. 
export const figures = [
  {
    id: '1.1',
    chapter: 1,
    chapterName: 'Licensing',
    caption: 'Individual licences by category, 2016-2025',
    chart: { type: 'bar',
      stacked: true,
      labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'], 
      datasets:[
        {
          label: 'NFP (I)',
          data: [176, 209, 220, 213, 220, 239, 248, 257, 265, 269],
        },
        {
          label: 'NSP (I)',
          data: [156, 176, 183, 176, 170, 173, 171, 175, 178, 181],
        },
        {
          label: 'CASP (I)',
          data: [48, 52, 56, 52, 48, 42, 40, 38, 37, 35],
        }
      ]
    },
  },
  {
    id: '1.2',
    chapter: 1,
    chapterName: 'Licensing',
    caption: 'Class licences by category, 2016–2025',
    chart: {
      type: 'bar',
      labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      // Colours set per series to match the report's legend order.
      datasets: [
        {
          label: 'NFP (C)',
          data: [15, 9, 8, 11, 17, 11, 11, 15, 18, 19],
          backgroundColor: '#c8c8c8',
          borderColor: '#c8c8c8',
        },
        {
          label: 'NSP (C)',
          data: [15, 11, 8, 11, 17, 11, 11, 15, 18, 23],
          backgroundColor: '#6fcfc7',
          borderColor: '#6fcfc7',
        },
        {
          label: 'CASP (C)',
          data: [12, 10, 11, 10, 15, 9, 11, 15, 14, 12],
          backgroundColor: '#1e9a8b',
          borderColor: '#1e9a8b',
        },
        {
          label: 'ASP (C)',
          data: [456, 433, 370, 420, 450, 465, 513, 522, 536, 539],
          backgroundColor: '#215f5c',
          borderColor: '#215f5c',
        },
      ],
    },
  },
  {
    id: '2.1',
    chapter: 2,
    chapterName: 'Economic Performance of the C&M Industry',
    caption: 'Industry revenue by segment',
    chart: {
      type: 'doughnut',
      labels: ['Telecommunications', 'Broadcasting', 'Postal', 'Digital Services'],
      values: [28.4, 6.2, 3.1, 11.75],
    },
  },
  {
    id: '2.10',
    chapter: 2,
    chapterName: 'Economic Performance of the C&M Industry',
    caption: 'Capex-to-revenue ratio (capital intensity), 2023–2025',
    source: 'Industry',
    note: 'Capital intensity from major publicly listed companies only',
    // Horizontal bars; the latest year comes first so it sits at the top.
    chart: {
      type: 'bar',
      horizontal: true,
      unit: '%',
      labels: ['2025', '2024', '2023'],
      datasets: [
        {
          label: 'Total',
          data: [12.9, 13.4, 13.0],
          backgroundColor: '#0e6b62',
          borderColor: '#0e6b62',
        },
        {
          label: 'Mobile',
          data: [10.8, 13.1, 11.2],
          backgroundColor: '#1e9a8b',
          borderColor: '#1e9a8b',
        },
        {
          label: 'Fixed',
          data: [16.4, 13.9, 16.0],
          backgroundColor: '#6fcfc7',
          borderColor: '#6fcfc7',
        },
      ],
    },
  },
  {
    id: '3.1',
    chapter: 3,
    chapterName: 'Services and Connectivity',
    caption: '4G LTE and 5G coverage by state',
    chart: {
      type: 'bar',
      labels: ['Selangor', 'KL', 'Johor', 'Penang', 'Sabah', 'Sarawak'],
      values: [99.9, 99.8, 99.5, 99.6, 97.2, 96.8],
    },
  },
  {
    id: '3.2',
    chapter: 3,
    chapterName: 'Services and Connectivity',
    caption: 'Fixed broadband subscription growth',
    chart: {
      type: 'line',
      labels: ['2021', '2022', '2023', '2024', '2025'],
      values: [8.1, 8.6, 9.0, 9.4, 9.81],
    },
  },
  {
    id: '3.13',
    chapter: 3,
    chapterName: 'Services and Connectivity',
    caption: 'Mobile cellular subscription market share by service provider, 2021–2025',
    source: 'MCMC',
    // Brand colours, matching the report. `yMin` starts the axis at 10 so the
    // lines aren't squashed; `unit` is added to axis ticks and tooltips.
    chart: {
      type: 'line',
      yMin: 10,
      unit: '%',
      labels: ['2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Maxis',
          data: [27.4, 27.1, 27.7, 28.6, 29.6],
          backgroundColor: '#1f7a3a',
          borderColor: '#1f7a3a',
        },
        {
          label: 'Digi',
          data: [21.6, 21.7, 21.8, 21.8, 21.0],
          backgroundColor: '#f2b705',
          borderColor: '#f2b705',
        },
        {
          label: 'Celcom',
          data: [18.7, 17.7, 16.8, 16.7, 17.0],
          backgroundColor: '#2f5fb3',
          borderColor: '#2f5fb3',
        },
        {
          label: 'UMobile',
          data: [16.0, 18.0, 17.9, 16.8, 16.0],
          backgroundColor: '#f26b1d',
          borderColor: '#f26b1d',
        },
        {
          label: 'Others/MVNOs',
          data: [16.3, 15.5, 15.7, 16.1, 16.3],
          backgroundColor: '#ffffff',
          borderColor: '#17131f',
          pointBorderWidth: 2,
        },
      ],
    },
  },
  {
    id: '3.16',
    chapter: 3,
    chapterName: 'Services and Connectivity',
    caption: 'Deployment of 5G sites by Digital Nasional Berhad (DNB)',
    source: 'MCMC, DNB',
    // Table figure: the first column labels each row; the others are numbers,
    // shown with `decimals` places. `total` is the bold footer row.
    table: {
      columns: [
        { label: 'State' },
        { label: '5G Sites' },
        { label: 'Coverage of Populated Areas (%)', decimals: 1 },
      ],
      rows: [
        ['W.P. Kuala Lumpur', 760, 97.8],
        ['W.P. Putrajaya', 108, 97.3],
        ['Selangor', 1829, 96.9],
        ['Kedah', 390, 80.2],
        ['Pulau Pinang', 446, 91.9],
        ['Perak', 502, 81.0],
        ['Perlis', 44, 91.4],
        ['Pahang', 358, 66.4],
        ['Kelantan', 232, 67.0],
        ['Terengganu', 228, 73.2],
        ['Johor', 923, 84.1],
        ['Melaka', 216, 89.9],
        ['Negeri Sembilan', 233, 77.8],
        ['Sarawak', 575, 63.8],
        ['Sabah', 595, 68.9],
        ['W.P. Labuan', 42, 96.3],
      ],
      total: ['Total', 7481, 82.4],
    },
  },
  {
    id: '4.1',
    chapter: 4,
    chapterName: 'Content Services',
    caption: 'Streaming service adoption rates',
    chart: {
      type: 'doughnut',
      labels: ['Video streaming', 'Music streaming', 'Live TV', 'Gaming'],
      values: [45, 25, 20, 10],
    },
  },
  {
    id: '5.1',
    chapter: 5,
    chapterName: 'Online and Community Services',
    caption: 'Social media usage by age group',
    chart: {
      type: 'bar',
      labels: ['13–17', '18–24', '25–34', '35–44', '45+'],
      values: [88, 95, 90, 78, 55],
    },
  },
  {
    id: '6.1',
    chapter: 6,
    chapterName: 'Postal and Courier',
    caption: 'Parcel delivery volume and courier revenue, 2021–2025',
    // Sample multi-axis chart: yAxisID 'y1' plots a series against a second
    // axis on the right. Revenue figures are placeholders.
    chart: {
      type: 'line',
      labels: ['2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Parcel volume (million)',
          data: [210, 245, 280, 310, 335],
        },
        {
          label: 'Courier revenue (RM billion)',
          data: [5.8, 6.4, 6.9, 7.5, 8.1],
          yAxisID: 'y1',
          borderDash: [6, 4],
        },
      ],
    },
  },
  {
    id: '7.1',
    chapter: 7,
    chapterName: 'Quality of Services',
    caption: 'Network complaint resolution time',
    chart: { type: 'bar', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [3.2, 2.8, 2.5, 2.1] },
  },
  {
    id: '8.1',
    chapter: 8,
    chapterName: 'Outlook',
    caption: 'Projected 5G subscription growth, 2026–2030',
    chart: {
      type: 'line',
      labels: ['2026', '2027', '2028', '2029', '2030'],
      values: [29.0, 34.5, 40.2, 46.8, 53.5],
    },
  },
]
