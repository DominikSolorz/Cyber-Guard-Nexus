import sgMail from '@sendgrid/mail';

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
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function buildVerificationEmailHtml(code: string, userName: string): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:12px;border:1px solid #262626;overflow:hidden;">
          
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%);padding:32px 40px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;width:48px;height:48px;background-color:rgba(255,255,255,0.2);border-radius:10px;line-height:48px;font-size:24px;color:#ffffff;margin-bottom:12px;">&#x1F6E1;</div>
                    <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:1px;">
                      Lex<span style="color:#fecaca;">Vault</span>
                    </h1>
                    <p style="margin:4px 0 0;font-size:12px;color:#fca5a5;text-transform:uppercase;letter-spacing:2px;">
                      Platforma Prawna
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#f5f5f5;">
                Weryfikacja adresu email
              </h2>
              <p style="margin:0 0 24px;font-size:14px;color:#a3a3a3;line-height:1.5;">
                Witaj <strong style="color:#f5f5f5;">${userName}</strong>,<br/>
                otrzymujesz ten email, poniewaz rejestrujesz konto w systemie LexVault. Uzyj ponizszego kodu, aby potwierdzic swoj adres email.
              </p>

              <div style="background-color:#1a1a1a;border:2px solid #dc2626;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:12px;color:#a3a3a3;text-transform:uppercase;letter-spacing:2px;">
                  Twoj kod weryfikacyjny
                </p>
                <div style="font-size:36px;font-weight:700;color:#ffffff;letter-spacing:8px;font-family:'Courier New',monospace;">
                  ${code}
                </div>
              </div>

              <div style="background-color:#1c1917;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#d4d4d4;line-height:1.5;">
                  <strong style="color:#f59e0b;">Wazne:</strong> Kod jest wazny przez <strong>15 minut</strong>. Nigdy nie udostepniaj tego kodu nikomu, nawet pracownikom LexVault. Nikt z naszego zespolu nigdy nie poprosi Cie o ten kod.
                </p>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#737373;line-height:1.5;">
                Jesli nie rejestrowales/rejestrowalas konta w LexVault, zignoruj ta wiadomosc. Twoje dane sa bezpieczne.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0f0f0f;padding:24px 40px;border-top:1px solid #262626;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;color:#525252;line-height:1.6;">
                      LexVault - Platforma Zarzadzania Kancelaria<br/>
                      Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice<br/>
                      Email: goldservicepoland@gmail.com
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;">
                    <p style="margin:0;font-size:10px;color:#404040;">
                      Ta wiadomosc zostala wyslana automatycznie. Prosimy nie odpowiadac na tego maila.
                    </p>
                  </td>
                </tr>
              </table>
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
    const { client, fromEmail } = await getUncachableSendGridClient();

    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: 'LexVault',
      },
      subject: `LexVault - Twoj kod weryfikacyjny: ${code}`,
      html: buildVerificationEmailHtml(code, userName),
    };

    await client.send(msg);
    return true;
  } catch (error: any) {
    console.error('SendGrid error:', error?.response?.body || error.message);
    return false;
  }
}

export { generateVerificationCode };
