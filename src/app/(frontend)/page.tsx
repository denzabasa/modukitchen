import Link from 'next/link'
export default function HomePage() {
  const colors = [
    { name: 'Ivory', hex: '#F7F4EF', className: 'bg-ivory' },
    { name: 'Sand', hex: '#E8DED1', className: 'bg-sand' },
    { name: 'Oak', hex: '#B99B7B', className: 'bg-oak' },
    { name: 'Walnut', hex: '#80532E', className: 'bg-walnut' },
    { name: 'Charcoal', hex: '#292621', className: 'bg-charcoal' },
  ]

  return (
    <div className="min-h-screen">
      <section className="container-site section-padding">
        <div className="max-w-3xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            ModuKitchen
          </p>

          <h1 className="text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
            Beautiful kitchens,
            <br />
            <span className="italic text-primary">
              designed for living.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Transform your home with thoughtfully designed modular
            kitchens, premium materials, and exceptional craftsmanship.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#design-system"
              className="inline-flex items-center justify-center bg-primary px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Explore our design system
            </a>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center border border-primary px-7 py-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              CMS Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section
        id="design-system"
        className="border-y border-border bg-white"
      >
        <div className="container-site section-padding">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Design foundation
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl">
            Our colour palette
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-5">
            {colors.map((color) => (
              <div key={color.name}>
                <div
                  className={`aspect-square border border-border ${color.className}`}
                />
                <h3 className="mt-4 font-sans text-sm font-semibold">
                  {color.name}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {color.hex}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-charcoal py-8 text-white">
        <div className="container-site flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-heading text-3xl">
            ModuKitchen.
          </p>

          <p className="text-sm text-white/70">
            Built with Payload CMS, Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
