
  var popupIdqayib    
  const qayib = () =>
  {   
    if (typeof popupIdqayib === "undefined") {
  
      // Open the popup
      chrome.windows.create({
        "url": "popup2.html",
        "type": "popup",
        "focused": true,
        "width": 350,
        "height": 350
      }, function (popup) {
        popupIdqayib = popup.id;
      }); 
      
    } 
    // There's currently a popup open
    else {
       // Bring it to the front so the user can see it
      chrome.windows.update(popupIdqayib, { "focused": true });  
    }
  
  
    }
  
    const quiz = () =>
    {   
      if (typeof popupIdquiz === "undefined") {
    
        // Open the popup
        chrome.windows.create({
          "url": "popup.html",
          "type": "popup",
          "focused": true,
          "width": 350,
          "height": 350
        }, function (popup) {
          popupIdquiz = popup.id;
        }); 
        
      } 
      // There's currently a popup open
      else {
         // Bring it to the front so the user can see it
        chrome.windows.update(popupIdquiz, { "focused": true });  
      }
    
    
      }

  

    
  
  
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "background" )
    {

      const jwt = request.jwt

      chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
      {
          if( request.greeting === "popup2.js" )
          {

            sendResponse({jwt:jwt})
          }})

setInterval(() => {fetch('http://www.foo.com:3005/extension/checkForQayib?jwt='+jwt).then(r => r.text()).then(result => {

  if(result == "true"){
    qayib()
    setTimeout(()=>{},10000)

}

})
},5000)

}
})



chrome.windows.onRemoved.addListener(function(windowId) {
  // If the window getting closed is the popup we created
  if (windowId === popupIdqayib) {
    // Set popupId to undefined so we know the popups not open
    popupIdqayib = undefined;
  }
});

