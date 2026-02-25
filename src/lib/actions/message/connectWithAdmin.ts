'use server';

import { Resend } from 'resend';

export async function connectWithAdmin(data: {
  text: string;
  userId: string;
  userEmail: string;
  userName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  try {
    if (!data.text || data.text.trim().length < 10) {
      throw new Error(
        'Текст повідомлення занадто короткий. Будь ласка, опишіть проблему детальніше.'
      );
    }
    await resend.emails.send({
      //   from: '"Complaint Form" <complaints@gratify.com>',
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `Повідомлення від ${data.userEmail}`,
      html: `
                <p><strong>User ID:</strong> ${data.userId}</p>
                <p><strong>User Email:</strong> ${data.userEmail}</p>
                <p><strong>User Name:</strong> ${data.userName}</p>
                <p><strong>Message:</strong></p>
                <p>${data.text}</p>
            `,
    });
  } catch (error) {
    console.log(error);
    throw error instanceof Error
      ? error
      : new Error('Не вдалось відправити повідомлення');
  }
}
