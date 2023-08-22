// Initialize the echarts instance based on the prepared dom
var myChart = echarts.init(document.getElementById('grafica'));
var p = document.getElementsByTagName("input")
var boton = document.querySelector('#accionar')
var medida = document.getElementById('medida')

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

function medida_solar() {
  solar.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == 60) {
        bandera = 0
        data_solar.push((data/60).toFixed(2))
        data = 0
    }
})
return data_solar
}
function bateria_solar(){
  battery_solar.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == 60) {
      bandera = 0
      data_battery_solar.push((data/60).toFixed(2))
      data = 0
    }
  })
  return data_battery_solar
}

function potencia_bateria(){
  battery_power.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == 60) {
      bandera = 0
      data_battery_power.push((data/60).toFixed(2))
      data = 0
    }
  })
  return data_battery_power
}
function medicion_red(){
  grid_measurement.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == 30) {
      bandera = 0
      data_grid_measurement.push((data/30).toFixed(2))
      data = 0
    }
  })
  return data_grid_measurement
}
function generador(){
  generator.forEach(x=>{
    data += x.value
    bandera += 1
    if (bandera == 30) {
      bandera = 0
      data_generator.push((data/30).toFixed(2))
      data = 0
    }
  })
  return data_generator
}
/////////////////////////////////////////////////////////////////////
function eleccion(){

  if (p[0].checked)
  {
    switch (medida.value){
      case "0":
        let n = 0
        let measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr> <th> Time </th> <th> Value </th>'
        console.log(medida_solar())
        medida_solar().forEach( measurement => {
          n += 1
          measurementTable = measurementTable + '<tr>'
          measurementTable = measurementTable + '<td>' + n + '</td>'
          measurementTable = measurementTable + '<td>' + measurement + '</td>'
          measurementTable = measurementTable + '</tr>'})
          document.getElementById('tabla').innerHTML = measurementTable
    }
  }
  if (p[1].checked)
  {
      console.log('Oprimio el de las 3 hora')
      console.log(medida.value)
  }
  if (p[2].checked)
  {
      console.log('Oprimio el de las 6 hora')
  }
  if (p[3].checked)
  {
      console.log('Oprimio el de las 12 hora')
  }
  }
  
  boton.addEventListener("click", function(){
      eleccion()
  })

  
/////////////////////////////////////////////////////////////////////
var option = {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['MEDIDA SOLAR','NIVEL BATERIA','POTENCIA BATERIA','MEDICION DE RED','MEDIDA DE GENERADOR']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'MEDIDA SOLAR',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: medida_solar()
      },
      {
        name: 'NIVEL BATERIA',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: bateria_solar()
      },
      {
        name:'POTENCIA BATERIA',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: potencia_bateria()
      },
      {
        name: 'MEDICION DE RED',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: medicion_red()
      },
      {
        name: 'MEDIDA DE GENERADOR',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: generador()
      }
    ]
  };
// Display the chart using the configuration items and data just specified.
myChart.setOption(option);