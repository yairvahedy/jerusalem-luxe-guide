import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "he";

const dict = {
  en: {
    nav: { home: "Home", listings: "Listings", about: "About", neighborhoods: "Neighborhoods", sold: "Sold", contact: "Contact" },
    cta: { whatsapp: "WhatsApp", call: "Call Jack", inquire: "Inquire", viewAll: "View all listings", explore: "Explore" },
    hero: {
      eyebrow: "Luxury Jerusalem Real Estate",
      title: "Where Jerusalem's most exceptional homes find their owners.",
      subtitle: "Private, curated, and personally guided by Jack Freedman.",
    },
    featured: { title: "Featured residences", subtitle: "A private selection of Jerusalem's finest." },
    neighborhoods: { title: "Where you'll live", subtitle: "The neighborhoods that define Jerusalem luxury." },
    why: {
      title: "Why work with Jack",
      items: [
        { t: "Jerusalem native expertise", d: "Born here. Raised here. Connected to every neighborhood worth knowing." },
        { t: "Discreet, personal service", d: "Every client is handled directly — no juniors, no handoffs." },
        { t: "International reach", d: "Fluent service for Israeli and overseas buyers, in English and Hebrew." },
        { t: "Off-market access", d: "First call on properties that never reach a public listing." },
      ],
    },
    sold: { title: "Recently sold", subtitle: "A track record built on quiet, decisive transactions." },
    testimonials: { title: "What clients say" },
    contactBanner: { title: "Looking for something specific?", subtitle: "Tell Jack what you're searching for — he'll find it.", cta: "Message Jack on WhatsApp" },
    filters: { all: "All", search: "Search by name or neighborhood", neighborhood: "Neighborhood", beds: "Bedrooms", baths: "Bathrooms", price: "Price range", type: "Type", sale: "For Sale", rent: "For Rent", clear: "Clear filters", results: "results" },
    listing: {
      bedrooms: "Bedrooms", bathrooms: "Bathrooms", sqm: "Sq. meters", balcony: "Balcony", mamad: "Mamad", elevator: "Elevator", parking: "Parking",
      yes: "Yes", no: "No", overview: "Overview", facts: "Property facts", gallery: "Gallery", tour: "Video tour", inquire: "Inquire about this property", related: "More residences",
    },
    about: {
      title: "Meet Jack Freedman",
      lead: "Jerusalem's young luxury specialist — combining old-city instinct with modern service.",
      body1: "Jack Freedman represents a new generation of Jerusalem real estate. With deep roots in the city and a sharp eye for architecture, light, and value, he guides buyers from Israel and abroad through the city's most desirable neighborhoods.",
      body2: "His approach is personal, discreet, and uncompromising. Every relationship begins with a conversation — and ends with the keys to a home worth waiting for.",
      timeline: [
        { y: "Born & raised", t: "Jerusalem" },
        { y: "Specialty", t: "Luxury homes & off-market deals" },
        { y: "Languages", t: "English · Hebrew" },
        { y: "Service", t: "Israeli & international buyers" },
      ],
    },
    contact: { title: "Let's talk", subtitle: "Reach out by WhatsApp, phone, or email. Jack responds personally.", form: { name: "Full name", email: "Email", phone: "Phone", message: "Tell Jack what you're looking for", submit: "Send message", sent: "Message sent — Jack will be in touch." } },
    footer: { rights: "All rights reserved.", tagline: "Luxury Jerusalem real estate, personally guided." },
  },
  he: {
    nav: { home: "בית", listings: "נכסים", about: "אודות", neighborhoods: "שכונות", sold: "נמכרו", contact: "צור קשר" },
    cta: { whatsapp: "וואטסאפ", call: "התקשרו לג'ק", inquire: "פנייה", viewAll: "כל הנכסים", explore: "גלו" },
    hero: {
      eyebrow: "נדל\"ן יוקרה בירושלים",
      title: "כאן הבתים הכי יוצאי דופן בירושלים מוצאים את בעליהם.",
      subtitle: "ליווי אישי, דיסקרטי וברמה הגבוהה ביותר — מאת ג'ק פרידמן.",
    },
    featured: { title: "נכסים נבחרים", subtitle: "מבחר פרטי של בתי היוקרה הטובים בירושלים." },
    neighborhoods: { title: "איפה תגורו", subtitle: "השכונות שמגדירות יוקרה בירושלים." },
    why: {
      title: "למה לעבוד עם ג'ק",
      items: [
        { t: "מומחיות מקומית", d: "ירושלמי מלידה. מכיר כל שכונה ששווה להכיר." },
        { t: "שירות אישי ודיסקרטי", d: "כל לקוח מטופל אישית — ללא מתווכים נוספים." },
        { t: "פריסה בינלאומית", d: "שירות שוטף לקונים מישראל ומחו\"ל, באנגלית ובעברית." },
        { t: "גישה לנכסי Off-Market", d: "עדיפות לנכסים שלא מגיעים לפרסום פומבי." },
      ],
    },
    sold: { title: "נמכרו לאחרונה", subtitle: "רקורד שנבנה על עסקאות שקטות ומדויקות." },
    testimonials: { title: "מה לקוחות אומרים" },
    contactBanner: { title: "מחפשים משהו ספציפי?", subtitle: "ספרו לג'ק מה אתם מחפשים — והוא ימצא.", cta: "שלחו הודעה בוואטסאפ" },
    filters: { all: "הכל", search: "חיפוש לפי שם או שכונה", neighborhood: "שכונה", beds: "חדרי שינה", baths: "אמבטיות", price: "טווח מחירים", type: "סוג", sale: "למכירה", rent: "להשכרה", clear: "נקה סינון", results: "תוצאות" },
    listing: {
      bedrooms: "חדרי שינה", bathrooms: "אמבטיות", sqm: 'מ"ר', balcony: "מרפסת", mamad: 'ממ"ד', elevator: "מעלית", parking: "חניה",
      yes: "כן", no: "לא", overview: "תיאור", facts: "פרטי הנכס", gallery: "גלריה", tour: "סיור וידאו", inquire: "פנייה לגבי הנכס", related: "נכסים נוספים",
    },
    about: {
      title: "הכירו את ג'ק פרידמן",
      lead: "המומחה הצעיר של נדל\"ן היוקרה בירושלים — שילוב של אינסטינקט מקומי ושירות מודרני.",
      body1: "ג'ק פרידמן מייצג דור חדש של נדל\"ן בירושלים. עם שורשים עמוקים בעיר ועין חדה לאדריכלות, אור וערך, הוא מלווה קונים מישראל ומחו\"ל בשכונות המבוקשות ביותר.",
      body2: "הגישה שלו אישית, דיסקרטית ובלתי מתפשרת. כל קשר מתחיל בשיחה — ומסתיים במפתחות לבית ששווה לחכות לו.",
      timeline: [
        { y: "נולד וגדל", t: "ירושלים" },
        { y: "התמחות", t: "נכסי יוקרה ועסקאות Off-Market" },
        { y: "שפות", t: "אנגלית · עברית" },
        { y: "שירות", t: "קונים ישראלים ובינלאומיים" },
      ],
    },
    contact: { title: "בואו נדבר", subtitle: "ניתן ליצור קשר בוואטסאפ, טלפון או מייל. ג'ק עונה אישית.", form: { name: "שם מלא", email: "אימייל", phone: "טלפון", message: "ספרו לג'ק מה אתם מחפשים", submit: "שליחה", sent: "ההודעה נשלחה — ג'ק יחזור אליכם." } },
    footer: { rights: "כל הזכויות שמורות.", tagline: "נדל\"ן יוקרה בירושלים, בליווי אישי." },
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