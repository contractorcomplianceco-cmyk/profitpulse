import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(
  __dirname,
  "../../artifacts/healthcast/public/onboarding/cca-healthcast-user-guide.pdf",
);

const NAVY = "#0B1220";
const NAVY_PANEL = "#0F1B33";
const BLUE = "#2563EB";
const CYAN = "#22D3EE";
const SILVER = "#94A3B8";
const WHITE = "#F8FAFC";
const SLATE = "#334155";
const SLATE_SOFT = "#475569";

interface Section {
  title: string;
  tagline: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    title: "Executive Overview",
    tagline: "Your daily command center.",
    body: "The Executive Overview is the first screen you should open each morning. It consolidates the company's most important financial vital signs - revenue, profit, cash position, runway, and overall financial health - into a single real-time view. Trend indicators compare each metric against the prior period so you can read momentum at a glance, while insight and recommended-action cards translate the raw numbers into clear next steps.",
  },
  {
    title: "AI CFO Copilot",
    tagline: "Ask anything, in plain language.",
    body: "The AI CFO Copilot lets you interrogate the business conversationally. Ask questions such as \"What is driving the change in gross margin?\" or \"How many months of runway remain?\" and receive an immediate, data-backed answer complete with the supporting figures and mini-charts. Suggested prompts help you get started, and recent questions keep your line of inquiry close at hand.",
  },
  {
    title: "Cash Flow",
    tagline: "Stay ahead of the money.",
    body: "Cash Flow is where you keep the business solvent. Track every dollar moving in and out, monitor your operating runway, and watch projected balances so a shortfall never takes you by surprise. Paired with the Cash Calendar, it shows exactly when large inflows and outflows are expected over the coming weeks.",
  },
  {
    title: "Scenario Builder",
    tagline: "Turn decisions into foresight.",
    body: "Scenario Builder converts decisions into foresight. Adjust levers such as headcount, pricing, marketing spend, or collection speed and watch the live impact ripple through profit, cash, runway, and break-even. Model both the upside and the downside before you commit a single dollar.",
  },
  {
    title: "Futurecast",
    tagline: "See the road ahead.",
    body: "Futurecast projects where the business is heading. Forward-looking models show where revenue, costs, and growth are likely to land across the coming quarters, helping you plan hiring, investment, and capacity with confidence rather than guesswork.",
  },
  {
    title: "Compliance & Risk Center",
    tagline: "Always audit-ready.",
    body: "The Compliance and Risk Center keeps Contractor Compliance Authority audit-ready at all times. Track license renewals, regulatory filing deadlines, and audit-readiness checklists, and review a live risk register that ranks the issues most likely to affect the business - all in one place.",
  },
  {
    title: "Alerts",
    tagline: "Your early-warning system.",
    body: "Alerts continuously scan your data and surface the issues that need attention - a slipping collection, a margin dip, an approaching deadline - so nothing critical slips through. Review, prioritize, and act before small problems become large ones.",
  },
];

mkdirSync(dirname(OUTPUT), { recursive: true });

const doc = new PDFDocument({ size: "LETTER", margin: 56, bufferPages: true });
const stream = createWriteStream(OUTPUT);
doc.pipe(stream);

const pageWidth = doc.page.width;
const pageHeight = doc.page.height;
const left = doc.page.margins.left;
const contentWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;

// ---- Cover page ----
doc.rect(0, 0, pageWidth, pageHeight).fill(NAVY);
doc.rect(0, 0, pageWidth, 8).fill(CYAN);
doc.rect(0, 8, pageWidth, 3).fill(BLUE);

doc.fill(CYAN).fontSize(13).font("Helvetica-Bold");
doc.text("EXECUTIVE USER GUIDE", left, 150, { characterSpacing: 3 });

doc.fill(WHITE).font("Helvetica-Bold").fontSize(46);
doc.text("CCA HealthCast OS", left, 188, { width: contentWidth });

doc.fill(SILVER).font("Helvetica").fontSize(15);
doc.text(
  "Financial Health, Growth Intelligence & Futurecast Command Center",
  left,
  256,
  { width: contentWidth - 80, lineGap: 4 },
);

doc.rect(left, 320, 70, 3).fill(CYAN);

doc.fill(SILVER).font("Helvetica").fontSize(12);
doc.text("Prepared for the CFO / Owner", left, 344);

doc.fill(SLATE).font("Helvetica").fontSize(11);
doc.text(
  "A guided reference to the platform's core modules - how to read them, and how to act on what they tell you.",
  left,
  pageHeight - 150,
  { width: contentWidth - 120, lineGap: 4 },
);

// ---- Section pages ----
SECTIONS.forEach((section, i) => {
  doc.addPage();

  // top band
  doc.rect(0, 0, pageWidth, 96).fill(NAVY);
  doc.rect(0, 96, pageWidth, 3).fill(CYAN);

  doc.fill(CYAN).font("Helvetica-Bold").fontSize(11);
  doc.text(`CHAPTER ${i + 1}`, left, 34, { characterSpacing: 2 });

  doc.fill(WHITE).font("Helvetica-Bold").fontSize(24);
  doc.text(section.title, left, 50, { width: contentWidth });

  // tagline
  doc.fill(BLUE).font("Helvetica-Bold").fontSize(14);
  doc.text(section.tagline, left, 138, { width: contentWidth });

  // body
  doc.fill(SLATE_SOFT).font("Helvetica").fontSize(12);
  doc.text(section.body, left, 172, {
    width: contentWidth,
    align: "left",
    lineGap: 6,
  });
});

// ---- Footers with page numbers (content pages only) ----
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  if (i === range.start) continue; // skip cover
  const y = pageHeight - 40;
  doc
    .fill(SILVER)
    .font("Helvetica")
    .fontSize(9)
    .text("CCA HealthCast OS - Executive User Guide", left, y, {
      lineBreak: false,
    });
  doc.text(`Page ${i - range.start}`, left, y, {
    width: contentWidth,
    align: "right",
    lineBreak: false,
  });
}

doc.end();

stream.on("finish", () => {
  console.log(`User guide written to ${OUTPUT}`);
});
