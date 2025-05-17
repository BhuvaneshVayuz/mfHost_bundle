// import React, {
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
//   useState,
// } from "react";
// import { useNavigate } from "react-router-dom";

// const MicrofrontendLoader = forwardRef(
//   ({ scriptUrl, cssUrl, mountDivId, globalVarName, propsToPass }, ref) => {
//     const rootRef = useRef(null);
//     const instanceRef = useRef(null);
//     const containerRef = useRef(null);
//     const linkRef = useRef(null);

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       // Load CSS first (optional)
//       if (cssUrl) {
//         const link = document.createElement("link");
//         link.rel = "stylesheet";
//         link.href = cssUrl;
//         link.type = "text/css";
//         linkRef.current = link;
//         document.head.appendChild(link);
//       }

//       const script = document.createElement("script");
//       script.src = scriptUrl;
//       script.async = true;
//       document.body.appendChild(script);

//       script.onload = () => {
//         const Component = window[globalVarName];
//         if (Component && containerRef.current) {
//           if (!rootRef.current) {
//             rootRef.current = window.ReactDOM.createRoot(containerRef.current);
//             instanceRef.current = {
//               props: propsToPass,
//               render: (newProps) => {
//                 instanceRef.current.props = {
//                   ...instanceRef.current.props,
//                   ...newProps,
//                 };
//                 rootRef.current.render(
//                   window.React.createElement(
//                     Component,
//                     instanceRef.current.props
//                   )
//                 );
//               },
//             };
//             instanceRef.current.render({});
//             setLoading(false);
//           }
//         }
//       };

//       return () => {
//         if (rootRef.current) {
//           rootRef.current.unmount();
//           rootRef.current = null;
//         }
//         if (containerRef.current) {
//           containerRef.current.innerHTML = "";
//         }
//         if (script.parentNode) {
//           document.body.removeChild(script);
//         }
//         if (linkRef.current && linkRef.current.parentNode) {
//           document.head.removeChild(linkRef.current);
//         }
//       };
//     }, [scriptUrl, cssUrl, mountDivId, globalVarName]); // no rerun on props

//     // Provide method to update props from outside
//     useImperativeHandle(ref, () => ({
//       updateProps: (newProps) => {
//         if (instanceRef.current) {
//           instanceRef.current.render(newProps);
//         }
//       },
//     }));

//     const navigate = useNavigate();

//     return (
//       <div>
//         {loading && (
//           <div style={{ textAlign: "center", padding: "1rem" }}>
//             Loading Microfrontend...
//           </div>
//         )}
//         <div
//           id={mountDivId}
//           ref={containerRef}
//           style={{ display: loading ? "none" : "block" }}
//         />
//       </div>
//     );
//   }
// );

// export default MicrofrontendLoader;


import React, {
    useEffect,
    forwardRef,
    useImperativeHandle,
    useState,
    Suspense,
} from "react";

const MicrofrontendLoader = forwardRef(
    ({ scriptUrl, cssUrl, globalVarName, propsToPass = {} }, ref) => {
        const [Component, setComponent] = useState(null);
        const [dynamicProps, setDynamicProps] = useState(propsToPass);

        useEffect(() => {
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;

            // Optional: attach CSS
            if (cssUrl) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = cssUrl;
                document.head.appendChild(link);
            }

            script.onload = () => {
                const RemoteComponent = window[globalVarName];
                if (RemoteComponent) {
                    setComponent(() => RemoteComponent);
                } else {
                    console.error(`Global var ${globalVarName} not found`);
                }
            };

            script.onerror = () => {
                console.error(`Failed to load script: ${scriptUrl}`);
            };

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }, [scriptUrl, cssUrl, globalVarName]);

        // Allow parent to update props dynamically
        useImperativeHandle(ref, () => ({
            updateProps: (newProps) => {
                setDynamicProps((prevProps) => ({
                    ...prevProps,
                    ...newProps,
                }));
            },
        }));

        if (!Component) {
            return <div>Loading Microfrontend...</div>;
        }

        return (
            <Suspense fallback={<div>Loading Component...</div>}>
                <Component {...dynamicProps} />
            </Suspense>
        );
    }
);

export default MicrofrontendLoader;
