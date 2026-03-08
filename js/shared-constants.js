const margin = { top: 70, right: 20, bottom: 50, left: 65 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const bodyBackgroundColor = '#fefbf7';  // warm cream matching the page background
const barColor = '#555555';
const primaryColor = '#e67e22';
const secondaryColor = '#d97834';
const accentColor = '#f39c12';

const colors = {
    background: bodyBackgroundColor,
    bar: barColor,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor
};

const filters_screentech = [
    { id: 'all', label: 'All', isActive: true },
    { id: 'LED', label: 'LED', isActive: true },
    { id: 'LCD', label: 'LCD', isActive: true },
    { id: 'OLED', label: 'OLED', isActive: true }
];

const filters_screensize = [
    { id: 'allsizes', label: 'All Sizes', isActive: true },
    { id: '24', label: '24"', isActive: true },
    { id: '32', label: '32"', isActive: true },
    { id: '55', label: '55"', isActive: true },
    { id: '65', label: '65"', isActive: true },
    { id: '98', label: '98"', isActive: true }
];

const xScale = d3.scaleLinear()
    .domain([0, 2800])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 1300])
    .range([height, 0]);

// Bins of 200 kWh each, covering full data range to 2800
const binGenerator = d3.bin()
    .domain([0, 2800])
    .thresholds(d3.range(0, 2800, 200))
    .value(d => d.energyConsumption);

let innerChartS = null;

const xScaleS = d3.scaleLinear()
    .range([0, width]);

const yScaleS = d3.scaleLinear()
    .range([height, 0]);

const tooltipWidth = 110;
const tooltipHeight = 50;
const tooltipPadding = 10;


const colorScale = d3.scaleOrdinal()
    .range(['#1f77b4', '#ff7f0e', '#2ca02c']); // Blue for LED, Orange for LCD, Green for OLED
