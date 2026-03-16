import { loadEnvFile, resolveEnvFilePath } from "./env-utils.mjs";

const REQUIRED_VARIABLES = [
  "APP_URL",
  "AUTH_SECRET",
  "DATABASE_URL",
  "MEDIA_ROOT_DIR",
];

const OPTIONAL_FEATURE_VARIABLES = [
  "MAILERLITE_API_KEY",
  "MAILERLITE_GROUP_ID_BLOG",
  "MAILERLITE_GROUP_ID_WHIPTHEDOGS",
  "RECAPTCHA_SECRET_KEY",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
];

function printList(title, values) {
  if (values.length === 0) {
    return;
  }

  console.log(title);
  for (const value of values) {
    console.log(`- ${value}`);
  }
}

try {
  const envFilePath = loadEnvFile();
  const missingRequired = REQUIRED_VARIABLES.filter(
    (key) => !process.env[key] || !process.env[key]?.trim()
  );
  const missingOptional = OPTIONAL_FEATURE_VARIABLES.filter(
    (key) => !process.env[key] || !process.env[key]?.trim()
  );

  console.log(`Environment file loaded: ${envFilePath}`);

  if (missingRequired.length > 0) {
    printList("Missing required variables:", missingRequired);
    process.exit(1);
  }

  console.log("Required production variables are present.");
  printList("Optional variables currently missing:", missingOptional);
} catch (error) {
  console.error("Unable to validate production environment.");
  console.error(error instanceof Error ? error.message : error);
  console.error(`Checked path: ${resolveEnvFilePath()}`);
  process.exit(1);
}
