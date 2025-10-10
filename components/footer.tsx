export function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2025. John Doe. All rights reserved.</p>
          <p>
            Built with <span className="text-cyan-400">Next.js</span> and{" "}
            <span className="text-cyan-400">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
