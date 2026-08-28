import prisma from "./prisma";

export interface DatabaseHealth {
  isConnected: boolean;
  tableStatus: {
    users: boolean;
    madrasas: boolean;
    facilities: boolean;
    galleryImages: boolean;
  };
  recordCounts: {
    users: number;
    madrasas: number;
    facilities: number;
    galleryImages: number;
  };
  errors: string[];
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const health: DatabaseHealth = {
    isConnected: false,
    tableStatus: {
      users: false,
      madrasas: false,
      facilities: false,
      galleryImages: false,
    },
    recordCounts: {
      users: 0,
      madrasas: 0,
      facilities: 0,
      galleryImages: 0,
    },
    errors: [],
  };

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    health.isConnected = true;

    // Check tables and get counts
    const tables = [
      { name: 'users', model: prisma.user },
      { name: 'madrasas', model: prisma.madrasa },
      { name: 'facilities', model: prisma.facility },
      { name: 'galleryImages', model: prisma.galleryImage },
    ] as const;

    for (const table of tables) {
      try {
        const count = await (table.model as any).count();
        health.tableStatus[table.name] = true;
        health.recordCounts[table.name] = count;
      } catch (error) {
        health.errors.push(`Table ${table.name}: ${error}`);
        console.warn(`Table check failed for ${table.name}:`, error);
      }
    }

  } catch (error) {
    health.errors.push(`Database connection failed: ${error}`);
    console.error('Database health check failed:', error);
  }

  return health;
}

export async function ensureDatabaseReady() {
  try {
    const health = await checkDatabaseHealth();
    
    if (!health.isConnected) {
      console.error('Database is not connected. Using mock data fallback.');
      return false;
    }

    if (!health.tableStatus.madrasas) {
      console.warn('Madrasas table not found. Consider running migrations.');
      return false;
    }

    // If no madrasas exist, we might need to seed
    if (health.recordCounts.madrasas === 0) {
      console.info('No madrasas found in database. Mock data will be used as fallback.');
    }

    return true;
  } catch (error) {
    console.error('Database readiness check failed:', error);
    return false;
  }
}