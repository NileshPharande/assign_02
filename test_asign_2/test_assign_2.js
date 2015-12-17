var json_reader = require("my-json-reader");
var json_sort = require("my-json-sorter");
var textFileWriter = require("my-json-to-text-writer");
var xmlFileWriter = require("my-json-to-xml-writer");
var async = require("async");

try
{
    async.waterfall(
        [
            function jsonReader(callback)
            {
                json_reader.readJSONFile("./source.json", function readJSONResponce(readErr, responceJSON){
                    if(readErr) {
                        console.log("json_reader Error:---- ", readErr);
                        callback("json_reader Error.", null);
                    } else {
                        callback(null, responceJSON);
                    }
                });
            },
            function jsonSorter(responceJSON, callback)
            {
                json_sort.json_sorter(responceJSON, function sortJSONResponce(sortErr, sortedJSON){
                    if(sortErr) {
                        console.log("json_sorter Error:---- ", sortErr);
                        callback("json_sorter Error.", null);
                    } else {
                        callback(null, sortedJSON);
                    }
                });
            },
            function textWriter(sortedJSON, callback)
            {
                textFileWriter.json_to_text_writer("./files/sorted_destination.txt", sortedJSON.students, function textFileWriterCallback(error, responceMessage1){
                    console.log("TextFileWriter responce: ", responceMessage1);
                    callback(null, sortedJSON);
                });
            },
            function xmlWriter(sortedJSON, callback)
            {
                xmlFileWriter.json_to_xml_writer("./files/sorted_destination.xml", sortedJSON.students, function xmlFileWriterCallback(error, responceMessage2){
                    console.log("XMLFileWriter responce: ", responceMessage2);
                    callback(null, "All Successfull");
                });
            }
        ], function waterfallResponce(error, responce){
            console.log("Waterfall Error: ", error);
            console.log("Waterfall Respo: ", responce);
        }
    );
} catch (errorResponce) {
    console.log("Error occurred:---- ", errorResponce);
}
/*
try {
    json_reader.readJSONFile("./source.json", function readJSONResponce(readErr, responceJSON){
        if(readErr) {
            console.log("json_reader Error:---- ", readErr);
        } else {
            //console.log("Before sort: ", responceJSON);
            json_sort.json_sorter(responceJSON, function sortJSONResponce(sortErr, sortedJSON){
                if(sortErr) {
                    console.log("json_sorter Error:---- ", sortErr);
                } else {
                    //console.log("Sorted JSON: ", sortedJSON);
                    textFileWriter.json_to_text_writer("./files/sorted_destination.txt", sortedJSON.students, function textFileWriterCallback(error, responceMessage1){
                        console.log(responceMessage1);
                        xmlFileWriter.json_to_xml_writer("./files/sorted_destination.xml", sortedJSON.students, function xmlFileWriterCallback(error, responceMessage2){
                            console.log(responceMessage2);
                        });
                    });
                }
            });
        }
    });
} catch (errorResponce) {
    console.log("Error occurred:---- ", errorResponce);
}
*/