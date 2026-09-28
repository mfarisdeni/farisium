/**
 * Extraction instructions for the product catalog agent.
 *
 * Tuned for marketplace grids and supplier catalogs, which differ from the
 * receipt/invoice prompts in three ways that decide accuracy:
 *  - a product is a *card* in a grid, so row order must follow the visual
 *    reading order (top-to-bottom, then left-to-right within a row);
 *  - prices come in pairs (struck-through original + live price) and only the
 *    live one belongs in `price`;
 *  - the page is full of UI noise (ads, promo banners, badges, COD labels)
 *    that must never be mistaken for a product.
 *
 * Instructions are embedded in the USER text by `lib/ai/gemini.ts`, matching
 * the reliability fix that made the receipt and invoice agents work.
 */

/** Language for the generated field values; keys stay English. */
export type CatalogLanguage = 'id' | 'en'

const COMMON_RULES = [
  'Extract EVERY product card you can see. Never stop early, never summarise, never merge two different products into one row.',
  'One card = one product object. A card that offers several sizes or colours with different prices is several products; if they share one price, keep one product and put the size/colour in `variant`.',
  'A product needs at least a name or a price to be worth extracting. Skip pure interface elements: navigation, banners, ads, promo headlines, coupon text, "Bisa COD", shipping labels, ratings summaries, and buttons.',
  'PRICES: `price` is the live amount the buyer pays. When a card shows two amounts and one is struck through, discounted or greyed, the struck one is `originalPrice` and the other is `price`. Never put a struck-through amount in `price`.',
  'Write amounts as plain numbers without currency symbols or separators: "Rp 81.000" becomes 81000, "Rp 32.256" becomes 32256. No dots, no commas, no "Rp".',
  'A discount badge such as "-42%" becomes discountPercent 42. "PROMO", "Gajian Sale", "Hemat s.d 8%" are discounts in words, not a percentage — leave discountPercent null for them and mention it in `notes`.',
  'Keep the product name exactly as printed, including a trailing "..." when the title is cut off. Do not invent the missing part, do not translate, do not tidy it up.',
  'SHOP ATTRIBUTION — read this first. On a marketplace page the cards are grouped under shop headers. Collect every shop name printed on the page into the top-level `shops` array, in the order you meet them reading top to bottom. Then give each product the name of the shop whose group it physically belongs to, which is the nearest shop header printed ABOVE that card, before any other shop header. A header keeps applying to the cards below it until the next header appears.',
  'A shop header is a short business name, usually in caps or bold and placed above a run of product cards, e.g. "NEKA LISTRIK", "SUPER MALL SHOPPING", "ANEKA LISTRIK". Copy it exactly as printed. Never invent a shop that is not printed.',
  'Badges are not shops: "Star+", "Star", "Official Store", "PROMO", "Gajian Sale", "SOKET DIJUAL TERPISAH" and free-shipping labels are badges. The marketplace brand (Shopee, Tokopedia, Lazada, Blibli) is not a shop either — that is `source`.',
  'Never use a city, district, or province as a shop name ("Kota Administrasi Jakarta", "Jakarta Selatan"). If the text near a card is a location rather than a business name, leave that product\'s `store` null and say so in `notes`.',
  'If a card sits above the first shop header on the page, it has no shop — leave `store` null rather than borrowing the header below it.',
  '`variant` takes the printed specification of the product itself: pack count, weight, size, ply, colour, or capacity, e.g. "2 Packs", "600g", "3 PLY 720 Ply 240 sheets", "50W", "220V", "1 Meter". These often appear as small chips or a spec line next to the title. If several are printed, join them with "; ". Leave `variant` null only when the card prints no specification at all.',
  '`brand` is the manufacturer or brand printed on the card. When the brand and the shop name differ, the brand goes in `brand` and the shop in `store`; when they are the same text, put it in both.',
  '`rating` is the star score only, e.g. "4,9" becomes 4.9. Do not put the review count or the "10rb+ terjual" text in `rating`.',
  '`soldCount` keeps the sales text verbatim, e.g. "10RB+ terjual" or "8,8K terjual". It is text, not a number.',
  'Use `category` only when the source states it explicitly (a category heading, breadcrumb, or section title). Do not guess a category from the product name; leave it null otherwise.',
  'Use `brand` only when the source names it. Do not derive it from the title.',
  'If a value is not visible, set it to null or an empty list. NEVER guess, infer, or fill in a plausible-looking value.',
  'Set `currency` to "IDR" when prices are in rupiah ("Rp", "Rp."), otherwise the symbol that is printed, otherwise null.',
  'Put anything ambiguous in that product\'s `notes` and add a short entry to the top-level `warnings`. Warnings are advisory and must never block the result.',
  'Set `needsReview` to true when any product is missing both name and price, or when two or more prices in a single card were ambiguous.',
].join('\n')

const LANGUAGE_RULES: Record<CatalogLanguage, string> = {
  id: 'Write every text value in the language that is printed in the document. Do not translate Indonesian into English or English into Indonesian.',
  en: 'Write every text value in the language that is printed in the document. Do not translate Indonesian into English or English into Indonesian.',
}

/**
 * Build the stage-1 transcription instruction. Kept verbatim-friendly so the
 * two-stage path can be enabled later without rewriting the contract.
 */
export function buildCatalogTranscribeInstruction(language: CatalogLanguage = 'id'): string {
  return [
    'Transcribe this product catalog page line by line, in visual reading order.',
    'Preserve every digit, every price, and every percent exactly as printed, including truncation marks and typos.',
    'Do not summarise, do not reorganise, do not translate, and do not drop any product card.',
    'Do not add commentary.',
    LANGUAGE_RULES[language],
  ].join('\n')
}

/** Build the structured-extraction instruction for a product catalog. */
export function buildCatalogStructuredInstruction(
  language: CatalogLanguage = 'id',
  documentHint = '',
): string {
  const hint = documentHint
    ? `\nThe document being read is: "${documentHint}". Record it as \`source\` if it names a marketplace or catalog, otherwise leave \`source\` null.`
    : ''

  return [
    'You are a product catalog data extractor. Read the catalog image and return a JSON object describing every product it shows.',
    '',
    COMMON_RULES,
    '',
    LANGUAGE_RULES[language],
    hint,
    '',
    'Return the JSON object now. It must contain: source, currency, shops, products, needsReview, warnings.',
    '`shops` must list every shop name printed on the page, in reading order. If the page shows no shop header at all, return an empty array.',
    '`products` must contain one object per product card with the keys: name, variant, sku, brand, category, price, originalPrice, discountPercent, store, rating, soldCount, sourceFile, sourcePage, notes.',
  ].join('\n')
}
