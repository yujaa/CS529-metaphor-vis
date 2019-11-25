var App={};

var filteredGraph; 

d3.json("./model/data/train_graph_data.json", function(error, data) {
  App.data = data;
  draw_graph(data);

})


async function filter_by_keyword(data, keyword){
 
  var filteredLinks = data.links.filter(d=> d.target == keyword  || d.source == keyword);

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

 console.log(data);
 return Promise.resolve(1);
}
