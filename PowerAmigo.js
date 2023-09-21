let dia = new Date()
let mes = new Date()
let año = new Date()
let fecha = dia.getDate()+' '+(mes.getMonth()+1)+' '+año.getFullYear()


function ApiPost(url,data) {
    fetch(url, {
        method: "POST", // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => Datos(response['api_token']))

}
function PedirDatos(url_3,response){
    fetch(url_3, {
        method: "GET", // or 'PUT'
        headers: {
            'Authorization': "Bearer" + ' ' + response
        },
    })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => verdatos(response))
}
function Datos(respuesta) {
    var url_3 = 'https://poweramigo.com/smr/api/get/132/data?date_start=2023-08-01&time_start=00:00:00&date_end=2023-08-08&units=P&interval=1minute&time_end=23:59:00'
    PedirDatos(url_3,respuesta)
}

function verdatos(d){
    const fs = require('fs');
    fs.writeFile(fecha + '.json', JSON.stringify(d),'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

var url = "https://poweramigo.com/smr/api/login";
var data = { email: "juan.gutierrez@gmail.com",password: 1234}
ApiPost(url,data)