import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import { QRCodeComponent } from "@/components/qr-code"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { NavigationLink } from "@/components/navigation-link"
import { notFound } from "next/navigation"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // Fetch project data from Supabase
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Fetch project images
  const { data: projectImages, error: imagesError } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', params.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (imagesError) {
    console.error('Error fetching project images:', imagesError)
  }

  // Fetch project technologies
  const { data: technologies, error: techError } = await supabase
    .from('project_technologies')
    .select('technology_name')
    .eq('project_id', params.id)
    .order('technology_name', { ascending: true })

  if (techError) {
    console.error('Error fetching project technologies:', techError)
  }

  // Fetch similar projects (any random two projects excluding current one)
  const { data: similarProjects, error: similarError } = await supabase
    .from('projects')
    .select('id, title, category, featured_image_url')
    .neq('id', params.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(2)

  if (similarError) {
    console.error('Error fetching similar projects:', similarError)
  }

  // Format project date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  // Generate project URL for QR code
  const projectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/projects/${params.id}`
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
                <ul className="mil-puplication-details mil-up mil-mb-60">
                  {project.client_name && (
                    <li>
                      <span className="mil-upper mil-dark">Client: </span>&nbsp;&nbsp;
                      <span className="mil-upper">{project.client_name}</span>
                    </li>
                  )}
                  {project.project_date && (
                    <li>
                      <span className="mil-upper mil-dark">Date: </span>&nbsp;&nbsp;
                      <span className="mil-upper">{formatDate(project.project_date)}</span>
                    </li>
                  )}
                  <li className="mil-upper mil-accent">{project.category}</li>
                </ul>
                <h1 className="mil-h1-sm mil-up mil-mb-60">{project.title}</h1>
                <ul className="mil-breadcrumbs mil-up">
                  <li>
                    <NavigationLink href="/">Homepage</NavigationLink>
                  </li>
                  <li>
                    <NavigationLink href="/projects">Projects</NavigationLink>
                  </li>
                  <li>
                    <NavigationLink href={`/projects/${params.id}`}>{project.title}</NavigationLink>
                  </li>
                </ul>
              </div>
            </section>
            {/* banner end */}

            {/* project */}
            <section className="mil-p-0-30">
              <div className="row justify-content-center">
                {project.detailed_description && (
                  <div className="col-lg-9">
                    <p className="mil-text-xl mil-dark mil-up mil-center mil-mb-90">
                      {project.detailed_description}
                    </p>
                  </div>
                )}
                
                {/* Project Images */}
                {projectImages && projectImages.length > 0 ? (
                  projectImages.map((image, index) => {
                    // First image takes full width
                    if (index === 0) {
                      return (
                        <div key={image.id} className="col-lg-12">
                          <img 
                            src={image.image_url} 
                            alt={image.alt_text || project.title} 
                            style={{ width: "100%" }} 
                            className="mil-up mil-mb-30" 
                          />
                        </div>
                      )
                    }
                    // Subsequent images in pairs
                    else if (index % 2 === 1) {
                      return (
                        <div key={image.id} className="col-lg-6">
                          <img 
                            src={image.image_url} 
                            alt={image.alt_text || project.title} 
                            style={{ width: "100%" }} 
                            className="mil-up mil-mb-30" 
                          />
                        </div>
                      )
                    } else {
                      return (
                        <div key={image.id} className="col-lg-6">
                          <img 
                            src={image.image_url} 
                            alt={image.alt_text || project.title} 
                            style={{ width: "100%" }} 
                            className="mil-up mil-mb-60" 
                          />
                        </div>
                      )
                    }
                  })
                ) : null}

                {project.description && (
                  <div className="col-lg-12">
                    <div className="mil-center">
                      <h3 className="mil-up mil-mb-30">Project Details</h3>
                      <p className="mil-up mil-mb-30">
                        {project.description}
                      </p>
                      
                      {technologies && technologies.length > 0 && (
                        <p className="mil-up mil-mb-30">
                          <strong>Technologies used:</strong> {technologies.map(t => t.technology_name).join(', ')}
                        </p>
                      )}
                      
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          className="mil-link mil-up mil-mb-30"
                          rel="noreferrer"
                        >
                          <span>View</span>
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
                        </a>
                      )}

                      {/* QR Code Section */}
                      <div className="mil-up mil-mb-60">
                        <h4 className="mil-text-sm mil-dark mil-mb-15">Share this project</h4>
                        <QRCodeComponent 
                          url={projectUrl} 
                          size={150}
                          className="mil-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
            {/* project end */}

            {/* similar projects */}
            {similarProjects && similarProjects.length > 0 && (
              <>
                <div className="mil-section-title mil-up">
                  <div className="mil-divider"></div>
                  <h3>Similar projects</h3>
                </div>

                <section className="mil-p-90-30">
                  <div className="row justify-content-between align-items-center">
                    {similarProjects.map((similarProject) => (
                      <div key={similarProject.id} className="col-lg-6">
                        <NavigationLink href={`/projects/${similarProject.id}`} className="mil-portfolio-item mil-mb-60">
                          <div className="mil-cover-frame mil-up">
                            <img 
                              src={similarProject.featured_image_url || "/placeholder.svg"} 
                              alt={similarProject.title} 
                            />
                          </div>
                          <div className="mil-description mil-up">
                            <div>
                              <p className="mil-upper mil-mb-5">{similarProject.category}</p>
                              <h4>{similarProject.title}</h4>
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
                  </div>
                </section>
              </>
            )}
            {/* similar projects end */}

            <div className="mil-divider mil-up mil-mb-90"></div>

            {/* call to action */}
            <section id="about" className="mil-p-0-90">
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

        <RightBanner backgroundImage={project.featured_image_url || "/images/1.jpg"} showPerson={false} />
      </div>
      {/* content end */}
    </div>
  )
}
