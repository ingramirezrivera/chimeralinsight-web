import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const ARGON_OPTIONS = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
};

function readArg(flagName) {
  const index = process.argv.indexOf(flagName);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function getRequiredValue(name, cliValue, envValue) {
  const value = cliValue || envValue;

  if (!value || !value.trim()) {
    throw new Error(`${name} is required`);
  }

  return value.trim();
}

async function main() {
  const prisma = new PrismaClient();

  try {
    const email = getRequiredValue(
      "ADMIN_EMAIL",
      readArg("--email"),
      process.env.ADMIN_EMAIL
    ).toLowerCase();
    const password = getRequiredValue(
      "ADMIN_PASSWORD",
      readArg("--password"),
      process.env.ADMIN_PASSWORD
    );
    const roleArg = (readArg("--role") || process.env.ADMIN_ROLE || "ADMIN").toUpperCase();
    const role = roleArg === "EDITOR" ? "EDITOR" : "ADMIN";

    const passwordHash = await hash(password, ARGON_OPTIONS);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role,
      },
      create: {
        email,
        passwordHash,
        role,
      },
    });

    console.log(`Bootstrap user ready: ${user.email} (${user.role})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unable to bootstrap admin user.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
