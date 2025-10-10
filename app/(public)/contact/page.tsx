import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import Link from "next/link"

export default function ContactPage() {
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
                <h1 className="mil-h1-sm mil-up mil-mb-60">Get In Touch</h1>
                <ul className="mil-breadcrumbs mil-up">
                  <li>
                    <Link href="/">Homepage</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </section>
            {/* banner end */}

            {/* contact form */}
            <section className="mil-p-90-90">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <p className="mil-text-xl mil-dark mil-up mil-center mil-mb-60">
                    Have a project in mind? Let's work together to bring your ideas to life.
                  </p>

                  <form className="mil-contact-form mil-up">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mil-input-frame mil-mb-30">
                          <label className="mil-upper mil-dark">
                            <span>Name</span>
                            <span className="mil-required">*</span>
                          </label>
                          <input type="text" placeholder="Your name" required />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mil-input-frame mil-mb-30">
                          <label className="mil-upper mil-dark">
                            <span>Email</span>
                            <span className="mil-required">*</span>
                          </label>
                          <input type="email" placeholder="your.email@example.com" required />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mil-input-frame mil-mb-30">
                          <label className="mil-upper mil-dark">
                            <span>Message</span>
                            <span className="mil-required">*</span>
                          </label>
                          <textarea placeholder="Tell me about your project..." rows={6} required></textarea>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <button type="submit" className="mil-btn mil-sm-btn">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
            {/* contact form end */}

            <PageFooter />
          </div>
        </div>

        <RightBanner />
      </div>
      {/* content end */}
    </div>
  )
}
