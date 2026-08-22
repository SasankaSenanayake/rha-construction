function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export interface AppConfig {
  tableName: string;
  sesFromAddress: string;
  sesToAddress: string;
}

let cached: AppConfig | undefined;

export function getConfig(): AppConfig {
  if (!cached) {
    cached = {
      tableName: requireEnv("SUBMISSIONS_TABLE_NAME"),
      sesFromAddress: requireEnv("SES_FROM_ADDRESS"),
      sesToAddress: requireEnv("SES_TO_ADDRESS"),
    };
  }
  return cached;
}
