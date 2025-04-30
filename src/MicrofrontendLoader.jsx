import { useEffect, useRef } from 'react';

const MicrofrontendLoader = ({ scriptUrl, cssUrl, mountDivId, globalVarName, propsToPass }) => {
    const rootRef = useRef(null); // Track the created root
    const linkRef = useRef(null); // Track the created <link> tag

    useEffect(() => {
        // 1. Load CSS first (if provided)
        if (cssUrl) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssUrl;
            link.type = 'text/css';
            linkRef.current = link;
            document.head.appendChild(link);
        }

        // 2. Load Script
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const rootElement = document.getElementById(mountDivId);
            const Component = window[globalVarName];
            if (Component && rootElement) {
                if (!rootRef.current) {
                    // Only create root if not already created
                    rootRef.current = window.ReactDOM.createRoot(rootElement);
                }

                // If root exists, call render, otherwise create root and then render
                rootRef.current.render(window.React.createElement(Component, propsToPass));
            }
        };

        return () => {
            // 3. Cleanup everything properly
            const rootElement = document.getElementById(mountDivId);
            if (rootRef.current) {
                rootRef.current.unmount(); // Cleanly unmount the component
                rootRef.current = null;    // Reset the root ref
            }
            if (rootElement) {
                rootElement.innerHTML = '';  // Clear the root element
            }
            if (script.parentNode) {
                document.body.removeChild(script);  // Remove the script
            }
            if (linkRef.current && linkRef.current.parentNode) {
                document.head.removeChild(linkRef.current); // Remove the CSS link tag
                linkRef.current = null;
            }
        };
    }, [scriptUrl, cssUrl, mountDivId, globalVarName, propsToPass]);

    return (
        <div id={mountDivId} />
    );
};

export default MicrofrontendLoader;
