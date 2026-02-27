export interface ConsultationProp {
    id: number;
    username: string;
    phone_number?: string;
    subject: string;
    message: string;
    is_answer: boolean;
    is_publish: boolean;
    created_at: string;
    updated_at: string;
}