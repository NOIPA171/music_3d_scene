// solve issues where TS doesn't know if env exists or not
// structure from:
// https://stackoverflow.com/questions/47008773/how-to-augment-process-env-in-typescript/51144635#51144635
// file name from:
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript

declare namespace NodeJS {
    interface ProcessEnv {
        SPOTIFY_CLIENT_ID: string; // this is the line you want
        SPOTIFY_CLIENT_SECRET: string;
        NODE_ENV: 'development' | 'production';
        // PORT?: string;
        // PWD: string;
    }
}