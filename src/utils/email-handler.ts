import sgMail from '@sendgrid/mail'
export const sendMail = async ({
    to,
    subject,
    text,
}: {
    to: string[];
    text: string;
    subject: string;
}) => {
    sgMail.setApiKey(process.env.SENDGRID_API!);
    await sgMail.send({
        to: [...new Set(to)],
        from: process.env.SENDGRID_EMAIL!,
        subject,
        text,
    });
};