if(document.getElementById("form2")){
    document.getElementById("form2").addEventListener("submit", handleClick, false);
    }

function handleClick () {
    chrome.runtime.sendMessage({greeting:"popup2.js"},  function (response) {
        const jwt = response.jwt;
//        $("#tabURL").text(tabURL);
        
    const req = new XMLHttpRequest();
    const baseUrl = "http://qayib-app.herokuapp.com/university/isPresent";
    const urlParams = "jwt="+jwt 
    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(urlParams);

    parent.window.close()
    
});
}
     