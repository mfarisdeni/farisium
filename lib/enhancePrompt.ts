const HAIR_COLORS = [
  'white', 'silver', 'black', 'blonde', 'brown', 'red', 'pink',
  'blue', 'purple', 'green', 'orange', 'golden', 'gray',
]

const EYE_COLORS = [
  'blue', 'red', 'green', 'purple', 'golden', 'pink', 'black', 'gray', 'hazel',
]

interface StyleProfile {
  context: string
  atmosphere: string
  clothing: string
  lighting: string
  palette: string
}

const PROFILES: Record<string, StyleProfile> = {
  maid: {
    context: 'elegant anime maid with graceful posture',
    atmosphere: 'cozy warm indoor setting, soft natural light',
    clothing: 'detailed frilly maid outfit with lace trim and apron',
    lighting: 'soft warm indoor lighting',
    palette: 'soft pastels with warm cream tones',
  },
  cafe: {
    context: 'charming anime cafe worker with warm smile',
    atmosphere: 'cozy cafe interior, steam rising from coffee',
    clothing: 'stylish cafe uniform with apron',
    lighting: 'warm ambient cafe lighting',
    palette: 'warm browns and soft cream tones',
  },
  warrior: {
    context: 'fierce anime warrior with commanding presence',
    atmosphere: 'epic fantasy landscape, dramatic sky',
    clothing: 'detailed fantasy armor with intricate engravings and flowing cape',
    lighting: 'dramatic cinematic lighting with rim light',
    palette: 'deep metallic tones with crimson accents',
  },
  sword: {
    context: 'skilled anime swordswoman in poised stance',
    atmosphere: 'ancient ruins at golden hour, misty air',
    clothing: 'practical yet elegant combat attire with leather and metal accents',
    lighting: 'golden hour sunlight piercing through ruins',
    palette: 'warm golds with deep shadow contrast',
  },
  knight: {
    context: 'noble anime knight with unwavering resolve',
    atmosphere: 'grand castle courtyard, banners flowing in wind',
    clothing: 'polished silver armor with ornate filigree, crimson cape',
    lighting: 'soft diffused daylight with神圣 glow',
    palette: 'silver and crimson with warm gold highlights',
  },
  armor: {
    context: 'majestic anime warrior clad in magnificent armor',
    atmosphere: 'mountain peak at dawn, clouds below',
    clothing: 'intricate plate armor with gemstone inlays',
    lighting: 'dawn light reflecting off polished metal',
    palette: 'steel blues with warm amber reflections',
  },
  witch: {
    context: 'mysterious anime witch with arcane knowledge',
    atmosphere: 'enchanted forest clearing, floating magical particles',
    clothing: 'flowing witch robes with celestial embroidery',
    lighting: 'moonlight filtering through canopy, magical glow',
    palette: 'deep purples and midnight blues with silver accents',
  },
  magic: {
    context: 'enchanting anime spellcaster weaving arcane energy',
    atmosphere: 'starlit sky above ancient stone circle, magical runes glowing',
    clothing: 'elegant mystical robes adorned with crystal charms',
    lighting: 'ethereal magical glow with soft blue highlights',
    palette: 'rich violets and sapphire blues with golden light',
  },
  school: {
    context: 'cheerful anime student with bright expression',
    atmosphere: 'sunny school campus, cherry blossom petals drifting',
    clothing: 'neat Japanese school uniform with ribbon',
    lighting: 'bright natural daylight, soft shadows',
    palette: 'clean whites and navy blues with sakura pink',
  },
  student: {
    context: 'earnest anime student with focused expression',
    atmosphere: 'quiet classroom afternoon light streaming through windows',
    clothing: 'tailored school uniform with blazer',
    lighting: 'soft afternoon sunlight with warm tones',
    palette: 'warm neutrals with navy and white trim',
  },
  uniform: {
    context: 'elegant anime character in polished uniform',
    atmosphere: 'spring day on campus, gentle breeze',
    clothing: 'crisp uniform with careful details',
    lighting: 'golden hour sunlight creating warm glow',
    palette: 'classic navy and white with warm highlights',
  },
  elf: {
    context: 'ethereal anime elf with timeless beauty',
    atmosphere: 'ancient elven forest, dappled sunlight through leaves',
    clothing: 'flowing elven silk embroidered with nature patterns',
    lighting: 'magical forest light filtering through canopy',
    palette: 'emerald greens, golds, and soft lavender shadows',
  },
  fairy: {
    context: 'delicate anime fairy with gossamer wings',
    atmosphere: 'moonlit glade with glowing flowers and fireflies',
    clothing: 'shimmering ethereal dress woven from moonlight',
    lighting: 'soft bioluminescent glow with moonbeams',
    palette: 'iridescent pastels with silver and soft gold',
  },
  demon: {
    context: 'captivating anime demon with otherworldly allure',
    atmosphere: 'dark gothic cathedral ruins, crimson sky',
    clothing: 'luxurious dark attire with demonic motifs',
    lighting: 'dramatic low-key lighting with red undertones',
    palette: 'deep crimsons and blacks with amber highlights',
  },
  dark: {
    context: 'mysterious anime antihero with shadowy presence',
    atmosphere: 'rain-slicked city streets at midnight, neon reflections',
    clothing: 'stylish dark attire with leather accents',
    lighting: 'moody noir lighting with stark contrast',
    palette: 'deep blacks and silvers with moody blue tones',
  },
  gothic: {
    context: 'elegant anime gothic character with aristocratic poise',
    atmosphere: 'ancient mansion interior, candlelit ballroom',
    clothing: 'ornate gothic dress with lace, corset, and jeweled details',
    lighting: 'warm candlelight with deep shadows',
    palette: 'deep burgundy, black, and antique gold',
  },
  angel: {
    context: 'radiant anime angel with luminous presence',
    atmosphere: 'heavenly realm with golden clouds and sacred light',
    clothing: 'flowing white robes with gold trim, majestic wings',
    lighting: 'divine golden light with soft ethereal glow',
    palette: 'pure whites, warm golds, and soft ivory tones',
  },
  divine: {
    context: 'exalted anime divine being radiating holy light',
    atmosphere: 'celestial temple among the stars, cosmic backdrop',
    clothing: 'sacred vestments with golden halos and celestial ornaments',
    lighting: 'heavenly radiance with prismatic light rays',
    palette: 'gold and white with subtle celestial blue',
  },
  idol: {
    context: 'radiant anime idol captivating the stage',
    atmosphere: 'vibrant concert stage with dynamic lighting',
    clothing: 'sparkling performance outfit with ribbons and glittering accessories',
    lighting: 'colorful stage spotlights creating dramatic highlights',
    palette: 'bright vibrant colors with glittering silver accents',
  },
  singer: {
    context: 'passionate anime singer pouring emotion into performance',
    atmosphere: 'intimate acoustic setting, single spotlight',
    clothing: 'elegant stage attire with flowing fabric',
    lighting: 'dramatic single spotlight with deep shadows',
    palette: 'rich jewel tones with warm spotlight glow',
  },
  cyberpunk: {
    context: 'stylish anime cyberpunk character in neon-drenched city',
    atmosphere: 'rainy cyberpunk nightscape, holographic advertisements',
    clothing: 'sleek cyberpunk gear with neon trim and tech accessories',
    lighting: 'vibrant neon lighting with high contrast',
    palette: 'electric blues, hot pinks, and deep purples',
  },
  futuristic: {
    context: 'sleek anime futuristic character from advanced civilization',
    atmosphere: 'clean high-tech environment with holographic interfaces',
    clothing: 'streamlined futuristic attire with glowing elements',
    lighting: 'cool ambient light from holographic displays',
    palette: 'cool whites, steel blues, and cyan accents',
  },
  kimono: {
    context: 'graceful anime beauty adorned in traditional kimono',
    atmosphere: 'serene Japanese garden at sunset, maple leaves falling',
    clothing: 'exquisite kimono with intricate floral embroidery and obi',
    lighting: 'warm sunset light casting golden hues',
    palette: 'rich jewel tones: deep crimson, gold, and emerald',
  },
  ninja: {
    context: 'stealthy anime ninja poised in shadow',
    atmosphere: 'moonlit Japanese rooftop, misty night',
    clothing: 'sleek ninja gear with wrapped fabric and mesh details',
    lighting: 'moonlight creating sharp silhouettes and deep shadows',
    palette: 'deep indigos, blacks, and silver moonlight',
  },
  cat: {
    context: 'playful anime cat girl with feline charm',
    atmosphere: 'sunny afternoon, cozy room with soft furnishings',
    clothing: 'cute casual outfit with cat ear hood and tail',
    lighting: 'warm soft daylight with gentle shadows',
    palette: 'warm pastels with cream and soft brown accents',
  },
  vampire: {
    context: 'alluring anime vampire with eternal elegance',
    atmosphere: 'dimly lit gothic hall, moonlight through stained glass',
    clothing: 'luxurious Victorian attire with cape and aristocratic details',
    lighting: 'moody moonlight with deep crimson undertones',
    palette: 'deep reds, blacks, and pale moonlight silver',
  },
  mermaid: {
    context: 'enchanting anime mermaid in crystal-clear waters',
    atmosphere: 'underwater coral reef, sunbeams piercing through surface',
    clothing: 'lustrous seashell top with flowing translucent fins',
    lighting: 'underwater light play with caustic reflections',
    palette: 'aquamarine, coral pink, and pearl white',
  },
}

