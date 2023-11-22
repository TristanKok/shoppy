"use strict";
// This file is basically use to prevent hot module reloading in development to prevent multiple clients being spun up
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    log: ["query"],
});
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
