import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import Link from "next/link"

export default function ProjectsPage() {
  const projects = [
    { id: "1", category: "Web App", title: "E-Commerce Platform", image: "/images/1.jpg" },
    { id: "2", category: "API", title: "REST API Service", image: "/images/2.jpg" },
    { id: "3", category: "Mobile App", title: "React Native App", image: "/images/3.jpg" },
    { id: "4", category: "Dashboard", title: "Analytics Dashboard", image: "/images/4.jpg" },
    { id: "5", category: "Laravel", title: "CRM System", image: "/images/5.jpg" },
    { id: "6", category: "React", title: "Social Media App", image: "/images/6.jpg" },
    { id: "7", category: "Node.js", title: "Real-time Chat", image: "/images/7.jpg" },
    { id: "8", category: "Vue.js", title: "Task Management", image: "/images/8.jpg" },
  ]

  return (
    <div className="mil-wrapper" id="top">
      <Frame />

      {/* content */}
      <div className="mil-content">
        <div className="mil-scroll-wrapper transition-fade" id="swupMain">
          <div className="mil-container">
            {/* banner */}
            <section className="mil-banner-sm mil-center">
              <div className="mil-banner-top mil-up"></div>
              <div className="mil-banner-title">
                <h1 className="mil-h1-sm mil-up mil-mb-60">
                  Building the <br />
                  Future with Code
                </h1>
                <ul className="mil-breadcrumbs mil-up">
                  <li>
                    <Link href="/">Homepage</Link>
                  </li>
                  <li>
                    <Link href="/projects">projects</Link>
                  </li>
                </ul>
              </div>
            </section>
            {/* banner end */}

            {/* portfolio */}
            <section>
              <div className="row">
                {projects.map((project) => (
                  <div key={project.id} className="col-lg-6">
                    <Link href={`/projects/${project.id}`} className="mil-portfolio-item mil-mb-60">
                      <div className="mil-cover-frame mil-up">
                        <img src={project.image || "/placeholder.svg"} alt="cover" />
                      </div>
                      <div className="mil-description mil-up">
                        <div>
                          <p className="mil-upper mil-mb-5">{project.category}</p>
                          <h4>{project.title}</h4>
                        </div>
                        <div className="mil-link mil-icon-link">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-arrow-right"
                          >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}

                <div className="col-lg-12">
                  <div className="mil-pagination mil-up">
                    <div className="mil-divider"></div>
                    <div className="mil-pagination-buttons">
                      <a href="/projects" className="mil-pagination-btn mil-active">
                        1
                      </a>
                      <a href="/projects" className="mil-pagination-btn">
                        2
                      </a>
                      <a href="/projects" className="mil-pagination-btn">
                        3
                      </a>
                      <a href="/projects" className="mil-pagination-btn">
                        4
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* portfolio end */}

            {/* call to action */}
            <section id="about" className="mil-p-90-90">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="mil-center">
                    <h2 className="mil-up mil-mb-30">Ready to bring your ideas to life? I'm here to help</h2>
                    <div className="mil-up">
                      <Link href="/contact" className="mil-btn mil-sm-btn">
                        Contact me
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* call to action end */}

            <PageFooter />
          </div>
        </div>

        <RightBanner />
      </div>
      {/* content end */}
    </div>
  )
}
