'use strict';

const express= require('express');
const bodyParser = require('body-parser');
const request = require('request');

const access_token = "EAAIhiCsv0VMBAAtSrpfUYdNKZAnfBnxfj6ZAZB8Y6AKunkQGi71wXEQKMiU4Q6mcuZA0ZCD3inDgokYffL0iGTR1kyhPXvMuZBYg2kWYN21TZBBUc1YOmZCB8wkx9WPlLkwM1ZCViRnxZCBpZBVvxxuVQNNhVZAPK4ndsE037UXCssB7QQZDZD";

const app = express();

app.use(bodyParser.json());

app.get('/', function (req, response) {
  response.send('Hola Mundo');
});

app.get('/webhook', (req, response) => {
  if(req.query['hub.verify_token'] === 'gobot_token'){
    response.send(req.query['hub.challenge']);
  }else{
    response.send('GoBot no tiene permisos');
  }
});

app.post('/webhook/', function (req, res) {
  const webhook_event = req.body.entry[0];

  if(webhook_event.messaging){
    webhook_event.messaging.forEach(event => {
      handleEvent(event.sender.id, event);
    })
    res.sendStatus(200);
  }
})


function handleEvent(senderId, event){
  
  if(event.postback) {
      handlePostback(senderId, event.postback.payload)
  }else if(event.message && event.message.quick_reply) {
      handlePostback(senderId, event.message.quick_reply.payload)
  }else if(event.message){
      handleMessage(senderId, event.message)
  }

  // if(event.message){
  //   handleMessage(senderId, event.message);
  // }else if(event.postback) {
  //   handlePostback(senderId, event.message.postback.payload);
  // }
}

function handleMessage(senderId, event){
  if(event.text){
    getLocation(senderId);
    //receipt(senderId);
    //callSendApi(senderId);
    //contactSuppport(senderId);
  }else if(event.attachments){
    handleAttachment(senderId, event);
  }
}

function defaultMessage(senderId){
  const messagedata = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "text": "Hola bienvenido a GoBot, tu código ¿De que refresco es?",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "Pepsi",
          "payload": "PEPSI_PAYLOAD"
        },
        {
          "content_type": "text",
          "title": "Pepsi Black",
          "payload": "PEPSIBLACK_PAYLOAD"
        },
        {
          "content_type": "text",
          "title": "Manzanita",
          "payload": "MANZANITA_PAYLOAD"
        },
        {
          "content_type": "text",
          "title": "Mirinda",
          "payload": "MIRINDA_PAYLOAD"
        }
      ]
    }
  }
  senderActions(senderId);
  callSendApi(messagedata);
}

function handlePostback(senderId, payload) {
  console.log(payload);
  switch (payload) {
    case "GET_STARTED_GOBOT":
      console.log(payload);
      const messagedata = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "Bienvenido"
        }
      }
      callSendApi(messagedata);
      break;
    case "PIZZAS_PAYLOAD":
      showPizzas(senderId);
      break;
  }
}

function senderActions(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId,
    },
    "sender_action": "typing_on"
    //"sender_action": "mark_seen"
  }
  callSendApi(messageData);
}

function handleAttachment(senderId, event){
  console.log(event);
  let attachment_type = event.attachments[0].type;
  switch (attachment_type) {
    case "imagen":
      console.log(attachment_type);
      break;
    case "video":
      console.log(attachment_type);
      break;
    case "audio":
      console.log(attachment_type);
      break;
    case "file":
      console.log(attachment_type);
      break;
  }
}

function callSendApi(response) {
  request({
    "uri": `https://graph.facebook.com/v5.0/me/messages?access_token=${access_token}`,
    "method": "POST",
    "json": response
  }),
  function(err){
    if(err){
      console.log('Ha ocurrido un error');
    }else{
      console.log('Mensaje Enviado');
    }
  }
}

