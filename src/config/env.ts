import dotenv from 'dotenv';
import path from 'path';

// Load the default .env file
dotenv.config();

// Load environment specific file
const environment = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${environment}`);

// Environment-specific variables override defaults
dotenv.config({path: envPath});
