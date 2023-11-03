declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      DISCORD_TOKEN: string;
      DISCORD_GUILD: string;
      ADMIN_KEY: string;
      XIVAPI_KEY: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
