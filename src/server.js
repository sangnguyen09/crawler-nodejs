import express from 'express';
import path from 'path';
import bodyParser from 'body-parser'
import { crawlerController } from './controllers/crawlerController';
import { checkDataInput } from './validation/crawlerValidation';
import {hostname, port} from './config/environment'
// init app
let app = express();


app.use('/' ,express.static(path.resolve(__dirname, 'public')));
// app.set('view engine',"ejs");
// app.set("views","./src/views");

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 100000
}));
// ROuter
app.post('/crawler', checkDataInput, crawlerController)

//start server
app.listen(port,hostname, ()=>{
    console.log(`Hello, Server running at ${hostname}:${port}/`)
})

