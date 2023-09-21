let fecha
let consumo = 0
let consumoGen = 0

$(document).ready(function()
{
  $.getJSON('20 9 2023.json',function(data2) {
    let tarde = []
    let tardeGen = []
    consumo = function(){
        let suma = 0
        for (let x  in data2['grid']){
            fecha = new Date(data2['grid'][x].timestamp*1000).toISOString()
            suma += data2['grid'][x].value
        }
        return suma.toFixed(3) 
    }
    consumoGen = function(){
    let suma = 0
    for (let x  in data2['generation']){
        fecha = new Date(data2['generation'][x].timestamp*1000).toISOString()
        suma += data2['generation'][x].value
    }
    return suma.toFixed(3)
}
graficarDatos_2([consumo()],tarde,[consumoGen()],tardeGen,['1 Semana'])
})
    $.getJSON('13 9 2023.json',function(data) {
        let tarde = []
        let tardeGen = []
        consumo = function(){
            let suma = 0
            for (let x  in data['grid']){
                fecha = new Date(data['grid'][x].timestamp*1000).toISOString()
                suma += data['grid'][x].value
            }
            return suma.toFixed(3) 
        }
        consumoGen = function(){
        let suma = 0
        for (let x  in data['generation']){
            fecha = new Date(data['generation'][x].timestamp*1000).toISOString()
            suma += data['generation'][x].value
        }
        return suma.toFixed(3)
    }
        graficarDatos([consumo()],tarde,[consumoGen()],tardeGen,['1 Semana'])
        
    })
});

function cualgrafica(gridM,gridT,solarM,solarT) {
    if (gridM.lenght > 1 && gridT.length > 1 && solarM.length > 1 && solarT.length > 1){
        return 0
    }
    else if (gridM.length > 1 && gridT.length == 0 && solarM.lenght > 1 && solarT.length == 0){
        return 1
    }
    else if (gridM.length == 1 && gridT.length == 0 && solarM.length == 1 && solarT.length == 0){
        return 2
    }
}

function graficarDatos(gridM,gridT,solarM,solarT,dias)
{
    let dato = [
        ['Mañana Grid','Tarde Grid','Mañana Solar','Tarde Solar'],
        ['Dia Grid','Dia Solar'],
        ['Semana Grid','Semana Solar']
    ]

    let  mostrar = cualgrafica(gridM,gridT,solarM,solarT)

    //var myChart = echarts.init(document.getElementById('main'));
    var dom = document.getElementById('main');
    var myChart = echarts.init(dom, null, {renderer: 'canvas',useDirtyRect: false});
    var app = {};

    const posList = [
      'left',
      'right',
      'top',
      'bottom',
      'inside',
      'insideTop',
      'insideLeft',
      'insideRight',
      'insideBottom',
      'insideTopLeft',
      'insideTopRight',
      'insideBottomLeft',
      'insideBottomRight'
    ];
    app.configParameters = {
      rotate: {
        min: -90,
        max: 90
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right'
        }
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom'
        }
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {})
      },
      distance: {
        min: 0,
        max: 100
      }
    };
    app.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: function () {
        const labelOption = {
          rotate: app.config.rotate,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          position: app.config.position,
          distance: app.config.distance
        };
        myChart.setOption({
          series: [
            {
              label: labelOption
            },
            {
              label: labelOption
            },
            {
              label: labelOption
            },
            {
              label: labelOption
            }
          ]
        });
      }
    };
    const labelOption = {
      show: true,
      position: app.config.position,
      distance: app.config.distance,
      align: app.config.align,
      verticalAlign: app.config.verticalAlign,
      rotate: app.config.rotate,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {}
      }
    };

    let serie = [       
      [{
      name: 'Mañana Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridM
    },
    {
      name: 'Tarde Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridT
    },
    {
      name: 'Mañana Solar',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarM.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    },
    {
      name: 'Tarde Solar',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarT.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    }],

    [{
      name: 'Dia Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridM
    },
    {
      name: 'Dia Solar',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarM.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    }],//Muestra la grafica de 1 dia

    [ {
      name: 'Semana Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridM
    },
    {
      name: 'Semana Solar',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarM.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    }
  ]//Muestra la grafica de 1 semana
  ]

    var option = {
      title: {
        text: '3'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: dato[mostrar]
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          name: 'Grid/Solar',
          axisTick: { show: false },
          data: dias
        }
      ],
      yAxis: [
        {
          name:'Kilowatios',
          type: 'value'
        }
      ],
      series: serie[mostrar]
    };
      myChart.setOption(option);
}


//esta parte del codigo muestra la segunda grafica

function graficarDatos_2(gridM,gridT,solarM,solarT,dias)
{
    let dato = [
        ['Mañana Grid','Tarde Grid','Mañana Solar','Tarde Solar'],
        ['Dia Grid','Dia Solar'],
        ['Semana Grid','Semana Solar']
    ]

    let  mostrar = cualgrafica(gridM,gridT,solarM,solarT)

    //var myChart = echarts.init(document.getElementById('main'));
    var dom2 = document.getElementById('main2');
    var myChart2 = echarts.init(dom2, null, {renderer: 'canvas',useDirtyRect: false});
    var app2 = {};
    const posList = [
      'left',
      'right',
      'top',
      'bottom',
      'inside',
      'insideTop',
      'insideLeft',
      'insideRight',
      'insideBottom',
      'insideTopLeft',
      'insideTopRight',
      'insideBottomLeft',
      'insideBottomRight'
    ];
    app2.configParameters = {
      rotate: {
        min: -90,
        max: 90
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right'
        }
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom'
        }
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {})
      },
      distance: {
        min: 0,
        max: 100
      }
    };
    app2.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: function () {
        const labelOption = {
          rotate: app2.config.rotate,
          align: app2.config.align,
          verticalAlign: app2.config.verticalAlign,
          position: app2.config.position,
          distance: app2.config.distance
        };
        myChart2.setOption({
          series: [
            {
              label: labelOption
            },
            {
              label: labelOption
            },
            {
              label: labelOption
            },
            {
              label: labelOption
            }
          ]
        });
      }
    };
    const labelOption = {
      show: true,
      position: app2.config.position,
      distance: app2.config.distance,
      align: app2.config.align,
      verticalAlign: app2.config.verticalAlign,
      rotate: app2.config.rotate,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {}
      }
    };

    let serie = [       
      [{
      name: 'Mañana Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridM
    },
    {
      name: 'Tarde Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridT
    },
    {
      name: 'Mañana Solar',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarM.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    },
    {
      name: 'Tarde Solar',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarT.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    }],

    [{
      name: 'Dia Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridM
    },
    {
      name: 'Dia Solar',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarM.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    }],//Muestra la grafica de 1 dia

    [ {
      name: 'Semana Grid',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: gridM
    },
    {
      name: 'Semana Solar',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: solarM.map((x) => x > 0 ? {value:x,itemStyle:{color:'red'}}:{value:x,itemStyle:{color:'red'}})
    }
  ]//Muestra la grafica de 1 semana
  ]

    var option = {
      title: {
        text: '132'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: dato[mostrar]
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          name: 'Grid/Solar',
          axisTick: { show: false },
          data: dias
        }
      ],
      yAxis: [
        {
          name:'Kilowatios',
          type: 'value'
        }
      ],
      series: serie[mostrar]
    };
      myChart2.setOption(option);
}