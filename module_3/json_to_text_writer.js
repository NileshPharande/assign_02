var fs = require("fs");
var prompt = require("prompt");



//Public function to write text file
function json_to_text_writer(fileName, jsonObject, textFileWriterCallback)
{
    try
    {
        if(fileName == "" ) {
            return textFileWriterCallback(null, "FileName not provided.");
        }
        if( !(jsonObject) || jsonObject == undefined ) {
            return textFileWriterCallback(null, "Invalid JSON object received."); 
        }

        checkExistanceOfFile(fileName, function fileExistsCallback(error, exsist)
        {
            if(error) {
                console.log("Error: ", error);
                return textFileWriterCallback(null, "Failed " + fileName);
            }
            if(!exsist) {
                writeTextFile(fileName, studentArray, function writeTextHandler(error, success)
                {
                    if(error) {
                        console.log("Error: ", error);
                        return textFileWriterCallback(null, "Failed " + fileName);
                    }
                    return textFileWriterCallback(null,"Modified " + fileName);
                });
            } else {
                return textFileWriterCallback(null,"Not modified " + fileName);
            }
        });
    } catch (errorMessage) {
    	console.log("json_to_text_writer terminated abnormally: " + errorMessage);
        return textFileWriterCallback(null, "process terminated.");
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

//Private function for accessing data from array and write in text file.
function writeTextFile(textFile, array, writeTextCallback)
{
    try
    {
        fs.writeFileSync(textFile, "First Name | Last Name | Score\n");
        for(var x = 0; x < array.length; ++x)
        {
            fs.appendFileSync(textFile, array[x].id +" | "+ array[x].fName +" | "+ array[x].lName +" | "+ array[x].score +"\n");
        }
        if(!fs.existsSync(textFile)) {
            return writeTextCallback(textFile + " not created successfully.", null);
        }
        return writeTextCallback(null, textFile + " is created successfully. Thank you.");
    } catch (errorMessage) {
        console.log("Writing text file failed: ", errorMessage);
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



module.exports.json_to_text_writer = json_to_text_writer;