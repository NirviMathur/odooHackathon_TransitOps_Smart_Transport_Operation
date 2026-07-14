import React from "react";
import { Link } from "react-router-dom";
import {
  Truck, Ship, TrainFront, MapPin, Wrench, BarChart3, Users, Package,
  CheckCircle2, Phone, Fuel, ShieldCheck, ArrowRight, Facebook, Instagram, Twitter,
} from "lucide-react";

const STATS = [
  { icon: Truck, value: "50k+", label: "Trips dispatched" },
  { icon: Package, value: "256", label: "Vehicles managed" },
  { icon: MapPin, value: "25+", label: "Regions covered" },
  { icon: Users, value: "120+", label: "Drivers onboarded" },
];

const SERVICES = [
  {
    icon: Truck,
    tag: "Dispatch",
    title: "Trip & dispatch management",
    desc: "Create trips, assign available vehicles and drivers, and track every delivery from draft to completion.",
  },
  {
    icon: Wrench,
    tag: "Uptime",
    title: "Maintenance tracking",
    desc: "Log service records automatically, pull vehicles out of rotation, and bring them back the moment they're roadworthy.",
  },
  {
    icon: BarChart3,
    tag: "Insight",
    title: "Fleet analytics",
    desc: "Fuel efficiency, operational cost, and ROI per vehicle — exportable, filterable, and always current.",
  },
];

const FEATURES = [
  "Real-time vehicle & driver status",
  "Cargo weight and capacity checks",
  "License expiry safeguards",
  "Automatic status transitions",
];

