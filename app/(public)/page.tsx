import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import { CTASectionSimple } from "@/components/cta-section-simple"
import { LanguageSkillsSection } from "@/components/language-skills-section"
import { ServicesSection } from "@/components/services-section"
import { HardSkillsSection } from "@/components/hard-skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { ReviewsSection } from "@/components/reviews-section"

export default function Home() {
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
                  John
                  <br />
                  Doe
                </h1>
                <p className="mil-upper mil-dark mil-up">Software Engineer</p>
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
            <section id="about" className="mil-p-0-90">
              <div className="mil-oval-frame-2 mil-mb-90">
                <img style={{backgroundColor: "white", padding: "20px",}} src="https://imgproxy.attic.sh/insecure/f:webp/q:90/w:1920/plain/https://attic.sh/w2wnxqdd1eyw3kw01bzg2u2arva1" alt="avatar" />
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="mil-center">
                    <h2 className="mil-up mil-mb-30">
                      Hi! My name is John, <br />
                      i'm Software Engineer based in Toronto
                    </h2>
                    <div className="mil-quote mil-up mil-mb-30">
                      <i className="fas fa-quote-left"></i>
                    </div>
                    <p className="mil-up mil-mb-30">
                      I am a passionate and dedicated software engineer with expertise in JavaScript, PHP Laravel, and
                      modern web technologies. I thrive on building scalable applications and solving complex technical
                      challenges. With a strong foundation in full-stack development and a problem-solving mindset, I
                      deliver robust solutions that drive business growth. Let's collaborate to bring your digital ideas
                      to life!
                    </p>
                    <img src="/images/sign.png" alt="signature" className="mil-up mil-sign" />
                  </div>
                </div>
              </div>
            </section>
            {/* about end */}

            <ServicesSection />

            <LanguageSkillsSection />

            <HardSkillsSection />

            <ExperienceSection />

            <ReviewsSection />

            <div className="mil-divider mil-up mil-mb-90"></div>

            <CTASectionSimple />
            <PageFooter />
          </div>
        </div>

        <RightBanner />
      </div>
      {/* content end */}
    </div>
  )
}
