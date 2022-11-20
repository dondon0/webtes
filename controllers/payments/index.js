const { request } = require('express');
const CoreApi = require('../midtrans/coreApi');
const coreApi= require('../midtrans/coreApi');
const bankTf= require('./banktransfer');

class Index{
    async bankTransfer({request,response}){
        let data;
        let body=request.body;
        let customers={
            email:"itis@gmail.com",
            first_name:"IT",
            last_name:"IS",
            phone:"081234567890"
        }

        let bankTransfer= new bankTf(body.items,customers);
        switch (body.channel) {
            case "BCA":
                data=bankTf.bca()
                
                break;
            case "BNI":
                data=bankTf.bni()
                break; 
            case "PERMATA":
                data=bankTf.permata()
                break;       
        }
        return data;
        return CoreApi.charge(data);
    }
}

module.exports= Index;