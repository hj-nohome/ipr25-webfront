// BM for the text written into the HTML pages, by each element's data-i18n
// key; main.js swaps it in. English is the page's own text. Keys missing
// here stay English: the paragraphs await the official BM edition.
// Chapter names come from src/data/chapters.js instead (data-chapter-name).
//
// Each entry is marked as checked against MCMC's published BM (Oct 2026):
// "confirmed" names the source, "draft" has none yet. Sources:
// - Pocket Book: MCMC, Komunikasi dan Multimedia: Fakta & Angka, ST4 2025
//   (www.mcmc.gov.my/skmmgovmy/media/General/pdf2/MCMC-4Q2025-Comm-BM.pdf)
// - MCMC site: www.mcmc.gov.my/ms (its nav and footer)
// - SKMM statement: as reported by Utusan Sarawak (utusansarawak.com.my/?p=3637)
// - Gov portal: www.malaysia.gov.my, its "Kesalinghubungan" section
// - MCMC data: as cited by Berita Harian, Oct 2025 (bungkusan per kapita)
// - MSQoS: SKMM's Standard Mandatori Kualiti Perkhidmatan, as reported
// - JENDELA progress: as reported by Berita Harian, Mar 2023
// The { en, ms } pairs in chapters.js, highlights.js and the renderers are
// marked the same way, against these sources.
export const bm = {
  'title.chapters': 'Bab | ipr25-testing', // draft

  'intro.title': 'Laporan Prestasi Industri 2025', // draft: no BM title found; MCMC's site uses the English one
  'intro.subtitle': 'Suruhanjaya Komunikasi dan Multimedia Malaysia', // confirmed: MCMC site, Pocket Book

  'nav.home': 'UTAMA', // draft: MCMC's BM site keeps "HOME" in English
  'nav.chapters': 'BAB', // draft
  'nav.download': 'MUAT TURUN', // draft: standard BM, not found on MCMC's site
  'nav.note': 'Laporan Prestasi Industri 2025', // draft: as intro.title

  'hero.line1': 'Laporan', // draft: as intro.title
  'hero.line2': 'Prestasi', // draft: as intro.title
  'hero.line3': 'Industri 2025', // draft: as intro.title

  'chairman.title': 'Perutusan Pengerusi', // draft: usual for statutory bodies, no MCMC source found
  'chairman.cta': 'Baca Perutusan Pengerusi', // draft
  'summary.title': 'Ringkasan Eksekutif', // draft: no MCMC source found

  'industry.title': 'Terokai Prestasi Industri', // draft
  'industry.economic': 'Prestasi Ekonomi Industri', // draft
  'industry.economic.revenue': 'Hasil Industri K&M', // confirmed: SKMM statement ("industri K&M telah menjana hasil")
  'industry.economic.marketCap': 'Permodalan Pasaran K&M Tersenarai', // confirmed: Pocket Book (Permodalan Pasaran), SKMM statement (K&M)
  'industry.economic.explore': 'Terokai Prestasi Ekonomi', // draft
  'industry.connectivity': 'Status Kesalinghubungan di Malaysia', // draft: "Kesalinghubungan" confirmed by Gov portal
  'industry.connectivity.fibre': 'Premis Dilalui Gentian Optik', // draft: JENDELA reports say "premis tersedia dengan capaian gentian optik"
  'industry.connectivity.fiveG': 'Langganan 5G', // confirmed: Pocket Book
  'industry.connectivity.explore': 'Terokai Status Kesalinghubungan', // draft
  'industry.content': 'Perkhidmatan Kandungan', // draft
  'industry.content.payTv': 'Kadar Penembusan TV Berbayar', // confirmed: Pocket Book
  'industry.content.radio': 'Pendengar Radio Mingguan', // draft
  'industry.content.explore': 'Terokai Perkhidmatan Kandungan', // draft
  'industry.online': 'Perkhidmatan Dalam Talian dan Komuniti', // draft
  'industry.online.nadi': 'Pengguna NADI Seluruh Negara', // draft
  'industry.online.certificates': 'Sijil Digital Terkumpul yang Dikeluarkan', // confirmed: Pocket Book ("Bilangan Sijil Terkumpul Yang Dikeluarkan")
  'industry.online.explore': 'Terokai Perkhidmatan Dalam Talian dan Komuniti', // draft
  'industry.postal': 'Pos dan Kurier', // confirmed: MCMC site, Pocket Book ("Pos & Kurier")
  'industry.postal.parcels': 'Bungkusan Per Kapita', // confirmed: MCMC data
  'industry.postal.courier': 'Item Kurier Dikendalikan', // draft
  'industry.postal.explore': 'Terokai Pos dan Kurier', // draft
  'industry.quality': 'Kualiti Perkhidmatan', // confirmed: MSQoS
  'industry.quality.resolved': 'Aduan Pengguna Diselesaikan', // draft: "aduan pengguna" is SKMM's usual term, label not found
  'industry.quality.recorded': 'Aduan Pengguna Direkodkan', // draft: as above
  'industry.quality.explore': 'Terokai Kualiti Perkhidmatan', // draft

  'unit.million': 'Juta', // confirmed: Pocket Book
  'unit.billion': 'Bilion', // confirmed: Pocket Book ("RM bilion")

  'chapters.title': 'Terokai Bab', // draft
  'chapters.heading': 'Bab', // draft
  chapter: 'Bab', // draft

  'chapter.back': 'Semua bab', // draft
  'chapter.rationale': 'Rasional Reka Bentuk:', // draft

  'footer.contact': 'Hubungi kami:', // confirmed: MCMC site ("HUBUNGI KAMI")
  'footer.email': 'E-mel:', // draft: MCMC's BM site keeps "Email:" in English
  'footer.copyright': 'Hakmilik ©2026 Suruhanjaya Komunikasi dan Multimedia Malaysia. Semua Hakmilik Terpelihara.', // confirmed: MCMC site
}
