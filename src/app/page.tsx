import Slider from "@/components/Slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureHighlights from '@/components/FeatureHighlights';
export default function Home() {
  return (
    <>
      <Navbar />
      <Slider />
      <FeatureHighlights/>
      <Footer />
    </>
  );
}
