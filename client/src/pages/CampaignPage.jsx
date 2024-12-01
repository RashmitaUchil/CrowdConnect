import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";


// redux imports
import { useSelector } from "react-redux";
import {
  useGetCampaignQuery,
} from "../features/apiSlice";

// zod and form imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// shadcn imports
import { useToast } from "@/hooks/use-toast";

function CampaignPage() {

  
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  // get campaign id from url
  const { id } = useParams();
  const { data: campaignData, isLoading } = useGetCampaignQuery(id); // fetch campaign data

  // zod schema definition
  const donationSchema = z.object({
    amount: z.coerce
      .number()
      .min(1, { message: "Amount is required" })
      .int({ message: "Amount should be an integer" })
      .positive({ message: "Amount should be positive" })
      .max(100000, { message: "Amount should not exceed 100000" }),
  });

  // react-hook-form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(donationSchema) });

  


  let progress =
    (campaignData?.campaign.amountRaised /
      campaignData?.campaign.targetAmount) *
    100;

  const formatAmount = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // shadcn toast hook
  const { toast } = useToast();

  // if user not logged in then prompt user to login
  const handleLoginPrompt = () => {
    toast({
      description: "You have to login first before making a donation",
    });

    navigate("/login");
  };



  
  

  const handlePayments = async (data) => {
    try {
      const response = await fetch('http://localhost:5050/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          product_id : campaignData.campaign._id,
          username : user.name,
          user_id : user._id
        }),
      });
  
      const session = await response.json();
  
      if (response.ok && session.url) {
        window.location.href = session.url; // Redirect to Stripe checkout page
      } else {
        console.error('Failed to create checkout session:', session);
      }
    } catch (error) {
      console.error('Error during payment processing:', error);
    }
  };
  
  

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div className="flex flex-grow items-center justify-center bg-[#E9F1E4]">
        <div className="mx-4 my-4 flex flex-col rounded bg-white p-8 shadow-lg md:mx-auto md:mt-10 md:w-1/2">
          <div id="title" className="text-2xl font-bold text-[#386641]">
            {campaignData.campaign.title}
          </div>
          <div id="creatorDetails" className="mt-4 flex items-center">
            <div id="profilePic">
              {campaignData.campaign.createdBy.profilePic ? (
                <div className="size-10 rounded-full">
                  <img
                    src={`http://localhost:5050/api/user/dp/${campaignData.campaign.createdBy.profilePic}`}
                    className="size-10 rounded-full"
                  />
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="box-content size-6 rounded-full p-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </div>
            <div id="creatorName" className="ml-10 flex-grow font-medium">
              {campaignData.campaign.createdBy.name}
            </div>
            <div>
              {formatDistanceToNow(campaignData.campaign.deadline, {
                addSuffix: true,
              })}
            </div>
          </div>
          <div
            id="description"
            className="prose my-4 whitespace-pre-wrap text-justify"
          >
            {campaignData.campaign.description}
          </div>
          <div id="info" className="flex">
            <div id="targetDetails">
              <p>
                Amount Raised:{" "}
                {formatAmount(campaignData.campaign.amountRaised)}
              </p>
            </div>
            <div className="flex flex-grow justify-end text-right">
              <p>
                Target Amount:{" "}
                {formatAmount(campaignData.campaign.targetAmount)}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handlePayments)}
            id="donationSection"
            className="my-4 flex"
          >
            <div className="flex-grow">
              <input
                {...register("amount")}
                type="number"
                placeholder="Enter donation amount"
                className="w-full rounded border-none bg-gray-200"
              />
            </div>
            <div className="ml-4 flex justify-end" id="donateButton">
              {user ? (
                <button
                  type="submit"
                  className="rounded-full bg-[#A7C957]/95 px-6 py-2 font-medium transition-all duration-300 hover:bg-[#A7C957] hover:shadow-md hover:shadow-[#386641]"
                >
                  Donate
                </button>
              ) : (
                <button
                  onClick={handleLoginPrompt}
                  className="rounded-full bg-[#A7C957]/95 px-6 py-2 font-medium transition-all duration-300 hover:bg-[#A7C957] hover:shadow-md hover:shadow-[#386641]"
                >
                  Donate
                </button>
              )}
            </div>
          </form>
          {errors.amount && (
            <p className="text-red-500">{errors.amount.message}</p>
          )}
          <div id="progressBar" className="my-4 py-2">
            <div className="h-4 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#A7C957] transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
              <p className="mt-2 text-sm text-gray-600">
                {progress.toFixed(1)}% of goal reached
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CampaignPage;
