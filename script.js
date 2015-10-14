var inputSearch;
function init() {
    var button = document.getElementById('search-btn');
    var lButton = document.createElement('button');
    
    lButton.className = button.className;
    lButton.dir = button.dir;
    lButton.innerHTML = "I'm feeling lucky!";
    button.parentNode.insertBefore(lButton, button);
    lButton.onclick = handleClick;
    inputSearch = document.getElementById("masthead-search-term") || document.getElementsByName("search_query")[0];
    inputSearch.onkeydown = function(e){
        if(e.shiftKey && e.keyCode === 13){
            handleClick(e);
            return false;
        }
    }
}
init();
function handleClick(e){
	if(!inputSearch){
		console.error('cannot find search input element');
		return;
	}
	var value = inputSearch.value;
	chrome.runtime.sendMessage({'input' : value, 'protocol' : location.protocol});
    e.preventDefault();
}