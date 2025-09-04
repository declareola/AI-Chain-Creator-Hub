"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
exports.prisma = prisma;
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map