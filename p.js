$(document).ready(function()
{
    let suma = 0
    $.getJSON('20 9 2023.json',function(d) {
        for (let x in d) {
            if (x == 'generation' ){
                for (let y in d[x]){
                    suma += d[x][y].value
                }}
        }
        console.log(suma)
    });
});
