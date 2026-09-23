import { useState, useEffect } from "react";

export default function useResponsive() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const resize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const navBarStyle = {
        '--height': windowWidth <= 480 ? '40px' : '48px',
        '--border-bottom': 'none',
        '--background-color': '#fff',
        '--color': '#333',
        '--font-size': windowWidth <= 480 ? '16px' : '18px',
        // boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    };

    const pageContainerStyle = {
        maxWidth: windowWidth <= 480 ? '100%' : '600px',
        margin: '0 auto',
        padding: windowWidth <= 480 ? '10px' : '20px',
        backgroundColor:'#F0F0F0',
    };

    return {
        windowWidth,
        navBarStyle,
        pageContainerStyle
    };
}