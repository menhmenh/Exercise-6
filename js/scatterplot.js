function drawScatterplot(data) {

    updateDimensions('#scatterplot');

    d3.select('#scatterplot').selectAll('svg').remove();

    const svg = d3.select('#scatterplot').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);


    innerChartS = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('class', 'innerChartS');

    const g = innerChartS;

    g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', bodyBackgroundColor);

    const starMin = d3.min(data, d => parseFloat(d.star));
    const starMax = d3.max(data, d => parseFloat(d.star));
    const energyMin = d3.min(data, d => d.energyConsumption);
    const energyMax = d3.max(data, d => d.energyConsumption);

    xScaleS.domain([starMin - 0.5, starMax + 0.5]);
    yScaleS.domain([energyMin - 50, energyMax + 50]);

    console.log('Scatterplot X domain (Star):', [starMin - 0.5, starMax + 0.5]);
    console.log('Scatterplot Y domain (Energy):', [energyMin - 50, energyMax + 50]);

    const screenTypes = [...new Set(data.map(d => d.screenTech))];
    colorScale.domain(screenTypes);

    console.log('Screen types found:', screenTypes);

    g.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScaleS(parseFloat(d.star)))
        .attr('cy', d => yScaleS(d.energyConsumption))
        .attr('r', 4)
        .attr('fill', d => colorScale(d.screenTech))
        .attr('opacity', 0.6)
        .attr('stroke', 'none');

    // Adjust tick count based on screen width
    const numTicksX = width < 500 ? 5 : 10;

    const xAxis = d3.axisBottom(xScaleS)
        .ticks(numTicksX)
        .tickFormat(d => Math.round(d));

    g.append('g')
        .attr('class', 'axis x-axis-scatter')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .text('Star Rating');

    const yAxis = d3.axisLeft(yScaleS)
        .tickFormat(d => Math.round(d));

    g.append('g')
        .attr('class', 'axis y-axis-scatter')
        .call(yAxis);

    g.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .text('Labeled Energy Consumption (kWh/year)');

    // Responsive legend position
    const legendX = width < 500 ? width - 80 : width - 150;

    const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${legendX}, 20)`);

    const legendItems = screenTypes;

    legendItems.forEach((screenType, index) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${index * 25})`);

        legendRow.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', colorScale(screenType));

        legendRow.append('text')
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '0.32em')
            .text(screenType)
            .style('font-size', '12px');
    });
}