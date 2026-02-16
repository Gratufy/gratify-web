'use server';

import { Resend } from 'resend';

export async function sendComplaint(data: {
  businessName: string;
  businessId: string;
  complaintText: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  try {
    if (!data.complaintText || data.complaintText.trim().length < 10) {
      throw new Error(
        'Текст скарги занадто короткий. Будь ласка, опишіть проблему детальніше.'
      );
    }
    await resend.emails.send({
      //   from: '"Complaint Form" <complaints@gratify.com>',
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `Подана скарга на ${data.businessName}`,
      html: `
                <p><strong>Business Name:</strong> ${data.businessName}</p>
                <p><strong>Business ID:</strong> ${data.businessId}</p>
                <p><strong>Complaint:</strong></p>
                <p>${data.complaintText}</p>
            `,
    });
  } catch (error) {
    console.log(error);
    throw error instanceof Error
      ? error
      : new Error('Не вдалось відправити скаргу');
  }
}
