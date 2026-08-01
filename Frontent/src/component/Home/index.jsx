import HomeSlider from "./HomeSlider";
import SomeCards from "./HomeSomeCards";
import './home.css'
export function Home({}) {
  return (
    <>
      <HomeSlider />
      <section className="home-section">
        <SomeCards />
      </section>
    </>
  );
}