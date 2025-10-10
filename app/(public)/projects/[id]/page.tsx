import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import Link from "next/link"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
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
                  <li>
                    <span className="mil-upper mil-dark">Client: </span>&nbsp;&nbsp;
                    <span className="mil-upper">TechCorp Solutions</span>
                  </li>
                  <li>
                    <span className="mil-upper mil-dark">Date: </span>&nbsp;&nbsp;
                    <span className="mil-upper">March 2023</span>
                  </li>
                  <li className="mil-upper mil-accent">Full-Stack Development</li>
                </ul>
                <h1 className="mil-h1-sm mil-up mil-mb-60">E-Commerce Platform</h1>
                <ul className="mil-breadcrumbs mil-up">
                  <li>
                    <Link href="/">Homepage</Link>
                  </li>
                  <li>
                    <Link href="/projects">Projects</Link>
                  </li>
                  <li>
                    <Link href={`/projects/${params.id}`}>Project</Link>
                  </li>
                </ul>
              </div>
            </section>
            {/* banner end */}

            {/* project */}
            <section className="mil-p-0-30">
              <div className="row justify-content-center">
                <div className="col-lg-9">
                  <p className="mil-text-xl mil-dark mil-up mil-center mil-mb-90">
                    A comprehensive e-commerce platform built with React.js frontend and Laravel backend, featuring
                    real-time inventory management, secure payment processing, and advanced analytics dashboard. The
                    platform handles over 10,000 daily transactions with 99.9% uptime.
                  </p>
                </div>
                <div className="col-lg-12">
                  <img src="/images/1.jpg" alt="project" style={{ width: "100%" }} className="mil-up mil-mb-30" />
                </div>
                <div className="col-lg-6">
                  <img src="/images/2.jpg" alt="project" style={{ width: "100%" }} className="mil-up mil-mb-30" />
                </div>
                <div className="col-lg-6">
                  <img src="/images/3.jpg" alt="project" style={{ width: "100%" }} className="mil-up mil-mb-60" />
                </div>
                <div className="col-lg-6">
                  <h3 className="mil-up mil-mb-30">Technical Implementation</h3>
                </div>
                <div className="col-lg-6">
                  <p className="mil-up mil-mb-15">
                    Built with modern web technologies including React.js for the frontend, Laravel 9 for the backend
                    API, and MySQL for database management.
                  </p>
                  <p className="mil-up mil-mb-30">
                    Implemented advanced features like real-time notifications using WebSockets, payment integration
                    with Stripe, and comprehensive admin dashboard with analytics. The application uses JWT
                    authentication, Redis for caching, and Docker for deployment.
                  </p>
                  <a
                    href="https://github.com/johndoe"
                    target="_blank"
                    className="mil-link mil-up mil-mb-60"
                    rel="noreferrer"
                  >
                    <span>View on GitHub</span>
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
                </div>
                <div className="col-lg-12">
                  <img src="/images/1_1.jpg" alt="project" style={{ width: "100%" }} className="mil-up mil-mb-30" />
                </div>
                <div className="col-lg-6">
                  <img src="/images/2_1.jpg" alt="project" style={{ width: "100%" }} className="mil-up mil-mb-30" />
                </div>
                <div className="col-lg-6">
                  <img src="/images/3_1.jpg" alt="project" style={{ width: "100%" }} className="mil-up mil-mb-60" />
                </div>
              </div>
            </section>
            {/* project end */}

            <div className="mil-section-title mil-up">
              <div className="mil-divider"></div>
              <h3>Similar projects</h3>
            </div>

            {/* similar projects */}
            <section className="mil-p-90-30">
              <div className="row justify-content-between align-items-center">
                <div className="col-lg-6">
                  <Link href="/projects/2" className="mil-portfolio-item mil-mb-60">
                    <div className="mil-cover-frame mil-up">
                      <img src="/images/2.jpg" alt="cover" />
                    </div>
                    <div className="mil-description mil-up">
                      <div>
                        <p className="mil-upper mil-mb-5">API</p>
                        <h4>REST API Service</h4>
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
                <div className="col-lg-6">
                  <Link href="/projects/5" className="mil-portfolio-item mil-mb-60">
                    <div className="mil-cover-frame mil-up">
                      <img src="/images/3.jpg" alt="cover" />
                    </div>
                    <div className="mil-description mil-up">
                      <div>
                        <p className="mil-upper mil-mb-5">Laravel</p>
                        <h4>CRM System</h4>
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
              </div>
            </section>
            {/* similar projects end */}

            <div className="mil-divider mil-up mil-mb-90"></div>

            {/* call to action */}
            <section id="about" className="mil-p-0-90">
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

        <RightBanner backgroundImage="/images/1.jpg" showPerson={false} />
      </div>
      {/* content end */}
    </div>
  )
}
