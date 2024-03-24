
import React, { useEffect } from 'react';
import useStore from '../store/store';   // Adjust the path as necessary

function JuicyPixel() {

    const setJuicySessionId = useStore((state) => state.setJuicySessionId);

    useEffect(() => {

        window.juicyLabConfig = {
            nextButton: "myFormButton",
            stopPingButton: "your-ping-button-id",
            completeButton: "mySubmitButton",
            apiKey: `${process.env.REACT_APP_JUICYSCORE_DATA_API_KEY}`,
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
          // Cleanup the script when the component unmounts
          document.head.removeChild(script);
        };
      }, []);
    
      return (
        <>
        </>
      );
}

export default JuicyPixel;