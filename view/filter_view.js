var App = App ||{};

//load data

function draw_graph(data){
  graph = data;
  //console.log(data);
  d3.select("g").selectAll("*").remove();
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
      link_mouseover_tooltip(d);
  	})
  	.on("mouseout.tooltip", function() {
      link_mouseout_tooltip()
    })
  	.on('mouseout.fade', fade(1))
    .on("mousemove", function() {
     link_mousemove();
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
        	node_mouseover_tooltip(d);
      	})
    	.on('mouseover.fade', fade(0.1))
      .on("mouseout.tooltip", function() {
          node_mouseout_tooltip();
  	    })
    	.on('mouseout.fade', fade(1))
  	    .on("mousemove", function() {
  	      node_mousemove();
  	    })
  	 //call zoomnode to zoom nodes on click
    	.on('dblclick',zoomnode) 

      .on('click', function(d){
          //console.log(d.id)
        getSentences(d.id);
        
        document.getElementById("pos-graph-div").style.visibility = "visible";

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
  var linkedByIndex = {};

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
        var thisOpacity = isConnected(d, o) ? 1 : opacity;
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
      });

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

  };

  //console.log(d.id)
}

  //called to zoom
    function zoomnode(d) {
     //add zoom capabilities 
  var zoom_handler = d3.zoom()
      .scaleExtent([1 / 2, 6])
      .on("zoom", zoom_actions);
    zoom_handler(svg);
  }
}


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

