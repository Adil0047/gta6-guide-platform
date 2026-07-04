export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(_payload: EmailPayload) {
  void _payload;

  return {
    success: true,
  };
}