function showLocations(senderId) {
  console.log('ada');
  const messageData = {
      "recipient": {
          "id": senderId
      },
      "message": {
          "attachment": {
              "type": "template",
              "payload": {
                  "template_type": "list",
                  "top_element_style": "large",
                  "elements": [
                      {
                          "title": "Sucursal Mexico",
                          "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                          "subtitle": "Direccion bonita #555",
                          "buttons": [
                              {
                                  "title": "Ver en el mapa",
                                  "type": "web_url",
                                  "url": "https://goo.gl/maps/GCCpWmZep1t",
                                  "webview_height_ratio": "full"
                              }
                          ]
                      },
                      {
                          "title": "Sucursal Colombia",
                          "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                          "subtitle": "Direccion muy lejana #333",
                          "buttons": [
                              {
                                  "title": "Ver en el mapa",
                                  "type": "web_url",
                                  "url": "https://goo.gl/maps/GCCpWmZep1t",
                                  "webview_height_ratio": "tall"
                              }
                          ]
                      }
                  ]
              }
          }
      }
  }
  callSendApi(messageData);
}

function showPizzas(senderId){
  const messageData = {
    "recipient": {
      "id": senderId,
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": "Peperoni",
              "subtitle": "Con todo el sabor del peperoni",
              "image_url": "https://okdiario.com/img/2019/09/26/curiosidades-de-la-pizza_--es-italiana-655x368.jpg",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Elegir Peperoni",
                  "payload": "PEPERONI_PAYLOAD"
                },
                {
                  "type": "postback",
                  "title": "Elegir Peperoni",
                  "payload": "PEPERONI_PAYLOAD2"
                },
                {
                  "type": "postback",
                  "title": "Elegir Peperoni",
                  "payload": "PEPERONI_PAYLOAD3"
                }
              ]
            },
            {
              "title": "Hawaiana",
              "subtitle": "Con todo el sabor del jamon",
              "image_url": "https://okdiario.com/img/2019/09/26/curiosidades-de-la-pizza_--es-italiana-655x368.jpg",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Elegir Hawaiana",
                  "payload": "HAWAIANA_PAYLOAD"
                }
              ]
            }
          ]
        }
      }
    }
  }
  callSendApi(messageData);
}

function messageImage(senderId) {
  const messageData = {
      "recipient": {
          "id": senderId
      },
      "message": {
          "attachment": {
              "type": "image",
              "payload": {
                  "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif"
              }
          }
      }
  }
  callSendApi(messageData);
}

function contactSuppport(senderId) {
  const messageData = {
      "recipient": {
          "id": senderId
      },
      "message": {
          "attachment": {
              "type": "template",
              "payload": {
                  "template_type": "button",
                  "text": "Hola este es el canal de soporte, ¿quieres llamarnos?",
                  "buttons": [
                      {
                          "type": "phone_number",
                          "title": "Llamar a un asesor",
                          "payload": "+571231231231"
                      }
                  ]
              }
          }
      }
  }
  callSendApi(messageData);
}

function receipt(senderId) {
  const messageData = {
      "recipient": {
          "id": senderId
      },
      "message": {
          "attachment": {
              "type": "template",
              "payload": {
                  "template_type": "receipt",
                  "recipient_name": "Oscar Barajas",
                  "order_number": "123123",
                  "currency": "MXN",
                  "payment_method": "Efectivo",
                  "order_url": "https://platzi.com/order/123",
                  "timestamp": "123123123",
                  "address": {
                      "street_1": "Platzi HQ",
                      "street_2": "---",
                      "city": "Mexico",
                      "postal_code": "543135",
                      "state": "Mexico",
                      "country": "Mexico"
                  },
                  "summary": {
                      "subtotal": 12.00,
                      "shipping_cost": 2.00,
                      "total_tax": 1.00,
                      "total_cost": 15.00
                  },
                  "adjustments": [
                      {
                          "name": "Descuento frecuent",
                          "amount": 1.00
                      }
                  ],
                  "elements": [
                      {
                          "title": "Pizza Pepperoni",
                          "subtitle": "La mejor pizza de pepperoni",
                          "quantity": 1,
                          "price": 10,
                          "currency": "MXN",
                          "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                      },
                      {
                          "title": "Bebida",
                          "subtitle": "Jugo de Tamarindo",
                          "quantity": 1,
                          "price": 2,
                          "currency": "MXN",
                          "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                      }
                  ]
              }
          }
      }
  }
  callSendApi(messageData);
}

function getLocation(senderId){
  console.log('aa');
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "text": "Ahora Danos tu ubicación",
      "quick_replies": [
        {
          "content_type": "location"
        }
      ]
    }
  }
  callSendApi(messageData);
}


app.listen(5000);
console.log('La aplicacion esta escuchando en http://localhost:5000');