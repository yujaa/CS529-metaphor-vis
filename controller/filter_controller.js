var App = App ||{};

var filteredGraph;


function search(){
  d3.json("./model/data/train_graph_data.json", function(error, data) {
    var keyword = document.getElementById('search-box').value;
    filter_by_keyword(data,keyword);

  })
  
}

function histogram_brushing(){

}