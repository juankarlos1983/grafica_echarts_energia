let fecha
let consumo = 0
let consumoGen = 0

$(document).ready(function()
{
    $.getJSON('13 9 2023.json',function(data) {
        $("#12-horas").click(function(){
            let mañana = []
            let tarde = []
            let dias = []
            let mañanaGen = []
            let tardeGen = []
            consumo = function(){
                let suma = 0
                let contenedor = []
                for (let x  in data['grid']){
                    fecha = new Date(data['grid'][x].timestamp*1000).toISOString()
                    suma += data['grid'][x].value
                    fecha.split('T')[0].split('-')[2] 
                    if (fecha.split('T')[1] == '11:59:00.000Z' || fecha.split('T')[1] == '23:59:00.000Z'){
                        contenedor.push([suma,fecha.split('T')[0].split('-')[2]])
                        suma = 0
                    }
                }
                return contenedor    
            }
            consumoGen = function(){
                let suma = 0
                let contenedor = []
                for (let x  in data['generation']){
                    fecha = new Date(data['generation'][x].timestamp*1000).toISOString()
                    suma += data['generation'][x].value
                    fecha.split('T')[0].split('-')[2] 
                    if (fecha.split('T')[1] == '11:59:00.000Z' || fecha.split('T')[1] == '23:59:00.000Z'){
                        contenedor.push([suma,fecha.split('T')[0].split('-')[2]])
                        suma = 0
                    }
                }
                return contenedor
            }

            for (let i = 0;i< consumo().length;i++){
                if (i%2 == 0){
                    mañana.push(consumo()[i][0])
                    mañanaGen.push(consumoGen()[i][0])
                    dias.push(consumo()[i][1])
                }
                else {
                    tarde.push(consumo()[i][0])
                    tardeGen.push(consumoGen()[i][0])
                }
            }
            graficarDatos(mañana,tarde,mañanaGen,tardeGen,dias)
            tabla(consumo(),consumoGen())
        })
        $("#1-dia").click(function(){
            let manTarde = []
            let manTardeGen = []
            let tarde = []
            let tardeGen = []
            let dias = []
            consumo = function(){
                let suma = 0
                let contenedor = []
                for (let x  in data['grid']){
                    fecha = new Date(data['grid'][x].timestamp*1000).toISOString()
                    suma += data['grid'][x].value
                    fecha.split('T')[0].split('-')[2] 
                    if (fecha.split('T')[1] == '23:59:00.000Z'){
                        contenedor.push([suma,fecha.split('T')[0].split('-')[2]])
                        suma = 0
                    }
                }
                return contenedor    
            }
            consumoGen = function(){
                let suma = 0
                let contenedor = []
                for (let x  in data['generation']){
                    fecha = new Date(data['generation'][x].timestamp*1000).toISOString()
                    suma += data['generation'][x].value
                    fecha.split('T')[0].split('-')[2] 
                    if (fecha.split('T')[1] == '23:59:00.000Z'){
                        contenedor.push([suma,fecha.split('T')[0].split('-')[2]])
                        suma = 0
                    }
                }
                return contenedor
            }
            consumo().forEach(x => {
                manTarde.push(x[0])
                dias.push(x[1])
            });
            consumoGen().forEach(x => {
                manTardeGen.push(x[0])
            });
            graficarDatos(manTarde,tarde,manTardeGen,tardeGen,dias)
            tabla(consumo(),consumoGen())
        })
        $("#1-semana").click(function(){
            let tarde = []
            let tardeGen = []
            consumo = function(){
                let suma = 0
                for (let x  in data['grid']){
                    fecha = new Date(data['grid'][x].timestamp*1000).toISOString()
                    suma += data['grid'][x].value
                }
                return suma 
            }
            consumoGen = function(){
            let suma = 0
            for (let x  in data['generation']){
                fecha = new Date(data['generation'][x].timestamp*1000).toISOString()
                suma += data['generation'][x].value
            }
            return suma
        }
            graficarDatos([consumo()],tarde,[consumoGen()],tardeGen,'1')
            tabla([consumo()],[consumoGen()])
        })
    })
});

