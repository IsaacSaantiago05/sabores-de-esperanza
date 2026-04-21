import nodemailer from "nodemailer";

type ResetEmailParams = {
  to: string;
  nombre?: string | null;
  resetUrl: string;
};

type SmtpTestEmailParams = {
  to: string;
  requestedBy: string;
};

const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 800;

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sanitizeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildResetPasswordEmailTemplate({
  nombre,
  resetUrl,
}: {
  nombre?: string | null;
  resetUrl: string;
}) {
  const appName = "Sabores de Esperanza";
  const safeName = nombre ? sanitizeHtml(nombre) : null;
  const safeUrl = sanitizeHtml(resetUrl);
  const saludo = safeName ? `Hola ${safeName},` : "Hola,";

  const text = [
    safeName ? `Hola ${nombre},` : "Hola,",
    "",
    `Recibimos una solicitud para restablecer tu contrasena en ${appName}.`,
    `Usa este enlace para continuar: ${resetUrl}`,
    "",
    "Si no hiciste esta solicitud, ignora este mensaje.",
  ].join("\n");

  const html = `
  <div style="background:#faf7f2;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#22311a;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e9ddcf;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="background:#2d5016;padding:18px 24px;color:#ffffff;font-size:18px;font-weight:700;">
          ${appName}
        </td>
      </tr>
      <tr>
        <td style="padding:24px;line-height:1.55;font-size:15px;">
          <p style="margin:0 0 12px 0;">${saludo}</p>
          <p style="margin:0 0 12px 0;">Recibimos una solicitud para restablecer tu contrasena.</p>
          <p style="margin:0 0 20px 0;">
            <a href="${safeUrl}" style="display:inline-block;background:#6b9f3f;color:#ffffff;text-decoration:none;font-weight:700;padding:11px 16px;border-radius:10px;">
              Restablecer contrasena
            </a>
          </p>
          <p style="margin:0 0 12px 0;color:#566050;word-break:break-all;">
            Si el boton no funciona, copia y pega este enlace:<br />
            <a href="${safeUrl}" style="color:#2d5016;">${safeUrl}</a>
          </p>
          <p style="margin:12px 0 0 0;color:#566050;">Si no hiciste esta solicitud, ignora este mensaje.</p>
        </td>
      </tr>
    </table>
  </div>`;

  return {
    subject: "Restablece tu contrasena",
    text,
    html,
  };
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendPasswordResetEmail({ to, nombre, resetUrl }: ResetEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("SMTP no configurado. No se envio correo de recuperacion.");
    return false;
  }

  const appName = "Sabores de Esperanza";
  const from = process.env.SMTP_FROM || `${appName} <no-reply@sabores.local>`;
  const template = buildResetPasswordEmailTemplate({ nombre, resetUrl });

  const retryAttempts = Number(process.env.SMTP_RETRY_ATTEMPTS || DEFAULT_RETRY_ATTEMPTS);
  const retryDelayMs = Number(process.env.SMTP_RETRY_DELAY_MS || DEFAULT_RETRY_DELAY_MS);

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      return true;
    } catch (error) {
      lastError = error;
      if (attempt < retryAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error("No se pudo enviar correo de recuperacion despues de reintentos", lastError);
  return false;
}

export async function sendSmtpTestEmail({ to, requestedBy }: SmtpTestEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("SMTP no configurado. No se envio correo de prueba.");
    return false;
  }

  const appName = "Sabores de Esperanza";
  const from = process.env.SMTP_FROM || `${appName} <no-reply@sabores.local>`;
  const now = new Date().toISOString();

  const text = [
    "Prueba SMTP completada.",
    `Proyecto: ${appName}`,
    `Solicitada por: ${requestedBy}`,
    `Fecha: ${now}`,
  ].join("\n");

  const html = `
  <div style="background:#faf7f2;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#22311a;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e9ddcf;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="background:#2d5016;padding:18px 24px;color:#ffffff;font-size:18px;font-weight:700;">
          ${appName}
        </td>
      </tr>
      <tr>
        <td style="padding:24px;line-height:1.55;font-size:15px;">
          <p style="margin:0 0 12px 0;font-weight:700;">Prueba SMTP completada.</p>
          <p style="margin:0 0 8px 0;">Solicitada por: ${sanitizeHtml(requestedBy)}</p>
          <p style="margin:0;color:#566050;">Fecha: ${sanitizeHtml(now)}</p>
        </td>
      </tr>
    </table>
  </div>`;

  const retryAttempts = Number(process.env.SMTP_RETRY_ATTEMPTS || DEFAULT_RETRY_ATTEMPTS);
  const retryDelayMs = Number(process.env.SMTP_RETRY_DELAY_MS || DEFAULT_RETRY_DELAY_MS);
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject: "Prueba SMTP: configuracion correcta",
        text,
        html,
      });
      return true;
    } catch (error) {
      lastError = error;
      if (attempt < retryAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error("No se pudo enviar correo de prueba SMTP", lastError);
  return false;
}
