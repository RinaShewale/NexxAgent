import PageTransition from "../components/Home/Loading/PageTransition";
import Navbar from "../components/Home/components/Navbar";

const MainLayout = () => {
  return (
    <div className="bg-[#FFF2E0] min-h-screen">
      {/* Navbar stays on top normally, but Transition SVG (z-9999) will cover it */}
      <Navbar />
      
      {/* 
        PageTransition renders the <Outlet /> content 
        and handles the animation logic 
      */}
      <PageTransition />
    </div>
  );
};

export default MainLayout;