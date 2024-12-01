const Donation = require("../models/donation.model");
const Campaign = require("../models/campaign.model");


const createDonation = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  try {
    const { campaignId, donationAmount, orderId, paymentId,username,user_id } = req.body;

    const savedDonation = await Donation.create({
      donorName: username,
      donorId: user_id,
      campaignId: campaignId,
      donationAmount: donationAmount,
      orderId: orderId,
      paymentId: paymentId,
    });
    const donationID = savedDonation._id

    const amount = Number(donationAmount);

    await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { amountRaised: amount }, $push: { donations: donationID } },
      { new: true }
    );


    if (!savedDonation) {
      console.log("Some error occured and the document could not be created");
      return res
        .status(500)
        .json({ serverMsg: "Donation could not be created" });
    }
    console.log("Document created successfully");
    return res.status(201).json({
      serverMsg: "Document created successfully",
      savedDonation,
    });
  } catch (error) {
    console.log("Error in addDonation() in donation.controller.js file");
    console.error(error);
    return res.status(500).json({ serverMsg: "Internal server error" });
  }
};

const getUserDonation = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  console.log("Started getUserDonation() in donation.controller.js file");
  try {
    const userId = req.user._id;

    // Find all donations made by the user
    const userDonations = await Donation.find({ donorId: userId });

    // Extract unique campaign IDs
    const uniqueCampaignIds = [
      ...new Set(userDonations.map((donation) => donation.campaignId)),
    ];

    // Fetch campaign details for the unique IDs
    const campaigns = await Campaign.find({
      _id: { $in: uniqueCampaignIds },
    }).populate("createdBy", "-password");

    if (campaigns.length === 0) {
      console.log("No donations found for this user");
      return res
        .status(404)
        .json({ serverMsg: "No donations found for this user" });
    }
    console.log("Campaigns found, sending response");
    return res.status(200).json({ campaigns: campaigns });
  } catch (error) {
    console.log("Error in getUserDonation() in donation.controller.js file");
    console.error(error);
    return res.status(500).json({ serverMsg: "Internal server error" });
  }
};

module.exports = { createDonation, getUserDonation };
