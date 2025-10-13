import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import { CTASectionSimple } from "@/components/cta-section-simple"
import { LanguageSkillsSection } from "@/components/language-skills-section"
import { ServicesSection } from "@/components/services-section"
import { HardSkillsSection } from "@/components/hard-skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { EducationSection } from "@/components/education-section"
import { ReviewsSection } from "@/components/reviews-section"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch user profile data and section visibility
  const [
    { data: userProfile, error: profileError },
    { data: sectionVisibility, error: visibilityError }
  ] = await Promise.all([
    supabase
      .from('user_profile')
      .select('*')
      .single(),
    supabase
      .from('section_visibility')
      .select('section_name, is_visible')
      .eq('is_visible', true)
  ])

  if (profileError) {
    console.error('Error fetching user profile:', profileError)
  }

  if (visibilityError) {
    console.error('Error fetching section visibility:', visibilityError)
  }

  // Create a set of visible sections for easy lookup
  const visibleSections = new Set(sectionVisibility?.map(s => s.section_name) || [])
  return (
    <div className="mil-wrapper" id="top">
      <Frame />

      {/* content */}
      <div className="mil-content">
        <div className="mil-scroll-wrapper">
          <div className="mil-container">
            {/* banner */}
            <section className="mil-side-banner mil-center">
              <div className="mil-banner-top mil-up"></div>
              <div className="mil-banner-title">
                <div className="mil-upper mil-dark mil-up mil-mb-30">Hello! My name is</div>
                <h1 className="mil-up mil-mb-30">
                  {userProfile?.first_name}
                  <br />
                  {userProfile?.last_name}
                </h1>
                <p className="mil-upper mil-dark mil-up">{userProfile?.title}</p>
              </div>
              <div className="mil-up mil-oval-frame">
                <div className="mil-circle-text">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 300 300"
                    enableBackground="new 0 0 300 300"
                    xmlSpace="preserve"
                    className="mil-ct-svg mil-rotate"
                    data-value="360"
                  >
                    <defs>
                      <path id="circlePath" d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "></path>
                    </defs>
                    <circle cx="150" cy="100" r="75" fill="none"></circle>
                    <g>
                      <use xlinkHref="#circlePath" fill="none"></use>
                      <text style={{ letterSpacing: "6.5px" }}>
                        <textPath xlinkHref="#circlePath">Scroll down - Scroll down - </textPath>
                      </text>
                    </g>
                  </svg>
                  <a href="#about" className="mil-button">
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
                      className="feather feather-arrow-down"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </section>
            {/* banner end */}

            {/* about */}
            {visibleSections.has('about_section') && (
              <section id="about" className="mil-p-0-90">
                <div className="mil-oval-frame-2 mil-mb-90">
                  <img 
                    style={{backgroundColor: "white", padding: "20px",}} 
                    src={userProfile?.avatar_url} 
                    alt="avatar" 
                  />
                </div>
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="mil-center">
                      <h2 className="mil-up mil-mb-30">
                        Hi! My name is {userProfile?.first_name}, <br />
                        i'm {userProfile?.title} based in {userProfile?.location}
                      </h2>
                      <div className="mil-quote mil-up mil-mb-30">
                        <i className="fas fa-quote-left"></i>
                      </div>
                      <p className="mil-up mil-mb-30">
                        {userProfile?.bio}
                      </p>
                      <img src={userProfile?.signature_image_url} alt="signature" className="mil-up mil-sign" style={{display: 'block', margin: '0 auto'}} />
                    </div>
                  </div>
                </div>
              </section>
            )}
            {/* about end */}

            {visibleSections.has('services_section') && <ServicesSection />}

            {visibleSections.has('language_skills_section') && <LanguageSkillsSection />}

            {visibleSections.has('hard_skills_section') && <HardSkillsSection />}

            {visibleSections.has('experience_section') && <ExperienceSection />}

            {visibleSections.has('education_section') && <EducationSection />}

            {visibleSections.has('reviews_section') && <ReviewsSection />}

            <div className="mil-divider mil-up mil-mb-90"></div>

            {visibleSections.has('contact_section') && <CTASectionSimple />}
            <PageFooter />
          </div>
        </div>

        <RightBanner />
      </div>
      {/* content end */}
    </div>
  )
}
