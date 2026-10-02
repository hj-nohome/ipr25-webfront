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
    id: '2.2',
    chapter: 2,
    chapterName: 'Economic Performance of the C&M Industry',
    caption: 'Market capitalisation of listed companies',
    chart: {
      type: 'line',
      labels: ['2021', '2022', '2023', '2024', '2025'],
      values: [88.2, 94.5, 101.3, 106.8, 110.63],
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
    caption: 'Parcel delivery volume, 2021–2025',
    chart: {
      type: 'line',
      labels: ['2021', '2022', '2023', '2024', '2025'],
      values: [210, 245, 280, 310, 335],
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
