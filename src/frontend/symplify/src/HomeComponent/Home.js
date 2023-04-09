import './Home.css';

function Home() {
  return (
    <div className="homepage">
      <header>
        <h1>Symplify</h1>
        <p>A modern and easy-to-use platform for chronic illness tracking.</p>
      </header>
      <main>
        <section>
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Log Symptoms</h3>
              <p>Track symptoms experienced by yourself and others to learn more about your illness.</p>
            </div>
            <div className="service-card">
              <h3>Discover Diagnoses</h3>
              <p>Find more information on chronic illnesses related to you.</p>
            </div>
            <div className="service-card">
              <h3>Connect With Others</h3>
              <p>Learn more others who share similar experiences.</p>
            </div>
          </div>
        </section>
        <section>
          <h2>About Us</h2>
          <p>Team007 - James Bond</p>
        </section>
      </main>
      <footer>
        <p>&copy; Symplify 2023 </p>
      </footer>
    </div>
  );
}

export default Home;