export const SITE = {
  agentName: "Jack Freedman",
  brand: "JF Realty",
  phone: "+972533985043",
  phoneDisplay: "+972 53-398-5043",
  whatsapp: "972533985043",
  email: "jack@jfrealty.co.il",
  city: "Jerusalem",
  address: "King David Street, Jerusalem, Israel",
  mapsQuery: "King+David+Street+Jerusalem",
};

export const waLink = (msg = "Hi Jack, I'd like more info about a property.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

export const telLink = `tel:${SITE.phone}`;