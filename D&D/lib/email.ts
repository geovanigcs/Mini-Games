import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Configuração do transporter para Gmail (ou outro provedor)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'seu-email@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'sua-senha-de-app'
  }
});

// Função para enviar email de redefinição de senha
export const sendPasswordResetEmail = async (email: string, resetToken: string, userName: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const emailOptions: EmailOptions = {
    to: email,
    subject: '🏔️ Terra Média RPG - Redefinição de Senha',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #1c1917;
            color: #d6d3d1;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #292524;
            border: 2px solid #d97706;
            border-radius: 16px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #d97706, #ea580c);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 32px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 18px;
            color: #fbbf24;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          }
          .warning {
            background-color: #451a03;
            border: 1px solid #ea580c;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #a8a29e;
            font-size: 12px;
            border-top: 1px solid #44403c;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏔️ Terra Média RPG</h1>
          </div>
          <div class="content">
            <div class="greeting">
              Saudações, ${userName}! ⚔️
            </div>
            <div class="message">
              Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Terra Média RPG</strong>.
              <br><br>
              Se você fez esta solicitação, clique no botão abaixo para criar uma nova senha:
            </div>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                🔑 Redefinir Minha Senha
              </a>
            </div>
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link expira em <strong>1 hora</strong></li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
            <div class="message">
              Se o botão não funcionar, copie e cole este link no seu navegador:
              <br>
              <a href="${resetUrl}" style="color: #60a5fa; word-break: break-all;">${resetUrl}</a>
            </div>
          </div>
          <div class="footer">
            Este email foi enviado automaticamente pelo sistema Terra Média RPG.
            <br>
            Se você não solicitou esta ação, entre em contato conosco.
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Terra Média RPG - Redefinição de Senha
      
      Olá ${userName},
      
      Recebemos uma solicitação para redefinir a senha da sua conta no Terra Média RPG.
      
      Para redefinir sua senha, acesse o link abaixo:
      ${resetUrl}
      
      IMPORTANTE:
      - Este link expira em 1 hora
      - Se você não solicitou esta redefinição, ignore este email
      - Nunca compartilhe este link com outras pessoas
      
      Se você não conseguir clicar no link, copie e cole o endereço acima no seu navegador.
      
      Atenciosamente,
      Equipe Terra Média RPG
    `
  };

  try {
    const info = await transporter.sendMail({
      from: `"🏔️ Terra Média RPG" <${process.env.SMTP_USER || 'noreply@terramediarPG.com'}>`,
      ...emailOptions
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error };
  }
};

// Função genérica para enviar emails
export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"🏔️ Terra Média RPG" <${process.env.SMTP_USER || 'noreply@terramediarPG.com'}>`,
      ...options
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error };
  }
};

export default transporter;
