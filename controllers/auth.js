const { request } = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
// var db = require('../db');
const midtransClient= require('midtrans-client');

const CLIENT_KEY= 'SB-Mid-client-lDMAT5qSUdOq3YmS';
const SERVER_KEY='SB-Mid-server-z5Grux1EzTijZEXx7qDFXPZV';

// Create Core API instance
let coreApi = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : SERVER_KEY,
    clientKey : CLIENT_KEY
});


let core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : SERVER_KEY,
    clientKey : CLIENT_KEY
});

let parameter = {
    "payment_type": "gopay",
    "gopay_partner": {
      "phone_number": "81212345678",
      "country_code": "62",
      "redirect_url": "https://www.gojek.com"
    }
};

// exports.goPay= async (req,res)=>{
//     let data;
//     let body=request.body;
//     let parameter = {
//         "payment_type": "gopay",
//         "gopay_partner": {
//           "phone_number": "81212345678",
//           "country_code": "62",
//           "redirect_url": "https://www.gojek.com"
//         }
//     };
//     let customers={
//         email:'test@gmail.com',
//         first_name:'si',
//         last_name:'pp',
//         phone:'12345678910',
//     }

//     var goPay=new E
// }

exports.charge=async(req,res)=>{
    console.log('Charge Request:',req.body);
    core.charge({
        "payment_type": "gopay",
        "transaction_details":{
            "gross_amount":a,
            "order_id": "md"+Math.round((new Date()).getTime() / 1000),
        },
        "item_details":[{
            "id":"id1",
            "price":a,
            "quantity":1,
            "name":"Batrai ABC"
        }],
        "customer_details":{
            "first_name":"IT",
            "last_name":"IS",
            "email":"its@gmail.com",
            "phone":"08123456789"
        },
        "gopay":{
            "enable_callback":true,
            "callback_url":"https://www.google.com/"
        }
    }).then((apiResponse)=>{
        res.send(`${JSON.stringify(apiResponse, null, 2)}`)
    }).catch((err)=>{
        res.send(`${JSON.stringify(err.ApiResponse, null, 2)}`)
    })
}

exports.checkTransaction=async(req,res)=>{
    console.log(`- Received check transaction status request:`,req.body);
    core.transaction.status(req.body.transaction_id).then((transactionStatusObject)=>{
        let orderId= transactionStatusObject.order_id;
        let transactionStatus= transactionStatusObject.transaction_status;
        let fraudStatus= transactionStatusObject.fraud_status;

        let summary = `Transaction Result. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw transaction status:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;

        // [5.A] Handle transaction status on your backend
      // Sample transactionStatus handling logic
      if (transactionStatus == 'capture'){
        if (fraudStatus == 'challenge'){
            // TODO set transaction status on your databaase to 'challenge'
        } else if (fraudStatus == 'accept'){
            // TODO set transaction status on your databaase to 'success'
        }
    } else if (transactionStatus == 'settlement'){
      // TODO set transaction status on your databaase to 'success'
      // Note: Non card transaction will become 'settlement' on payment success
      // Credit card will also become 'settlement' D+1, which you can ignore
      // because most of the time 'capture' is enough to be considered as success
    } else if (transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire'){
      // TODO set transaction status on your databaase to 'failure'
    } else if (transactionStatus == 'pending'){
      // TODO set transaction status on your databaase to 'pending' / waiting payment
    } else if (transactionStatus == 'refund'){
      // TODO set transaction status on your databaase to 'refund'
    }

    console.log(summary);
    res.send(JSON.stringify(transactionStatusObject, null, 2));
    })
}

exports.notification=async(req,res)=>{
    let receivedJson = req.body;
    core.transaction.notification(receivedJson)
    .then((transactionStatusObject)=>{
      let orderId = transactionStatusObject.order_id;
      let transactionStatus = transactionStatusObject.transaction_status;
      let fraudStatus = transactionStatusObject.fraud_status;

      let summary = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.<br>Raw notification object:<pre>${JSON.stringify(transactionStatusObject, null, 2)}</pre>`;

      // [5.B] Handle transaction status on your backend via notification alternatively
      // Sample transactionStatus handling logic
      if (transactionStatus == 'capture'){
          if (fraudStatus == 'challenge'){
              // TODO set transaction status on your databaase to 'challenge'
          } else if (fraudStatus == 'accept'){
              // TODO set transaction status on your databaase to 'success'
          }
      } else if (transactionStatus == 'settlement'){
        // TODO set transaction status on your databaase to 'success'
        // Note: Non-card transaction will become 'settlement' on payment success
        // Card transaction will also become 'settlement' D+1, which you can ignore
        // because most of the time 'capture' is enough to be considered as success
      } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire'){
        // TODO set transaction status on your databaase to 'failure'
      } else if (transactionStatus == 'pending'){
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      } else if (transactionStatus == 'refund'){
        // TODO set transaction status on your databaase to 'refund'
      }
      console.log(summary);
      res.send(summary);
    });
}

exports.snap=async(req,res)=>{
  let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : SERVER_KEY,
    clientKey : CLIENT_KEY
  });

  let parameter = {
    "transaction_details": {
      "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
      "gross_amount": 10000,
      "redirect_url": "https://www.gojek.com"
    }, "credit_card":{
      "secure" : true
    }
  };

  snap.createTransactionRedirectUrl(parameter)
      .then((redirectUrl)=>{
          console.log('redirectUrl:',redirectUrl);
      })

  snap.createTransactionToken(parameter).then((transactionToken)=>{
    res.render('snapCheckout',{
      token:transactionToken,
      clientKey:snap.apiConfig.clientKey
    })
  })

}

