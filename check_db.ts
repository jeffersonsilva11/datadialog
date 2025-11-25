
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            include: {
                accounts: true,
                analyticsConnections: true,
            },
        });

        console.log("Users found:", users.length);
        users.forEach((user) => {
            console.log(`User: ${user.email} (ID: ${user.id})`);
            console.log(`  Accounts: ${user.accounts.length}`);
            user.accounts.forEach((acc) => {
                console.log(`    - Provider: ${acc.provider}, ID: ${acc.providerAccountId}`);
            });
            console.log(`  Connections: ${user.analyticsConnections.length}`);
            user.analyticsConnections.forEach((conn) => {
                console.log(`    - Property: ${conn.propertyName} (${conn.propertyId})`);
            });
        });
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
