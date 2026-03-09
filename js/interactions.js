function populateFilters() {

    d3.select('#filters-screentech')
        .selectAll('.filter-btn.tech')
        .data(filters_screentech)
        .enter()
        .append('button')
        .attr('class', 'filter-btn tech')
        .text(d => d.label)
        .classed('active', d => d.isActive)
        .classed('inactive', d => !d.isActive)
        .on('click', function (event, d) {

            if (d.id === 'all') {
                filters_screentech.forEach(filter => {
                    filter.isActive = true;
                });
                d.isActive = true;
            } else {

                const allFilter = filters_screentech.find(f => f.id === 'all');
                allFilter.isActive = false;
                d.isActive = !d.isActive;
            }

            d3.select('#filters-screentech')
                .selectAll('.filter-btn.tech')
                .classed('active', d => d.isActive)
                .classed('inactive', d => !d.isActive);

            if (filters_screentech.find(f => f.id === 'all').isActive &&
                filters_screentech.filter(f => f.id !== 'all').every(f => f.isActive)) {
                currentFilterScreenTech = 'all';
            } else {
                currentFilterScreenTech = filters_screentech
                    .filter(f => f.isActive && f.id !== 'all')
                    .map(f => f.id);
            }

            console.log('Screen tech filter:', currentFilterScreenTech);
            updateHistogram();
        });

    d3.select('#filters-screensize')
        .selectAll('.filter-btn.size')
        .data(filters_screensize)
        .enter()
        .append('button')
        .attr('class', 'filter-btn size')
        .text(d => d.label)
        .classed('active', d => d.isActive)
        .classed('inactive', d => !d.isActive)
        .on('click', function (event, d) {

            if (d.id === 'allsizes') {
                filters_screensize.forEach(filter => {
                    filter.isActive = true;
                });
                d.isActive = true;
            } else {

                const allFilter = filters_screensize.find(f => f.id === 'allsizes');
                allFilter.isActive = false;
                d.isActive = !d.isActive;
            }

            d3.select('#filters-screensize')
                .selectAll('.filter-btn.size')
                .classed('active', d => d.isActive)
                .classed('inactive', d => !d.isActive);

            if (filters_screensize.find(f => f.id === 'allsizes').isActive &&
                filters_screensize.filter(f => f.id !== 'allsizes').every(f => f.isActive)) {
                currentFilterScreenSize = 'allsizes';
            } else {
                currentFilterScreenSize = filters_screensize
                    .filter(f => f.isActive && f.id !== 'allsizes')
                    .map(f => parseInt(f.id));
            }

            console.log('Screen size filter:', currentFilterScreenSize);
            updateHistogram();
        });
}

function updateHistogram() {

    let updatedData = globalData;


    if (currentFilterScreenTech !== 'all') {
        updatedData = updatedData.filter(d =>
            currentFilterScreenTech.includes(d.screenTech)
        );
    }

    if (currentFilterScreenSize !== 'allsizes') {
        updatedData = updatedData.filter(d =>
            currentFilterScreenSize.includes(d.screenSize)
        );
    }

    console.log('Updated data after filters:', updatedData.length, 'records');

    const updatedBins = binGenerator(updatedData);

    // Round yMax up to nearest 100 to keep axis tidy
    const rawYMax = Math.max(...updatedBins.map(bin => bin.length)) || 100;
    const yMax = Math.ceil(rawYMax / 100) * 100;
    yScale.domain([0, yMax]);

    const g = d3.select('#chart').select('svg').select('g');

    g.selectAll('.bar')
        .data(updatedBins, (d, i) => i)
        .transition()
        .duration(750)
        .ease(d3.easeQuadInOut)
        .attr('y', d => yScale(d.length))
        .attr('height', d => height - yScale(d.length));

    const yAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(0, yMax + 1, 100))
        .tickFormat(d3.format(","));

    g.select('.y-axis')
        .transition()
        .duration(750)
        .call(yAxis);

    // In case width changed between filter clicks, also update the x axis
    const numTicksX = width < 500 ? 5 : 10;
    const xAxis = d3.axisBottom(xScale)
        .ticks(numTicksX)
        .tickFormat(d3.format(","));

    g.select('.x-axis')
        .transition()
        .duration(750)
        .call(xAxis);
}

function createTooltip() {

    const tooltip = innerChartS.append('g')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    tooltip.append('rect')
        .attr('width', tooltipWidth)
        .attr('height', tooltipHeight)
        .attr('fill', barColor)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('opacity', 0.85);

    tooltip.append('text')
        .attr('class', 'tooltip-text')
        .attr('x', tooltipWidth / 2)
        .attr('y', tooltipHeight / 2)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '22px')
        .attr('font-weight', 'bold');

    console.log('Tooltip created');
}

function handleMouseEvents() {

    innerChartS.selectAll('.dot')

        .on('mouseenter', function (e, d) {
            console.log('Mouse entered circle', d);
            console.log('Event:', e);

            innerChartS.select('.tooltip-text')
                .text(Math.round(d.energyConsumption));

            const circleX = parseFloat(d3.select(this).attr('cx'));
            const circleY = parseFloat(d3.select(this).attr('cy'));

            const tooltipX = circleX - tooltipWidth / 2;
            const tooltipY = circleY - tooltipHeight - 12;

            innerChartS.select('.tooltip')
                .raise()
                .attr('transform', `translate(${tooltipX},${tooltipY})`)
                .transition()
                .duration(150)
                .style('opacity', 1);
        })
        .on('mouseleave', function () {
            innerChartS.select('.tooltip')
                .transition()
                .duration(200)
                .style('opacity', 0);
        });
}