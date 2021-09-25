export function getTokenImageLink(image: string) {
  if (image.indexOf('ipfs://') === 0) {
    return `https://ipfs.io/ipfs/${image.substring(7)}`;
  }
  return image;
}
