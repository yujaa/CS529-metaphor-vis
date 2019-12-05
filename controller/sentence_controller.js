function getSentences(word){
    let sentenceArr= [];
    let wordArr=[];
    let metaphorArr=[];
    let wordPos_Arr = [];
    let metaphorPos_Arr = [];
    for (let d in linkArray){
        //console.log(linkArray[d])
        if(linkArray[d].source == word || linkArray[d].target == word){
            sentenceArr.push(linkArray[d].sentence)
            wordArr.push(linkArray[d].source)
            metaphorArr.push(linkArray[d].target)
            wordPos_Arr.push(linkArray[d].source_POS)
            metaphorPos_Arr.push(linkArray[d].target_POS)
        }
    }

    document.getElementById('sentences-list').innerHTML = ''
    var node_ol = document.createElement('p');
    node_ol.innerHTML="<ol> ";
    document.getElementById('sentences-list').appendChild(node_ol);

    //print 
    for(let d in sentenceArr){
        wordPOS_color = ""
        metaphorPOS_color = ""
        console.log(sentenceArr[d]);
        var newNode = document.createElement('p');
        var readmore = document.createElement('p');
        console.log(wordArr[d]);
        //Adding color to POS Tags
        if (wordPos_Arr[d] == "Noun")
        {
            wordPOS_color = "<sub style='font-size:small; font-style:italic; color:LimeGreen;'>[Noun]</sub>"
        }
        else if (wordPos_Arr[d] == "Verb")
        {
            wordPOS_color = "<sub style='font-size:small; font-style:italic; color:Magenta;'>[Verb]</sub>"
        }
        else if (wordPos_Arr[d] == "Adjective")
        {
            wordPOS_color = "<sub style='font-size:small; font-style:italic; color:HotPink;'>[Adjective]</sub>"
        }
        if (wordPos_Arr[d] == "Adverb")
        {
            wordPOS_color = "<sub style='font-size:small; font-style:italic; color:DarkTurquoise;'>[Adverb]</sub>" 
        }
        if (metaphorPos_Arr[d] == "Noun")
        {
            metaphorPOS_color = "<sub style='font-size:small; font-style:italic; color:LimeGreen;'>[Noun]</sub>"
        }
        else if (metaphorPos_Arr[d] == "Verb")
        {
            metaphorPOS_color = "<sub style='font-size:small; font-style:italic; color:Magenta;'>[Verb]</sub>"
        }
        else if (metaphorPos_Arr[d] == "Adjective")
        {
            metaphorPOS_color = "<sub style='font-size:small; font-style:italic; color:HotPink;'>[Adjective]</sub>"
        }
        else if (metaphorPos_Arr[d] == "Adverb")
        {
            metaphorPOS_color = "<sub style='font-size:small; font-style:italic; color:DarkTurquoise;'>[Adverb]</sub>" 
        }
        //highlight words
        sentenceArr[d] = sentenceArr[d].replace(" "+wordArr[d], " "+"<text style='color:black; font-weight:bold; background-color: skyblue; font-size:14px'>"+wordArr[d]+"</text>"+" "+wordPOS_color);
        sentenceArr[d] = sentenceArr[d].replace(" "+metaphorArr[d], " "+"<text style='color:black; font-weight:bold; background-color: orange; font-size:14px'>"+metaphorArr[d]+"</text>"+" "+metaphorPOS_color);
        console.log(sentenceArr[d]);
        newNode.innerHTML="<li> " + sentenceArr[d] + "</li>";

        // Add the contents of sentences to #sentences-tab
        document.getElementById('sentences-list').appendChild(newNode);
    }

    node_ol.innerHTML= " </ol>";
    document.getElementById('sentences-list').appendChild(node_ol);


}

