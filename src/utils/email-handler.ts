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
    sgMail.setApiKey('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');
    await sgMail.send({
        to: [...new Set(to)],
        from: "chinmaysrivastava.cs@gmail.com",
        subject,
        text,
    });
};