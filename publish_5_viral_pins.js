const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to load Pinterest and Supabase credentials
const envPath = path.join(__dirname, '.env.local');
let env = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine && !cleanLine.startsWith('#')) {
      const parts = cleanLine.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    }
  });
} catch (e) {
  console.log("Could not load credentials automatically, relying on process.env.");
}

const ACCESS_TOKEN = env.PINTEREST_ACCESS_TOKEN || process.env.PINTEREST_ACCESS_TOKEN;
const BOARD_ID = env.PINTEREST_BOARD_ID || process.env.PINTEREST_BOARD_ID;

if (!ACCESS_TOKEN || !BOARD_ID) {
  console.error("⚠️ Error: PINTEREST_ACCESS_TOKEN or PINTEREST_BOARD_ID is not configured in .env.local!");
  console.error("Please add them to .env.local to run this automation script successfully.\n");
}

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

async function publishPin(pin) {
  if (!ACCESS_TOKEN || !BOARD_ID) {
    console.log(`[DRY-RUN PRINT] Pin Created: "${pin.title}" -> Link: ${pin.link}`);
    return;
  }

  try {
    const res = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        board_id: BOARD_ID,
        title: pin.title.substring(0, 99),
        description: pin.description.substring(0, 499),
        link: pin.link,
        media_source: {
          source_type: "image_url",
          url: pin.image_url
        }
      })
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Success! Published: "${pin.title}" -> https://www.pinterest.com/pin/${data.id}`);
    } else {
      console.error(`❌ Error publishing "${pin.title}":`, data.message || data);
    }
  } catch (err) {
    console.error(`❌ Fetch Exception for "${pin.title}":`, err.message);
  }
}

async function main() {
  console.log("🚀 Starting Pinterest 100M+ Views Viral Pins Automation Pipeline...\n");
  for (const pin of viralPins) {
    await publishPin(pin);
    // Slight delay between requests to keep Pinterest API rate limits happy
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log("\n🎉 All 5 viral pins processed!");
}

main();
