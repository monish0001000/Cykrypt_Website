// ═══════════════════════════════════════════════════════════════
// CyberShield — Validation & Sanitization Utility
// Shared between frontend (RegistrationModal) and backend (API)
// ═══════════════════════════════════════════════════════════════

export interface ValidationResult {
    valid: boolean;
    error?: string;
    warning?: string;
}

// ─── Sanitization ───

/** Strip HTML/script tags, trim whitespace, collapse internal spaces */
export function sanitize(input: string): string {
    return input
        .replace(/<[^>]*>/g, "")           // strip HTML tags
        .replace(/[<>"'`;(){}]/g, "")      // strip dangerous chars
        .replace(/javascript:/gi, "")       // strip js protocol
        .replace(/on\w+\s*=/gi, "")         // strip event handlers
        .trim()
        .replace(/\s{2,}/g, " ");          // collapse multiple spaces
}

/** Check if value has 5+ identical consecutive characters */
function hasRepeatedChars(value: string): boolean {
    return /(.)\1{4,}/i.test(value);
}

// ─── Field Validators ───

export function validateName(value: string): ValidationResult {
    const v = sanitize(value);
    if (!v) return { valid: false, error: "Name is required" };
    if (v.length < 2) return { valid: false, error: "Name must be at least 2 characters" };
    if (!/^[A-Za-z\s]+$/.test(v)) return { valid: false, error: "Name must contain only alphabets and spaces" };
    if (hasRepeatedChars(v.replace(/\s/g, ""))) return { valid: false, error: "Name appears invalid (repeated characters)" };
    return { valid: true };
}

export function validatePhone(value: string): ValidationResult {
    const v = value.replace(/[\s\-+]/g, "");
    // Strip optional country code
    const digits = v.replace(/^91/, "");
    if (!digits) return { valid: false, error: "Phone number is required" };
    if (!/^\d+$/.test(digits)) return { valid: false, error: "Phone number must contain only digits" };
    if (digits.length !== 10) return { valid: false, error: "Phone number must be exactly 10 digits" };
    if (hasRepeatedChars(digits)) return { valid: false, error: "Phone number appears invalid" };
    return { valid: true };
}

export function validateEmail(value: string): ValidationResult {
    const v = sanitize(value).toLowerCase();
    if (!v) return { valid: false, error: "Email is required" };
    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(v)) return { valid: false, error: "Enter a valid email address" };
    if (hasRepeatedChars(v.split("@")[0])) return { valid: false, error: "Email appears invalid" };
    return { valid: true };
}

export function validateTeamName(value: string): ValidationResult {
    const v = sanitize(value);
    if (!v) return { valid: false, error: "Team name is required" };
    if (v.length < 2) return { valid: false, error: "Team name must be at least 2 characters" };
    if (v.length > 30) return { valid: false, error: "Team name must be at most 30 characters" };
    if (hasRepeatedChars(v.replace(/\s/g, ""))) return { valid: false, error: "Team name appears invalid (repeated characters)" };
    return { valid: true };
}

export function validateCollege(value: string): ValidationResult {
    const v = sanitize(value);
    if (!v) return { valid: false, error: "College name is required" };
    if (v.length < 3) return { valid: false, error: "College name must be at least 3 characters" };
    if (!/^[A-Za-z\s.,&\-'()]+$/.test(v)) return { valid: false, error: "College name contains invalid characters" };
    if (hasRepeatedChars(v.replace(/\s/g, ""))) return { valid: false, error: "College name appears invalid" };
    return { valid: true };
}

export function validateYearDept(value: string): ValidationResult {
    const v = sanitize(value);
    if (!v) return { valid: false, error: "Year/Department is required" };
    if (/^\d+$/.test(v)) return { valid: false, error: "Department must not be only numbers" };
    if (v.length < 2) return { valid: false, error: "Please enter a valid year/department" };
    if (hasRepeatedChars(v.replace(/[\s\/\-]/g, ""))) return { valid: false, error: "Year/Department appears invalid" };
    return { valid: true };
}

// ─── Step-Level Validation ───

export interface StepErrors {
    [field: string]: string | undefined;
}

export interface StepWarnings {
    [field: string]: string | undefined;
}

export interface StepValidation {
    valid: boolean;
    errors: StepErrors;
    warnings: StepWarnings;
}

export function validateStep1(teamName: string, college: string): StepValidation {
    const errors: StepErrors = {};
    const warnings: StepWarnings = {};
    const tn = validateTeamName(teamName);
    const cl = validateCollege(college);

    if (!tn.valid) errors.teamName = tn.error;
    if (!cl.valid) errors.college = cl.error;

    return { valid: Object.keys(errors).length === 0, errors, warnings };
}

export function validateStep2(leader: {
    name: string; phone: string; email: string; yearDept: string;
}): StepValidation {
    const errors: StepErrors = {};
    const warnings: StepWarnings = {};

    const nm = validateName(leader.name);
    const ph = validatePhone(leader.phone);
    const em = validateEmail(leader.email);
    const yd = validateYearDept(leader.yearDept);

    if (!nm.valid) errors.leaderName = nm.error;
    if (!ph.valid) errors.leaderPhone = ph.error;
    if (!em.valid) errors.leaderEmail = em.error;
    if (em.warning) warnings.leaderEmail = em.warning;
    if (!yd.valid) errors.leaderYearDept = yd.error;

    return { valid: Object.keys(errors).length === 0, errors, warnings };
}

export function validateStep3(
    members: { name: string; phone: string; email: string }[]
): StepValidation {
    const errors: StepErrors = {};
    const warnings: StepWarnings = {};

    if (members.length < 2) {
        errors._members = "At least 2 team members are required";
    }

    members.forEach((m, i) => {
        const nm = validateName(m.name);
        const ph = validatePhone(m.phone);
        const em = validateEmail(m.email);

        if (!nm.valid) errors[`member${i}_name`] = nm.error;
        if (!ph.valid) errors[`member${i}_phone`] = ph.error;
        if (!em.valid) errors[`member${i}_email`] = em.error;
        if (em.warning) warnings[`member${i}_email`] = em.warning;
    });

    // Ensure first 2 members are fully filled
    for (let i = 0; i < Math.min(2, members.length); i++) {
        if (!members[i].name.trim()) errors[`member${i}_name`] = "Required for member " + (i + 1);
        if (!members[i].phone.trim()) errors[`member${i}_phone`] = "Required for member " + (i + 1);
        if (!members[i].email.trim()) errors[`member${i}_email`] = "Required for member " + (i + 1);
    }

    return { valid: Object.keys(errors).length === 0, errors, warnings };
}

// ─── Anti-Bot ───

/** Minimum time in ms a real human would take to fill the form */
export const MIN_FILL_TIME_MS = 5000;

/** Maximum submissions per session */
export const MAX_SESSION_SUBMISSIONS = 3;

/** Checks if submission timing is suspicious */
export function isTimingSuspicious(formOpenedAt: number): boolean {
    return Date.now() - formOpenedAt < MIN_FILL_TIME_MS;
}
