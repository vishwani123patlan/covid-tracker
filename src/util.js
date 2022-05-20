
export  const buildChartData = (data, casesType="cases") => {
    const chartData = [];
    let lastPointdata;
    for(let date in data[casesType]) {
        if(lastPointdata){
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastPointdata        
            }
            chartData.push(newDataPoint);
        }
        lastPointdata = data[casesType][date];
    }
    return chartData;
}