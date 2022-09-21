const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
app.use(cors())
app.use(express.json());
const db=mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'root123',
    database:"sys",
})
let clients=[]
app.get('/',(req, res) => {
 

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Access-Control-Allow-Origin', '*')
    const id =Date.now()
    const client ={
        id,
        res
    }
    clients.push(client)
    console.log(' new User Is connected with id ',id)
    req.on("close", () => {
        console.log(`Client disconnected: ${id}`);
        clients = clients.filter((client) => client.id !== id);
      });
    
})

const notifySubscribers = (message) => {
    clients.forEach((client) =>
      client.res.write(`data: ${JSON.stringify(message)}\n\n`)
    );
  };
app.post('/createUser',(req, res)=>{
    const {
        Name,
        Username , 
        Password, 
        SName ,
        FName,
        Email,
        Bio,
        URL
         } = req.body
    db.query("INSERT INTO users (Name, SName, FName , Username , Email,Password, Bio,  URL) VALUES (?,?,?,?,?,?,?,?)"
            ,[Name , SName,FName, Username, Email,Password,Bio,URL]
            ,(err)=>{
                if(err){
                    console.log(err)
                }else{
                    res.send('done')
                }
            })
            
            notifySubscribers('new User go check ')
})

app.get("/getAllUsers",(req,res)=>{
    db.query("SELECT * FROM users",(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
}
)

app.listen(3002,()=>{
    console.log("Server is Running.... on Port 3002 ")
})