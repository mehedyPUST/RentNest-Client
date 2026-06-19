import Banner from "@/components/Banner";
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import FeaturedProperties from "@/components/FeaturedProperties";
import CustomerReviews from "@/components/CustomerReviews";

import RentalStatistics from "@/components/RentalStatistics";
import TopLocations from "@/components/TopLocations";

export default function Home() {
  return (
    <main>
      <Banner />
      <FeaturedProperties />
      <TopLocations />
      <CustomerReviews />
      <RentalStatistics />
      <HowItWorks />
      <WhyChooseUs />
    </main>
  );
}