var json_reader = require("my-json-reader");
var json_sort = require("my-json-sorter");

try {
    json_reader.readJSONFile("./source.json", function readJSONResponce(readErr, responceJSON){
        if(readErr) {
            console.log("json_reader Error:---- ", readErr);
        } else {
            console.log("Before sort: ", responceJSON);
            json_sort.json_sorter(responceJSON, function sortJSONResponce(sortErr, sortedJSON){
                if(sortErr) {
                    console.log("json_sorter Error:---- ", sortErr);
                } else {
                    console.log("Sorted JSON: ", sortedJSON);
                }
            });
        }
    });
} catch (errorResponce) {
    console.log("Error occurred:---- ", errorResponce);
}