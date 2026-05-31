import './HeroSection.css';

const HeroSection = ({ title, description }) => {
  return (
    <section className="hero-section">
      <h1 className="hero-title">{title}</h1>

      <p className="hero-description">
        {description}
      </p>
    </section>
  );
};

export default HeroSection;