import { NextResponse } from "next/server";

const GROUP_ID = process.env.MAILERLITE_GROUP_ID_BLOG;
const API_KEY = process.env.MAILERLITE_API_KEY;

const API_URL = "https://connect.mailerlite.com/api/subscribers";

export async function POST(req: Request) {
  try {
    const { email, hp } = await req.json();

    if (hp) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!API_KEY || !GROUP_ID) {
      throw new Error(
        "MailerLite API Key or Blog Group ID is missing in environment variables."
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const mlRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        status: "active",
        groups: [GROUP_ID],
        fields: { source: "Main Mailing List" },
      }),
    });

    if (!mlRes.ok) {
      const text = await mlRes.text();

      if (mlRes.status === 409) {
        return NextResponse.json(
          { ok: true, message: "Already subscribed." },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: text || "MailerLite error occurred" },
        { status: mlRes.status }
      );
    }

    const data = await mlRes.json();
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
