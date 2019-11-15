////bar chart
//Create an SVG
function drawBarChart(){
  var bar_margin = {top: 20, right: 0, bottom: 40, left: 40},
      bar_width = 300 - bar_margin.left - bar_margin.right,
      bar_height = 150 - bar_margin.top - bar_margin.bottom;

  var x = d3.scaleBand().range([0, bar_width],0.5)
            .padding(0.1);

  var x_brush = d3.scaleTime()
    .domain([new Date(2012, 11), new Date(2013,12)])
    .rangeRound([0, bar_width-10]);

  var y = d3.scaleLinear().range([bar_height, 0]);

  var xAxis = d3.axisBottom(x)
              .tickPadding(5)
              .tickFormat(function(d){
                  if(d ==0) return "2012-12";
                  else  return "2013-"+d});

  var yAxis = d3.axisLeft(y)
      .ticks(10);

  var bar_svg = d3.select("#filter-div").append("svg")
      .attr("width", bar_width + bar_margin.left + bar_margin.right)
      .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + bar_margin.left + "," + bar_margin.top + ")");


  let bar_data= [];

  dummy_data = [{"score":1, "value":5}, {"score":2, "value":1}, {"score":3, "value":8}];

  // for(i in Object.keys(aggregated_month_data)){
  //     bar_data.push({"date":i, "value": Object.keys(aggregated_month_data[i]).length});
  // }


  //console.log(aggregated_month_data)
 // x.domain([Object.keys(aggregated_month_data)]);
  x.domain([0, 3]);
  y.domain([0, 10]);

    bar_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(10," + bar_height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end");

    bar_svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("# of people");

  bar_svg.selectAll("bar")
      .data(bar_data)
      .enter().append("rect")
      .style("fill", "lightgray")
      .attr("x", function(d) { return x(d.score); })
      .attr("width", x.bandwidth()-7)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return (bar_height-y(d.value)); });

// svg.append("g")
//     .attr("class", "axis axis--x")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x)
//         .ticks(d3.timeMonth)
//         .tickPadding(0))
//     .attr("text-anchor", null)
//   .selectAll("text")
//     .attr("x", 6);

 
  bar_svg.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", brushended));

  //interval = d3.timeMonth.range(new Date(2012, 11), new Date(2013,12));

  function brushended() {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    var d0 = d3.event.selection.map(x_brush.invert),
        d1 = d0.map(d3.timeMonth.round);
    

    // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
      d1[0] = d3.timeMonth.floor(d0[0]);
      d1[1] = d3.timeMonth.offset(d1[0]);
    }

    let s_year = d1[0].getFullYear();
    let s_month = d1[0].getMonth();
    let e_year = d1[1].getFullYear();
    let e_month = d1[1].getMonth();
    let start, end;
    if(s_year == 2012)
      start = 0;
    else
    start = s_month+1;

    if(e_year == 2012)
      end = 0;
    else if(e_year ==2014)
      end = 13
    else
      end = e_month+1;

    //change Map
    var keys = Object.keys(aggregated_state_month_data);
    var filtered_data= []
    for(var i = 0; i<keys.length;i++){
        filtered_data[keys[i]] = [];
      for(var j =start; j<end; j++){
        filtered_data[keys[i]][j]=(aggregated_state_month_data[keys[i]][j]);
      }
    }

    recolorMap(filtered_data, start, end-1);

    d3.select(this).transition().call(d3.event.target.move, d1.map(x_brush));
}};

drawBarChart();