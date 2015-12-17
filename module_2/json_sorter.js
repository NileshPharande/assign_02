

//Public function to sort json.
function json_sorter(inputJSON, sorterCallback)
{
    try
    {
        if(!(inputJSON) || inputJSON == undefined || inputJSON == {}) {
            return sorterCallback("Invalid JSON object received.", null);
        }

        //Checking for all expected key-value pairs are present in source.json or not
        var studentArray = inputJSON.students;
        if(!(studentArray)) {
        	return sorterCallback("students array not found in received JSON object.", null);
        }
        for(x in studentArray)
        {
            if(!(studentArray[x].id)) {
                return sorterCallback("In student Record " +x+ ", id not present.", null);
            }
            if(!(studentArray[x].fName)) {
                return sorterCallback("In student Record " +x+ ", fName not present.", null);
            }
            if(!(studentArray[x].lName)) {
                return sorterCallback("In student Record " +x+ ", lName not present.", null);
            }
            if(!(studentArray[x].score)) {
                return sorterCallback("In student Record " +x+ ", score not present.", null);
            }
        }

        //(a-b) for asending sort and (b-a) for desending sort.
        studentArray.sort(function(a, b){return b.score - a.score;});
        inputJSON.students = studentArray;    //Not making difference actually.
        return sorterCallback(null, inputJSON);

    } catch (errorMessage) {
        return sorterCallback("json_sorter terminated abnormally: " + errorMessage , null);
    }
    
}




module.exports.json_sorter = json_sorter;