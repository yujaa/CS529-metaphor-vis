var App = App ||{};

//load data

function draw_graph(data){
  graph = data;
  //console.log(data);
  d3.select("g").selectAll("*").remove();
  //append a group for the links and load links from json
      link = g.selectAll(".link")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("class", "links")
              .attr("stroke-width", function(d) {
                return d.score*4; });

        link.append("title")
            .text(function (d) {return d.score});

        edgepaths = g.selectAll(".edgepath")
            .data(graph.links)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
           //  .attr('fill-opacity', 1)
         //     .attr('stroke-opacity', 1)
                .attr('id', function (d, i) {return 'edgepath' + i})
      //      .style("pointer-events", "none");

        edgelabels = g.selectAll(".edgelabel")
            .data(graph.links)
            .enter()
            .append('text')
            .style("fill-opacity", 0)
            .attr('class', 'edgelabel')
            .attr( 'id', function (d, i) {return 'edgelabel' + i})
            .attr('font-size', "5px")
        //    .attr('fill', '#aaa')
            

        textlink=edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
        //    .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {var f = d3.format(".3f")
              return f(d.score)})
            //console.log(edgelabels);



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
      .attr("r", function(d) { return radius(d.freq)*.5; })
      .attr("fill", function(d) { return color(d.type); })
      .on('mouseover.tooltip', function(d) {
        node_mouseover_tooltip(d);
      })
    .on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function() {
        node_mouseout_tooltip();
      })
    .on('mouseout.fade', fade(1))
    .on('mouseover.show_novelty', show_novelty(0))
    .on('mouseout.fade_novelty', fade_novelty())
      .on("mousemove", function() {
        node_mousemove();
      })
   //call zoomnode to zoom nodes on click
    .on('dblclick',zoomnode) 

    .on('click', function(d){
        //console.log(d.id)
      getSentences(d.id);
//document.getElementById("zoomed_image").style.visibility = "visible";
      document.getElementById("pos-graph-div").style.visibility = "visible";

    })
 


//add texts to nodes    
var text= node.append("text")
      .attr("dy", "1.3em")
      .attr("text-anchor", "middle")
      .style("font-size", function(d) { return font_size(d.freq); })
      .text(function(d) { return d.id; })



//on simulation, load ticks to adjust positions
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

      //add zoom capabilities 
var zoom_handler = d3.zoom()

    .on("zoom", zoom_actions);

zoom_handler(svg);


   //Zoom function-currently need to work on it.
  function zoom_actions(){
  

   var transform = d3.event.transform;
   g.attr("transform",transform.toString())
  //console.log(transform)
  if(transform.k<1.5){
    //console.log("hidshbfdjbjhd")
//    var hull=d3.selectAll('.edgelabel')
//    hull.attr("visibility","hidden")
 
  }

    else{
    var hull=d3.selectAll('.edgelabel')
    hull.attr("visibility","visible")

  }

  
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

         edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
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
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
      });

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
  //    edgelabels.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      //   edgepaths.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      //     textlink.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

    };

    //console.log(d.id)
  }

    function show_novelty(opacity) {
    return d => {
  
     edgelabels.style('fill-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
  

    };

    //console.log(d.id)
  }
  function fade_novelty(opacity) {
    return d => {
 
      edgelabels.style('fill-opacity', 0);
  

    };

    //console.log(d.id)
  }


  //called to zoom
    function zoomnode(d) {
     //add zoom capabilities 
  var zoom_handler = d3.zoom()
      .scaleExtent([1 / 2, 10])
      .on("zoom", zoom_actions);
    zoom_handler(App.svg);
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

