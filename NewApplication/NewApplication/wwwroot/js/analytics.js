/* The main function to draw the various bar charts */
function drawGraph($filename) {
    var svg = d3.select("svg");
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var width = 900;
    var height = 450;
    var daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //D3 variables
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv($filename, function (d) {
        d.frequency = +d.frequency;
        return d;
    }, function (error, data) {
        if (error) throw error;

        x.domain(data.map(function (d) { return d.day; }));
        y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(6))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 7)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", function (d) { return d.class; })
            .attr("x", function (d) { return x(d.day); })
            .attr("y", function (d) { return y(d.frequency); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.frequency); })
            .on("click", function (d) {
                d3.select("g").remove();
                if (monthArr.indexOf(d.day) >= 0) {
                    $('#barGraphText').html("2017 Order History");
                    drawGraph("Documents/order_data.tsv");
                } else {
                    if (daysArr.indexOf(d.day) >= 0) {
                        $('#barGraphText').html("2017 Order History - " + d.day + "'s");
                        drawGraph("Documents/" + d.day + "_data.tsv");
                    } else {
                        $('#barGraphText').html("2017 Order History");
                        drawGraph("Documents/monthly_data.tsv");
                    }
                }
            })
            .append("title")
            .text(function (d) {
                if (d.amount !== undefined) {
                    return d.frequency + " Orders: $" + d.amount;
                } else {
                    return d.frequency + " Orders";
                }
            });
    });
}
$(document).ready(drawGraph("Documents/monthly_data.tsv"));