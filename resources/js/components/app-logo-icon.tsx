import React from 'react';

export default function AppLogoIcon({
    className = 'size-8',
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo-icon.png"
            alt="Monayem Azam Logo"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
