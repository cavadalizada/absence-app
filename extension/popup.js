if(document.getElementById("form")){
  document.getElementById("form").addEventListener("submit", handleClickInitialize, false);
  }
  
  
    function handleClickInitialize () {
      
        email = form.elements[0].value
        password = form.elements[1].value

        try {

        fetch('http://qayib-app.herokuapp.com/extension/getToken?email='+email+'&password='+password).then(response => response.text()).catch(data => {

        jwt = data
        

        chrome.runtime.sendMessage({greeting: "background",jwt:jwt});
        chrome.runtime.sendMessage({greeting: "popup2",jwt:jwt});
  
        window.close()
        chrome.browserAction.setPopup({popup: "popup2.html"});
        
        })
      } catch (error) {
          
      }
      
        }

  