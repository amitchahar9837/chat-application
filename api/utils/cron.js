import cron from 'cron';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.URL;

// Set the cron job to run every 1 hour
const job = new cron.CronJob("*/15 * * * *", () => {
      https.get(URL, (res) => {
            if (res.statusCode === 200) {
                  console.log("GET request sent successfully");
            } else {
                  console.log("GET request failed");
            }
      }).on('error', (e) => {
            console.log("Error while sending request", e);
      });
});

export default job;