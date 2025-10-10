import Link from "next/link"

interface ProjectCardProps {
  id: string
  title: string
  category: string
  image: string
}

export function ProjectCard({ id, title, category, image }: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-cyan-400 uppercase tracking-wider mb-2">{category}</p>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{title}</h3>
        </div>
        <div className="text-cyan-400 group-hover:translate-x-1 transition-transform">
          <i className="fas fa-arrow-right"></i>
        </div>
      </div>
    </Link>
  )
}
