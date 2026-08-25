export const DICTIONARY: Record<string, string> = {
  // ===== Karakter =====
  'waifu': 'anime girl',
  'gadis': 'anime girl',
  'cewek': 'anime girl',
  'cewe': 'anime girl',
  'cwk': 'anime girl',

  'cowok': 'anime boy',
  'cowo': 'anime boy',
  'pria': 'man',
  'laki laki': 'man',

  // ===== Ras / Fantasy =====
  'elf': 'elf',
  'peri': 'fairy',
  'iblis': 'demon girl',
  'malaikat': 'angel girl',

  // ===== Anatomi =====
  'dada besar': 'large breasts',
  'oppai': 'large breasts',

  'toketnya': 'her large breasts',
  'toket': 'large breasts',

  'teteknya': 'her breasts',
  'tetek': 'breasts',

  'tetenya': 'her breasts',
  'tete': 'breasts',

  'payudaranya': 'her breasts',
  'payudara': 'breasts',

  'memeknya': 'her vagina',
  'memek': 'vagina',

  'vaginanya': 'her vagina',
  'vagina': 'vagina',

  'kontolnya': 'his penis',
  'kontol': 'penis',

  'penisnya': 'his penis',

  'pantatnya': 'her buttocks',
  'pantat': 'buttocks',

  'bokongnya': 'her buttocks',
  'bokong': 'buttocks',

  'keteknya': 'her armpits',
  'ketek': 'armpits',

  'ketiaknya': 'her armpits',
  'ketiak': 'armpits',

  'pahanya': 'her thighs',
  'paha': 'thighs',

  // ===== Bentuk Tubuh =====
  'montok': 'curvy',
  'tembem': 'chubby',
  'berisi': 'thick',
  'seksi': 'sexy',
  'langsing': 'slim',
  'gemuk': 'plump',

  // ===== Status Pakaian =====
  'telanjang': 'nude',
  'bugil': 'nude',

  // ===== Aktivitas =====
  'ngewe': 'sexual intercourse',
  'ngentot': 'sexual intercourse',
  'ewe': 'sexual intercourse',
  'entot': 'sexual intercourse',
  'dikentot': 'sexual intercourse',
  'diewe': 'sexual intercourse',

  // ===== Rambut =====
  'rambut putih': 'white hair',
  'rambut hitam': 'black hair',
  'rambut merah': 'red hair',
  'rambut pirang': 'blonde hair',

  // ===== Mata =====
  'mata biru': 'blue eyes',
  'mata merah': 'red eyes',
  'mata hijau': 'green eyes',

  // ===== Outfit =====
  'seragam sekolah': 'school uniform',
  'rok pendek': 'short skirt',
  'stoking': 'thighhighs',

  'maid': 'maid outfit',
  'pelayan': 'maid outfit',

  'kacamata': 'glasses',
  'berkacamata': 'glasses',

  'tato': 'tattoo',

  'lingerie': 'lingerie',
  'bra': 'bra',
  'celana dalam': 'panties',
  'cd': 'panties',
  'bikini': 'bikini',

  // ===== Rambut Kemaluan =====
  'cukur habis': 'shaved',
  'tanpa bulu': 'hairless',
  'botak': 'shaved',

  // ===== Kondisi Kulit =====
  'kaki mulus': 'smooth legs',
  'kulit mulus': 'smooth skin',
  'putih mulus': 'fair smooth skin',
  'mulus': 'smooth skin',
  'putih': 'fair skin',

  // ===== Lokasi =====
  'pantai': 'beach',
  'hutan': 'forest',
  'gunung': 'mountain',

  // ===== Adjektif Umum =====
  'gede': 'large',
  'besar': 'large',
}

export function normalizePrompt(prompt: string): string {
  let result = prompt.toLowerCase()

const entries = Object.entries(DICTIONARY)
  .sort((a, b) => b[0].length - a[0].length)

  for (const [indo, english] of entries) {
    const escaped = indo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    result = result.replace(
      new RegExp(`\\b${escaped}\\b`, 'gi'),
      english
    )
  }

  return result
}