function detectProfile(input: string): StyleProfile | null {
  const lower = input.toLowerCase()
  for (const [key, profile] of Object.entries(PROFILES)) {
    if (lower.includes(key)) return profile
  }
  return null
}

function extractHair(input: string): string | null {
  const lower = input.toLowerCase()
  for (const color of HAIR_COLORS) {
    if (lower.includes(color)) {
      if (color === 'red') return 'long vibrant red hair'
      if (color === 'purple') return 'flowing purple hair'
      if (color === 'blue') return 'striking blue hair'
      if (color === 'pink') return 'soft pink hair'
      if (color === 'golden') return 'lustrous golden hair'
      if (color === 'silver') return 'silken silver hair'
      if (color === 'gray') return 'elegant gray hair'
      return `beautiful ${color} hair`
    }
  }
  return null
}

function extractEyes(input: string): string | null {
  const lower = input.toLowerCase()
  for (const color of EYE_COLORS) {
    if (lower.includes(`${color} eye`)) {
      return `striking ${color} eyes`
    }
  }
  return null
}

function extractGender(input: string): 'girl' | 'boy' | null {
  const lower = input.toLowerCase()
  if (/\bgirl\b/.test(lower) || /\bwanita\b/.test(lower) ||
      /\bperempuan\b/.test(lower) || /\bfemale\b/.test(lower) ||
      /\bwoman\b/.test(lower)) return 'girl'
  if (/\bboy\b/.test(lower) || /\bpria\b/.test(lower) ||
      /\blaki\b/.test(lower) || /\bmale\b/.test(lower) ||
      /\bman\b/.test(lower)) return 'boy'
  return null
}

