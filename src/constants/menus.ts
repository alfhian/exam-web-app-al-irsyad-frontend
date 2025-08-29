export const roleMenus: Record<string, string[]> = {
  SISWA: ['dashboard', 'ujian'],
  GURU: ['dashboard', 'exam', 'subject'],
  ADMIN: ['dashboard', 'exam', 'subject', 'user_management', 'laporan'],
};

export const menus = [
  {
    name: 'dashboard',
    title: 'Dashboard',
    icon: 'FaHome',
    path: '/dashboard',
  },
  {
    name: 'ujian',
    title: 'Ujian',
    icon: 'FaClipboardList',
    Path: '/ujian',
  },
  {
    name: 'exam',
    title: 'Soal Ujian',
    icon: 'FaQuestionCircle',
    path: '/exam',
  },
  {
    name: 'subject',
    title: 'Mata Pelajaran',
    icon: 'FaBook',
    path: '/subjects',
  },
  {
    name: 'user_management',
    title: 'User Management',
    icon: 'FaUsers',
    path: '/user-management',
  },
  {
    name: 'laporan',
    title: 'Laporan',
    icon: 'FaChartBar',
    path: '/laporan',
  },
];