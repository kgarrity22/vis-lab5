    const margin = ({top: 50, right: 40, bottom: 50, left: 40 })
    const width = 650 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;


    let svg = d3.select(".chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleBand()
            //.domain(companies)
            .rangeRound([0, width])
            .paddingInner(0.1);

    const yScale = d3.scaleLinear()
            //.domain([0, d3.max(data.map(d => d.stores))])
            .range([height, 0])

    let xAxis = d3.axisBottom()
            .scale(xScale)


        let yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10, "s")

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`);

    svg.append("g")
        .attr("class", "axis y-axis")
        //.attr("transform", `translate(0, ${width})`);


    var sort = false;


    function update(data, type, sort) {


        if (sort % 2 == 0) {
        data.sort(function (a, b) {
            console.log("a: ", a, "and b:", b)
            return a[type] - b[type];
        })
    } else {
        data.sort(function (a, b) {
            return b[type] - a[type];
        })
    }

        // Update the scale domains
        xScale.domain(data.map(d=>d.company));

        yScale.domain([0, d3.max(data.map(d => d[type]))]);


        // Implement the enter-update-exit sequence
        const bars = svg.selectAll('.bars')
            .data(data, function(d){
                return d.company;
            })

        bars.exit()
            .remove()


        bars.enter()
            .append("rect")
            .attr("class", "bars")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
        console.log("logging x: ", xScale(d.company));
                return xScale(d.company);
            })
            .attr("width", xScale.bandwidth())


            .attr("y", function (d) {
                return yScale(d[type]);
            })
            .attr("height", function (d) {
                // console.log("D: ", d)
                // console.log("stores: ", d.stores)
                return height - yScale(d[type]);
            })
            .attr("fill", "steelblue")

        bars.exit()
            .transition()
            .duration(2000)
            .remove()




        //update the axes and the axis title

        svg.select(".y-label")
            .remove()
            .exit()


        svg.append("text")
            .attr("class", "y-label")
            .attr('x', 10)
            .attr('y', -5)
            .attr("class", "yax")
            .text(function(type){
                if (type == "stores") {
                    return "Stores";
                } else {
                    return "Billion USD";
                }
            });

        svg.append("text")
            .attr('x', width - 50)
            .attr('y', height+30)
            .text("Company")

        xAxis.scale(xScale)
            .ticks(5, 's');

        yAxis.scale(yScale)
            .ticks(10, 's');


        svg.select('.x-axis')
            .transition()
            .duration(1000)
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        svg.select('.y-axis')
            .transition()
            .duration(1000)
            .call(yAxis);


    } // end of update data function


    d3.csv('coffee-house-chains.csv', d => {
        return d3.autoType(d)
    }).then(data => {


        console.log("DATA: ", data);


        let type = document.querySelector("#group-by").value

        var sorted = 0

        update(data, type, sorted)

        console.log("Here: ", type.value)
        d3.select('#group-by')
            .on("change", function(d){
        type = document.querySelector("#group-by").value
                console.log("d: ", d.target.value);
                d3.selectAll(".bars")

                update(data, d.target.value, sorted)
            });

        d3.select("#sort-btn")
            .on("click", function(d){
        sorted += 1;
                update(data, type, sorted)
            })












    })//  END OF CSV PARSING



