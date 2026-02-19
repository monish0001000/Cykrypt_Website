import { NextResponse } from "next/server";
import {
    sanitize,
    validateTeamName, validateCollege,
    validateName, validatePhone, validateEmail, validateYearDept,
    MIN_FILL_TIME_MS,
} from "@/lib/validation";

// ─── In-memory IP rate limiter ───
const ipTracker = new Map<string, { count: number; firstAt: number }>();
const MAX_PER_IP = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = ipTracker.get(ip);
    if (!entry || now - entry.firstAt > WINDOW_MS) {
        ipTracker.set(ip, { count: 1, firstAt: now });
        return false;
    }
    entry.count++;
    return entry.count > MAX_PER_IP;
}

export async function POST(request: Request) {
    try {
        // ─── Rate limiting by IP ───
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() || "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { success: false, error: "Too many registrations. Please try again later." },
                { status: 429 }
            );
        }

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
            console.error("Telegram credentials not found");
            return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
        }

        const data = await request.json();
        const { teamName, event, college, ctfMode, leader, members, _hp, _ts } = data;

        // ─── Honeypot check ───
        if (_hp) {
            // Bot detected — silently return success
            return NextResponse.json({ success: true });
        }

        // ─── Timing check ───
        if (_ts && Date.now() - _ts < MIN_FILL_TIME_MS) {
            return NextResponse.json(
                { success: false, error: "Submission too fast. Please take your time." },
                { status: 400 }
            );
        }

        // ─── Server-side validation ───
        const fieldErrors: Record<string, string> = {};

        const tn = validateTeamName(sanitize(teamName || ""));
        if (!tn.valid) fieldErrors.teamName = tn.error!;

        const cl = validateCollege(sanitize(college || ""));
        if (!cl.valid) fieldErrors.college = cl.error!;

        // Validate leader
        if (!leader) {
            fieldErrors.leader = "Team leader information is required";
        } else {
            const ln = validateName(sanitize(leader.name || ""));
            if (!ln.valid) fieldErrors.leaderName = ln.error!;

            const lp = validatePhone(leader.phone || "");
            if (!lp.valid) fieldErrors.leaderPhone = lp.error!;

            const le = validateEmail(sanitize(leader.email || ""));
            if (!le.valid) fieldErrors.leaderEmail = le.error!;

            const ly = validateYearDept(sanitize(leader.yearDept || ""));
            if (!ly.valid) fieldErrors.leaderYearDept = ly.error!;
        }

        // Validate members — require at least 2
        if (!members || !Array.isArray(members) || members.length < 2) {
            fieldErrors._members = "At least 2 team members are required";
        } else {
            members.forEach((m: { name: string; phone: string; email: string }, i: number) => {
                const mn = validateName(sanitize(m.name || ""));
                if (!mn.valid) fieldErrors[`member${i}_name`] = mn.error!;

                const mp = validatePhone(m.phone || "");
                if (!mp.valid) fieldErrors[`member${i}_phone`] = mp.error!;

                const me = validateEmail(sanitize(m.email || ""));
                if (!me.valid) fieldErrors[`member${i}_email`] = me.error!;
            });
        }

        if (Object.keys(fieldErrors).length > 0) {
            return NextResponse.json(
                { success: false, error: "Please fix the validation errors.", fieldErrors },
                { status: 400 }
            );
        }

        // ─── Sanitize all data ───
        const cleanTeam = sanitize(teamName);
        const cleanCollege = sanitize(college);
        const cleanLeader = {
            name: sanitize(leader.name),
            phone: sanitize(leader.phone),
            email: sanitize(leader.email),
            yearDept: sanitize(leader.yearDept),
        };
        const cleanMembers = members.map((m: { name: string; phone: string; email: string }) => ({
            name: sanitize(m.name),
            phone: sanitize(m.phone),
            email: sanitize(m.email),
        }));

        // Build members list string
        const membersText = cleanMembers.length > 0
            ? cleanMembers.map((m: { name: string; phone: string; email: string }, i: number) =>
                `   ${i + 1}. ${m.name} | ${m.phone} | ${m.email}`
            ).join("\n")
            : "   None";

        const message = `
🛡️ *NEW SQUAD REGISTRATION* 🛡️

📛 *Squad:* ${cleanTeam}
🎯 *Event:* ${event} ${ctfMode && ctfMode !== "N/A" ? `(${ctfMode})` : ""}
🏫 *College:* ${cleanCollege}

👤 *Mission Commander:*
   Name: ${cleanLeader.name}
   Phone: ${cleanLeader.phone}
   Email: ${cleanLeader.email}
   Year/Dept: ${cleanLeader.yearDept}

👥 *Operatives (${cleanMembers.length}):*
${membersText}

_Transmission secured by CyberShield Relay._
    `;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "Markdown",
            }),
        });

        if (!response.ok) {
            throw new Error("Telegram API Error");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
    }
}
