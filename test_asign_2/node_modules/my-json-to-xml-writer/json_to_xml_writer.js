var fs = require("fs");
var prompt = require("prompt");
var builder = require("xmlbuilder");



//Public function to write xml file.
function json_to_xml_writer(fileName, studentArray, xmlFileWriterCallback)
{
    try
    {
        if(fileName == "" ) {
            return xmlFileWriterCallback(null, "FileName not provided.");
        }
        if( !(studentArray) || studentArray == undefined ) {
            return xmlFileWriterCallback(null, "Invalid JSON object received."); 
        }

        checkExistanceOfFile(fileName, function fileExistsCallback(error, exsist)
        {
            if(error) {
                console.log("Error: ", error);
                return xmlFileWriterCallback(null, "Failed " + fileName);
            }
            if(!exsist) {
                writeXMLFile(fileName, studentArray, function writeXMLHandler(error, success)
                {
                    if(error) {
                        console.log("Error: ", error);
                        return xmlFileWriterCallback(null, "Failed " + fileName);
                    }
                    return xmlFileWriterCallback(null, "Modified " + fileName);
                });
            } else {
                return xmlFileWriterCallback(null, "Not modified " + fileName);
            }
        });
    } catch (errorMessage) {
        console.log("json_to_xml_writer terminated abnormally: " + errorMessage);
        return xmlFileWriterCallback(null, "process terminated.");
    }
}

//Private function to read exsistace of the file with the given name/path.
function checkExistanceOfFile(fileName, existstanceCallback)
{
    try
    {
        if(!fs.existsSync(fileName)) {
            return existstanceCallback(null, 0);
        }
        console.log(fileName+ " is already exists... Do you like to overWrite? (y/n)");
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
                checkPermission(fileName, function filePermissionCallback(err, writeAccess) {
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
    } catch (errorMessage) {
        console.log("Reading permissions failed: ", errorMessage);
        return existstanceCallback("Reading permissions for " + fileName + " terminated abnormally.", null);
    }
        
}

//Private function for accessing data from array and write in xml file.
function writeXMLFile(xmlFile, inputArray, writeXMLCallback)
{
    try
    {
        var rootElement = builder.create("Students");
        for(x in inputArray) {
            var student = rootElement.ele('Student', {'id': inputArray[x].id});
            student.ele('name', inputArray[x].fName +" "+ inputArray[x].lName);
            student.ele('score', inputArray[x].score);
        }
        var xmlString = rootElement.end({pretty: true});
        fs.writeFileSync(xmlFile, xmlString);
        if(!fs.existsSync(xmlFile)) {
            return writeXMLCallback(xmlFile + " not created successfully.", null);
        }
        return writeXMLCallback(null, xmlFile + " is created successfully. Thank you.");

    } catch (errorMessage) {
        console.log("Writing XML file failed: ", errorMessage);
        return writeTextCallback("Writing " + fileName + " terminated abnormally.", null);
    }
}

//Private function to check permission of file
function checkPermission(file, cb)
{
    try
    {
        //r,w,x ----> 4,2,1 
        var mask = 2;
        fs.stat (file, function statResponce(error, stats){
            if(error){
                return cb (error, null);
            } else {
                return cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
            }
        });
    } catch (errorMessage) {
        console.log("Checking file permission failed: ", errorMessage);
        return cb("Checking file permission terminted abnormally.", null);
    }
};



module.exports.json_to_xml_writer = json_to_xml_writer;