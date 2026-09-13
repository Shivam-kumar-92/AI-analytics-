# Yuktivya AI — Sovereign Indian Market Intelligence & AI Data Analyst Platform 🇮🇳

> **Yuktivya AI** (derived from Sanskrit *Yukti* — strategic reasoning & ingenuity, and *Vyapti* — pervasive universal relation / data synergy) is a production-grade **AI Data Analyst + Market Research Intelligence Web Application** engineered specifically for Indian businesses, products, and consumer trends.

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.2-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Made in India](https://img.shields.io/badge/Made%20in-Bharat%20🇮🇳-FF7700.svg?style=flat-square)](https://www.makeinindia.com/)

---

## 🌟 Overview & Key Capabilities

Yuktivya AI answers the essential commercial questions facing product managers, founders, and market researchers:
* Is this product getting positive reviews? What are customers praising or complaining about?
* What is the quantified customer sentiment across dimensions (battery, build, sound, pricing, support)?
* What is the real demand trajectory and directional momentum?
* How does pricing benchmark against category competitor bands in Indian Rupee (`₹`)?
* What is the calculated Commercial Success Score and risk profile?
* What strategic action should the business take next?

---

## 🚀 Key Modules & Features

### 1. Multi-Format Data Ingestion & Auto-Cleaning Engine
- **Universal Multi-Format Support**: Drag-and-drop ingestion for **CSV**, **Excel (.xlsx, .xls)**, **JSON**, and **TXT** tabular files, plus direct clipboard copy/paste.
- **Statistical Quality Scoring (0–100 & A+ to D Grade)**: Automated missing-value imputation (medians/modes), Interquartile Range (IQR 1.5×) outlier detection, deduplication, and Pearson correlation matrices.

### 2. Review & Sentiment Intelligence (Amazon / Flipkart NLP)
- **Granular Star Distribution**: 1★ to 5★ breakdown with percentage calculations.
- **Polarity NLP**: Classifies customer feedback into Positive, Negative, and Neutral sentiment with negation and intensifier handling.
- **Aspect-Based Feature Extraction**: Detects product-specific dimensions (e.g. Battery Life, Build Quality, Sound Quality, Ergonomics, Pricing Value, Customer Support).
- **Verbatim Evidence Quotes**: Real praise and critical feedback citations.

### 3. Demand Intelligence & Trend Forecasting
- **Demand Score (0–100)**: Momentum tracking with +3 period linear extrapolation.
- **Methodological Transparency**: Distinct labels between **Verified Market Demand** (sales logs) and **Estimated Demand / Proxy** (review velocity, search trends).

### 4. Pricing & Market Value Intelligence (Standardized in ₹)
- **Competitor Benchmarking**: Compares selling prices against category minimum, average, and ceiling prices in Indian Rupee (`₹`).
- **Elasticity Positioning**: Evaluates if the product is Undervalued, Competitive, Fairly Priced, or Premium Priced.

### 5. AI Conversational Analyst Agent
- Interactive chat grounded strictly in computed dataset numbers and statistical matrices.
- Preset strategic prompts: *"Is this product worth launching?"*, *"Why are customers unhappy?"*, *"What price should we target?"*, *"Summarize this dataset."*

### 6. Institutional Export Deliverables
- **Executive PDF Report**: Client-ready consulting memorandum generated via `jspdf`.
- **Multi-Sheet Excel Workbook (.xlsx)**: Raw and cleansed data, stats, and benchmarks via `xlsx`.
- **Cleaned CSV Dataset**: Sanitized output ready for external SQL/Python pipelines.

### 7. Interactive 3D Visual Experience
- **Three.js WebGL Background**: Responsive floating 3D geometric prisms, cybernetic grid floor, and mouse parallax depth.
- **3D "Made in India" Coin Showpiece**: 360° draggable metallic coin featuring the 24-spoke Ashoka Chakra, gear teeth, and Indian Tricolor bands.
- **3D Flippable Make in India Lion Plaque**: Photorealistic 3D extruded metallic gear lion sculpture with perspective mouse tilt and specular glare. Clicking the card flips it 180° in 3D to reveal **PM Narendra Modi's historic Make in India vision address** in Devanagari Hindi.

---

## 🇮🇳 6 Built-In Native Indian Brand Demos

Every demo is grounded in iconic Indian household brands and real consumer dynamics:
1. **boAt Airdopes 141 True Wireless** (`boAt_Airdopes_141_Reviews.csv`) — Amazon & Flipkart audio feedback, ₹1,499 price point, 81% positive sentiment.
2. **Tata Nexon EV (Empowered Plus)** (`Tata_Nexon_EV_Sales.csv`) — Quarterly deliveries, ₹17,49,000 price point, 5-star Bharat NCAP safety praise.
3. **Tata Tea Premium ("Desh Ki Chai")** (`Tata_Tea_Premium_SellThrough.csv`) — 24-week retail sell-through across Blinkit/Zepto quick commerce & Kirana stores, ₹140 unit price, 66% repeat rate.
4. **Himalaya Purifying Neem Face Wash** (`Himalaya_Neem_FaceWash_Reviews.csv`) — 35,000 customer reviews on Nykaa & Amazon, ₹185 price point, anti-pimple herbal protection feedback.
5. **HDFC Bank Millennia Credit Card** (`HDFC_Millennia_Credit_Card_GMV.csv`) — ₹265.8 Cr monthly GMV spend, 5% cashback praise vs reward capping.
6. **Indian Oil Corporation (IOCL) Crude Basket** (`IOCL_Crude_Oil_Index.csv`) — Refinery inputs, ₹6,480/barrel benchmark, seasonal highway fuel demand.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + Custom Glassmorphic Design System
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Data Visualizations**: [Recharts](https://recharts.org/)
- **Excel & Document Engine**: [SheetJS (xlsx)](https://sheetjs.com/) + [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/Shivam-kumar-92/AI-analytics-.git

# Navigate into the project directory
cd AI-analytics-

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be available at `http://localhost:5173/`.

### Production Build

```bash
npm run build
```

---

## 📜 License & Sovereign Heritage

Built with pride for **Atmanirbhar Bharat** • **Vocal for Local** • Engineered in India 🇮🇳.
