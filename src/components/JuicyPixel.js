
import React, { useEffect } from 'react';

function JuicyPixel() {
    useEffect(() => {

        window.juicyLabConfig = {
            nextButton: "myFormButton",
            stopPingButton: "your-ping-button-id",
            completeButton: "mySubmitButton",
            onSessionReady: function(s) {
              console.log('Session from config event', s); //TODO: useState
            }
          };

          
        // Dynamically load the tracking script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = "https://score.jcsc.online/static/js.js";
        document.head.appendChild(script);
    
        return () => {
          // Cleanup the script when the component unmounts
          document.head.removeChild(script);
        };
      }, []);
    
      return (
        <noscript>
          <img style={{display: 'none'}} src="https://score.jcsc.online/savedata/?isJs=0" alt="" />
        </noscript>
      );
}

export default JuicyPixel;