const NEGATIVE_PROMPT =
  'Negative Prompt: bad anatomy, deformed hands, extra fingers, mutated limbs, missing limbs, fused fingers, distorted face, poorly drawn eyes, double head, malformed ears, defective elf ears, lowres, bad quality, blurry, overexposed, cluttered lighting, chaotic shadows, oversaturated neon mess, extra organs, text, watermark, signature.'

export function enhancePrompt(userInput: string): string {
  const trimmed = userInput.trim()
  if (!trimmed) return trimmed

  const profile = detectProfile(trimmed)
  const hair = extractHair(trimmed)
  const eyes = extractEyes(trimmed)
  const gender = extractGender(trimmed)
  const isElf = /\belf\b/i.test(trimmed)

  // Build positive prompt
  const parts: string[] = []

  // Context / subject
  if (profile) {
    parts.push(profile.context)
  } else {
    const subject = gender === 'boy' ? 'handsome anime character' : 'beautiful anime girl'
    parts.push(subject)
  }

  // Hair
  if (hair) parts.push(hair)

  // Eyes
  if (eyes) parts.push(eyes)

  // Clothing
  if (profile?.clothing) parts.push(profile.clothing)

  // Atmosphere
  if (profile?.atmosphere) parts.push(profile.atmosphere)

  // Lighting
  if (profile?.lighting) parts.push(profile.lighting)

  // Color palette
  if (profile?.palette) parts.push(profile.palette)

  // Elf ear quality
  if (isElf) {
    parts.push('perfectly shaped elegant elven ears, flawlessly connected')
  }

  // Generic quality refinements
  parts.push(
    'masterpiece quality',
    'intricate detailed textures',
    'flawless anatomy',
    'perfect hands and fingers',
    'rich harmonious colors',
    'beautiful composition',
    'depth and dimensionality',
  )

  // Remove duplicates while preserving order
  const seen = new Set<string>()
  const uniqueParts = parts.filter(p => {
    const lower = p.toLowerCase()
    if (seen.has(lower)) return false
    seen.add(lower)
    return true
  })

  const positivePrompt = uniqueParts.join(', ')

  return `${positivePrompt}. ${NEGATIVE_PROMPT}`
}
