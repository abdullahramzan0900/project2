// const fs=require('fs');
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
var cors = require("cors");
const token = require("jsonwebtoken");
const { application } = require("express");

// const bodyparser=require("bodyparser");
const app = express();
app.use(bodyparser.json());

// app.use(bodyparser.json());

// const data=require('./data');
// const colors=require("colors");
// console.log("hello world".red);
// fs.writeFileSync("abc.txt","abcddddd");
// const  http=require("http");// handles reponse and request of server
// function datacontrol(req,resp){
//     resp.writeHead(200,{'Content-Type':'application\json'});
//     resp.write(JSON.stringify(data));
//     resp.end();
//     console.log("872")
// }
// http.createServer(datacontrol).listen(4000);
// console.log("abc");
// console.log("abcs");
// const a=5;
// let waitingdata=new Promise((resolve,reject)=>{
// setTimeout(()=>{
//   resolve(90);
// },2000)
// })
// waitingdata.then((num)=>{
//     b=num;
//     console.log(a+b);

// })
// const route=express.Router();
// const reqfilter=(req,resp,next)=>{
//     console.log(reqfilter);
//     if(req.query.age<18)
//     {
//         resp.send("you cannot access this page")
//     }
//     else if  (!req.query.age)
//     {
//         resp.send("please provide your age")
//     }
//     else {
//         next();
//     }

// }
// // app.use(reqfilter);
// app.get('/',(req,res)=>{
//     console.log("name",req.query.name)   // for params
//     res.send("hellooo");
// }) //  get  allow us to use routes
// app.get('/aboutus',reqfilter,(req,res)=>{
//     res.send("hellooow2d");
// }) //  get  allow us to use routes

// app.listen(5000);

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const uri =
  "mongodb+srv://abdullah:hero124421@cluster0.qmfb9vc.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, (err, sucess) => {
  if (err) {
    console.log("failed");
  } else {
    console.log("success");
  }
});

// create a schema
const users = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
});

const userModel = mongoose.model(`user`, users);
app.post("/signup", async (req, resp) => {
  console.log(req);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // save in table
  new userModel({ name, email, password }).save((err, success) => {
    if (err) {
      resp.send({ code: 500, msg: "error" });
    } else if (success) {
      resp.send({ code: 200, msg: "data sucessfully" });
    }
  });
});
const posts = mongoose.Schema({
  name: { type: String },
  id: { type: String },
});

const userModel2 = mongoose.model(`posts`, posts);
app.post("/posts", async (req, resp) => {
  const name = req.body.name;
  const id = req.body.id;
  console.log(id, "id");
  new userModel2({ name, id }).save((err, success) => {
    if (err) {
      resp.send({ code: 500, msg: "error" });
    } else if (success) {
      resp.send({ code: 200, msg: "data sucessfully" });
    }
  });
});

app.post("/login", async (req, res) => {
  // let user=userModel.findOne(req.body);
  // resp.send(user);
  try {
    const { name, password } = req.body;
    console.log(name, "nameee");

    const User = await userModel.findOne({ name: name });
    console.log(User.password, "querry");
    console.log(User.password === password, "check");
    if (User.password === password) {
      console.log("uryyyyyyyy");
      const jwt = token.sign(
        {
          name: User.name,
          email: User.email,
        },
        "this is text ",
        {
          expiresIn: "24h",
      
        }
      );

      res.status(200).json({ token: jwt, name: User.name });
    } else {
      console.log("unable to find the userr");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/getdata", async (req, res) => {
  const data = await userModel.find();
  console.log(data, "data");
});
app.get("/posts/getdata", async (req, res) => {
  const data = await userModel2.find();// get all data from database 
  console.log(data, "data");
  res.status(200).json({
    data
  });
});
app.delete("/posts/delete/:id",async (req,res)=>{
  const data=await userModel2.findByIdAndRemove(req.params.id);
  console.log(data,"del");
 res.status(200).json({
     "status":"deleted sucessfully"
 })
})
app.put("/posts/uptade/:id",async(req,res)=>{
  console.log(req.params.id,"idddd");
  const data= await userModel2.findByIdAndUpdate(req.params.id,req.body);
  console.log(data,"data");
  res.status(200).json({
    "status":"uptade sucessfully"
})
})

app.listen(2000, () => {
  console.log("connected successfully");
});
