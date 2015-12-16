var json_reader = require("my-json-reader");

try {
    json_reader.readJSONFile("./source.json", function readJSONResponce(err, responce){
        if(err) {
            console.log("Error:---- ", err);
        } else {
            console.log("sourceJSON: ", responce);
        }
    });
} catch (errorResponce) {
    console.log("Error occurred:---- ", errorResponce);
}