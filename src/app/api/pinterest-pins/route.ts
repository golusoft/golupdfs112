import { NextResponse } from "next/server";

const viralPins = [
  {
    title: "How to Compress PDF to Exactly 10KB or 20KB for UPSC & SSC forms 📝",
    description: "Tired of government portals rejecting your signature scans or documents because they are too small or too big? Use GoluPDFs' 100% free, private target resizer to hit your desired file size in KB down to the byte—with zero blur! No signups or email required.",
    link: "https://golupdf.online/tools/resize-pdf",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "90% of Employees Miss This HRA Tax Hack: Free Watermark-Free Rent Receipts 🏠",
    description: "Tax season is here! Generate legally compliant, watermark-free rent receipts for HRA tax exemption under Section 10(13A) of the Income Tax Act. Features a live drawing signature pad for your landlord. 100% private client-side browser processing—no email or signup needed!",
    link: "https://golupdf.online/tools/rent-receipt-generator",
    image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Stop Using Ugly Excel Invoices: Create Stunning, Compliant Indian GST Bills in 5 Seconds! 📊",
    description: "Micro-business owners, kirana shops, and freelancers: Generate beautiful tax-compliant GST invoices in seconds! Handles HSN/SAC codes, and automatically calculates SGST/CGST (intra-state) vs IGST (inter-state) tax splits. Fully private, watermark-free.",
    link: "https://golupdf.online/tools/gst-invoice-generator",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "How to E-Sign Any Contract or NDA for Free on Your Phone (No Subscriptions!) ✍️",
    description: "Draw, stamp, and flatten signature presets directly on your PDF documents using our premium touchscreen drawing pad. Your file is processed entirely in browser memory locally—guaranteeing 100% data safety. Ditch expensive e-signature fees forever!",
    link: "https://golupdf.online/tools/sign-pdf",
    image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "First Startup Employee? Generate Professional Salary Slips with HRA, PF & ESI Instantly! 👥",
    description: "Avoid complicated spreadsheets and expensive payroll systems. The Salary Slip Generator is designed for HR managers, startups, and small businesses to generate professional employee payslips in 5 seconds. Mapped perfectly to standard A4 printing sizes.",
    link: "https://golupdf.online/tools/salary-slip-generator",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secretQuery = searchParams.get("secret");
  const secretEnv = process.env.CRON_SECRET || "super-secret-cron-agent-token-2026";

  if (secretQuery !== secretEnv) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = process.env.PINTEREST_BOARD_ID;

  if (!token || !boardId) {
    return NextResponse.json({ error: "Pinterest credentials not configured in Vercel!" }, { status: 400 });
  }

  const results: any[] = [];

  for (const pin of viralPins) {
    try {
      const res = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          board_id: boardId,
          title: pin.title.substring(0, 99),
          description: pin.description.substring(0, 499),
          link: pin.link,
          media_source: {
            source_type: "image_url",
            url: pin.image_url,
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        results.push({ title: pin.title, status: "success", pinUrl: `https://www.pinterest.com/pin/${data.id}` });
      } else {
        results.push({ title: pin.title, status: "failed", error: data });
      }
    } catch (e: any) {
      results.push({ title: pin.title, status: "exception", error: e.message });
    }
  }

  return NextResponse.json({ success: true, results });
}
