export interface MediaItem {
    id: number;
    disk: string;
    path: string;
    webp_path: string | null;
    thumb_path: string | null;
    original_name: string;
    mime: string;
    type: 'image' | 'video' | 'document';
    size_bytes: number;
    width: number | null;
    height: number | null;
    duration_seconds: number | null;
    alt_text: string | null;
    created_at: string;
    updated_at: string;
    url: string;
    webp_url: string | null;
    thumb_url: string | null;
    reference_count: number;
    is_in_use: boolean;
    formatted_size: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface DashboardCounts {
    published_projects: number;
    total_projects: number;
    unread_messages: number;
    total_messages: number;
    skills: number;
    media: number;
}

export interface RecentMessage {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    read_at: string | null;
    created_at: string;
}

export interface RecentProject {
    id: number;
    title: string;
    slug: string;
    planet_style: string;
    is_published: boolean;
    updated_at: string;
}

export interface SystemTelemetry {
    php_version: string;
    laravel_version: string;
    server_time: string;
    environment: string;
}

export interface SettingItem {
    id: number;
    group: string;
    key: string;
    value: string | null;
    type:
        | 'string'
        | 'text'
        | 'color'
        | 'url'
        | 'email'
        | 'bool'
        | 'int'
        | 'media'
        | 'json';
    label: string;
    created_at?: string;
    updated_at?: string;
}

export interface SectionItem {
    id: number;
    key: string;
    nav_label: string;
    eyebrow: string | null;
    title: string | null;
    subtitle: string | null;
    sort_order: number;
    is_visible: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface HeroRoleItem {
    id: number;
    hero_content_id: number;
    text: string;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface HeroContentItem {
    id: number;
    eyebrow: string | null;
    name: string;
    primary_button_label: string;
    primary_button_url: string;
    secondary_button_label: string;
    secondary_button_url: string;
    roles: HeroRoleItem[];
    created_at?: string;
    updated_at?: string;
}

export interface AboutFactItem {
    id: number;
    about_content_id: number;
    kind: 'fact' | 'counter';
    label: string;
    value: string;
    suffix: string | null;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface AboutContentItem {
    id: number;
    heading: string | null;
    bio: string;
    facts: AboutFactItem[];
    created_at?: string;
    updated_at?: string;
}

export interface SkillItem {
    id: number;
    name: string;
    category: string;
    level: number;
    icon: string | null;
    sort_order: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export type PlanetStyle =
    | 'rocky'
    | 'station'
    | 'amber'
    | 'ringed'
    | 'ocean'
    | 'desert'
    | 'generic';

export interface TagItem {
    id: number;
    name: string;
    slug: string;
    sort_order?: number;
    pivot?: {
        sort_order: number;
    };
}

export interface ProjectFeatureItem {
    id?: number;
    project_id?: number;
    group_label: string;
    text: string;
    sort_order: number;
}

export interface ProjectMediaItem {
    id?: number;
    project_id?: number;
    media_id: number;
    kind: 'desktop' | 'mobile' | 'video' | 'other';
    caption: string | null;
    sort_order: number;
    media?: MediaItem;
}

export interface ProjectItem {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string | null;
    business_type: string | null;
    role: string | null;
    year: number | null;
    live_url: string;
    planet_style: PlanetStyle;
    accent_color: string | null;
    cover_media_id: number | null;
    show_live_preview: boolean;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    deleted_at: string | null;
    created_at?: string;
    updated_at?: string;
    cover_media?: MediaItem | null;
    tags?: TagItem[];
    features?: ProjectFeatureItem[];
    project_media?: ProjectMediaItem[];
}
