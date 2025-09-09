export class User {
    id: number | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    email: string | undefined;
    profile_image: string;
    gender :number;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: LoginResponseData;
}

export interface MySystemDetailResponse {
    success: boolean;
    message: string;
    data: SystemDetail;
}

export interface SystemDetail {
    user: User;
    navigation: Navigation[];
    permissions: string;
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}

export interface LoginResponseData {
    token: string;
    // user: User;
    // navigation: Navigation[];
    // permissions: string;
}

export interface Navigation {
    key: string
    label: string
    isTitle?: boolean
    icon?: string
    url?: string
    badge?: {
        variant: string
        text: string
    },
    parentKey?: string
    isDisabled?: boolean
    collapsed?: boolean
    children?: Navigation[]
}

export interface NavigationChild {
    key: string;
    url: string;
    label: string;
    parentKey: string;
}

export interface RecoverPasswordResponse{
    success: boolean;
    message: string;
    error?: string;
}