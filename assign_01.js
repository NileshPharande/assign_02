try {

    var fs = require("fs");
    var builder = require("xmlbuilder");
    var prompt = require('prompt');
    var async = require("async");

    if(!fs.existsSync("./source.json")) {
        throw new Error("source.json file is not present in current folder.");
    }

    var sourceJSON = JSON.parse(fs.readFileSync("./source.json"));
    var studentArray = sourceJSON.students;

    //Checking for all expected key-value pairs are present in source.json or not 
    if(!(studentArray)) {
        throw new Error("students array not found in source.json file.");
    }
    for(x in studentArray)
    {
        var errorString = "In student Record: " + x;
        if(!(studentArray[x].id)) {
            errorString = errorString + ", id not present.";
            throw new Error(errorString);
        } else if (!(studentArray[x].fName)) {
            errorString = errorString + ", fName not present.";
            throw new Error(errorString);
        } else if (!(studentArray[x].lName)) {
            errorString = errorString + ", lName not present.";
            throw new Error(errorString);
        } else if (!(studentArray[x].score)) {
            errorString = errorString + ", score not present.";
            throw new Error(errorString);
        }
    }

    //Logic for accessing data from array and write in text file.
    function writeTextFile(textFile, array, writeTextCallback)
    {
        fs.writeFileSync("./files/" + textFile, "First Name | Last Name | Score\n");
        for(var x = 0; x < array.length; ++x)
        {
            fs.appendFileSync("./files/" + textFile, array[x].id +" | "+ array[x].fName +" | "+ array[x].lName +" | "+ array[x].score +"\n");
        }
        if(!fs.existsSync("./files/" + textFile)) {
            return writeTextCallback(textFile + " not created successfully.", null);
        }
        return writeTextCallback(null, textFile + " is created successfully. Thank you.");
    }

    //Logic for accessing data from array and write in xml file.
    function writeXMLFile(xmlFile, inputArray, writeXMLCallback)
    {
        var rootElement = builder.create("Students");
        for(x in inputArray) {
            var student = rootElement.ele('Student',{'id': inputArray[x].id});
            student.ele('name', inputArray[x].fName +" "+ inputArray[x].lName);
            student.ele('score', inputArray[x].score);
        }
        var xmlString = rootElement.end({pretty: true});
        fs.writeFileSync("./files/" +xmlFile, xmlString);
        if(!fs.existsSync("./files/" + xmlFile)) {
            return writeXMLCallback(xmlFile + " not created successfully.", null);
        }
        return writeXMLCallback(null, xmlFile + " is created successfully. Thank you.");
    }

    function checkExistanceOfFile(fileName, existstanceCallback)
    {
        if(!fs.existsSync("./files/" +fileName)) {
            return existstanceCallback(null, 0);
        }
        console.log(fileName+ " is already exists... Do you like to overWrite? (y/n)\n");
        prompt.start();
        prompt.get(['promptInput'], function promptReply(err, result) {
            if(err) {
                console.log(err);
                return existstanceCallback("Failed to get reply from user.", null);
            }
            if(result.promptInput === "n" || result.promptInput === "N") {
                console.log(fileName + " file will remain unchanged.");
                return existstanceCallback(null, 1);
            }
            if(result.promptInput === "y" || result.promptInput === "Y") {
                checkPermission("./files/"+ fileName, function filePermissionCallback(err, writeAccess) {
                    if(err) {
                        //console.log("Error :", err);
                        return existstanceCallback("Failed to read permissions of file " + fileName, null);
                    }
                    if(!writeAccess) {
                        return existstanceCallback(fileName + " is not writable.", null);
                    } else {
                        return existstanceCallback(null, 0);
                    }
                });
            } else {
                return existstanceCallback("Invalid input. Please enter only 'y' or 'n'... Currently " +fileName+ " will remain unchanged.", null);
            }
        });
    }

    function checkPermission(file, cb){
        //r,w,x ----> 4,2,1 
        var mask = 2;
        fs.stat (file, function (error, stats){
            if (error){
                return cb (error, false);
            }else{
                return cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
            }
        });
    };


    async.series([
            function writeNormalTextFile(callback) {
                checkExistanceOfFile("destination.txt", function fileExistsCallback(error, exsist){
                    if(error) {
                        console.log("Error: ", error);
                        return callback(null, "Failed destination.txt");
                    }
                    if(!exsist) {
                        writeTextFile("destination.txt", studentArray, function writeTextHandler(error, success)
                        {
                            if(error) {
                                console.log("Error: ", error);
                                return callback(null, "Failed destination.txt");
                            }
                            return callback(null,"Modified destination.txt");
                        });
                    } else {
                        return callback(null,"Not modified destination.txt");
                    }
                });
            },
            function writeSortedTextFile(callback) {
                //(a-b) for asending sort and (b-a) for desending sort.
                studentArray.sort(function(a, b){return b.score - a.score;});
                checkExistanceOfFile("sorted_destination.txt", function fileExistsCallback(error, exsist){
                    if(error) {
                        console.log("Error: ", error);
                        return callback(null, "Failed sorted_destination.txt");
                    }
                    if(!exsist) {
                        writeTextFile("sorted_destination.txt", studentArray, function writeTextHandler(error, success){
                            if(error) {
                                console.log("Error: ", error);
                                return callback(null, "Failed sorted_destination.txt");
                            }
                            return callback(null,"Modified sorted_destination.txt");
                        });
                    } else {
                        return callback(null,"Not modified sorted_destination.txt");
                    }
                });
            },
            function writeSortedXMLFile(callback) {
                //(a-b) for asending sort and (b-a) for desending sort.
                studentArray.sort(function(a, b){return b.score - a.score;});
                checkExistanceOfFile("sorted_destination.xml", function fileExistsCallback(error, exsist){
                    if(error) {
                        console.log("Error: ", error);
                        return callback(null, "Failed sorted_destination.xml");
                    }
                    if(!exsist) {
                        writeXMLFile("sorted_destination.xml", studentArray, function writeXMLHandler(error, success){
                            if(error) {
                                console.log("Error: ", error);
                                return callback(null, "Failed sorted_destination.xml");
                            }
                            return callback(null,"Modified sorted_destination.xml");
                        });
                    } else {
                        return callback(null,"Not modified sorted_destination.xml");
                    }
                });
            }
        ], function seriesResponce(err, responce){
            console.log("Series Responce: ", responce);
        }
    );








} catch(errorMessage) {
    console.log("Execution stopped:- ", errorMessage);
}