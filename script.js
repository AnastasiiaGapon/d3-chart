class Gauge {
    constructor(input) {
        this.config = {
            margin: {top: 0, right: 0, bottom: 0, left: 0},
            height: 254,

            maxAngle: 90,
            minAngle: -90,
            size: 200,

            minValue: 0,
            maxValue: 100,
            majorTicks: 2,

            ringInset: 20,
            ringWidth: 50,
            labelInset: 10,
            arcColor: ['#a0f283', '#f3683d'],
        };
        this.value = input;
        this.svg = null;
        this.chartContainer = null;
        this.chart = null;
        this.range = null;
        this.r = null;
        this.scale = null;
        this.tickData = null;
        this.arc = null;
        this.ticks =null;
    }

    data(data) {
        this.value = data;
        this.tickData = [[this.scale(this.config.minValue), this.scale(this.value)], [this.scale(this.value), this.scale(this.config.maxValue)]];
        this.update();

        return this;
    }

    build() {
        this.svg = d3.select('#chart')
            .append('svg:svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 254 212`)
                .attr('preserveAspectRatio', 'xMinYMin meet');

        this.chartContainer = this.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

        this.chartLegend = this.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

        this.range = this.config.maxAngle - this.config.minAngle;

        this.r = this.config.size / 2;

        // a linear scale that maps domain values to a percent from 0..1
        this.scale = d3.scaleLinear()
            .range([this.config.minAngle, this.config.maxAngle])
            .domain([this.config.minValue, this.config.maxValue]);

        this.ticks = this.scale.ticks(this.config.majorTicks);
        this.tickData = [[this.scale(this.config.minValue), this.scale(this.value)], [this.scale(this.value), this.scale(this.config.maxValue)]];
        const centerTx = this._centerTranslation();

        this.arc = d3.arc()
            .innerRadius(this.r - this.config.ringWidth - this.config.ringInset)
            .outerRadius(this.r - this.config.ringInset)
            .startAngle(function(d) {
                return d[0] * Math.PI / 180;
            })
            .endAngle(function(d)  {
                return d[1] * Math.PI / 180;
            });

        this.chart = this.chartContainer
            .append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx)
            .selectAll('g')
            .data(this.tickData)
            .enter()
            .append('path')
            .attr('fill', (d, i) => this.config.arcColor[i])
            .attr('d', this.arc);

        return this;
    }

    update() {
        return this.chart.call(g => g
            .data(this.tickData)
            .transition(50)
            .attr('d', this.arc)
        );
    }

    _centerTranslation() {
        return `translate(${this.r}, ${this.r})`;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

let gauge = new Gauge(30);
gauge.build();

const button = document.getElementById("random");
button.addEventListener("click", function() {
    gauge.data(getRandomInt(0, 100));
});
