
    width = 800
    height = 400

//tooltip to show details
var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

//append an svg for the network graph
var svg = d3.select("#net-graph-div").append("svg")
    .attr("width", width)
    .attr("height", height);

//add encompassing group for the zoom 
var g = svg.append("g")
    .attr("class", "everything");

//set color for each node type
var color = d3.scaleOrdinal()
  .domain(["w", "b", "m"])
  .range(["limegreen", "orchid", "orange"]);
  
//set size of nodes based on the frequencies
var radius = d3.scaleSqrt()
    .range([0, 6]);

//constants to set gravity 
const forceX = d3.forceX(width / 2).strength(0.015) 
const forceY = d3.forceY(height / 2).strength(0.015)


//the simulation that controls the layout
var simulation = d3.forceSimulation()
    .force("link", 
           d3.forceLink().id(function(d) { return d.id; })
           	             .distance(function(d) { return radius(d.source.freq * 8) + radius(d.target.freq * 8); }) //distance among nodes that are connected
                         .strength(function(d) {return 0.6; }) //how zoomed it is
          )
    .force("charge", d3.forceManyBody().strength(-25)) //distance among nodes that are not connected
	.force("collide", d3.forceCollide().radius(function(d) { return radius(d.freq / 2) + 2; }))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('x', forceX)
    .force('y',  forceY);

//load data
d3.json("./data/metaphor_graph.json", function(error, graph) {
  if (error) throw error;

//append a group for the links and load links from json
var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return d.score*5 });

      //tooltip to display link details
      link
     	.on('mouseover.tooltip', function(d) {
        tooltip.transition()
            .duration(300)
            .style("opacity", .8);
      	tooltip.html("Word:"+ d.source.id + 
                     "<p/>Metaphor:" + d.target.id +
                     "<p/>Novelty:"  + d.score)
        	.style("left", (d3.event.pageX) + "px")
        	.style("top", (d3.event.pageY + 10) + "px");
    	})
    	.on("mouseout.tooltip", function() {
	    tooltip.transition()
	        .duration(100)
	        .style("opacity", 0);
	    })
  		.on('mouseout.fade', fade(1))
	    .on("mousemove", function() {
	    tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 10) + "px");
	    });

//append a group for the nodes and load node data from json
var node =g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")
        .style('transform-origin', '50% 50%')
        .call(d3.drag() //functions to drag and drop
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

//append circles to the node group and add tooltip details
node.append('circle')
      .attr("r", function(d) { return radius(d.freq); })
      .attr("fill", function(d) { return color(d.type); })
      .on('mouseover.tooltip', function(d) {
      	tooltip.transition()
        	.duration(300)
        	.style("opacity", .8);
      	tooltip.html("Word:" + d.id + "<p/>Type:" + d.type)
        	.style("left", (d3.event.pageX) + "px")
        	.style("top", (d3.event.pageY + 10) + "px");
    	})
  	.on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function() {
        tooltip.transition()
	        .duration(100)
	        .style("opacity", 0);
	    })
  	.on('mouseout.fade', fade(1))
	    .on("mousemove", function() {
	      tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 10) + "px");
	    })
	 //call zoomnode to zoom nodes on click
  	.on('dblclick',zoomnode) 

    .on('click', function(d){
        console.log(d.id)
      getSentences(d.id)

    })
 
//add texts to nodes    
var text= node.append("text")
      .attr("dy", "1.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", "28px")
      .text(function(d) { return d.id; })

//on simulation, load ticks to adjust positions
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);


 //Zoom function-currently need to work on it.
function zoom_actions(){
    g.attr("transform", d3.event.transform)
    console.log("hi")

var text2= link.append("text")
      .attr("dy", "1.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", "28px")
      .text(function(d) { return d.score; })
  
}

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }

 //starting from here to line 170 are for checking the neighbours(level-1) of a highlighted node 
  const linkedByIndex = {};
  graph.links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }

  // fade the rest of the graph except the neighbours of a highlighted node
  function fade(opacity) {
    return d => {
      node.style('stroke-opacity', function (o) {
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
      });

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

    };

    console.log(d.id)
  }

//called to zoom
  function zoomnode(d) {
   //add zoom capabilities 
var zoom_handler = d3.zoom()
    .scaleExtent([1 / 2, 6])
    .on("zoom", zoom_actions);
  zoom_handler(svg);
}

});


//these functions are for dragging
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.5).restart();
  p1=d.x;
  p2=d.y;
  d.fx = d.x;
  d.fy = d.y;
  
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);

  d.fx = null;
  d.fy = null;
}

