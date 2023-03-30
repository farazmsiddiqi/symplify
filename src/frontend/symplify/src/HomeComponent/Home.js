import './Home.css';

function Home() {
  return (
    <div className="homepage">
      <header>
        <h1>Symplify</h1>
        <p>A modern and easy-to-use platform for all your healthcare needs.</p>
      </header>
      <main>
        <section>
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Virtual Consultations</h3>
              <p>Get access to medical professionals from the comfort of your own home.</p>
            </div>
            <div className="service-card">
              <h3>Health Tracking</h3>
              <p>Track your health and fitness goals with our easy-to-use platform.</p>
            </div>
            <div className="service-card">
              <h3>Prescription Refills</h3>
              <p>Refill your prescriptions online and have them delivered to your door.</p>
            </div>
          </div>
        </section>
        <section>
          <h2>About Us</h2>
          <p>We are a team of healthcare professionals dedicated to making healthcare more accessible and convenient for everyone.</p>
          <p>Our platform is designed to help you manage your health and wellness in one place, with features like virtual consultations, health tracking, and prescription refills.</p>
        </section>
      </main>
      <footer>
        <p>&copy; Symplify 2023</p>
      </footer>
    </div>
  );
}

export default Home;