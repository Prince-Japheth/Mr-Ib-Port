export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          <p className="text-cyan-400 text-sm uppercase tracking-wider mb-4">Hello! My name is</p>
          <h1 className="text-6xl md:text-8xl font-bold text-slate-100 mb-6">John Doe</h1>
          <p className="text-2xl md:text-3xl text-slate-400 mb-8">Software Engineer</p>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            I am a passionate and dedicated software engineer with expertise in JavaScript, PHP Laravel, and modern web
            technologies. I thrive on building scalable applications and solving complex technical challenges.
          </p>
        </div>
      </div>
    </section>
  )
}