export default function Landing() {
  return (
    <div className="lp-root">
      <style>{`
        .lp-root { font-family: 'Inter', system-ui, sans-serif; color: #0F2E35; background: #fff; }
        .lp-root * { box-sizing: border-box; }
        .lp-topstrip { background: #0B2A30; color: #B9CDD1; font-size: 12.5px; padding: 8px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .lp-topstrip a { color: #F4762B; text-decoration: none; }
        .lp-topstrip .social { display: flex; gap: 12px; }
        .lp-nav { background: #fff; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #EDEFF0; flex-wrap: wrap; gap: 12px; }
        .lp-logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; color: #0F2E35; display: flex; align-items: center; gap: 6px; }
        .lp-logo span { color: #F4762B; }
        .lp-navlinks { display: flex; gap: 28px; font-size: 14.5px; font-weight: 600; color: #435459; }
        .lp-navlinks a { color: inherit; text-decoration: none; }
        .lp-navlinks a.active { color: #F4762B; }
        .lp-cta-btn { background: #0F2E35; color: #fff; border: none; padding: 12px 22px; border-radius: 3px; font-weight: 700; font-size: 13px; letter-spacing: 0.3px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .lp-cta-btn.orange { background: #F4762B; }
        .lp-hero { position: relative; background: linear-gradient(120deg, #0F2E35 0%, #123f47 60%, #16535d 100%); color: #fff; padding: 90px 32px 130px; overflow: hidden; }
        .lp-hero::after { content: ""; position: absolute; right: -60px; bottom: -80px; width: 340px; height: 340px; border-radius: 50%; background: rgba(244,118,43,0.12); }
        .lp-hero-inner { max-width: 720px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .lp-eyebrow { display: inline-block; background: rgba(244,118,43,0.15); color: #F4A15E; border: 1px solid rgba(244,118,43,0.35); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.4px; margin-bottom: 20px; }
        .lp-hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; line-height: 1.2; margin: 0 0 18px; font-weight: 700; }
        .lp-hero h1 span { color: #F4762B; }
        .lp-hero p { color: #C7D8DB; font-size: 15.5px; line-height: 1.7; max-width: 520px; margin: 0 auto 30px; }
        .lp-hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .lp-hero-icons { display: flex; justify-content: center; gap: 18px; margin-top: 56px; position: relative; z-index: 1; }
        .lp-hicon { width: 64px; height: 64px; border-radius: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; color: #F4A15E; }
        .lp-strip { background: #F6F9FA; padding: 26px 32px; display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; font-size: 13px; font-weight: 700; color: #8A9BA0; letter-spacing: 0.4px; }
        .lp-about { padding: 90px 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; max-width: 1120px; margin: 0 auto; align-items: center; }
        .lp-tag { display: inline-block; background: #FDECE1; color: #D9591A; font-size: 11.5px; font-weight: 700; letter-spacing: 0.5px; padding: 5px 12px; border-radius: 4px; margin-bottom: 14px; }
        .lp-about h2 { font-family: 'Space Grotesk', sans-serif; font-size: 30px; margin: 0 0 16px; color: #0F2E35; line-height: 1.25; }
        .lp-about p { color: #62757A; font-size: 14.5px; line-height: 1.75; margin-bottom: 22px; }
        .lp-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-bottom: 26px; }
        .lp-feature-grid div { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; color: #2B4247; }
        .lp-feature-grid svg { color: #F4762B; flex-shrink: 0; }
        .lp-about-visual { position: relative; background: #F6F9FA; border-radius: 16px; padding: 32px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .lp-vcard { background: #fff; border: 1px solid #E8ECED; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
        .lp-vcard svg { color: #F4762B; }
        .lp-vcard b { font-size: 22px; font-family: 'Space Grotesk', sans-serif; color: #0F2E35; }
        .lp-vcard span { font-size: 11.5px; color: #8A9BA0; font-weight: 600; }
        .lp-vcard.dark { background: #0F2E35; color: #fff; }
        .lp-vcard.dark svg { color: #F4A15E; }
        .lp-vcard.dark span { color: #9DB3B7; }
        .lp-vcard.dark b { color: #fff; }
        .lp-stats { background: #0F2E35; padding: 56px 32px; }
        .lp-stats-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
        .lp-stat { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 14px; }
        .lp-stat-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(244,118,43,0.15); display: flex; align-items: center; justify-content: center; color: #F4762B; flex-shrink: 0; }
        .lp-stat b { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 22px; color: #fff; }
        .lp-stat span { font-size: 12px; color: #9DB3B7; }
        .lp-services { padding: 90px 32px; background: #F6F9FA; text-align: center; }
        .lp-services h2 { font-family: 'Space Grotesk', sans-serif; font-size: 30px; margin: 10px 0 14px; color: #0F2E35; }
        .lp-services > p { color: #62757A; font-size: 14.5px; max-width: 480px; margin: 0 auto 44px; }
        .lp-svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; max-width: 1080px; margin: 0 auto; }
        .lp-svc-card { background: #fff; border-radius: 14px; padding: 28px 24px; text-align: left; border: 1px solid #E8ECED; }
        .lp-svc-iconwrap { width: 52px; height: 52px; border-radius: 12px; background: #0F2E35; display: flex; align-items: center; justify-content: center; color: #F4A15E; margin-bottom: 18px; }
        .lp-svc-tag { font-size: 11px; font-weight: 700; color: #F4762B; letter-spacing: 0.4px; margin-bottom: 6px; }
        .lp-svc-card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 17px; margin: 0 0 10px; color: #0F2E35; }
        .lp-svc-card p { font-size: 13.5px; color: #62757A; line-height: 1.65; margin: 0 0 16px; }
        .lp-svc-link { font-size: 13px; font-weight: 700; color: #0F2E35; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
        .lp-cta-band { background: linear-gradient(120deg,#F4762B,#e0641c); color: #fff; padding: 56px 32px; text-align: center; }
        .lp-cta-band h2 { font-family: 'Space Grotesk', sans-serif; font-size: 26px; margin: 0 0 10px; }
        .lp-cta-band p { font-size: 14px; opacity: 0.9; margin: 0 0 24px; }
        .lp-footer { background: #0B2A30; color: #9DB3B7; padding: 28px 32px; text-align: center; font-size: 12.5px; }
        @media (max-width: 860px) {
          .lp-about { grid-template-columns: 1fr; }
          .lp-svc-grid { grid-template-columns: 1fr; }
          .lp-navlinks { display: none; }
        }
      `}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;600;700&display=swap" />

      <div className="lp-topstrip">
        <span>Support hours: Mon–Fri, 8am–7pm · <a href="#contact">Contact ops desk</a></span>
        <div className="social"><Facebook size={14} /><Instagram size={14} /><Twitter size={14} /></div>
      </div>

      <nav className="lp-nav">
        <div className="lp-logo">Transit<span>Ops</span></div>
        <div className="lp-navlinks">
          <a href="#home" className="active">Home</a>
          <a href="#services">Services</a>
          <a href="#fleet">Fleet</a>
          <a href="#contact">Contact</a>
        </div>
        <Link to="/login" className="lp-cta-btn orange">Log in <ArrowRight size={15} /></Link>
      </nav>

      <header className="lp-hero" id="home">
        <div className="lp-hero-inner">
          <span className="lp-eyebrow">TransitOps operations platform</span>
          <h1>Run your fleet <span>without the spreadsheets</span></h1>
          <p>
            Vehicles, drivers, dispatch, maintenance, and cost tracking in one place —
            with the business rules enforced automatically, every time.
          </p>
          <div className="lp-hero-actions">
            <Link to="/login" className="lp-cta-btn orange">Get started <ArrowRight size={15} /></Link>
            <a href="#services" className="lp-cta-btn" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>Explore features</a>
          </div>
          <div className="lp-hero-icons">
            <div className="lp-hicon"><Truck size={26} /></div>
            <div className="lp-hicon"><Ship size={26} /></div>
            <div className="lp-hicon"><TrainFront size={26} /></div>
            <div className="lp-hicon"><Fuel size={26} /></div>
          </div>
        </div>
      </header>

      <div className="lp-strip">
        <span>VEHICLE REGISTRY</span><span>DRIVER COMPLIANCE</span><span>TRIP DISPATCH</span><span>MAINTENANCE LOG</span><span>COST REPORTS</span>
      </div>

      <section className="lp-about" id="fleet">
        <div>
          <span className="lp-tag">ABOUT TRANSITOPS</span>
          <h2>We'll keep your fleet moving, on time and on budget</h2>
          <p>
            TransitOps replaces manual logbooks with a live operations view. Every dispatch checks
            cargo weight against capacity, every license gets verified before assignment, and every
            maintenance job pulls the vehicle out of rotation until it's ready.
          </p>
          <div className="lp-feature-grid">
            {FEATURES.map((f) => (
              <div key={f}><CheckCircle2 size={16} />{f}</div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link to="/login" className="lp-cta-btn">Contact ops <CheckCircle2 size={15} /></Link>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#0F2E35" }}>
              <Phone size={16} color="#F4762B" /> +91 XXXXXXXXXXX
            </div>
          </div>
        </div>
        <div className="lp-about-visual">
          <div className="lp-vcard dark"><ShieldCheck size={22} /><b>100%</b><span>Compliance checked dispatch</span></div>
          <div className="lp-vcard"><BarChart3 size={22} /><b>Live</b><span>Fleet utilization</span></div>
          <div className="lp-vcard"><Wrench size={22} /><b>Auto</b><span>Maintenance status sync</span></div>
          <div className="lp-vcard"><Fuel size={22} /><b>Tracked</b><span>Fuel & cost per vehicle</span></div>
        </div>
      </section>

      <section className="lp-stats">
        <div className="lp-stats-inner">
          {STATS.map((s) => (
            <div className="lp-stat" key={s.label}>
              <div className="lp-stat-icon"><s.icon size={20} /></div>
              <div><b>{s.value}</b><span>{s.label}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-services" id="services">
        <span className="lp-tag">OUR SERVICES</span>
        <h2>Everything operations needs, in one console</h2>
        <p>From registering a vehicle to closing out a maintenance job — the whole lifecycle lives in one platform.</p>
        <div className="lp-svc-grid">
          {SERVICES.map((s) => (
            <div className="lp-svc-card" key={s.title}>
              <div className="lp-svc-iconwrap"><s.icon size={24} /></div>
              <div className="lp-svc-tag">{s.tag}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <Link to="/login" className="lp-svc-link">Open module <ArrowRight size={14} /></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-cta-band" id="contact">
        <h2>Ready to see your fleet in one place?</h2>
        <p>Log in with a demo role and try the dispatch, maintenance, and reporting flows.</p>
        <Link to="/login" className="lp-cta-btn" style={{ background: "#0F2E35" }}>Log in to TransitOps <ArrowRight size={15} /></Link>
      </section>

      <footer className="lp-footer">© {new Date().getFullYear()} TransitOps — Smart Transport Operations Platform</footer>
    </div>
  );
}
