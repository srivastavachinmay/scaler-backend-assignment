import "reflect-metadata";
import app from "./app";
import getConnection from './utils/get-connection';
import { log } from "util";

app.listen(process.env.PORT || 3000, async () => {
    await getConnection().then(() => log("Connected to DB."));
    console.log(`Express application is up and running on port ${process.env.PORT || 3000}`);
});



