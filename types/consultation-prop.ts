export interface ConsultationProp {
    _id: string;
    username: string;
    phone_number?: string;
    message: string;
    answer?: string;
    is_publish: boolean;
    created_at: Date;
}