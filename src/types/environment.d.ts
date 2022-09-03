// declare global env variable to define types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV: "production" | "development" | "test";
      MONGODB_URL: string;
    }
  }
}

export {};
