import "./Contact.css";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";
import emailjs from "@emailjs/browser";
import { IoSendSharp } from "react-icons/io5";
import { useRef, useState } from "react";

export const Contact = () => {
  const [cooldown, setCooldown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const form = useRef();
  const sendEmail = (e) => {
    if (cooldown) {

      alert("Please wait before sending another message.");

      return;
    }
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    emailjs.sendForm('service_fbw91qw', 'template_07ql51d', form.current, 'tQfp3s48hpQ_U_ad4')
      .then((result) => {
        console.log(result.text);
        alert("Message sent successfully!");
        setCooldown(true);
        setTimeout(() => setCooldown(false), 30000);
        form.current.reset();
        setIsSending(false);
      }, (error) => {
        console.log(error.text);
        alert("An error occurred while sending the message. Please try again later.");
        setIsSending(false);
      });
  };

  return (
    <section id="contact" className="contact-section section-container">

      <div className="contact-container">

        {/* LEFT SIDE */}

        <div className="contact-info">
          <h2 className="section-heading">
            <span className="shootable-text" data-shootable>Let's Talk</span>
          </h2>

          <div className="about-divider" />

          <p className="contact-description" data-shootable>
            I'm always interested in new projects,
            frontend opportunities and creative ideas.
          </p>

          <div className="contact-details">

            <div className="contact-item">
              <div className="contact-icon" data-shootable>
                <FiMail />
              </div>
              <div>
                <p data-shootable>edujuarezcba@gmail.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon" data-shootable>
                <FiPhone />
              </div>

              <div>
                <p data-shootable>+34 617913802</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon" data-shootable>
                <FiMapPin />
              </div>

              <div>
                <p data-shootable>Spain</p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="contact-form-wrapper" data-shootable>

          <form ref={form}
            className="contact-form"
            onSubmit={sendEmail}>

            <div className="input-group">

              <div className="input-icon">
                <FiUser style={{ color: '#d946ef' }} />
              </div>

              <input type="text" 
                placeholder="Your Name"
                  name="name"
                  required
               />

            </div>

            <div className="input-group">

              <div className="input-icon">
                <FiMail style={{ color: '#3b82f6' }} />
              </div>

              <input
                type="email"
                placeholder="Your Email"
                name="email"
                required
              />

            </div>

            <div className="input-group textarea-group">

              <div className="input-icon">
                <FiMessageSquare style={{ color: '#6366f1' }} />
              </div>

              <textarea
                placeholder="Your Message"
                rows={6}
                name="message"
                required
                minLength={10}
              />

            </div>

            <button type="submit" disabled={cooldown || isSending}>
              <span>
                {isSending
                  ? "Sending..."
                  : "Send"}
              </span>
              <IoSendSharp />
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}
