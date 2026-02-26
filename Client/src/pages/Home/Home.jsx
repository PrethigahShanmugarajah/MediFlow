// MediFlow / Client / src / pages / Home / Home.jsx
import Banner from "./Components/Banner";
import Certification from "./Components/Certification";
import HomeDoctors from "./Components/HomeDoctors";
import HomeServices from "./Components/HomeServices";
import Testimonial from "./Components/Testimonial";

const Home = () => {
  return (
    <div>
      <Banner />
      <Certification />
      <HomeDoctors />
      <HomeServices />
      <Testimonial />
    </div>
  );
};

export default Home;
