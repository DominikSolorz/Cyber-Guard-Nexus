import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key || !connectionSettings.settings.from_email)) {
    throw new Error('SendGrid not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email };
}

async function getUncachableSendGridClient() {
  const { apiKey, email } = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

function generateVerificationCode(): string {
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0) % 900000 + 100000;
  return num.toString();
}

function hashVerificationCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function verifyCodeHash(code: string, hash: string): boolean {
  const inputHash = hashVerificationCode(code);
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
}

function buildVerificationEmailHtml(code: string, userName: string): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LexVault - Kod weryfikacyjny</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:8px;border:1px solid #262626;overflow:hidden;">

          <tr>
            <td style="background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);padding:28px 40px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:1px;">
                Lex<span style="color:#fecaca;">Vault</span>
              </h1>
              <p style="margin:4px 0 0;font-size:11px;color:#fca5a5;text-transform:uppercase;letter-spacing:3px;">
                Platforma Prawna
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px 24px;">
              <p style="margin:0 0 20px;font-size:15px;color:#a3a3a3;line-height:1.6;">
                Witaj <strong style="color:#f5f5f5;">${userName}</strong>,
              </p>
              <p style="margin:0 0 4px;font-size:17px;color:#f5f5f5;text-align:center;">
                Oto Twoj kod weryfikacyjny
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 28px;" align="center">
              <div style="background-color:#1a1a1a;border:2px solid #dc2626;border-radius:10px;padding:24px 32px;display:inline-block;">
                <div style="font-size:36px;font-weight:700;color:#ffffff;letter-spacing:8px;font-family:'Courier New',monospace;">
                  ${code}
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 28px;">
              <div style="background-color:#1c1917;border-left:3px solid #f59e0b;border-radius:0 6px 6px 0;padding:14px 16px;">
                <p style="margin:0;font-size:13px;color:#d4d4d4;line-height:1.6;">
                  <strong style="color:#f59e0b;">Wazne:</strong> Kod jest wazny przez <strong>5 minut</strong>.
                  Nigdy nie udostepniaj tego kodu nikomu, nawet pracownikom LexVault.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:13px;color:#737373;line-height:1.5;">
                Jesli nie rejestrowales/rejestrowalas konta w LexVault, zignoruj te wiadomosc.
                Twoje dane sa bezpieczne.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0f0f0f;padding:20px 40px;border-top:1px solid #262626;">
              <p style="margin:0 0 8px;font-size:11px;color:#525252;line-height:1.6;">
                &copy; 2026 LexVault. Wszystkie prawa zastrzezone.<br/>
                Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice
              </p>
              <p style="margin:0;font-size:10px;color:#404040;">
                Ta wiadomosc zostala wyslana automatycznie. Prosimy nie odpowiadac na tego maila.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(toEmail: string, userName: string, code: string): Promise<boolean> {
  try {
    console.log(`[Email] Sending verification code to ${toEmail}`);
    const { client, fromEmail } = await getUncachableSendGridClient();

    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: 'LexVault',
      },
      subject: 'LexVault - Kod weryfikacyjny',
      html: buildVerificationEmailHtml(code, userName),
    };

    const result = await client.send(msg);
    console.log(`[Email] Verification email sent to ${toEmail}, status: ${result?.[0]?.statusCode}`);
    return true;
  } catch (error: any) {
    console.error('[Email] SendGrid error:', JSON.stringify({
      message: error?.message,
      code: error?.code,
      response: error?.response?.body,
      statusCode: error?.response?.statusCode,
    }));
    return false;
  }
}

