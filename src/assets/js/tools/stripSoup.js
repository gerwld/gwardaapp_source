export default function stripSoup(soup) {
  // All general removes (big chunks)
  return soup.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')

    // Visuals
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')

    // Remove html comments
    .replace(/<\!--[\s\S]*?-->/g, '')

    // Remove onload js parts
    .replace(/onload/g, 'soup-onload')
    .replace(/\s+/g, ' ')
}
