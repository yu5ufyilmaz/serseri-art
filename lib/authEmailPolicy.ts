const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DISPOSABLE_EMAIL_DOMAINS = new Set([
    '10minutemail.com',
    '20minutemail.com',
    'dispostable.com',
    'fakeinbox.com',
    'guerrillamail.com',
    'maildrop.cc',
    'mailinator.com',
    'temp-mail.org',
    'tempmail.com',
    'trashmail.com',
    'yopmail.com',
]);

type ValidationSuccess = {
    ok: true;
    normalizedEmail: string;
};

type ValidationFail = {
    ok: false;
    message: string;
};

export type EmailValidationResult = ValidationSuccess | ValidationFail;

function getAllowedEmailDomains(): string[] {
    const raw = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS || '';
    return raw
        .split(',')
        .map((domain) => domain.trim().toLowerCase())
        .filter(Boolean);
}

export function validateAuthEmail(email: string): EmailValidationResult {
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        return { ok: false, message: 'Geçerli bir e-posta adresi gir.' };
    }

    const domain = normalizedEmail.split('@')[1];
    if (!domain) {
        return { ok: false, message: 'Geçerli bir e-posta adresi gir.' };
    }

    if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
        return { ok: false, message: 'Geçici/tek kullanımlık e-posta adresleri kabul edilmiyor.' };
    }

    const allowedDomains = getAllowedEmailDomains();
    if (allowedDomains.length > 0 && !allowedDomains.includes(domain)) {
        return {
            ok: false,
            message: `Sadece şu uzantılara izin veriliyor: ${allowedDomains.join(', ')}`
        };
    }

    return { ok: true, normalizedEmail };
}
