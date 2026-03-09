function drawHistogram(data) {

    d3.select('#chart').selectAll('svg').remove();

    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;

    const svg = d3.select('#chart').append('svg')
        .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', bodyBackgroundColor);
    
    const bins = binGenerator(data);
    console.log('Bins created:', bins);
    console.log('Number of bins:', bins.length);

    const rawYMax = Math.max(...bins.map(bin => bin.length));
    const yMax = Math.ceil(rawYMax / 100) * 100;
    yScale.domain([0, yMax]);

    console.log('X domain: [0, 2800] (fixed)');
    console.log('Y domain:', [0, yMax]);
    
    const barWidth = (xScale(bins[0].x1) - xScale(bins[0].x0));
    
    g.selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.x0))
        .attr('y', d => yScale(d.length))
        .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr('height', d => height - yScale(d.length))
        .attr('fill', barColor);

    const xAxis = d3.axisBottom(xScale)
        .tickValues(d3.range(0, 2801, 200))
        .tickFormat(d3.format(","));

    g.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .text('Labeled Energy Consumption (kWh/year)');

    const yAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(0, yMax + 1, 100))
        .tickFormat(d3.format(","));

    g.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis);

    g.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Frequency');
}
