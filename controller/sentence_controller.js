function getSentences(word){
    let sentenceArr= [];
    let wordArr=[];
    let metaphorArr=[];
    for (let d in linkArray){
        //console.log(linkArray[d])
        if(linkArray[d].source == word || linkArray[d].target == word){
            sentenceArr.push(linkArray[d].sentence)
            wordArr.push(linkArray[d].source)
            metaphorArr.push(linkArray[d].target)
        }
    }

    document.getElementById('sentences-list').innerHTML = ''

    //print 
    for(let d in sentenceArr){

        console.log(sentenceArr[d]);
        var newNode = document.createElement('p');
        console.log(wordArr[d]);
        //highlight words
        sentenceArr[d] = sentenceArr[d].replace(" "+wordArr[d], "<text style='color:white; background-color: limegreen; font-size:14px'>"+" "+wordArr[d]+"</text>");
        sentenceArr[d] = sentenceArr[d].replace(" "+metaphorArr[d], "<text style='color:white; background-color: orange; font-size:14px'>"+" "+metaphorArr[d]+"</text>");
        console.log(sentenceArr[d]);
        newNode.innerHTML="* " + sentenceArr[d];

        // Add the contents of sentences to #sentences-tab
        document.getElementById('sentences-list').appendChild(newNode);
    }


}

