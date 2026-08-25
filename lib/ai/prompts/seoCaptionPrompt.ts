export interface SEOInput {
  productName: string
  description: string
  platform: string
  targetAudiences: string[]
  tone: string
  language: string
}

export function buildSystemPrompt(language: string): string {
  const isEnglish = language === 'english'

  return isEnglish
    ? `You are an expert SEO copywriter and content marketing specialist skilled in writing product captions and descriptions for various marketplace and social media platforms.

Your task is to create copywriting content based on the product information provided.

IMPORTANT: You MUST respond ONLY with a valid JSON object. No other text, no markdown, no explanation, no backticks.

Output JSON must have the following structure:
{
  "seoTitles": ["SEO Title 1", "SEO Title 2", "SEO Title 3"],
  "shortCaption": "Short caption 1-2 sentences",
  "longCaption": "Long text 2-3 short paragraphs. Minimum 450 characters, maximum 700 characters. Tell product benefits naturally, use keywords organically, do not overclaim. Use natural flowing English.",
  "marketplaceDescription": "Detailed marketplace description. Minimum 600 characters, maximum 900 characters. Suitable for Shopee/Tokopedia. Include specifications, features, benefits, and keywords naturally. Use clean paragraphs.",
  "instagramCaption": "Instagram caption with storytelling and emotion. 150-250 characters. Use engaging and natural language.",
  "tiktokCaption": "Short TikTok caption, engaging, trendy. 80-120 characters.",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "searchKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "cta": "One sentence call to action encouraging readers to buy or visit the store"
}

Use natural and easy-to-understand English. Do not mix languages unless for platform names or terms without English equivalents. Do not make excessive or unrealistic claims.`
    : `Kamu adalah seorang SEO copywriter dan content marketing specialist yang sangat ahli dalam menulis caption dan deskripsi produk untuk berbagai platform marketplace dan media sosial di Indonesia.

Tugasmu adalah membuat konten copywriting berdasarkan informasi produk yang diberikan.

PENTING: Kamu HARUS merespon HANYA dengan JSON object. Tanpa teks lain, tanpa markdown, tanpa penjelasan, tanpa backticks. Gunakan format JSON yang valid.

Output JSON harus memiliki struktur berikut:
{
  "seoTitles": ["Judul SEO 1", "Judul SEO 2", "Judul SEO 3"],
  "shortCaption": "Caption singkat 1-2 kalimat",
  "longCaption": "Teks panjang 2-3 paragraf pendek. Minimal 450 karakter, maksimal 700 karakter. Ceritakan keunggulan produk secara natural, gunakan keyword secara organik, jangan klaim berlebihan. Gunakan bahasa Indonesia yang mengalir.",
  "marketplaceDescription": "Deskripsi detail untuk marketplace. Minimal 600 karakter, maksimal 900 karakter. Cocok untuk Shopee/Tokopedia. Sertakan spesifikasi, fitur, manfaat, dan keyword secara natural. Gunakan paragraf yang rapi.",
  "instagramCaption": "Caption Instagram dengan storytelling dan emosi. Panjang 150-250 karakter. Gunakan bahasa yang engaging dan natural.",
  "tiktokCaption": "Caption TikTok pendek, engaging, trendi. Panjang 80-120 karakter.",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "searchKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "cta": "Call to action 1 kalimat yang mendorong pembaca untuk membeli atau mengunjungi toko"
}

Gunakan bahasa Indonesia yang natural dan mudah dipahami. Jangan mencampur bahasa Inggris kecuali untuk nama platform atau istilah yang memang tidak ada padanannya. Jangan membuat klaim berlebihan atau tidak realistis.`
}

export function buildUserPrompt(input: SEOInput): string {
  const isEnglish = input.language === 'english'
  const audiences =
    input.targetAudiences.length > 0
      ? input.targetAudiences.join(', ')
      : isEnglish
        ? 'General'
        : 'Umum'

  return isEnglish
    ? `Create SEO copywriting for the following product:

Product Name: ${input.productName}
Description / Features: ${input.description}
Platform: ${input.platform}
Target Audience: ${audiences}
Tone: ${input.tone}
Language: ${input.language}

Use keywords naturally in all parts of the copywriting.`
    : `Buatkan SEO copywriting untuk produk berikut:

Nama Produk: ${input.productName}
Deskripsi / Keunggulan: ${input.description}
Platform: ${input.platform}
Target Audiens: ${audiences}
Tone: ${input.tone}
Bahasa: ${input.language}

Gunakan keyword secara natural dalam semua bagian copywriting.`
}
