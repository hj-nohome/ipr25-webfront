// BM for the text written into the HTML pages, by each element's data-i18n
// key; main.js swaps it in. English is the page's own text. Keys missing
// here stay English. The paragraphs are drafts until the official BM edition.
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

  'nav.home': 'Utama', // draft: MCMC's BM site keeps "HOME" in English
  'nav.chapters': 'Bab', // draft
  'nav.download': 'Muat Turun', // draft: standard BM, not found on MCMC's site
  'nav.downloadRest': ' Laporan Penuh', // draft
  'nav.note': 'Laporan Prestasi Industri 2025', // draft: as intro.title

  'hero.line1': 'Laporan', // draft: as intro.title
  'hero.line2': 'Prestasi', // draft: as intro.title
  'hero.line3': 'Industri 2025', // draft: as intro.title

  // draft
  'hero.body1':
    'Laporan Prestasi Industri 2025 SKMM menawarkan gambaran menyeluruh tentang landskap komunikasi dan multimedia Malaysia, daripada kadar penerimaan 5G dan perluasan gentian optik hingga kepada tabiat digital yang terus berubah dan membentuk kesalinghubungan, ekonomi serta kehidupan seharian negara.',
  // draft
  'hero.body2':
    'Pada tahun 2025, sektor komunikasi Malaysia terus memacu pertumbuhan melalui liputan jalur lebar mudah alih dan talian tetap yang lebih kukuh, daya tahan rangkaian yang lebih baik serta permintaan yang semakin meningkat bagi perkhidmatan awan, keselamatan siber dan analitik data. Laporan ini meneliti prestasi perkhidmatan utama, menjejaki trend baharu dalam infrastruktur digital dan mengetengahkan peluang yang tercipta hasil kesalinghubungan yang lebih pantas dan boleh diharap merentasi isi rumah, perniagaan dan komuniti.',

  'chairman.title': 'Perutusan Pengerusi', // draft: usual for statutory bodies, no MCMC source found
  // draft
  'chairman.quote':
    '"Bersama-sama, kita akan membina ekosistem komunikasi dan multimedia yang dipercayai, inklusif, inovatif dan bersedia menyokong aspirasi Malaysia sebagai sebuah negara digital yang terkemuka"',
  'chairman.cta': 'Baca Perutusan Pengerusi', // draft
  'summary.title': 'Ringkasan Eksekutif', // draft: no MCMC source found
  // draft
  'summary.body':
    'Industri komunikasi dan multimedia Malaysia kekal berdaya tahan pada tahun 2025, disokong oleh permintaan yang kukuh terhadap kesalinghubungan, pelaburan infrastruktur yang berterusan dan peranan perkhidmatan digital yang semakin penting dalam kehidupan seharian. Syarikat komunikasi dan multimedia tersenarai mencatatkan permodalan pasaran sebanyak RM110.63 bilion, manakala hasil industri meningkat sebanyak 1.5% kepada RM49.45 bilion. Kesalinghubungan negara turut bertambah baik, dengan 9.81 juta premis dilalui gentian optik, liputan 4G LTE sebanyak 99.71% di kawasan berpenduduk dan 29.0 juta langganan 5G.',

  'industry.title': 'Terokai Prestasi Industri', // draft
  'industry.economic': 'Prestasi Ekonomi Industri', // draft
  // draft
  'industry.economic.body':
    'Industri komunikasi dan multimedia (K&M) Malaysia kekal berdaya tahan pada tahun 2025, disokong oleh permintaan yang kukuh terhadap kesalinghubungan digital dan pelaburan infrastruktur. Hasil industri meningkat sebanyak 1.5%, manakala syarikat K&M tersenarai terus memainkan peranan penting dalam ekonomi digital Malaysia, dengan telekomunikasi kekal sebagai penyumbang utama.',
  'industry.economic.revenue': 'Hasil Industri K&M', // confirmed: SKMM statement ("industri K&M telah menjana hasil")
  'industry.economic.marketCap': 'Permodalan Pasaran K&M Tersenarai', // confirmed: Pocket Book (Permodalan Pasaran), SKMM statement (K&M)
  'industry.economic.explore': 'Terokai Prestasi Ekonomi', // draft
  'industry.connectivity': 'Status Kesalinghubungan di Malaysia', // draft: "Kesalinghubungan" confirmed by Gov portal
  // draft
  'industry.connectivity.body':
    'Malaysia terus memperkukuh kesalinghubungan digitalnya pada tahun 2025 melalui perluasan infrastruktur jalur lebar, gentian optik dan mudah alih di bawah inisiatif nasional seperti JENDELA. Kesalinghubungan gentian optik mencapai 9.81 juta premis dilalui, melepasi sasaran nasional sebanyak 9 juta, manakala liputan 4G LTE diperluas kepada 99.71% kawasan berpenduduk. Negara juga mencatatkan 29.0 juta langganan 5G, mencerminkan penerimaan teknologi mudah alih generasi baharu yang semakin meluas.',
  'industry.connectivity.fibre': 'Premis Dilalui Gentian Optik', // draft: JENDELA reports say "premis tersedia dengan capaian gentian optik"
  'industry.connectivity.fiveG': 'Langganan 5G', // confirmed: Pocket Book
  'industry.connectivity.explore': 'Terokai Status Kesalinghubungan', // draft
  'industry.content': 'Perkhidmatan Kandungan', // draft
  // draft
  'industry.content.body':
    'Landskap perkhidmatan kandungan Malaysia terus berkembang apabila penonton semakin beralih kepada penstriman, media digital dan hiburan atas permintaan. Walaupun kadar penembusan TV berbayar menurun susulan perubahan cita rasa tontonan, radio terus mengekalkan khalayak yang kukuh. Penyiar turut memperluas tumpuan terhadap kandungan tempatan, pengedaran digital dan penglibatan khalayak.',
  'industry.content.payTv': 'Kadar Penembusan TV Berbayar', // confirmed: Pocket Book
  'industry.content.radio': 'Pendengar Radio Mingguan', // draft
  'industry.content.explore': 'Terokai Perkhidmatan Kandungan', // draft
  'industry.online': 'Perkhidmatan Dalam Talian dan Komuniti', // draft
  // draft
  'industry.online.body':
    'Malaysia terus memajukan keterangkuman digital dan perkhidmatan dalam talian yang dipercayai melalui inisiatif berasaskan komuniti, pengesahan digital dan penyertaan yang semakin meningkat dalam ekonomi digital. NADI memperluas akses kepada pembelajaran dan perkhidmatan digital, manakala penggunaan sijil digital yang semakin meluas menyokong komunikasi dan transaksi dalam talian yang selamat.',
  'industry.online.nadi': 'Pengguna NADI Seluruh Negara', // draft
  'industry.online.certificates': 'Sijil Digital Terkumpul yang Dikeluarkan', // confirmed: Pocket Book ("Bilangan Sijil Terkumpul Yang Dikeluarkan")
  'industry.online.explore': 'Terokai Perkhidmatan Dalam Talian dan Komuniti', // draft
  'industry.postal': 'Pos dan Kurier', // confirmed: MCMC site, Pocket Book ("Pos & Kurier")
  // draft
  'industry.postal.body':
    'Industri pos dan kurier Malaysia terus melalui transformasi, disokong oleh aktiviti e-dagang yang semakin meningkat dan permintaan terhadap penghantaran bungkusan. Trafik kurier berkembang dengan ketara pada tahun 2025, manakala penghantaran bungkusan per kapita melepasi sasaran nasional PAKEJ. Pemain industri turut memperkukuh infrastruktur mereka dan menerima pakai teknologi bagi meningkatkan kecekapan penghantaran.',
  'industry.postal.parcels': 'Bungkusan Per Kapita', // confirmed: MCMC data
  'industry.postal.courier': 'Item Kurier Dikendalikan', // draft
  'industry.postal.explore': 'Terokai Pos dan Kurier', // draft
  'industry.quality': 'Kualiti Perkhidmatan', // confirmed: MSQoS
  // draft
  'industry.quality.body':
    'Perlindungan pengguna, kualiti perkhidmatan dan pematuhan kawal selia kekal menjadi teras keutamaan SKMM pada tahun 2025. Walaupun jumlah aduan meningkat, sebahagian besar kes telah diselesaikan menjelang akhir tahun. SKMM juga memperkukuh pengawasan kawal selia, standard perkhidmatan dan inisiatif keselamatan digital bagi meningkatkan akauntabiliti dan keyakinan pengguna.',
  'industry.quality.resolved': 'Aduan Pengguna Diselesaikan', // draft: "aduan pengguna" is SKMM's usual term, label not found
  'industry.quality.recorded': 'Aduan Pengguna Direkodkan', // draft: as above
  'industry.quality.explore': 'Terokai Kualiti Perkhidmatan', // draft

  'unit.million': 'Juta', // confirmed: Pocket Book
  'unit.billion': 'Bilion', // confirmed: Pocket Book ("RM bilion")

  'chapters.title': 'Terokai Bab', // draft
  'chapters.heading': 'Bab', // draft
  // draft
  'chapters.intro1':
    'Terokai prestasi, perkembangan dan trend utama yang membentuk industri komunikasi dan multimedia Malaysia pada tahun 2025.',
  // draft
  'chapters.intro2':
    'Merangkumi lapan bab, Laporan Prestasi Industri meneliti landskap pelesenan, prestasi ekonomi, perkhidmatan dan kesalinghubungan, perkhidmatan kandungan, perkhidmatan dalam talian dan komuniti, aktiviti pos dan kurier, kualiti perkhidmatan serta tinjauan industri.',
  chapter: 'Bab', // draft

  'chapter.back': 'Semua bab', // draft
  'chapter.rationale': 'Rasional Reka Bentuk', // draft

  'footer.contact': 'Hubungi kami:', // confirmed: MCMC site ("HUBUNGI KAMI")
  'footer.email': 'E-mel:', // draft: MCMC's BM site keeps "Email:" in English
  'footer.copyright': 'Hakmilik ©2026 Suruhanjaya Komunikasi dan Multimedia Malaysia. Semua Hakmilik Terpelihara.', // confirmed: MCMC site
}
