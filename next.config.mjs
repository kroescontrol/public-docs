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
  }
})