let globalData = [];
let currentFilterScreenTech = 'all';
let currentFilterScreenSize = 'allsizes';

d3.csv('data/Ex6_TVdata.csv').then(data => {

    globalData = data.map(d => ({
        brand: d.brand,
        model: d.model,
        star: parseFloat(d.star),
        screenTech: d.screenTech,
        energyConsumption: parseFloat(d.energyConsumption),
        screenSize: parseInt(d.screenSize)
    }));
    
    console.log('Data loaded successfully:', globalData);
    console.log('Number of records:', globalData.length);
    console.log('Energy consumption range:', d3.extent(globalData, d => d.energyConsumption));
    console.log('Screen sizes:', [...new Set(globalData.map(d => d.screenSize))].sort((a,b) => a-b));
    console.log('Screen techs:', [...new Set(globalData.map(d => d.screenTech))]);
    
    drawHistogram(globalData);
    drawScatterplot(globalData);
    populateFilters();
    createTooltip();
    handleMouseEvents();
    
}).catch(error => {
    console.error('Error loading data:', error);
});
