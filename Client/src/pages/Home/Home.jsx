// MediFlow / Client / src / pages / Home / Home.jsx
import Banner from "../../components/Banner/Banner";
import Certification from "../../components/Certification/Certification";
import HomeDoctors from "../../components/HomeDoctors/HomeDoctors";
import Testimonial from "../../components/Testimonial/Testimonial";

const Home = () => {
  return (
    <div>
      <Banner />
      <Certification />
      <HomeDoctors />
      <Testimonial />
    </div>
  );
};

export default Home;
