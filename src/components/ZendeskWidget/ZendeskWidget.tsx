import React, { useEffect } from 'react';

declare global {
  interface Window {
    zE?: any;
  }
}

const ZendeskWidget: React.FC = () => {
  useEffect(() => {
    // script de Zendesk
    const script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=b50e2bd7-fe12-4f65-8583-adeb6aa94b3c';
    script.async = true;

    //script al documento
    document.body.appendChild(script);

    // Limpieza cuando el componente se desmonte
    return () => {
      const existingScript = document.getElementById('ze-snippet');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; 
};

export default ZendeskWidget; 