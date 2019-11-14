
// width = 300
// height = 300
// var pos_svg = d3.select("#pos-graph-div").append("svg")
// .attr("width", width)
// .attr("height", height);

////////////////////////////////////////////////////////////
    //////////////////////// Set-up ////////////////////////////
    ////////////////////////////////////////////////////////////

    var margin = {left: 20, top: 20, right: 20, bottom: 20},
      width = 300 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
          
    var pos_svg = d3.select("#pos-graph-div").append("svg")
          .attr("width", (width + margin.left + margin.right))
          .attr("height", (height + margin.top + margin.bottom))
           .append("g").attr("class", "wrapper")
          .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    ////////////////////////////////////////////////////////////// 
    ///////////////////// Data &  Scales ///////////////////////// 
    ////////////////////////////////////////////////////////////// 
    // d3.json("./word_metaphor_data.json", function(error, data){

    // //   var word_POS={};
    // //   var metaphor_POS={};
    // //   for (let d of data){
    // //     if(d.Word_POS_Tag);
    // //   }

    // // });

    //Some random data
    var donutData = [
      {name: "Noun",  value: 20},
      {name: "Verb",    value: 10},
      {name: "Adverb",   value: 15},
      {name: "Adjective",   value: 25},
      {name: "Pronoun",  value: 30}
    ];

    //Create a color scale
    var colorScale = d3.scaleLinear()
       .domain([1,3.5,6])
       .range(["#2c7bb6", "#ffffbf", "#d7191c"])
       .interpolate(d3.interpolateHcl);

    //Create an arc function   
    var donut_arc = d3.arc()
      .innerRadius(width*0.75/2) 
      .outerRadius(width*0.75/2 + 30);

    //Turn the pie chart 90 degrees counter clockwise, so it starts at the left 
    var pie = d3.pie()
      .startAngle(0)
      .endAngle(2*Math.PI)
      .value(function(d) { return d.value; })
      .padAngle(.01)
      .sort(null);

    // var pie = d3.pie()
    //   .startAngle(-1* Math.PI)
    //   .endAngle(Math.PI/180 )
    //   .value(function(d) { return d.value; })
    //   .padAngle(.01)
    //   .sort(null);
     
    ////////////////////////////////////////////////////////////// 
    //////////////////// Create Donut Chart ////////////////////// 
    ////////////////////////////////////////////////////////////// 

    //Create the donut slices and also the invisible arcs for the text 
    pos_svg.selectAll(".donutArcs")
      .data(pie(donutData))
      .enter().append("path")
      .attr("class", "donutArcs")
      .attr("d", donut_arc)
      .style("fill", function(d,i) {
        if(i === 7) return "#CCCCCC"; //Other
        else return colorScale(i); 
      })
    .each(function(d,i) {
      //Search pattern for everything between the start and the first capital L
      var firstArcSection = /(^.+?)L/;  

      //Grab everything up to the first Line statement
      var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
      //Replace all the comma's so that IE can handle it
      newArc = newArc.replace(/,/g , " ");
      
      //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
      //flip the end and start position
      if ((d.endAngle > 90 * Math.PI/180)) {
        var startLoc  = /M(.*?)A/,    //Everything between the first capital M and first capital A
          middleLoc   = /A(.*?)0 0 1/,  //Everything between the first capital A and 0 0 1
          endLoc    = /0 0 1 (.*?)$/; //Everything between the first 0 0 1 and the end of the string (denoted by $)
        //Flip the direction of the arc by switching the start en end point (and sweep flag)
        //of those elements that are below the horizontal line
        var newStart = endLoc.exec( newArc )[1];
        var newEnd = startLoc.exec( newArc )[1];
        var middleSec = middleLoc.exec( newArc )[1];
  
        //Build up the new arc notation, set the sweep-flag to 0
        newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
      }//if
      
      //Create a new invisible arc that the text can flow along
      pos_svg.append("path")
        .attr("class", "hiddenDonutArcs")
        .attr("id", "donutArc"+i)
        .attr("d", newArc)
        .style("fill", "none");
    });
      
    //Append the label names on the outside
    pos_svg.selectAll(".donutText")
      .data(pie(donutData))
       .enter().append("text")
      .attr("class", "donutText")
      //Move the labels below the arcs for those slices with an end angle greater than 90 degrees
      .attr("dy", function(d,i) { return (d.endAngle > 90 * Math.PI/180 ? 18 : -11); })
       .append("textPath")
      .attr("startOffset","50%")
      .style("text-anchor","middle")
      .attr("xlink:href",function(d,i){return "#donutArc"+i;})
      .text(function(d){return d.data.name;});

    ////////////////////////////////////////////////////////////// 
    ///////////////////////// half nodes ///////////////////////// 
    ////////////////////////////////////////////////////////////// 

    var arc = d3.arc();

    var halfcircle = function(x,y,rad, start, end, color) {
      pos_svg.append('path')
        .attr('transform', 'translate('+[x,y]+')')
        .attr('d', arc({
            innerRadius: 0,
            outerRadius: rad,
            startAngle: Math.PI * start,
            endAngle: Math.PI * end,
        }))
        .style("fill", color);  

    }


    halfcircle(-1,0,20, -1, 0, "purple");
    halfcircle(1,0,20, 1, 0, "orange");


    var list = d3.selectAll(".donutArcs").each(function(d){
      console.log(d);  

      
      pos_svg
        .append("circle")
        .style("stroke", "gray")
        .style("fill", "red")
        .attr("r", 5)
        .attr("cx", (width*0.75/2)*Math.sin((d.startAngle+d.endAngle)*180/6.28 * Math.PI/180))
        .attr("cy", -(width*0.75/2)*Math.cos((d.startAngle+d.endAngle)*180/6.28 * Math.PI/180));
    })
    
    // var ribbon = d3.ribbon().radius(10);
    //
    

    // pos_svg.append("g")
    // .attr("class", "ribbons")
    // .selectAll("path")
    // .enter().append("path")
    //   .attr("d", ribbon)
    //   .style("fill", function(d) { return color(d.target.index); })
    //   .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });