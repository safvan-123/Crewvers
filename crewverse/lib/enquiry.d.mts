export function localDate(now?: Date): string;
export function validateEnquiry(
  data: Record<string, string>,
  today?: string,
): Record<string, string>;
export function enquiryMessage(data: Record<string, string>): string;
export function enquiryLink(
  company: {
    email: string;
    whatsappNumber: string;
    whatsappConfirmed: boolean;
  },
  message: string,
  channel?: string,
): string;
