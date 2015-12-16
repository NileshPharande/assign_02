var fs = require("fs");

var readJSON = function()
{
    this.readJSONFile = readJSONFile;

    //public function to read JSON file with given name.
    function readJSONFile(fileName, readJSONCallBack)
    {
        try
        {
            if(!fs.existsSync(fileName)) {
                return readJSONCallBack(fileName +" file is not present in current folder.", null);
            }
            checkPermission(fileName, function filePermissionCallback(err, readAccess) {
                if(err) {
                    return readJSONCallBack("Failed to read permissions of " +fileName, null);
                }
                if(!readAccess) {
                    return readJSONCallBack(fileName +" file is not readable.", null);
                }
                var sourceJSON = JSON.parse(fs.readFileSync(fileName));
                if(!sourceJSON) {
                    return readJSONCallBack("Failed to readJSON from "+ fileName, null);
                }
                return readJSONCallBack(null, sourceJSON);
            });
        } catch (errorMessage){
            return readJSONCallBack("json_reader terminated abnormally.", null);
        }
    }

    //private function to check read permissions.
    function checkPermission(file, cb){
        //r,w,x ----> 4,2,1 
        var mask = 4;
        fs.stat (file, function statResponce(error, stats){
            if (error){
                return cb (error, false);
            }else{
                return cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
            }
        });
    };
}

module.export = readJSON;