import "dotenv/config";
import app from "./api";
import bot from "./bot";

console.log(`Listening on ${process.env.PORT}`);
bot.connect();
app.listen(process.env.PORT);
