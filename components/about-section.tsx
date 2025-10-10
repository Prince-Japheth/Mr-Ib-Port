export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-slate-700 flex-1"></div>
            <h2 className="text-3xl font-bold text-slate-100">About</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-cyan-400/20 mx-auto">
                <img src="/professional-developer-portrait.png" alt="John Doe" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-100">Hi! I'm John, a Software Engineer based in Toronto</h3>
              <div className="text-4xl text-cyan-400">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="text-slate-300 leading-relaxed">
                I am a passionate and dedicated software engineer with expertise in JavaScript, PHP Laravel, and modern
                web technologies. I thrive on building scalable applications and solving complex technical challenges.
                With a strong foundation in full-stack development and a problem-solving mindset, I deliver robust
                solutions that drive business growth.
              </p>
              <p className="text-slate-300 leading-relaxed">Let's collaborate to bring your digital ideas to life!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
