var App={};

var filteredGraph; 
var charts;
var brush;
var gBrush;
var x;
App.brushRange = [1.2, 1.3];


d3.json("./model/data/train_graph_data.json", function(error, data) {
  App.data = data;
  // keyword =["worth","structure"]
  // filter_by_keyword(data,keyword).then(draw_graph(filteredGraph));

})


async function filter_by_keyword_score(data, keyword, minScore, maxScore){
  
  d3.json("./model/data/train_graph_data.json", function(error, data) {
    App.data = data;
    //POS Filtering
    let pos_w = getChecked_w();
    let pos_m = getChecked_m();
    let word = 0,
        metaphor = 0;

    var filteredLinks;


    if(!Array.isArray(keyword)){
      filteredLinks = data.links.filter(d=> (d.score >= minScore)&&(d.score <= maxScore)&&
                                          ((keyword === d.target) || keyword === d.source));

      metaphor = data.links.filter(d=> (d.score >= minScore)&&(d.score <= maxScore)&&(keyword === d.source));
      metaphor = metaphor.map(d=>d.target);
      word = data.links.filter(d=> (d.score >= minScore)&&(d.score <= maxScore)&&(keyword === d.target));
      word = word.map(d=>d.source);
    }
    
    else
      filteredLinks = data.links.filter(d=> (d.score >= minScore)&&(d.score <= maxScore)&&
                                          ((keyword.includes(d.target) || keyword.includes(d.source))));


    filteredLinks = filteredLinks.filter(d=> (pos_w.includes(d.source_POS) && pos_m.includes(d.target_POS)));

    var filteredNodes = Object.values(filteredLinks.reduce(function(t,v){
                            if(!t[v.source]){
                              t[v.source] = data.nodes.filter(o => o.id === v.source)[0]
                            }
                            if(!t[v.target]){
                              t[v.target] = data.nodes.filter(o => o.id === v.target)[0]
                            }
                          return t;
                       
                        },{}))
   
    filteredGraph = {
            nodes: filteredNodes,
            links: filteredLinks
        };
    
    if(!Array.isArray(keyword)){   
      draw_graph(filteredGraph,1, word, metaphor);
    }
    else
      draw_graph(filteredGraph,0, 0, 0);
  });
  
}

