import { container } from '@sapphire/framework';
import config from "config";
import pg from 'pg';

const { Client } = pg

async function reconnectDB() {
    try {
        console.log("Reconnecting to Dual")
        await container.db.dual.end();
        await initDB();
    } catch (err) {
        console.log("Reconnection failed", err.stack);
        setTimeout(reconnectDB, 5000);
    }
}
function startHeartbeat() {
    console.log("Starting dual db heartbeat");
    setInterval(async () => {
        try {
            await container.db.dual.query('SELECT 1');
        } catch (err) {
            console.console.log('Heartbeat: Connection lost', err.stack);
            await reconnectDB();
        }
    }, 30000); // Check every 30 seconds
}
async function initDB() {
    container.db = {
        dual: new Client({
            host: config.get("dualDB.host"),
            user: config.get("dualDB.user"),
            password: config.get("dualDB.password"),
            database: config.get("dualDB.database"),
            port: config.get("dualDB.port")
        })
    };
    container.db.dual.connect(err => {
        if (err) {
            console.log('Error connecting to the database: dual');
            return;
        }
        console.log('Connected to the database:', e);

    });
    startHeartbeat()
}

/**
 * @returns {import('pg').Client}
 */
function getDualDB() {
    return container.db.dual;
}

export { getDualDB, initDB };