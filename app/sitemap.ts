export default function sitemap() {
  return [
    {
      url: 'https://readme-profile-gen.seonay.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://readme-profile-gen.seonay.com/generator',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];
}
