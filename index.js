const { createApp, ref } = Vue
var myChart = echarts.init(document.getElementById('main'));
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

$(document).ready(function() {
    $("#energia").change(function() {
        let n = $('#energia option:selected').val()//html();
        let tiempoValor = energia[Number(n)]
        if (tiempoValor === undefined) {
            tiempoValor = []
        }
        var data1 = []
        var data2 = []
        tiempoValor.forEach(x =>{ 
            data1.push(x.time)
            data2.push(x.value)
        })
        //codigo para insertar datos en la tabla
        let measurementTable = '<table cellspacing="10" cellpadding="10" border="1">'
        measurementTable = measurementTable + '<tr> <th> Time </th> <th> Value </th>'
        tiempoValor.forEach(measurement =>{
            measurementTable = measurementTable + '<tr>'
            measurementTable = measurementTable + '<td>' + measurement.time + '</td>'
            measurementTable = measurementTable + '<td>' + measurement.value + '</td>'
            measurementTable = measurementTable + '</tr>'
        });
        measurementTable = measurementTable + '</table>'
        $('#measurements').html(measurementTable)//JSON.stringify(tiempoValor))

        var option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data1
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: data2,
                    type: 'line',
                    areaStyle: {}
                  }
                ]
              };
              // Display the chart using the configuration items and data just specified.
              myChart.setOption(option);

        data1 = []
    });
});