import { Frame } from "@/components/frame"
import { RightBanner } from "@/components/right-banner"
import { PageFooter } from "@/components/page-footer"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { NavigationLink } from "@/components/navigation-link"

interface ContactPageProps {
  searchParams: {
    success?: string
  }
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const supabase = await createClient()
  
  // Await searchParams
  const params = await searchParams
  
  // Fetch contact information from site settings
  const { data: contactEmail, error: emailError } = await supabase
    .from('site_settings')
    .select('setting_value')
    .eq('setting_key', 'contact_email')
    .single()

  const { data: contactPhone, error: phoneError } = await supabase
    .from('site_settings')
    .select('setting_value')
    .eq('setting_key', 'contact_phone')
    .single()

  if (emailError) {
    console.error('Error fetching contact email:', emailError)
  }
  if (phoneError) {
    console.error('Error fetching contact phone:', phoneError)
  }
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
                    <NavigationLink href="/">Homepage</NavigationLink>
                  </li>
                  <li>
                    <NavigationLink href="/contact">Contact</NavigationLink>
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

                  {/* Success Message */}
                  {params.success === 'true' && (
                    <div className="mil-alert mil-success mil-up mil-center mil-mb-60">
                      <p>Thank you for your message! I'll get back to you soon.</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  {(contactEmail?.setting_value || contactPhone?.setting_value) && (
                    <div className="row mil-mb-60">
                      {contactEmail?.setting_value && (
                        <div className="col-lg-6">
                          <div className="mil-contact-info mil-up mil-center">
                            <h4 className="mil-mb-15">Email</h4>
                            <p>
                              <a href={`mailto:${contactEmail.setting_value}`}>
                                {contactEmail.setting_value}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                      {contactPhone?.setting_value && (
                        <div className="col-lg-6">
                          <div className="mil-contact-info mil-up mil-center">
                            <h4 className="mil-mb-15">Phone</h4>
                            <p>
                              <a href={`tel:${contactPhone.setting_value}`}>
                                {contactPhone.setting_value}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <form className="mil-contact-form mil-up" action="/api/contact" method="POST">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mil-input-frame mil-mb-30">
                          <label className="mil-upper mil-dark">
                            <span>Name</span>
                            <span className="mil-required">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="name"
                            placeholder="Your name" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mil-input-frame mil-mb-30">
                          <label className="mil-upper mil-dark">
                            <span>Email</span>
                            <span className="mil-required">*</span>
                          </label>
                          <input 
                            type="email" 
                            name="email"
                            placeholder="your.email@example.com" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mil-input-frame mil-mb-30">
                          <label className="mil-upper mil-dark">
                            <span>Message</span>
                            <span className="mil-required">*</span>
                          </label>
                          <textarea 
                            name="message"
                            placeholder="Tell me about your project..." 
                            rows={6} 
                            required
                          ></textarea>
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
