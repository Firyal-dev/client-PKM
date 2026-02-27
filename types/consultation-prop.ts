export interface ConsultationProp {
    id: number;
    username: string;
    email?: string;
    subject: string;
    message: string;
    answer?: string;
    is_answer: boolean;
    is_publish: boolean;
    created_at: string;
    updated_at: string;
}