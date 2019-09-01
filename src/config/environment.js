import dotenv from 'dotenv';

dotenv.config();

module.exports = {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT
}