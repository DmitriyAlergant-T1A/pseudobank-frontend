
import React, { useEffect } from 'react';
import useStore from '../store/store';   // Adjust the path as necessary

function JuicyPixel() {

    const { setJuicySessionId, config } = useStore((state) => ({
      setJuicySessionId: state.setJuicySessionId,
      config: state.config
    }));

    useEffect(() => {
      // Only proceed if config.juicyScoreDataApiKey is available
      if (config.juicyScoreDataApiKey) {
        window.juicyLabConfig = {
          nextButton: "myFormButton",
          stopPingButton: "your-ping-button-id",
          completeButton: "mySubmitButton",
          apiKey: config.juicyScoreDataApiKey,
          onSessionReady: function(s) {
            console.log('Session from config event', s);
            setJuicySessionId(s); // Update the session ID in the store
          }
        };
    
        // Dynamically load the tracking script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = "https://score.juicyscore.net/static/js.js";
        document.head.appendChild(script);
    
        return () => {
          document.head.removeChild(script);
        };
      }
    }, [config.juicyScoreDataApiKey]);
}    

export default JuicyPixel;