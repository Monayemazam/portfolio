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
