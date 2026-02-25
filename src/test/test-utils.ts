export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
  },
  role: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  permission: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userRole: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  userOtp: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  account: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
  loginHistory: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  auditLog: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  blog: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  notification: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

export const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  invalidatePattern: jest.fn(),
  getOrSet: jest.fn(),
  clear: jest.fn(),
  ping: jest.fn(),
};

export const mockQueue = {
  add: jest.fn(),
  process: jest.fn(),
  on: jest.fn(),
  getJob: jest.fn(),
  getJobs: jest.fn(),
  clean: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
};

export const mockEmailService = {
  sendOTPEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendNotificationEmail: jest.fn(),
};

export const mockCategoryService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

export const mockRoleService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  assignRole: jest.fn(),
  removeRole: jest.fn(),
};

export const mockNotificationService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
};

export const mockUploadService = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
  getSignedUrl: jest.fn(),
};
