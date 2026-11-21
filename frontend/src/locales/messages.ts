export const messages = {
  id: {
    dashboard: 'Beranda', tasks: 'Rencana tugas', pulih: 'PULIH', rest: 'REST', nourish: 'NOURISH', pantry: 'Dapur & anggaran', assistant: 'Asisten keputusan', reports: 'Laporan mingguan', settings: 'Pengaturan',
    users: 'Pengguna', recipes: 'Resep', ingredients: 'Bahan makanan', prices: 'Harga pangan',
    welcome: 'Ruang untuk maju. Waktu untuk pulih.', intro: 'Produktivitas dan kesejahteraan, berjalan beriringan.',
    foundation: 'Fondasi proyek · Fase 2', placeholder: 'Ruang ini sedang disiapkan. Fitur akan hadir pada fase pengembangan berikutnya.',
    preview: 'Pratinjau publik. Belum ada autentikasi atau data pribadi.',
    theme: 'Tema', light: 'Terang', dark: 'Gelap', language: 'Bahasa',
    connection: 'Koneksi layanan', checking: 'Memeriksa', connected: 'Terhubung', disconnected: 'Tidak tersedia', retry: 'Periksa ulang',
    login: 'Masuk', register: 'Daftar', authPending: 'Autentikasi belum tersedia. Formulir akan ditambahkan pada fase berikutnya.',
    open: 'Buka ruang ARAH', home: 'Halaman awal', notFound: 'Halaman tidak ditemukan', skip: 'Langsung ke konten', admin: 'Administrasi',
  },
  en: {
    dashboard: 'Dashboard', tasks: 'Task planner', pulih: 'PULIH', rest: 'REST', nourish: 'NOURISH', pantry: 'Pantry & budget', assistant: 'Decision assistant', reports: 'Weekly report', settings: 'Settings',
    users: 'Users', recipes: 'Recipes', ingredients: 'Ingredients', prices: 'Food prices',
    welcome: 'Room to grow. Time to recover.', intro: 'Productivity and wellbeing, moving together.',
    foundation: 'Project foundation · Phase 2', placeholder: 'This space is being prepared. Features will arrive in a later development phase.',
    preview: 'Public preview. Authentication and private data are not available yet.',
    theme: 'Theme', light: 'Light', dark: 'Dark', language: 'Language',
    connection: 'Service connection', checking: 'Checking', connected: 'Connected', disconnected: 'Unavailable', retry: 'Check again',
    login: 'Sign in', register: 'Register', authPending: 'Authentication is not available yet. Forms will be added in a later phase.',
    open: 'Open ARAH', home: 'Home', notFound: 'Page not found', skip: 'Skip to content', admin: 'Administration',
  },
} as const
export type MessageKey = keyof typeof messages.en
