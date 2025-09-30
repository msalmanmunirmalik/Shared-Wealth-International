import { Pool } from 'pg';
declare const pool: Pool;
export declare const checkDatabaseHealth: () => Promise<boolean>;
export declare const closeDatabasePool: () => Promise<void>;
export default pool;
//# sourceMappingURL=config.d.ts.map