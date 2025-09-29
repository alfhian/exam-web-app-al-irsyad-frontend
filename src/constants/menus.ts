export const roleMenus: Record<string, string[]> = {
  SISWA: ['dashboard', 'ujian', 'exam_submissions'],
  GURU: ['dashboard', 'exam', 'subject', 'grading_exam_submissions'],
  ADMIN: ['dashboard', 'exam', 'subject', 'user_management', 'laporan', 'exam_submissions', 'grading_exam_submissions'],
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
    path: '/student/exam',
  },
  {
    name: 'exam',
    title: 'Soal Ujian',
    icon: 'FaQuestionCircle',
    path: '/exam',
  },
  {
    name: 'exam_submissions',
    title: 'Hasil Ujian',
    icon: 'FaFileAlt',
    path: '/student/exam-submissions',
  },
  {
    name: 'grading_exam_submissions',
    title: 'Skor Ujian',
    icon: 'FaCheckCircle',
    path: '/grading-exam-submissions',
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