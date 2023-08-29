// Initialize the echarts instance based on the prepared dom
var myChart = echarts.init(document.getElementById('grafica'));
var boton = document.querySelector('#accionar')
var medida = document.getElementById('medida')
var p = document.getElementsByTagName('input')
let esquema

import {
    SOLAR_MEASUREMENT_MINUTE,
    BATTERY_LEVEL_MEASUREMENT_MINUTE,
    BATTERY_POWER_MEASUREMENT_MINUTE,
    GRID_MEASUREMENT_MINUTE,
    GENERATOR_MEASUREMENT_MINUTE
} from './demo-data.js'

let energia = [
    SOLAR_MEASUREMENT_MINUTE,
    BATTERY_LEVEL_MEASUREMENT_MINUTE,
    BATTERY_POWER_MEASUREMENT_MINUTE,
    GRID_MEASUREMENT_MINUTE,
    GENERATOR_MEASUREMENT_MINUTE
]

let data_solar = [] //este arreglo almacenara el vector con la media de energia
let data_battery_solar = []
let data_battery_power = []
let data_grid_measurement = []
let data_generator = []

let data = 0
let bandera = 0

var solar = energia[0]
var battery_solar = energia[1]
var battery_power = energia[2]
var grid_measurement = energia[3]
var generator = energia[4]

function medida_solar(porHora) {
  data_solar = []
  solar.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == porHora) {
        bandera = 0
        data_solar.push((data/100).toFixed(2))
        data = 0
    }
})
return data_solar
}
function bateria_solar(porHora){//Estos dotas seran representados por una linea
  data_battery_solar = []
  battery_solar.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == porHora) {
      bandera = 0
      data_battery_solar.push((data/100).toFixed(2))
      data = 0
    }
  })
  return data_battery_solar
}

function potencia_bateria(porHora){
  data_battery_power= []
  battery_power.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == porHora) {
      bandera = 0
      data_battery_power.push((data/100).toFixed(2))
      data = 0
    }
  })
  return data_battery_power
}
function medicion_red(porHora){
  data_grid_measurement = []
  grid_measurement.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == porHora/2) {
      bandera = 0
      data_grid_measurement.push((data).toFixed(2))
      data = 0
    }
  })
  return data_grid_measurement
}
function generador(porHora){
  data_generator = []
  generator.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == porHora/2) {
      bandera = 0
      data_generator.push((data).toFixed(2))
      data = 0
    }
  })
  return data_generator
}
/////////////////////////////////////////////////////////////////////
function graficar(agrupacion)
{
  let rango = []
  let vectorEnergia = [
    medida_solar(agrupacion),
    bateria_solar(agrupacion),
    potencia_bateria(agrupacion),
    medicion_red(agrupacion),
    generador(agrupacion)]
  
  vectorEnergia.forEach(dato =>{
    dato.forEach(valor =>{
      rango.push(Number(valor))
    })
  })

  let esquema = []
  for (let i = 1; i <= 1440/agrupacion;i++){
    esquema.push(i)
  }
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['Solar', 'Potencia de Bateria','Medicion de red','Generador','Bateria solar']
    },
    xAxis: [
      {
        type: 'category',
        data: esquema,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'KiloWatio/Hora',
        min: Math.min(...rango) - 1,
        max: Math.max(...rango) + 1,
        interval: 20,
        axisLabel: {
          formatter: '{value} KW/H'
        }
      },
      {
        type: 'value',
        name: 'Bateria Solar',
        min: Math.min(...rango) - 1,
        max: Math.max(...rango) + 1,
        interval: 20,
        axisLabel: {
          formatter: '{value} KW'
        }
      }
    ],
    series: [
      {
        name: 'Bateria solar',
        type: 'line',
        color:'#00bb2d',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' KW';
          }
        },
        data: bateria_solar(agrupacion)
      },
    
      {
        name: 'Solar',
        type: 'bar',
        color:'yellow',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' KW';
          }
        },
        data: medida_solar(agrupacion)
      },  
      {
        name: 'Potencia de Bateria',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            if (value > 0) {
              return value + ' Descarga KW';
            }
            else if (value < 0){
              return value + ' Carga KW';
            }
          }
        },
        data: potencia_bateria(agrupacion).map((x) => x < 0 ? 
        {value:x,itemStyle:{color:'green'}} : {value:x,itemStyle:{color:'#ABEBC6'}})
        //[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      },
      {
        name: 'Medicion de red',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' KW';
          }
        },
        data: medicion_red(agrupacion).map((x) => x < 0 ? 
        {value:x,itemStyle:{color:'#85C1E9'}} : {value:x,itemStyle:{color:'#1F618D'}})//[0.6, 0.9, 0.0, 6.4, 8.7, 0.7, 75.6, 82.2, 8.7, 8.8, 6.0, 3.3]
      },
    
      {
        name: 'Generador',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' KW';
          }
        },
        data: generador(agrupacion)//[10.6, 20.9, 30.0, 46.4, 58.7, 60.7, 75.6, 82.2, 8.7, 8.8, 6.0, 83.3]
      }
    ]
  };
    
  // Display the chart using the configuration items and data just specified.
  myChart.setOption(option);
}
/////////////////////////////////////////////////////////////////////
function eleccion(){
  let n = 0
  let measurementTable = ''

  if (p[0].checked)
  {
    graficar(60)
    switch (medida.value){
      case "0":{
        n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medida_solar(60).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          measurementTable = measurementTable + '</table>'
          document.getElementById('tabla').innerHTML = measurementTable
          break
        }
      case "1":{
        n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        bateria_solar(60).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
          break
        }
      case "2":{ n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        potencia_bateria(60).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
          break}
       
      case "3":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medicion_red(60).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
          break}
        
      case "4":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        generador(60).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
          break}
        
    }
  }
  if (p[1].checked)
  {
    graficar(60*3)
    switch (medida.value){
      case "0":{
        n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medida_solar(60*3).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
          break
        }
        
      case "1":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        bateria_solar(60*3).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "2":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        potencia_bateria(60*3).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "3":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medicion_red(60*3).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "4":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        generador(60*3).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
    }
  }
  if (p[2].checked)
  {
    graficar(60*6)
    switch (medida.value){
      case "0":{
        n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medida_solar(60*6).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
          break
        }
        
      case "1":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        bateria_solar(60*6).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "2":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        potencia_bateria(60*6).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "3":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medicion_red(60*6).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "4":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        generador(60*6).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
    }
  }
  if (p[3].checked)
  {
    graficar(60*12)
    switch (medida.value){
      case "0":{
        n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medida_solar(60*12).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
          break
        }
        
      case "1":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        bateria_solar(60*12).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "2":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        potencia_bateria(60*12).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "3":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'
        medicion_red(60*12).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
      case "4":{n = 0
        measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr>'//measurementTable + '<tr> <th> Time </th> <th> Value </th>'
        generador(60*12).forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
        break
      }
        
    }
  }
  }
  boton.addEventListener("click", function(){
      eleccion()
  })
/////////////////////////////////////////////////////////////////////
