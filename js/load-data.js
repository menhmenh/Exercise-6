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
    console.log('Screen sizes:', [...new Set(globalData.map(d => d.screenSize))].sort((a, b) => a - b));
    console.log('Screen techs:', [...new Set(globalData.map(d => d.screenTech))]);

    drawHistogram(globalData);
    drawScatterplot(globalData);
    populateFilters();
    createTooltip();
    handleMouseEvents();

    // Add window resize event listener for responsiveness
    window.addEventListener('resize', () => {
        drawHistogram(globalData);
        drawScatterplot(globalData);
        // Need to recreate tooltip and handle events since SVG is removed and added anew
        createTooltip();
        handleMouseEvents();
        updateHistogram(); // To apply current filters to the newly drawn histogram
    });

}).catch(error => {
    console.error('Error loading data:', error);
});