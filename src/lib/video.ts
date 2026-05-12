/**
 * Converts standard YouTube/Vimeo URLs to their embeddable counterparts.
 * Returns the original URL if it's already an embed URL or if no match is found.
 */
export function getEmbedUrl(url: string): string {
  if (!url) return "";

  // YouTube
  // Standard: https://www.youtube.com/watch?v=VIDEO_ID
  // Short: https://youtu.be/VIDEO_ID
  // Mobile: https://m.youtube.com/watch?v=VIDEO_ID
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo
  // Standard: https://vimeo.com/VIDEO_ID
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}