d3.csv("../model/data/train_data.csv", function(error, data){

  var formatNumber = d3.format(",d");

  var dataset = crossfilter(data),
      all = dataset.groupAll(),
      word = dataset.dimension(function(d){return d.Word}),
      metaphor = dataset.dimension(function(d){return d.Metaphor}),
      score = dataset.dimension(function(d){return d.Score}),
      scores = score.group(function(d){return Math.floor(d *100) / 100}),
      word_pos = dataset.dimension(function(d){return d.Word_POS_Tag}),
      metaphor_pos = dataset.dimension(function(d){return d.Metaphor_POS_Tag});

  var nestByScore = d3.nest()
      .key(function(d) { return d.score; });


  charts = [
    barChart()
        .dimension(score)
        .group(scores)
        .x(d3.scaleLinear()
        .domain([0, 2.5])
        .rangeRound([0, 10 * 35]))
        .filter([1.2, 1.3])

  ];

  var chart = d3.selectAll(".chart")
      .data(charts)

  var list = d3.selectAll(".list")
      .data([datasetList]);

 // Render the total.
  d3.selectAll("#total")
      .text(formatNumber(dataset.size()));

  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
    list.each(render);
  }


  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  // window.reset = function(i) {
  //   charts[i].filter(null);
  //   renderAll();
  // };


  async function datasetList(div) {
    var dataByScore = nestByScore.entries(score.top(10000));
    let promise = new Promise((resolve, reject) => {
        if(App.keyword == null){
          App.keyword = [];
          (dataByScore[0].values).forEach(function(value, index){
                            if(value.Word == "undefined" || value.Metaphor=="undefined"){}
                            else{
                              App.keyword.push(value.Word); 
                              App.keyword.push(value.Metaphor);

                            };
                          });
          App.keyword = App.keyword.filter(distinct);
        }
          //console.log(keyword);
        resolve(App.keyword); 
       

      });

    let keyword = await promise;
    let promise2 = new Promise((resolve, reject) =>{


    filter_by_keyword_score(App.data, keyword, App.brushRange[0], App.brushRange[1]);
      
    });


    let temp = await promise2;
    //console.log(filteredGraph);
    //
  
  }


  function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
        y = d3.scaleLinear().range([100, 0]),
        id = barChart.id++,
        axis = d3.axisBottom(),
        brushDirty,
        dimension,
        group,
        round;
    brush = d3.brushX();

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];

      brush.extent([[0, 0], [width, height]])

      y.domain([0, group.top(1)[0].value]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          // div.select(".title").append("a")
          //     .attr("href", "javascript:reset(" + id + ")")
          //     .attr("class", "reset")
          //     .text("reset")
          //     .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) {return d + " bar"})
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);

          // Initialize the brush component with pretty resize handles.
          gBrush = g.append("g")
              .attr("class", "brush")
              .call(brush);

          // handle
          // gBrush.selectAll(".handle--custom")
          //     .data([{type: "w"}, {type: "e"}])
          //   .enter().append("path")
          //     .attr("class", "brush-handle")
          //     .attr("cursor", "ew-resize")
          //     .attr("d", resizePath)
          //     .style("display", "none")
        }

        // Only redraw the brush if set externally.
        if (brushDirty != false) {
          var filterVal = brushDirty;
          brushDirty = false;

          div.select(".title a").style("display", d3.brushSelection(div) ? null : "none");

          if (!filterVal) {
            g.call(brush)

            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);

            g.selectAll(".brush-handle").style("display", "none")
            renderAll();

          } else {
            var range = filterVal.map(x)
            brush.move(gBrush, range)
          }
        }

        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("start.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode);
      var brushRange = d3.event.selection || d3.brushSelection(this); // attempt to read brush range
      var xRange = x && x.range(); // attempt to read range from x scale
      var activeRange = brushRange || xRange; // default to x range if no brush range available

      var hasRange = activeRange &&
                     activeRange.length === 2 &&
                     !isNaN(activeRange[0]) &&
                     !isNaN(activeRange[1]);

      if (!hasRange) return; // quit early if we don't have a valid range

      // calculate current brush extents using x scale
      var extents = activeRange.map(x.invert);

      // if rounding fn supplied, then snap to rounded extents
      // and move brush rect to reflect rounded range bounds if it was set by user interaction
      if (round) {
        extents = extents.map(round);
        activeRange = extents.map(x);

        if (d3.event.sourceEvent &&
            d3.event.sourceEvent.type === "mousemove") {
              d3.select(this).call(brush.move, activeRange)
        }
      }


      // move brush handles to start and end of range
      g.selectAll(".brush-handle")
          .style("display", null)
          .attr("transform", function(d, i) {
            return "translate(" + activeRange[i] + ", 0)"
          });

      // resize sliding window to reflect updated range
      g.select("#clip-" + id + " rect")
          .attr("x", activeRange[0])
          .attr("width", activeRange[1] - activeRange[0]);

      // filter the active dimension to the range extents
      dimension.filterRange(extents);

      // re-render the other charts accordingly
      renderAll();
    });

    brush.on("end.chart", function() {
      // reset corresponding filter if the brush selection was cleared
      // (e.g. user "clicked off" the active range)
      App.brushRange = d3.event.selection || d3.brushSelection(this)
      App.brushRange = [(App.brushRange[0]/350)* 2.5, (App.brushRange[1]/350)* 2.5];
      console.log(App.brushRange);
      if (!d3.brushSelection(this)) {
        reset(id);
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (!_) dimension.filterAll();
      brushDirty = _;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    chart.gBrush = function() {
      return gBrush
    }

    return chart;
  }
});

function distinct(value, index, self) { 
    return self.indexOf(value) === index;
}

function brushAdjust(minScore, maxScore){
  App.brushRange = [minScore, maxScore];
  //charts[0].filter([minScore, maxScore]);
  gBrush.call(brush.move, [minScore, maxScore].map(x));
}

