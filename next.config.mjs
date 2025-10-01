import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

export default withNextra({
  reactStrictMode: true,
  basePath: '',
  transpilePackages: ['@kroescontrol/brand', '@kroescontrol/ui'],
  images: {
    unoptimized: true
  },

  async headers() {
    return [
      {
        // HTML pages - kort voor nu
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, stale-while-revalidate=1800'
          }
        ]
      },
      {
        // Next.js static assets - immutable
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Public assets - medium cache
        source: '/:path*.(jpg|jpeg|png|gif|svg|webp|avif|ico|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|tar|gz|tgz|bz2|xz|7z|woff|woff2|ttf|otf|eot|mp4|webm|ogg|mp3|wav|flac|aac)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ]
  }
})