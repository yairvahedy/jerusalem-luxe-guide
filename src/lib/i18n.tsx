import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "he";

const dict = {
  en: {
    nav: { home: "Home", listings: "Listings", about: "About", neighborhoods: "Neighborhoods", sold: "Sold", contact: "Contact" },
    cta: { whatsapp: "WhatsApp", call: "Call now", inquire: "Contact us", viewAll: "View all listings", explore: "Explore" },
    hero: {
      eyebrow: "Jerusalem Apartments",
      title: "Find your next Jerusalem apartment.",
      subtitle: "Rentals and sales across Jerusalem's best neighborhoods — guided by local experts.",
    },
    featured: { title: "Available now", subtitle: "Apartments available across Jerusalem's most popular neighborhoods." },
    neighborhoods: { title: "Explore neighborhoods", subtitle: "Jerusalem's most sought-after areas for renters and buyers." },
    why: {
      title: "Why choose JF Realty",
      items: [
        { t: "Deep local knowledge", d: "We know every street, building, and landlord. No guesswork — genuine Jerusalem expertise." },
        { t: "Fast WhatsApp service", d: "Send a message and get a real answer within the hour. We work on your timeline." },
        { t: "Verified listings", d: "Every apartment we list has been visited in person. What you see is what you get." },
        { t: "Hebrew and English", d: "Full service in both languages for Israeli and international clients alike." },
      ],
    },
    sold: { title: "Recently rented & sold", subtitle: "A track record of finding the right apartment for every client." },
    testimonials: { title: "What clients say" },
    contactBanner: { title: "Have a specific apartment in mind?", subtitle: "Tell us your budget, neighborhood, and needs — we'll do the searching.", cta: "Message us on WhatsApp" },
    filters: { all: "All", search: "Search by name or neighborhood", neighborhood: "Neighborhood", beds: "Bedrooms", baths: "Bathrooms", price: "Price range", type: "Type", sale: "For Sale", rent: "For Rent", clear: "Clear filters", results: "results" },
    listing: {
      bedrooms: "Bedrooms", bathrooms: "Bathrooms", sqm: "Sq. meters", balcony: "Balcony", mamad: "Mamad", elevator: "Elevator", parking: "Parking",
      storage: "Storage", sukkaBalcony: "Sukka balcony", accessibility: "Accessibility", renovated: "Renovated", furnished: "Furnished", airCon: "Air conditioning",
      yes: "Yes", no: "No", overview: "Overview", facts: "Property details", gallery: "Gallery", tour: "Video tour", inquire: "Inquire about this property", related: "More properties",
      arnona: "Arnona",
    },
    about: {
      title: "About JF Realty",
      lead: "Jerusalem rental and property experts — practical, personal, and genuinely local.",
      body1: "JF Realty helps people find the right Jerusalem apartment — whether you're relocating, investing, or simply looking for a better place to live. We cover rentals and sales across the city's most sought-after neighborhoods.",
      body2: "Our approach is straightforward: we listen, we search, we show you properties that actually match. No pressure, no wasted time. Just good apartments and honest advice.",
      timeline: [
        { y: "Based in", t: "Jerusalem" },
        { y: "Specialties", t: "Rentals · Sales · Investment" },
        { y: "Languages", t: "English · Hebrew" },
        { y: "Serving", t: "Locals & international clients" },
      ],
    },
    contact: { title: "Let's talk", subtitle: "Reach out by WhatsApp, phone, or email. We respond personally — usually within the hour.", form: { name: "Full name", email: "Email", phone: "Phone", message: "Tell us what you're looking for", submit: "Send message", sent: "Message sent — we'll be in touch shortly." } },
    footer: { rights: "All rights reserved.", tagline: "Jerusalem apartment rentals & sales — local expertise, personal service." },
  },
  he: {
    nav: { home: "בית", listings: "נכסים", about: "אודות", neighborhoods: "שכונות", sold: "נמכרו/הושכרו", contact: "צור קשר" },
    cta: { whatsapp: "וואטסאפ", call: "התקשרו", inquire: "פנייה", viewAll: "כל הנכסים", explore: "גלו" },
    hero: {
      eyebrow: "דירות בירושלים",
      title: "מצאו את הדירה הבאה שלכם בירושלים.",
      subtitle: "השכרות ומכירות בשכונות הטובות של ירושלים — מומחים מקומיים לשירותכם.",
    },
    featured: { title: "זמין עכשיו", subtitle: "דירות זמינות בשכונות הנפוצות של ירושלים." },
    neighborhoods: { title: "גלו את השכונות", subtitle: "האזורים המבוקשים ביותר של ירושלים לשוכרים ולרוכשים." },
    why: {
      title: "למה JF Realty",
      items: [
        { t: "ידע מקומי אמיתי", d: "אנחנו מכירים כל רחוב, בניין ובעל בית. ניסיון אמיתי בירושלים." },
        { t: "שירות מהיר בוואטסאפ", d: "שלחו הודעה וקבלו תשובה תוך שעה. עובדים לפי הלוח זמנים שלכם." },
        { t: "נכסים מאומתים", d: "כל דירה שאנחנו מציגים נבדקה בעצמנו. מה שרואים — מה שמקבלים." },
        { t: "עברית ואנגלית", d: "שירות מלא בשתי השפות ללקוחות ישראלים ובינלאומיים." },
      ],
    },
    sold: { title: "הושכרו ונמכרו לאחרונה", subtitle: "רקורד של מציאת הדירה הנכונה לכל לקוח." },
    testimonials: { title: "מה לקוחות אומרים" },
    contactBanner: { title: "יש לכם דירה ספציפית בראש?", subtitle: "ספרו לנו את התקציב, השכונה והצרכים שלכם — אנחנו נחפש.", cta: "שלחו הודעה בוואטסאפ" },
    filters: { all: "הכל", search: "חיפוש לפי שם או שכונה", neighborhood: "שכונה", beds: "חדרי שינה", baths: "אמבטיות", price: "טווח מחירים", type: "סוג", sale: "למכירה", rent: "להשכרה", clear: "נקה סינון", results: "תוצאות" },
    listing: {
      bedrooms: "חדרי שינה", bathrooms: "אמבטיות", sqm: 'מ"ר', balcony: "מרפסת", mamad: 'ממ"ד', elevator: "מעלית", parking: "חניה",
      storage: "מחסן", sukkaBalcony: "מרפסת סוכה", accessibility: "נגישות", renovated: "משופצת", furnished: "מרוהטת", airCon: "מזגן",
      yes: "כן", no: "לא", overview: "תיאור", facts: "פרטי הנכס", gallery: "גלריה", tour: "סיור וידאו", inquire: "פנייה לגבי הנכס", related: "נכסים נוספים",
      arnona: "ארנונה",
    },
    about: {
      title: "אודות JF Realty",
      lead: "מומחי השכרות ונדל\"ן ירושלמיים — מעשיים, אישיים ומקומיים אמיתיים.",
      body1: "JF Realty עוזרת לאנשים למצוא את הדירה הנכונה בירושלים — בין אם אתם עוברים דירה, משקיעים או פשוט מחפשים מקום טוב יותר לגור בו.",
      body2: "הגישה שלנו פשוטה: מקשיבים, מחפשים, ומציגים נכסים שבאמת מתאימים. ללא לחץ, ללא בזבוז זמן. רק דירות טובות ועצות כנות.",
      timeline: [
        { y: "מבוססים ב", t: "ירושלים" },
        { y: "התמחויות", t: "השכרות · מכירות · השקעות" },
        { y: "שפות", t: "עברית · אנגלית" },
        { y: "משרתים", t: "לקוחות מקומיים ובינלאומיים" },
      ],
    },
    contact: { title: "בואו נדבר", subtitle: "ניתן ליצור קשר בוואטסאפ, טלפון או מייל. אנחנו עונים אישית — בדרך כלל תוך שעה.", form: { name: "שם מלא", email: "אימייל", phone: "טלפון", message: "ספרו לנו מה אתם מחפשים", submit: "שליחה", sent: "ההודעה נשלחה — ניצור קשר בקרוב." } },
    footer: { rights: "כל הזכויות שמורות.", tagline: "השכרות ומכירות בירושלים — מומחיות מקומית, שירות אישי." },
  },
} as const;

type Dict = typeof dict.en;
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict; dir: "ltr" | "rtl" }>({ lang: "en", setLang: () => {}, t: dict.en, dir: "ltr" });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("jf-lang") as Lang | null) ?? "en";
    setLangState(saved);
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("jf-lang", l);
  };
  const dir = lang === "he" ? "rtl" : "ltr";
  return <LangCtx.Provider value={{ lang, setLang, t: dict[lang] as Dict, dir }}>{children}</LangCtx.Provider>;
}

export const useI18n = () => useContext(LangCtx);
