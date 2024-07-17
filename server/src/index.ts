import "dotenv/config";
import app from "./api";
import bot from "./bot";

const port = process.env.PORT || 3000;

console.log(`Listening on ${port}`);
bot.connect();
app.listen(port);
