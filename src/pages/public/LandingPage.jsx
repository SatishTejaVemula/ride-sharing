import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/ridex-hero.png";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="ridex-landing">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`ridex-navbar ${
          scrolled ? "ridex-navbar-scrolled" : ""
        }`}
      >
        <div className="ridex-nav-inner">

          <button
            className="ridex-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <h1>Ride<span>Share</span></h1>
          </button>

          <nav className="ridex-desktop-nav">

            <a href="#how-it-works">
              How it works
            </a>

            <a href="#safety">
              Safety
            </a>

            <a href="#drivers">
              Drive with us
            </a>

            <a href="#about">
              About
            </a>

          </nav>

          <div className="ridex-nav-actions">

            <button
              className="ridex-login-btn"
              onClick={() => goTo("/login")}
            >
              Log in
            </button>

            <button
              className="ridex-nav-cta"
              onClick={() => goTo("/register")}
            >
              Get started
              <ArrowUpRight size={15} />
            </button>

            <button
              className="ridex-mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>

        {menuOpen && (
          <div className="ridex-mobile-nav">

            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </a>

            <a
              href="#safety"
              onClick={() => setMenuOpen(false)}
            >
              Safety
            </a>

            <a
              href="#drivers"
              onClick={() => setMenuOpen(false)}
            >
              Drive with us
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>

            <button
              onClick={() => goTo("/login")}
            >
              Log in
            </button>

            <button
              className="ridex-mobile-cta"
              onClick={() => goTo("/register")}
            >
              Get started
            </button>

          </div>
        )}

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="ridex-hero">

        <div className="ridex-hero-image">
          <img
            src={heroImage}
            alt="Motorcycle on the road"
          />
        </div>

        <div className="ridex-hero-overlay" />

        <div className="ridex-hero-content">

          <div className="ridex-eyebrow ridex-eyebrow-light">
            THE SMARTER WAY TO MOVE
          </div>

          <h1>
            Your journey.
            <br />
            <span>Your way.</span>
          </h1>

          <p>
            Find reliable rides, connect with trusted riders,
            and get where you're going without the hassle.
          </p>

          <div className="ridex-hero-actions">

            <button
              className="ridex-primary-btn"
              onClick={() => goTo("/passenger/rides")}
            >
              Find a ride
              <ArrowRight size={18} />
            </button>

            <button
              className="ridex-secondary-btn"
              onClick={() => goTo("/register")}
            >
              Become a Rider
            </button>

          </div>

          <div className="ridex-hero-trust">

            <div className="ridex-avatar-stack">
              <span>B</span>
              <span>S</span>
              <span>T</span>
              <span>+</span>
            </div>

            <div>
              <strong>Built for real journeys</strong>
              <small>
                Simple. Reliable. Connected.
              </small>
            </div>

          </div>

        </div>


        <div className="ridex-hero-bottom">

          <span>
            SCROLL TO EXPLORE
          </span>

          <div className="ridex-scroll-line">
            <span />
          </div>

        </div>

      </section>


      {/* =====================================================
          TRUST BAR
      ===================================================== */}

      <section className="ridex-trust-bar">

        <div>
          <ShieldCheck size={20} />
          <span>Verified profiles</span>
        </div>

        <div>
          <Zap size={20} />
          <span>Fast ride discovery</span>
        </div>

        <div>
          <Users size={20} />
          <span>Community driven</span>
        </div>

        <div>
          <Wallet size={20} />
          <span>Transparent pricing</span>
        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        id="about"
        className="ridex-intro"
      >

        <div className="ridex-section-number">
          01 / INTRODUCTION
        </div>

        <div className="ridex-intro-grid">

          <h2>
            Mobility
            <br />
            <span>should feel</span>
            <br />
            effortless.
          </h2>

          <div className="ridex-intro-copy">

            <p className="ridex-large-copy">
              Ride<span>Share</span> connects Travelers and Riders
              through one simple experience designed
              around the way people actually travel.
            </p>

            <p>
              Whether you're heading across town,
              commuting to work, or sharing your everyday
              route, Ride<span>Share</span> makes the entire journey easier
              to discover, book, and manage.
            </p>

            <button
              className="ridex-text-btn"
              onClick={() => goTo("/register")}
            >
              Explore RideShare
              <ArrowUpRight size={17} />
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="ridex-how"
      >

        <div className="ridex-section-heading">

          <div className="ridex-section-number">
            02 / HOW IT WORKS
          </div>

          <h2>
            From search
            <br />
            to <span>seat.</span>
          </h2>

          <p>
            Everything you need for a smoother journey,
            without unnecessary steps.
          </p>

        </div>


        <div className="ridex-steps">

          <article className="ridex-step">

            <span>01</span>

            <div className="ridex-step-icon">
              <Users size={23} />
            </div>

            <h3>
              Find your ride
            </h3>

            <p>
              Search available rides by destination,
              date, and time.
            </p>

          </article>


          <article className="ridex-step ridex-step-featured">

            <span>02</span>

            <div className="ridex-step-icon">
              <Check size={23} />
            </div>

            <h3>
              Choose with confidence
            </h3>

            <p>
              Review ride details and rider information
              before making your decision.
            </p>

          </article>


          <article className="ridex-step">

            <span>03</span>

            <div className="ridex-step-icon">
              <ArrowRight size={23} />
            </div>

            <h3>
              Enjoy the journey
            </h3>

            <p>
              Book your seat and focus on getting
              where you need to go.
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          SAFETY
      ===================================================== */}

      <section
        id="safety"
        className="ridex-safety"
      >

        <div className="ridex-safety-image">

          <img
            src="https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=1800&q=90"
            alt="Motorcycle rider"
          />

        </div>

        <div className="ridex-safety-content">

          <div className="ridex-section-number">
            03 / SAFETY
          </div>

          <div className="ridex-eyebrow">
            TRUST COMES FIRST
          </div>

          <h2>
            Every journey
            <br />
            starts with
            <br />
            <span>confidence.</span>
          </h2>

          <p>
            Ride<span>Share</span> is designed around transparency.
            Know who you're riding with, understand
            the ride before booking, and stay in control
            throughout your journey.
          </p>

          <div className="ridex-safety-list">

            <div>
              <ShieldCheck />
              <span>
                Rider & Traveler profiles
              </span>
            </div>

            <div>
              <Check />
              <span>
                Clear ride information
              </span>
            </div>

            <div>
              <Users />
              <span>
                Community-first experience
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          DRIVER
      ===================================================== */}

      <section
        id="drivers"
        className="ridex-driver"
      >

        <div className="ridex-driver-content">

          <div className="ridex-section-number">
            04 / FOR RIDERS
          </div>

          <div className="ridex-eyebrow">
            YOUR ROUTE. YOUR OPPORTUNITY.
          </div>

          <h2>
            Already
            <br />
            going there?
            <br />
            <span>Take someone.</span>
          </h2>

          <p>
            Turn empty seats into value.
            Create rides, choose your schedule,
            and connect with passengers travelling
            in the same direction.
          </p>

          <button
            className="ridex-primary-btn"
            onClick={() => goTo("/register")}
          >
            Start driving
            <ArrowRight size={18} />
          </button>

        </div>


        <div className="ridex-driver-visual">

          <div className="ridex-driver-card">

            <div className="ridex-driver-card-top">
              <span>YOUR NEXT RIDE</span>
              <span>08:30 AM</span>
            </div>

            <div className="ridex-route">

              <div className="ridex-route-dot" />

              <div className="ridex-route-line" />

              <div className="ridex-route-dot" />

            </div>

            <div className="ridex-route-labels">

              <strong className="ridex-route-university">
                K L University
              </strong>

              <strong>
                Vijayawada
              </strong>

            </div>

            <div className="ridex-driver-card-bottom">

              <div>
                <small>Passengers</small>
                <strong>3 / 4</strong>
              </div>

              <div>
                <small>Estimated earnings</small>
                <strong>₹1,240</strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="ridex-stats">

        <div className="ridex-stat">

          <strong>
            7.4k<span>+</span>
          </strong>

          <p>
            journeys made
          </p>

        </div>

        <div className="ridex-stat">

          <strong>
            1.7k<span>+</span>
          </strong>

          <p>
            Riders
          </p>

        </div>

        <div className="ridex-stat">

          <strong>
            12<span>+</span>
          </strong>

          <p>
            cities
          </p>

        </div>

        <div className="ridex-stat">

          <strong>
            4.7<span>★</span>
          </strong>

          <p>
            community rating
          </p>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIAL
      ===================================================== */}

      <section className="ridex-testimonials">

        <div className="ridex-section-number">
          05 / THE COMMUNITY
        </div>

        <div className="ridex-testimonial-main">

          <div className="ridex-stars">

            {[1, 2, 3, 4, 5].map((item) => (
              <Star
                key={item}
                size={16}
                fill="currentColor"
              />
            ))}

          </div>

          <blockquote>
            “The best part of Ride<span>Share</span> is how
            simple everything feels. I can find
            a ride, understand the details,
            and book without wasting time.”
          </blockquote>

          <div className="ridex-testimonial-person">

            <div className="ridex-person-avatar">
              S
            </div>

            <div>
              <strong>
                Satish Teja
              </strong>

              <span>
                RideShare<br/> passenger
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="ridex-final">

        <div className="ridex-final-bg" />

        <div className="ridex-final-content">

          <div className="ridex-eyebrow ridex-eyebrow-light">
            YOUR NEXT JOURNEY STARTS HERE
          </div>

          <h2>
            Where are you
            <br />
            <span>going next?</span>
          </h2>

          <p>
            Find your ride. Share the road.
            Move forward.
          </p>

          <div className="ridex-final-actions">

            <button
              className="ridex-primary-btn"
              onClick={() => goTo("/passenger/rides")}
            >
              Find a ride
              <ArrowRight size={18} />
            </button>

            <button
              className="ridex-final-link"
              onClick={() => goTo("/register")}
            >
              Create an account
              <ArrowUpRight size={17} />
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="ridex-footer">

        <div className="ridex-footer-brand">

          <button
            className="ridex-brand ridex-footer-logo"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Ride<span>Share</span>
          </button>

          <p>
            Move people.
            <br />
            Move cities.
          </p>

        </div>


        <div className="ridex-footer-column">

          <strong>
            PRODUCT
          </strong>

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#safety">
            Safety
          </a>

          <a href="#drivers">
            Drive with us
          </a>

        </div>


        <div className="ridex-footer-column">

          <strong>
            ACCOUNT
          </strong>

          <button onClick={() => goTo("/login")}>
            Log in
          </button>

          <button onClick={() => goTo("/register")}>
            Create account
          </button>

        </div>


        <div className="ridex-footer-column">

          <strong>
            COMPANY
          </strong>

          <a href="#about">
            About Ride<span>Share</span>
          </a>

          <a href="#safety">
            Trust & safety
          </a>

        </div>


        <div className="ridex-footer-bottom">

          <span>
            © 2026 Ride<span>Share</span>. All rights reserved.
          </span>

          <span>
            Built for better journeys.
          </span>

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;