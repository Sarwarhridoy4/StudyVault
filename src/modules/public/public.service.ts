export const PublicService = {
  getLandingPageData: () => ({
    name: 'StudyVault API',
    version: '1.0.0',
    description: 'A learning platform marketplace',
    endpoints: {
      health: '/health',
      courses: '/api/v1/courses',
      modules: '/api/v1/modules',
      courseModules: '/api/v1/coursemodule',
      about: '/about',
    },
  }),

  getAboutPageData: () => ({
    name: 'StudyVault',
    tagline: 'Your gateway to learning',
    description: 'StudyVault is a marketplace for learning modules where users can browse, create, and manage course materials.',
    features: [
      'Browse courses and modules by category',
      'Search and filter content',
      'Add and manage your own modules',
      'Admin tools for course and module management',
    ],
    apiVersion: '1.0.0',
  }),
};
