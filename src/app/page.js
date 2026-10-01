import Footer from "@/components/Footer";
import Landingpage from "@/components/Landingpage";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";


export default function Home() {
  return (
    <div className="bg-accent overflow-x-hidden">
      <Navbar />
      <Landingpage image={"./main.jpg"} />
      <Stats />
      <Footer />
    </div>
  );
}