export async function sendContactNotificationEmail(submission: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  senderType: string;
  category: string;
  caseCategory?: string | null;
  subject: string;
  description: string;
  priority: string;
  attachmentName?: string | null;
}): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();

    const senderTypeLabels: Record<string, string> = {
      "klient_indywidualny": "Klient indywidualny",
      "firma": "Firma",
      "kancelaria": "Kancelaria prawna",
      "inne": "Inne",
    };
    const categoryLabels: Record<string, string> = {
      "pomoc_logowanie": "Pomoc z logowaniem",
      "reset_hasla": "Reset hasla",
      "usuniecie_konta": "Usuniecie konta",
      "odzyskanie_konta": "Odzyskanie konta",
      "wspolpraca": "Wspolpraca",
      "problem_techniczny": "Problem techniczny",
      "pytanie_prawne": "Pytanie prawne",
      "reklamacja": "Reklamacja",
      "inne": "Inne",
    };
    const priorityLabels: Record<string, string> = {
      "niski": "Niski",
      "sredni": "Sredni",
      "wysoki": "Wysoki",
      "pilny": "PILNY",
    };

    const priorityColor = submission.priority === "pilny" ? "#dc2626" : submission.priority === "wysoki" ? "#f59e0b" : "#22c55e";

    const html = `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:12px;border:1px solid #262626;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);padding:24px 40px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Nowe zgloszenie kontaktowe</h1>
              <p style="margin:4px 0 0;font-size:12px;color:#fca5a5;text-transform:uppercase;letter-spacing:2px;">LexVault</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <div style="display:inline-block;padding:4px 12px;border-radius:4px;background-color:${priorityColor};color:#fff;font-size:12px;font-weight:600;margin-bottom:16px;">
                Priorytet: ${priorityLabels[submission.priority] || submission.priority}
              </div>
              <h2 style="margin:12px 0 8px;font-size:18px;color:#f5f5f5;">${submission.subject}</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr><td style="padding:8px 0;border-bottom:1px solid #262626;color:#a3a3a3;font-size:13px;width:140px;">Nadawca:</td><td style="padding:8px 0;border-bottom:1px solid #262626;color:#f5f5f5;font-size:13px;">${submission.firstName} ${submission.lastName}</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #262626;color:#a3a3a3;font-size:13px;">Email:</td><td style="padding:8px 0;border-bottom:1px solid #262626;color:#f5f5f5;font-size:13px;">${submission.email}</td></tr>
                ${submission.phone ? `<tr><td style="padding:8px 0;border-bottom:1px solid #262626;color:#a3a3a3;font-size:13px;">Telefon:</td><td style="padding:8px 0;border-bottom:1px solid #262626;color:#f5f5f5;font-size:13px;">${submission.phone}</td></tr>` : ''}
                <tr><td style="padding:8px 0;border-bottom:1px solid #262626;color:#a3a3a3;font-size:13px;">Typ nadawcy:</td><td style="padding:8px 0;border-bottom:1px solid #262626;color:#f5f5f5;font-size:13px;">${senderTypeLabels[submission.senderType] || submission.senderType}</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #262626;color:#a3a3a3;font-size:13px;">Kategoria:</td><td style="padding:8px 0;border-bottom:1px solid #262626;color:#f5f5f5;font-size:13px;">${categoryLabels[submission.category] || submission.category}</td></tr>
                ${submission.caseCategory ? `<tr><td style="padding:8px 0;border-bottom:1px solid #262626;color:#a3a3a3;font-size:13px;">Rodzaj sprawy:</td><td style="padding:8px 0;border-bottom:1px solid #262626;color:#f5f5f5;font-size:13px;">${submission.caseCategory}</td></tr>` : ''}
                ${submission.attachmentName ? `<tr><td style="padding:8px 0;border-bottom:1px solid #262626;color:#a3a3a3;font-size:13px;">Zalacznik:</td><td style="padding:8px 0;border-bottom:1px solid #262626;color:#f5f5f5;font-size:13px;">${submission.attachmentName}</td></tr>` : ''}
              </table>
              <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin-top:16px;">
                <p style="margin:0 0 8px;font-size:12px;color:#a3a3a3;text-transform:uppercase;letter-spacing:1px;">Opis zgloszenia:</p>
                <p style="margin:0;font-size:14px;color:#d4d4d4;line-height:1.6;white-space:pre-wrap;">${submission.description}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f0f0f;padding:20px 40px;border-top:1px solid #262626;">
              <p style="margin:0;font-size:11px;color:#525252;">Ta wiadomosc zostala wyslana automatycznie z formularza kontaktowego LexVault.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const msg = {
      to: 'goldservicepoland@gmail.com',
      from: { email: fromEmail, name: 'LexVault Kontakt' },
      subject: `[LexVault] ${priorityLabels[submission.priority] || ''} - ${submission.subject}`,
      html,
    };

    await client.send(msg);
    return true;
  } catch (error: any) {
    console.error('SendGrid contact notification error:', error?.response?.body || error.message);
    return false;
  }
}

export { generateVerificationCode, hashVerificationCode, verifyCodeHash };
