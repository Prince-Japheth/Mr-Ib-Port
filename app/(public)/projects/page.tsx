import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { NavigationLink } from "@/components/navigation-link"

interface ProjectsPageProps {
  searchParams: {
    page?: string
  }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const supabase = await createClient()
  
  // Get current page from search params, default to 1
  const currentPage = parseInt(searchParams.page || '1', 10)
  const projectsPerPage = 6
  const offset = (currentPage - 1) * projectsPerPage
  
  // Fetch projects data from Supabase with pagination
  const { data: projects, error: projectsError, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .range(offset, offset + projectsPerPage - 1)

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
  }

  const totalProjects = count || 0
  const totalPages = Math.ceil(totalProjects / projectsPerPage)

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
                    <NavigationLink href="/">Homepage</NavigationLink>
                  </li>
                  <li>
                    <NavigationLink href="/projects">projects</NavigationLink>
                  </li>
                </ul>
              </div>
            </section>
            {/* banner end */}

            {/* portfolio */}
            <section>
              {projects && projects.length > 0 ? (
                <div className="row">
                  {projects.map((project) => (
                    <div key={project.id} className="col-lg-6">
                      <NavigationLink href={`/projects/${project.id}`} className="mil-portfolio-item mil-mb-60">
                        <div className="mil-cover-frame mil-up">
                          <img 
                            src={project.featured_image_url || "/placeholder.svg"} 
                            alt={project.title || "project cover"} 
                          />
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
                      </NavigationLink>
                    </div>
                  ))}

                  <div className="col-lg-12">
                    <div className="mil-pagination mil-up">
                      <div className="mil-divider"></div>
                      <div className="mil-pagination-buttons">
                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <NavigationLink
                            key={pageNum}
                            href={`/projects?page=${pageNum}`}
                            className={`mil-pagination-btn ${currentPage === pageNum ? 'mil-active' : ''}`}
                          >
                            {pageNum}
                          </NavigationLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="mil-center mil-up">
                      <div className="mil-empty-state">
                        <div className="mil-empty-icon mil-mb-30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mil-text-muted"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                          </svg>
                        </div>
                        <h3 className="mil-h3 mil-mb-15">No Projects Yet</h3>
                        <p className="mil-text-lg mil-text-muted mil-mb-30">
                          Projects will appear here once they're added to the portfolio.
                        </p>
                        <div className="mil-divider mil-mb-30"></div>
                        <p className="mil-text-sm mil-text-muted">
                          Check back soon for exciting new projects and case studies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            {/* portfolio end */}

            {/* call to action */}
            <section id="about" className="mil-p-90-90">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="mil-center">
                    <h2 className="mil-up mil-mb-30">Ready to bring your ideas to life? I'm here to help</h2>
                    <div className="mil-up">
                      <NavigationLink href="/contact" className="mil-btn mil-sm-btn">
                        Contact me
                      </NavigationLink>
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
