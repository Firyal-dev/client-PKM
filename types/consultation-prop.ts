export interface ConsultationProp {
    id: string;
    username: string;
    phone_number?: string;
    subject: string;
    message: string;
    answer?: string;  // Keep answer field for displaying actual response
    is_answer: boolean;
    is_publish: boolean;
    created_at: Date;
    updated_at: Date;
}