export function SkillsSection() {
  const skills = [
    { name: "HTML5", icon: "https://cdn-icons-png.flaticon.com/128/3291/3291670.png" },
    {
      name: "CSS3",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Official_CSS_Logo.svg/2048px-Official_CSS_Logo.svg.png",
    },
    { name: "JavaScript", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968292.png" },
    { name: "TypeScript", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968381.png" },
    { name: "React", icon: "https://cdn-icons-png.flaticon.com/128/10826/10826338.png" },
    { name: "Next.js", icon: "https://www.datocms-assets.com/98835/1684410508-image-7.png" },
    { name: "Node.js", icon: "https://cdn-icons-png.flaticon.com/128/5968/5968322.png" },
    { name: "PHP", icon: "https://cdn-icons-png.flaticon.com/128/919/919830.png" },
    {
      name: "Laravel",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhoVwuJmtF1Lu4t9WcsZ7fESV9KdIQ7pVHw&s",
    },
    { name: "MySQL", icon: "https://cdn-icons-png.flaticon.com/128/9543/9543826.png" },
    {
      name: "MongoDB",
      icon: "https://cdn.prod.website-files.com/6640cd28f51f13175e577c05/664e00a400e23f104ed2b6cd_3b3dd6e8-8a73-5879-84a9-a42d5b910c74.svg",
    },
    { name: "Git", icon: "https://cdn-icons-png.flaticon.com/128/15466/15466163.png" },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-slate-700 flex-1"></div>
          <h2 className="text-3xl font-bold text-slate-100">Hard Skills</h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={skill.icon || "/placeholder.svg"}
                  alt={skill.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <p className="text-sm text-slate-300 text-center">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
