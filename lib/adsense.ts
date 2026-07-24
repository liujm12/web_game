export function getAdsenseClient() {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
}

export function getAdsensePublisherId(client = getAdsenseClient()) {
  if (!client) {
    return "";
  }

  return client.startsWith("ca-pub-") ? client.slice(3) : client;
}
