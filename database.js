import mongoose from 'mongoose';

export async function connect() {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    const cs = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

    mongoose.connection.on('connecting',    () => console.log("[M] Connecting"));
    mongoose.connection.on('connected',     () => console.log("[M] Connected"));
    mongoose.connection.on('reconnected',   () => console.log("[M] Reconnected"));
    mongoose.connection.on('disconnecting', () => console.log("[M] Disconnecting"));
    mongoose.connection.on('disconnected',  () => console.log("[M] Disconnected"));
    mongoose.connection.on('error',         er => console.log("[M] Error", er));

    await mongoose.connect(cs);
}