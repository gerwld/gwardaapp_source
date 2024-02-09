export default function stripSoup(soup) {
  // All general removes (big chunks)
  soup = soup.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '');
  soup = soup.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  soup = soup.replace(/<link\b[^>]*>/gi, '');
  soup = soup.replace(/<meta\b[^>]*>/gi, '');

  // Visuals
  soup = soup.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  soup = soup.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');

  // Remove html comments
  soup = soup.replace(/<\!--[\s\S]*?-->/g, '');

  // Remove onload js parts
  soup = soup.replace(/onload/g, 'soup-onload');

  return soup.replace(/\s+/g, ' ');
} 