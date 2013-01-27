var chart1; // globally available
var chart2;
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function jsonRequest(year) {
    $('#current_year').html(year)
    $('#loading').show();
    $('#charts').hide();
    $.getJSON('/accidents/' + year, function(data) {
        $('#loading').hide();
        $('#charts').show();
        title = numberWithCommas(data['total_accidents']) +  ' Accidents'
        chart1 = new Highcharts.Chart({
            chart: {
                renderTo: 'chart',
                type: 'area'
            },
            title: {
                text: title
            },
            xAxis: {
                type:'datetime',
                title:{text:null}
            },
            yAxis: {
                title: {
                    text: 'Number of Accidents'
                }
            },
            series: [{
                pointInterval:24*3600*1000,
                pointStart:Date.UTC(year,0,01),
                name: 'Accidents Per Day',
                data: data['daily_accidents']
            }]
        });

        fatal = data['fatal_accidents']
        injuries = data['injured_accidents']
        in_town = data['in_town']
        out_of_town = data['out_of_town']
        chart2 = new Highcharts.Chart({
            chart: {
                renderTo: 'driver_types',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Driver Origin State'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled:false
                    },
                    showInLegend:true
                }
            },
            series: [{
                type: 'pie',
                name: 'Origin State',
                data: [
                    ['In State', in_town],
                    ['Visitor', out_of_town],
                ]
            }]
        });
        
        chart3 = new Highcharts.Chart({
            chart: {
                renderTo: 'driver_sex',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Driver Sex'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                    showInLegend:true
                },
            },
            series: [{
                type: 'pie',
                name: 'Sex',
                data: [
                    ['Male', data['males']],
                    ['Female', data['females']],
                ]
            }]
        });

        chart4 = new Highcharts.Chart({
            chart: {
                renderTo: 'driver_age',
                type: 'bar'
            },
            title: {
                text: 'Drver Age Demographics'
            },
            xAxis: {
                categories: ['18-27', '28-37', '38-47', '48-57', '58+'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Drivers',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                enabled:false
            },
            credits: {
                enabled: false
            },
            series: [{
                data: [data['18to27'], data['28to37'], data['38to47'], data['48to57'], data['58andup']]
            }]
        });
    });
}

$(document).ready(function() {
    jsonRequest(2012)
});
