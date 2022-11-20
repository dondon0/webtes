const apireq= require('./apirequest');
const config=require('./config');
class CoreApi{
    static charge(payloads){
        let result= apireq.post(
            config.getBaseUrl()+"/charge",config.serverKey,payloads
        );
        return result;
    }
}

module.exports=CoreApi