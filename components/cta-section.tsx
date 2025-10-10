import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-8">
            Ready to bring your ideas to life? I'm here to help
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-cyan-400 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-300 transition-colors"
          >
            Contact me
          </Link>
        </div>
      </div>
    </section>
  )
}
