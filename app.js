const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));   // use static to use external css & image while rendering html
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function (req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function (req,res) {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.emailname;
    
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/83ea43583a";

    const option = {
        method:"POST",
        auth: "brijesh1:0c902ef7d4bb7100423d0cd684592f2d-us5"
    }

    const request = https.request(url,option,function (response) {
        if (response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure",function (req,res) {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,function () {  //process.env.PORT used to work seamlessly with heroku
    console.log("Server started at 3000");
});




//Api key : 0c902ef7d4bb7100423d0cd684592f2d-us5
//List Id : 83ea43583a








