// redux imports
import { useGetFeaturedCampaignsQuery } from "../features/apiSlice";

// component imports
import CampaignCard from "../components/CampaignCard";

// icon imports
import { FaHandHoldingMedical } from "react-icons/fa6";
import { MdOutlineSportsTennis } from "react-icons/md";
import { IoMdSchool } from "react-icons/io";
import { GiEarthAsiaOceania } from "react-icons/gi";
import { PiAmbulanceFill } from "react-icons/pi";
import { PiDogFill } from "react-icons/pi";
import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";

function HomePage() {
  const { data, isLoading, isError } = useGetFeaturedCampaignsQuery();

  return (
    <div>
      {/* Hero Section */}
      <div
        id="imageBackground"
        className="flex h-screen w-full flex-col justify-between bg-[url('/community2.jpg')] bg-cover bg-center bg-no-repeat"
      >
        <div className="mx-auto mt-20">
          <h1 className="text-center text-4xl font-extrabold text-[#FFB347]">
            CrowdConnect
          </h1>
        </div>
        <div className="mb-36 text-center">
          <h1 className="mx-2 text-4xl font-extrabold text-[#FFB347]">
            Trusted by 10,000+ users worldwide
          </h1>
        </div>
      </div>

      {/* Featured Campaigns Section */}
      <div className="my-10 p-2">
        <div id="sampleCampaigns" className="rounded-md bg-[#76448A] p-6">
          <h1 className="flex h-28 items-center justify-center text-center text-4xl font-bold text-[#F4F4F4]">
            Featured Campaigns
          </h1>
          {isLoading ? (
            <div className="text-center text-[#F4F4F4]">Loading...</div>
          ) : isError ? (
            <div className="text-center text-red-500">Failed to load campaigns.</div>
          ) : data?.campaigns ? (
            <div className="md:flex md:flex-wrap md:justify-around">
              {data.campaigns.map((item) => (
                <CampaignCard
                  key={item._id}
                  campaignId={item._id}
                  title={item.title}
                  createdBy={item.createdBy}
                  description={item.description}
                  targetAmount={item.targetAmount}
                  deadline={item.deadline}
                  amountRaised={item.amountRaised}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-[#F4F4F4]">No campaigns to show</div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <section>
        <h1 className="my-10 text-center text-5xl text-[#FFB347]">Categories</h1>
        <div
          id="categoriesList"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          {[
            { to: "/category/medical", icon: <FaHandHoldingMedical />, label: "Medical" },
            { to: "/category/education", icon: <IoMdSchool />, label: "Education" },
            { to: "/category/sports", icon: <MdOutlineSportsTennis />, label: "Sports" },
            { to: "/category/environment", icon: <GiEarthAsiaOceania />, label: "Environment" },
            { to: "/category/emergency", icon: <PiAmbulanceFill />, label: "Emergency" },
            { to: "/category/animal", icon: <PiDogFill />, label: "Animal" },
          ].map((category, index) => (
            <Link
              key={index}
              to={category.to}
              className="m-4 flex items-center justify-center rounded bg-[#D9C2EB] px-10 py-4 text-2xl transition-all duration-300 hover:bg-[#448A76] hover:text-[#F4F4F4] hover:shadow-lg"
            >
              {category.icon}
              <p className="mr-10 flex h-36 w-32 items-center">{category.label}</p>
              <BsArrowRightShort />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
