import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
            console.error("Telegram credentials not found");
            return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
        }

        const data = await request.json();
        const { teamName, event, college, ctfMode, leader, members } = data;

        // Build members list string
        const membersText = members && members.length > 0
            ? members.map((m: { name: string; phone: string; email: string }, i: number) =>
                `   ${i + 1}. ${m.name} | ${m.phone} | ${m.email}`
            ).join("\n")
            : "   None";

        const message = `
🛡️ *NEW SQUAD REGISTRATION* 🛡️

📛 *Squad:* ${teamName}
🎯 *Event:* ${event} ${ctfMode && ctfMode !== "N/A" ? `(${ctfMode})` : ""}
🏫 *College:* ${college}

👤 *Mission Commander:*
   Name: ${leader?.name}
   Phone: ${leader?.phone}
   Email: ${leader?.email}
   Year/Dept: ${leader?.yearDept}

👥 *Operatives:*
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
