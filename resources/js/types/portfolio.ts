export interface PortfolioSection {
    id: number;
    key:
        | 'hero'
        | 'about'
        | 'skills'
        | 'projects'
        | 'services'
        | 'experience'
        | 'process'
        | 'testimonials'
        | 'contact'
        | 'footer';
    nav_label: string;
    eyebrow?: string | null;
    title?: string | null;
    subtitle?: string | null;
    sort_order: number;
    is_visible: boolean;
}

export interface HeroRoleItem {
    id: number;
    text: string;
    sort_order: number;
}

export type HeroRole = HeroRoleItem;

export interface HeroData {
    id: number;
    eyebrow?: string | null;
    name: string;
    primary_button_label: string;
    primary_button_url: string;
    secondary_button_label: string;
    secondary_button_url: string;
    roles: HeroRoleItem[];
}

export interface AboutFactItem {
    id: number;
    kind: string;
    label: string;
    value: string;
    suffix?: string | null;
    sort_order: number;
}

export interface AboutData {
    id: number;
    heading?: string | null;
    bio: string;
    facts: AboutFactItem[];
}

export interface SkillItem {
    id: number;
    name: string;
    category: string;
    level: number;
    icon?: string | null;
    sort_order: number;
    is_published: boolean;
}

export interface TagItem {
    id: number;
    name: string;
    slug: string;
    category?: string | null;
    color?: string | null;
}

export interface ProjectFeatureItem {
    id: number;
    group_label: string;
    title: string;
    description?: string | null;
    sort_order: number;
}

export interface MediaItem {
    id: number;
    url: string;
    webp_url?: string | null;
    thumb_url?: string | null;
    original_name: string;
    mime: string;
    type: string;
    alt_text?: string | null;
}

export interface ProjectItem {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description?: string | null;
    business_type?: string | null;
    role?: string | null;
    year?: number | null;
    live_url: string;
    planet_style: string;
    accent_color?: string | null;
    cover_media_id?: number | null;
    cover_media?: MediaItem | null;
    show_live_preview: boolean;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    tags?: TagItem[];
    features?: ProjectFeatureItem[];
    media?: MediaItem[];
}

export interface ServiceItem {
    id: number;
    title: string;
    description: string;
    icon?: string | null;
    sort_order: number;
    is_published: boolean;
}

export interface ExperienceItem {
    id: number;
    role: string;
    company: string;
    start_date: string;
    end_date?: string | null;
    is_current: boolean;
    description?: string | null;
    sort_order: number;
    is_published: boolean;
}

export interface ProcessStepItem {
    id: number;
    title: string;
    description: string;
    sort_order: number;
    is_published: boolean;
}

export interface TestimonialItem {
    id: number;
    quote: string;
    author_name: string;
    author_role?: string | null;
    company?: string | null;
    photo_media_id?: number | null;
    photo?: MediaItem | null;
    project_id?: number | null;
    project?: { id: number; title: string; slug: string } | null;
    sort_order: number;
    is_published: boolean;
}

export interface PortfolioSettings {
    site_title?: string;
    site_tagline?: string;
    logo_media_id?: string;
    favicon_media_id?: string;
    photo_media_id?: string;
    resume_media_id?: string;
    logo_media?: MediaItem | null;
    favicon_media?: MediaItem | null;
    photo_media?: MediaItem | null;
    resume_media?: MediaItem | null;
    default_theme?: 'system' | 'dark' | 'light';
    dark_primary?: string;
    dark_secondary?: string;
    dark_accent?: string;
    light_primary?: string;
    light_secondary?: string;
    light_accent?: string;
    animation_level?: 'full' | 'light' | 'off';
    contact_email?: string;
    contact_phone?: string;
    whatsapp_number?: string;
    booking_url?: string;
    github_url?: string;
    linkedin_url?: string;
    facebook_url?: string;
    x_url?: string;
    youtube_url?: string;
    [key: string]: unknown;
}

export interface PortfolioSeo {
    id: number;
    page: string;
    meta_title: string;
    meta_description: string;
    og_image_media_id?: number | null;
    og_image?: MediaItem | null;
    canonical_url?: string | null;
    person_job_title?: string | null;
    person_same_as?: string[] | null;
    robots: string;
}

export interface PortfolioPageProps {
    sections: PortfolioSection[];
    hero: HeroData | null;
    about: AboutData | null;
    skills: SkillItem[];
    projects: ProjectItem[];
    services: ServiceItem[];
    experiences: ExperienceItem[];
    processSteps: ProcessStepItem[];
    testimonials: TestimonialItem[];
    settings: PortfolioSettings;
    seo: PortfolioSeo | null;
}
