
var tesseract = require('node-tesseract-ocr');
var comprehend = require("comprehend");
var AWS = require("aws-sdk");

var express = require("express");
var app = express();

app.get("/ocr_data", (req, res) =>{
  // console.log(req);
  const config={
    lan:"eng",
    oem:1,
    psm:3
  }
  AWS.config.update({
//     accessKeyId: "AKIAJX5MFR26KWUJF65A",
//     secretAccessKey: "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",
    accessKeyId: "AKIAJUN4VM3I5XZFN4DA",
    secretAccessKey: "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",
    region: 'us-east-1'
  });
  var comprehend = new AWS.Comprehend();

tesseract.recognize("/home/anandbabu/Desktop/mithyalabs-OCR-project/visiting-cards/card3.JPG",config)
.then((data)=>{
    var params = {
        LanguageCode: 'en',
        TextList: [data]
      };
    comprehend.batchDetectEntities(params, function (err, data) {
      if (err){
        console.log(err, err.stack);   // an error occurred
      }else{
        // console.log(data.ResultList[0]);   // successful response
        res.send(data.ResultList[0].Entities)
        var total_data = data.ResultList[0].Entities
        console.log(total_data)
        var Dict = {name:""};
        for (var i of total_data){
          if(i.Text.includes("@")  && i.Text.includes(".")){
            Dict.Email=i.Text
          }
          else if(i.Type in Dict){
            continue
          }else{
            console.log(Dict[i.Type]);
            Dict[i.Type]=i.Text
          }
        }
      } 
      console.log(Dict);
      
    });
});
})
var server = app.listen(3031, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log(host, port);
  console.log("server is running mode.....")
})
