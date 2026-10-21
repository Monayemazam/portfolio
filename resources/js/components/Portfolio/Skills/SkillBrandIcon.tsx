import React from 'react';
import * as LineIcons from 'lineicons-react';
import { resolveSkillIcon } from './iconResolver';

interface SkillBrandIconProps {
    name: string;
    icon?: string | null;
    className?: string;
}

/**
 * Authentic technology brand icons with official colors, crisp vector paths,
 * and high-contrast rendering against dark and light themes.
 */
export default function SkillBrandIcon({
    name,
    icon,
    className = 'h-5 w-5',
}: SkillBrandIconProps) {
    const cleanName = (name || '').toLowerCase().trim();

    // 1. JavaScript
    if (cleanName === 'javascript' || cleanName === 'js') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="JavaScript"
            >
                <rect width="24" height="24" rx="4" fill="#F7DF1E" />
                <path
                    d="M6.5 18.2c.8.5 1.7.8 2.6.8 1.4 0 2.2-.7 2.2-2.1v-7.4H9.3v7.3c0 .7-.3 1.1-.9 1.1-.5 0-.9-.2-1.3-.4l-.6 1.4zm7.3-.1c1 .6 2.2.9 3.5.9 2.5 0 3.9-1.3 3.9-3.2 0-1.7-1-2.6-2.9-3.4l-.8-.4c-1.1-.5-1.5-.9-1.5-1.6 0-.8.6-1.3 1.7-1.3.9 0 1.6.3 2.2.7l.6-1.4c-.7-.5-1.7-.8-2.8-.8-2.3 0-3.6 1.3-3.6 3 0 1.6 1 2.5 2.7 3.2l.9.4c1.2.5 1.7 1 1.7 1.8 0 .9-.8 1.5-2.1 1.5-1.1 0-2.1-.4-2.8-1l-.6 1.6z"
                    fill="#000000"
                />
            </svg>
        );
    }

    // 2. TypeScript
    if (cleanName === 'typescript' || cleanName === 'ts') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="TypeScript"
            >
                <rect width="24" height="24" rx="4" fill="#3178C6" />
                <path
                    d="M4.5 9.5h7.2v1.8H9.1v8.2H7.1v-8.2H4.5V9.5zm9 8.7c1 .6 2.2.9 3.5.9 2.5 0 3.9-1.3 3.9-3.2 0-1.7-1-2.6-2.9-3.4l-.8-.4c-1.1-.5-1.5-.9-1.5-1.6 0-.8.6-1.3 1.7-1.3.9 0 1.6.3 2.2.7l.6-1.4c-.7-.5-1.7-.8-2.8-.8-2.3 0-3.6 1.3-3.6 3 0 1.6 1 2.5 2.7 3.2l.9.4c1.2.5 1.7 1 1.7 1.8 0 .9-.8 1.5-2.1 1.5-1.1 0-2.1-.4-2.8-1l-.6 1.6z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 3. PHP
    if (cleanName === 'php') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="PHP"
            >
                <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4" />
                <path
                    d="M6.8 14.5h-1.5l1.6-6.2h2.4c1.3 0 2.1.7 1.8 2-.3 1.4-1.5 2.1-2.8 2.1H7.2l-.4 2.1zm1.2-3.3h.9c.7 0 1.2-.4 1.4-1.1.2-.6-.2-1-.9-1h-.9l-.6 2.1zm5.2 3.3h-1.5l1.6-6.2h1.5l-.6 2.4h1.7c1.3 0 2.1.7 1.8 2-.3 1.4-1.5 2.1-2.8 2.1h-1.1l-.6 1.7zm1.3-2.9h.9c.7 0 1.2-.4 1.4-1.1.2-.6-.2-1-.9-1h-.9l-.6 2.1z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 4. Laravel
    if (cleanName === 'laravel') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Laravel"
            >
                <path
                    d="M3.5 6.2l7.8-4.5c.4-.2.9-.2 1.4 0l7.8 4.5c.5.3.8.8.8 1.4v9c0 .6-.3 1.1-.8 1.4l-7.8 4.5c-.4.2-.9.2-1.4 0l-7.8-4.5c-.5-.3-.8-.8-.8-1.4v-9c0-.6.3-1.1.8-1.4z"
                    fill="#FF2D20"
                />
                <path
                    d="M12 2.5l7.5 4.3v8.6L12 19.7 4.5 15.4V6.8L12 2.5z"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                />
                <path
                    d="M8.5 8.5l3.5 2v4l-3.5-2v-4zm7 0v4l-3.5 2v-4l3.5-2z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 5. Vue.js
    if (cleanName.includes('vue')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Vue.js"
            >
                <polygon points="12,19.2 1.5,4 6,4 12,13.5 18,4 22.5,4" fill="#42B883" />
                <polygon points="12,13.5 6,4 9.5,4 12,8.5 14.5,4 18,4" fill="#35495E" />
            </svg>
        );
    }

    // 6. React
    if (cleanName.includes('react')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="React"
            >
                <ellipse cx="12" cy="12" rx="3" ry="3" fill="#61DAFB" />
                <ellipse
                    cx="12"
                    cy="12"
                    rx="10"
                    ry="4"
                    stroke="#61DAFB"
                    strokeWidth="1.6"
                />
                <ellipse
                    cx="12"
                    cy="12"
                    rx="10"
                    ry="4"
                    stroke="#61DAFB"
                    strokeWidth="1.6"
                    transform="rotate(60 12 12)"
                />
                <ellipse
                    cx="12"
                    cy="12"
                    rx="10"
                    ry="4"
                    stroke="#61DAFB"
                    strokeWidth="1.6"
                    transform="rotate(120 12 12)"
                />
            </svg>
        );
    }

    // 7. Tailwind CSS
    if (cleanName.includes('tailwind')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Tailwind CSS"
            >
                <path
                    d="M12 6c-3.6 0-5.8 1.8-6.6 5.4 1.4-1.8 3-2.4 4.8-1.8 1 .3 1.8 1.1 2.6 1.9C14.1 12.8 15.8 14 19.2 14c3.6 0 5.8-1.8 6.6-5.4-1.4 1.8-3 2.4-4.8 1.8-1-.3-1.8-1.1-2.6-1.9C17 7.2 15.3 6 12 6zm-7.2 6c-3.6 0-5.8 1.8-6.6 5.4 1.4-1.8 3-2.4 4.8-1.8 1 .3 1.8 1.1 2.6 1.9C6.9 18.8 8.6 20 12 20c3.6 0 5.8-1.8 6.6-5.4-1.4 1.8-3 2.4-4.8 1.8-1-.3-1.8-1.1-2.6-1.9C9.8 13.2 8.1 12 4.8 12z"
                    fill="#38BDF8"
                />
            </svg>
        );
    }

    // 8. MySQL
    if (cleanName.includes('mysql')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="MySQL"
            >
                <rect width="24" height="24" rx="4" fill="#00758F" />
                <path
                    d="M5.5 15.5l2.2-6.5h1.8l1.8 4.2 1.8-4.2h1.8l2.2 6.5h-1.8l-.9-3-1.8 4h-1.3l-1.8-4-.9 3H5.5z"
                    fill="#FFFFFF"
                />
                <circle cx="18" cy="7" r="1.5" fill="#F29111" />
            </svg>
        );
    }

    // 9. WordPress
    if (cleanName.includes('wordpress')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="WordPress"
            >
                <circle cx="12" cy="12" r="10.5" fill="#21759B" />
                <circle cx="12" cy="12" r="9.5" stroke="#FFFFFF" strokeWidth="1" />
                <path
                    d="M3.8 12c0 3.8 2.6 7 6.2 8l-3.8-10.4c-.4.8-.6 1.6-.6 2.4zm13.4-.6c0-1.1-.4-1.8-.7-2.4-.5-.8-.9-1.4-.9-2.2 0-.9.7-1.7 1.7-1.7.1 0 .2 0 .3.1C16.1 4 14.1 3.2 12 3.2c-3.1 0-5.8 1.6-7.3 4l4.2 11.5 3-8.8c-.2 0-.4-.1-.6-.1-.5 0-1.2.1-1.2.1l.1-.9 2.9.1 1.7-.1-.1.9c-.2 0-.6-.1-.8-.1-.4 0-.8.3-.9.9l-2.6 7.6 2.5 7.4c3.4-1.2 5.9-4.5 5.9-8.4zm-7.6 8.3L6.8 12.2l3.4 9.4c.8.2 1.6.3 2.5.3.3 0 .7 0 1-.1l-4.1-12.1zm8.3-9.5c.3.8.4 1.6.4 2.5 0 2.8-1.5 5.3-3.7 6.7l3.3-9.2z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 10. WooCommerce
    if (cleanName.includes('woocommerce')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="WooCommerce"
            >
                <rect width="24" height="24" rx="5" fill="#96588A" />
                <path
                    d="M4.5 7.5h15c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1h-7l-3 2.5v-2.5h-5c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1z"
                    fill="#7F54B3"
                />
                <path
                    d="M7 10.2l1.2 3.8 1.4-3.8h1l1.4 3.8 1.2-3.8h1.2l-2 5.5h-1l-1.4-3.8-1.4 3.8h-1l-2-5.5H7z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 11. HTML & CSS
    if (cleanName.includes('html') || cleanName.includes('css')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="HTML & CSS"
            >
                {/* HTML Shield (Orange) */}
                <path d="M3 4l1.6 14.5L10 20.5l.1-14.5H3z" fill="#E34F26" />
                <path d="M10 6H5.2l.4 3.5h4.4V6zm0 5H5.8l.4 3.5 3.8 1.1V13.8l-2.4-.7-.2-1.6h2.8V11z" fill="#FFFFFF" />
                {/* CSS Shield (Blue) */}
                <path d="M21 4l-1.6 14.5L14 20.5l-.1-14.5H21z" fill="#1572B6" />
                <path d="M14 6h4.8l-.4 3.5H14V6zm0 5h4.2l-.4 3.5-3.8 1.1V13.8l2.4-.7.2-1.6H14V11z" fill="#FFFFFF" />
            </svg>
        );
    }

    // 12. GitHub
    if (cleanName.includes('github')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="GitHub"
            >
                <circle cx="12" cy="12" r="11" fill="#24292F" />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 13. cPanel Deployment
    if (cleanName.includes('cpanel')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="cPanel"
            >
                <rect width="24" height="24" rx="4" fill="#FF6C2C" />
                <path
                    d="M10.5 7.5C8 7.5 6 9.5 6 12s2 4.5 4.5 4.5c1.8 0 3.4-1.1 4.1-2.7h-2.1c-.5.7-1.2 1.1-2 1.1-1.6 0-2.8-1.3-2.8-2.9s1.2-2.9 2.8-2.9c.8 0 1.5.4 2 1.1h2.1c-.7-1.6-2.3-2.7-4.1-2.7zm4.5 0v9h1.8v-3.5h2.2c1.7 0 2.8-1.1 2.8-2.8 0-1.6-1.1-2.7-2.8-2.7H15zm1.8 1.6h2c.8 0 1.3.5 1.3 1.2 0 .7-.5 1.2-1.3 1.2h-2V9.1z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 14. hPanel Deployment
    if (cleanName.includes('hpanel') || cleanName.includes('hostinger')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="hPanel"
            >
                <rect width="24" height="24" rx="4" fill="#673DE6" />
                <path
                    d="M7 6h2.5v4.5h5V6H17v12h-2.5v-5h-5v5H7V6z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 15. SEO
    if (cleanName === 'seo' || cleanName.includes('search engine')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="SEO"
            >
                <rect width="24" height="24" rx="4" fill="#10B981" />
                <path
                    d="M5 17l4-5 3 3 6-8"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M14 7h4v4"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    // 16. Facebook Ads
    if (cleanName.includes('facebook ads') || cleanName.includes('fb ads')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Facebook Ads"
            >
                <rect width="24" height="24" rx="4" fill="#1877F2" />
                <path
                    d="M15.5 12.5H13v7h-3v-7H8v-2.5h2v-2c0-2.2 1.3-3.5 3.4-3.5 1 0 1.9.1 2.1.1v2.5h-1.4c-1.1 0-1.3.5-1.3 1.3v1.6h2.7l-.4 2.5z"
                    fill="#FFFFFF"
                />
                <circle cx="18" cy="6" r="3" fill="#F59E0B" />
                <path d="M17 5h2v2h-2z" fill="#FFFFFF" />
            </svg>
        );
    }

    // 17. Facebook Meta Pixel
    if (cleanName.includes('pixel') || cleanName.includes('meta pixel')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Meta Pixel"
            >
                <rect width="24" height="24" rx="4" fill="#0081FB" />
                <path
                    d="M7.5 14.5c-1.5 0-2.5-1.2-2.5-2.5s1-2.5 2.5-2.5c1.4 0 2.3.9 3.2 2.2l.3.4.3-.4c.9-1.3 1.8-2.2 3.2-2.2 1.5 0 2.5 1.2 2.5 2.5s-1 2.5-2.5 2.5c-1.4 0-2.3-.9-3.2-2.2l-.3-.4-.3.4c-.9 1.3-1.8 2.2-3.2 2.2zm0-1.4c.8 0 1.4-.7 2.1-1.6-.7-.9-1.3-1.6-2.1-1.6-.7 0-1.2.6-1.2 1.2s.5 2 1.2 2zm9 0c.7 0 1.2-.6 1.2-1.2s-.5-1.2-1.2-1.2c-.8 0-1.4.7-2.1 1.6.7.9 1.3 1.6 2.1 1.6z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 18. Content Creation
    if (cleanName.includes('content') || cleanName.includes('copywriting')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Content Creation"
            >
                <rect width="24" height="24" rx="4" fill="#F59E0B" />
                <path
                    d="M6 18h12v-2H6v2zm0-4h12v-2H6v2zm0-4h8V8H6v2zm10.5-3.5l1.5 1.5-6 6H10.5v-1.5l6-6z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 19. Video Editing
    if (cleanName.includes('video')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Video Editing"
            >
                <rect width="24" height="24" rx="4" fill="#EC4899" />
                <path
                    d="M4 6h16v12H4V6zm2 2v2h2V8H6zm0 3v2h2v-2H6zm0 3v2h2v-2H6zm10-6v2h2V8h-2zm0 3v2h2v-2h-2zm0 3v2h2v-2h-2zm-6-4l4 3-4 3v-6z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 20. Graphic Design
    if (cleanName.includes('graphic design') || cleanName.includes('graphic')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Graphic Design"
            >
                <rect width="24" height="24" rx="4" fill="#A855F7" />
                <path
                    d="M12 4a8 8 0 100 16 2.5 2.5 0 002.5-2.5c0-.6-.3-1.1-.7-1.5-.4-.4-.7-.9-.7-1.5 0-1.1.9-2 2-2H17a3 3 0 003-3c0-4.4-3.6-8-8-8zm-4.5 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-3a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 21. UI/UX Design
    if (cleanName.includes('ui/ux') || cleanName.includes('ui') || cleanName.includes('ux')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="UI/UX Design"
            >
                <rect width="24" height="24" rx="4" fill="#A259FF" />
                <path
                    d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2 0v3h12V6H6zm0 5v7h5v-7H6zm7 0v7h5v-7h-5z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 22. Website Deployment & Hosting
    if (cleanName.includes('hosting') || cleanName.includes('website deployment')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Website Deployment"
            >
                <rect width="24" height="24" rx="4" fill="#0EA5E9" />
                <path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 9h-3.2a14.3 14.3 0 00-1.3-5.2A8 8 0 0118.9 11zM12 4.1c.9 1.4 1.7 3.5 2.1 6.9H9.9c.4-3.4 1.2-5.5 2.1-6.9zM5.1 11A8 8 0 019.6 5.8 14.3 14.3 0 008.3 11H5.1zm0 2h3.2c.2 2 .7 3.8 1.3 5.2A8 8 0 015.1 13zm6.9 6.9c-.9-1.4-1.7-3.5-2.1-6.9h4.2c-.4 3.4-1.2 5.5-2.1 6.9zm2.4-1.7a14.3 14.3 0 001.3-5.2h3.2a8 8 0 01-4.5 5.2z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // 23. Ecommerce
    if (cleanName.includes('ecommerce') || cleanName.includes('store')) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Ecommerce"
            >
                <rect width="24" height="24" rx="4" fill="#10B981" />
                <path
                    d="M7 8V6a5 5 0 0110 0v2h2a1 1 0 011 1l-1.5 10a2 2 0 01-2 1.8H7.5a2 2 0 01-2-1.8L4 9a1 1 0 011-1h2zm2 0h6V6a3 3 0 00-6 0v2zm-1 3a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    // Generic fallback: Use resolved Lineicon with acid-lime/orange accent
    const FallbackIcon = resolveSkillIcon(icon);
    if (FallbackIcon) {
        return <FallbackIcon className={`${className} text-[var(--accent)]`} />;
    }

    // Typographic 2-letter monogram
    return (
        <span className="font-mono text-xs font-black text-[var(--accent)]">
            {cleanName.slice(0, 2).toUpperCase()}
        </span>
    );
}
