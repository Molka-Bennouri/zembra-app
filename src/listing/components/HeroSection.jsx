import './HeroSection.css';

const HeroSection = ({ badge, title, description, icon }) => {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <span className="badge-icon">
          <i className={icon}></i>
        </span>
        <span className="badge-text">{badge}</span>
      </div>

      <h1 className="hero-title">{title}</h1>

      <p className="hero-description">
        {description}
      </p>
    </section>
  );
};

export default HeroSection;