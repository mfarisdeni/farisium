# Pedoman Penulisan Blog Farisium

Dokumen ini adalah *single source of truth* untuk setiap artikel di Blog Farisium.
Seluruh artikel — baru maupun yang sudah ada — harus mematuhi pedoman ini.

---

## Filosofi Penulisan

- **Fokus pada search intent**: Pahami pertanyaan utama yang ingin dijawab pengguna saat mencari topik ini.
- **Bahas topik secara lengkap, bukan panjang**: Setiap paragraf harus memiliki nilai informasi. Hindari *fluff* dan pengulangan.
- **Jawab pertanyaan utama pengguna di awal artikel**: Dua paragraf pertama langsung memberikan jawaban inti.
- **Hindari pengulangan kalimat**: Jika satu ide sudah disampaikan, jangan sampaikan lagi dengan kata lain.
- **Setiap H2 harus memiliki nilai informasi yang jelas**: Jika sebuah heading tidak memberikan arah yang jelas, hapus atau gabung.
- **Gunakan contoh nyata jika relevan**: Contoh konkret lebih berharga daripada teori abstrak.
- **Optimalkan artikel agar mudah dipahami manusia dan AI**: Gunakan bahasa alami, struktur jelas, dan hindari *keyword stuffing*.

---

## Spesifikasi Teknis

### Jumlah Kata

| Metrik | Nilai |
|--------|-------|
| Target | 2.200–2.800 kata |
| Minimum | 1.800 kata |
| Maksimum normal | 3.500 kata |

Hitung kata berdasarkan konten semua paragraf, list, dan heading (tidak termasuk metadata, URL, dan kode).

### Struktur Artikel

```
1. H1 (judul artikel)
2. Ringkasan singkat (2 paragraf pertama — jawab search intent)
3. 5–10 H2 (topik utama)
4. H3 jika diperlukan (subtopik)
5. FAQ: 5–8 pertanyaan (format H3 diawali kata tanya)
6. Kesimpulan (H2 "Kesimpulan" / "Conclusion")
7. CTA (ajakan ke AI Tools Farisium atau halaman relevan)
```

### Gambar

- 4–6 gambar per artikel
- Setiap gambar wajib memiliki `alt text` yang deskriptif
- Gunakan format SVG dengan gaya visual Farisium

### Internal Link

- 5–10 internal link per artikel
- Link ke halaman Farisium yang relevan: homepage, AI Tools, Anime Generator, blog lain, FRSC, Rewards
- Jangan duplikat internal link yang sama dalam satu artikel (setiap URL unik maksimal muncul sekali)

### External Link

- 2–5 external link ke sumber terpercaya
- Prioritaskan sumber otoritatif: riset akademik, laporan industri, dokumentasi resmi
- Contoh: Google AI, OpenAI, Coursera, Wikipedia, jurnal ilmiah

### SEO Wajib

Setiap artikel harus memiliki:

- **Meta Title**: Unik, mengandung kata kunci utama, maksimal 60 karakter
- **Meta Description**: 120–160 karakter, menjawab search intent
- **Canonical**: `https://farisium.com/blog/[slug]`
- **OG Image**: Gambar Open Graph yang relevan
- **JSON-LD Schema**: BlogPosting, BreadcrumbList, FAQPage (jika ada FAQ)
- **Slug**: Huruf kecil, gunakan tanda hubung, maksimal 80 karakter
- **Kategori**: Konsisten dengan kategori yang sudah ada

### Struktur Heading

- H1: Hanya judul artikel (otomatis dari komponen blog)
- H2: Topik utama — pastikan setiap H2 informatif
- H3: Subtopik dan FAQ — FAQ harus diawali kata tanya (Apa, Bagaimana, Apakah, Berapa, What, How, Is, Can, Does)

---

## Standar Kategori

| Bahasa Indonesia | Bahasa Inggris |
|-----------------|----------------|
| Artificial Intelligence | Artificial Intelligence |
| Tutorial | Tutorials |
| Perbandingan | Comparisons |
| Edukasi & Tips | Education & Tips |

**Catatan**: Kategori "Digital Education" sudah digabung ke "Edukasi & Tips" / "Education & Tips".

---

## Checklist Penerbitan

Sebelum menyelesaikan artikel, pastikan semua poin berikut terpenuhi:

- [ ] Meta title sesuai format
- [ ] Meta description menjawab search intent
- [ ] Canonical URL benar
- [ ] OG image tersedia
- [ ] Slug sesuai format
- [ ] Ringkasan singkat di 2 paragraf pertama
- [ ] 5–10 H2 informatif
- [ ] 5–8 FAQ dengan format H3 diawali kata tanya
- [ ] Kesimpulan yang merangkum isi artikel
- [ ] 4–6 gambar dengan alt text
- [ ] 5–10 internal link (tanpa duplikasi URL)
- [ ] 2–5 external link ke sumber terpercaya
- [ ] JSON-LD schema (BlogPosting, FAQPage)
- [ ] Tidak ada pengulangan kalimat
- [ ] Tidak ada paragraf tanpa nilai informasi
- [ ] Target 2.200–2.800 kata (minimum 1.800)
- [ ] Kategori konsisten
- [ ] Bahasa konsisten (ID atau EN)
- [ ] Internal link tidak duplikat dalam satu artikel

---

## Larangan

- **Jangan** membuat konten lebih panjang dari 3.500 kata tanpa alasan yang jelas.
- **Jangan** mengulang kalimat atau ide yang sama dalam satu artikel.
- **Jangan** menggunakan H2 yang tidak informatif (contoh buruk: "Pendahuluan", "Hal Lain").
- **Jangan** meletakkan internal link yang sama lebih dari sekali dalam satu artikel.
- **Jangan** menggunakan *keyword stuffing* atau frasa yang tidak alami.
- **Jangan** membuat FAQ yang tidak relevan dengan topik utama.
- **Jangan** menggunakan gambar tanpa alt text.
- **Jangan** menggunakan sumber eksternal yang tidak kredibel.

---

## Alur Kerja

1. Baca BLOG-WRITING.md.
2. Review artikel yang sudah ada untuk menghindari duplikasi topik.
3. Pilih topik berikutnya berdasarkan *topical authority*.
4. Tulis artikel dengan mengikuti struktur di atas.
5. Pastikan semua checklist terpenuhi.
6. Tambahkan 5–10 internal link dan 2–5 external link.
7. Optimalkan SEO (meta, schema, OG).
8. Publikasi.

---

## Batasan Eksekusi

Maksimal 2 artikel per eksekusi untuk menjaga kualitas.
Setelah selesai, berikan ringkasan artikel dan usulkan 2 topik berikutnya.
