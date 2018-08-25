var inputSearch;
function maxTimes(fn,n, ctx){
	var lastRes;
	return function(){
		if(n === 0) return lastRes;
		n--;
		lastRes = fn.apply(ctx || this, arguments);
		return lastRes;
	}
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var setTimeout15 = maxTimes(window.setTimeout, 15, window);


function init() {
    var button = document.getElementById('search-icon-legacy');
    if(!button) { 
		setTimeout15(init, 2000); 
		return;
	}
	var lButton = document.createElement('button');
    lButton.className = button.className;
    lButton.dir = button.dir;
    lButton.innerHTML = "I'm feeling lucky!";	
    insertAfter(lButton, button);
    lButton.style.padding = '2px 2px 2px 2px';
    lButton.onclick = handleClick;
    inputSearch = document.getElementById("masthead-search-term") || document.getElementsByName("search_query")[0];
    inputSearch.onkeydown = function(e){
        if(e.shiftKey && e.keyCode === 13){
            handleClick(e);
            return false;
        }
    }
}
window.onload = init;
function handleClick(e){
	if(!inputSearch){
		console.error('cannot find search input element');
		return;
	}
	var value = inputSearch.value;
	chrome.runtime.sendMessage({'input' : value, 'protocol' : location.protocol});
    e.preventDefault();
}