function tabla(consumo,consumoGen)
{
    let registros = '<br><table>'
    if (consumo.length == 16){
        registros = registros + '<colgroup span="2" width="100"></colgroup>'
        registros = registros + '<colgroup span="2" width="100"></colgroup>'
        registros = registros + '<tr>'
        registros = registros + '<td colspan="2">GRID</td>'
        registros = registros + '<td colspan="2">GENERATION</td>'
        registros = registros + '</tr>'
        registros = registros + '<tr>'
        registros = registros + '<td>Mañana</td>'
        registros = registros + '<td>Tarde</td>'
        registros = registros + '<td>Mañana</td>'
        registros = registros + '<td>Tarde</td>'
        registros = registros + '</tr>'
        for (let i = 0; i < consumo.length-1; i += 2){
            registros = registros + '<tr>'
            registros = registros + '<td>'+consumo[i][0].toFixed(3)+'</td>'
            registros = registros + '<td>'+consumo[i+1][0].toFixed(3)+'</td>'
            registros = registros + '<td>'+consumoGen[i][0].toFixed(3)+'</td>'
            registros = registros + '<td>'+consumoGen[i+1][0].toFixed(3)+'</td>'
            registros = registros + '</tr>'
        }
    }
    if (consumo.length == 8) {
        registros = registros + '<tr>'
        registros = registros + '<td>GRID</td>'
        registros = registros + '<td>GENERATION</td>'
        registros = registros + '</tr>'
        for (let i = 0; i < consumo.length; i++){
            registros = registros + '<tr>'
            registros = registros + '<td>'+consumo[i][0].toFixed(3)+'</td>'
            registros = registros + '<td>'+consumoGen[i][0].toFixed(3)+'</td>'
            registros = registros + '</tr>'
        }
    }
    if (consumo.length == 1) {
        registros = registros + '<tr>'
        registros = registros + '<td>GRID</td>'
        registros = registros + '<td>GENERATION</td>'
        registros = registros + '</tr>'
        registros = registros + '<tr>'
        registros = registros + '<td>'+consumo[0].toFixed(3)+'</td>'
        registros = registros + '<td>'+consumoGen[0].toFixed(3)+'</td>'
        registros = registros + '</tr>'
    }
    registros = registros + '</table>'
    $("#tabla").html(registros)
}

function graficarDatos(mañana,tarde,mañanaGen,tardeGen,dias){
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
        title: {
          text: 'Potencia \nConsumida'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Mañana grid','Tarde grid','Mañana gen','Tarde gen']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
        xAxis: {
            boundaryGap: [0, 0.01],
            data: dias
        },

        yAxis: {},
        series: [
          {
            name: 'Mañana grid',
            type: 'bar',
            data: mañana.map((x) => x < 0 ? 
            {value:x,itemStyle:{color:'green'}} : {value:x,itemStyle:{color:'#ABEBC6'}})
          },
          {
            name: 'Tarde grid',
            type: 'bar',
            data: tarde.map((x) => x < 0 ? 
            {value:x,itemStyle:{color:'green'}} : {value:x,itemStyle:{color:'#ABEBC6'}})
          },

          {
            name: 'Mañana gen',
            type: 'bar',
            data: mañanaGen.map((x) => x < 0 ? 
            {value:x,itemStyle:{color:'blue'}} : {value:x,itemStyle:{color:'yellow'}})
          },
          {
            name: 'Tarde gen',
            type: 'bar',
            data: tardeGen.map((x) => x < 0 ? 
            {value:x,itemStyle:{color:'blue'}} : {value:x,itemStyle:{color:'yellow'}})
          }

        ]
      };
      // Display the chart using the configuration items and data just specified.
      myChart.setOption(option);
}