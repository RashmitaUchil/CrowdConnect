const Campaign = require("../models/campaign.model");

const createCampaign = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  console.log("Started createCampaign func");
  try {
    const { title, description, targetAmount, deadline, createdBy } = req.body;
    console.log("About to create new campaign");
    Campaign.create({
      createdBy,
      title,
      description,
      targetAmount,
      deadline,
    }).then((doc) => {
      if (doc) {
        console.log("Created new campaign. Campaign details:");
        console.log(doc);
        res.json({
          success: true,
          serverMsg: "Successfully created a new campaign",
        });
        console.log("Response sent");
      } else {
        console.log("Document creation did not go as planned");
        console.log(doc);
        res.json({
          success: false,
          serverMsg: "Document creation did not go as planned",
        });
      }
    });
  } catch (error) {
    console.log(
      "Something went wrong in createCampaign func in campaign.controller.js file"
    );
    console.log("Error: ", error);
    res.json({
      success: false,
      serverMsg: "Internal server error occured",
      error,
    });
  }
};

const getAllCampaigns = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  console.log("Started getAllCampaigns func");
  try {
    console.log("Going to find all campaigns from DB");
    const campaigns = await Campaign.find().populate("createdBy", "-password");

    if (campaigns) {
      if (campaigns.length === 0) {
        console.log("No campaigns exist in database");
        res.json({
          success: false,
          serverMsg: "No campaigns exist in database",
        });
        console.log("Response sent");
      } else {
        console.log("Campaigns found; going to send them through response");
        res.json({ success: true, serverMsg: "Campaigns found", campaigns });
        console.log("Response sent");
      }
    }
  } catch (error) {
    console.log(
      "Something went wrong in getAllCampaigns func in campaign.controller.js file"
    );
    console.log("Error :", error);
    res.json({ success: false, serverMsg: "Internal server error occured" });
  }
};

const getCampaignDetails = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  console.log("Started getCampaignDetails func in campaign.controller.js file");
  try {
    const { campaignId } = req.body;
    console.log("Captured id: ", campaignId);
    console.log("Searching for campaign");
    const campaign = await Campaign.findById(campaignId).populate(
      "createdBy",
      "-password"
    );

    if (!campaign) {
      console.log("No campaign found for the given id; sending false response");
      res.json({
        success: false,
        serverMsg: "Couldn't fetch campaign from database",
      });
    } else {
      console.log("Campaign found; sending campaign details via response");
      res.json({ success: true, serverMsg: "Campaign found", campaign });
    }
  } catch (error) {
    console.log("Some error occured in getCampaignDetails func.");
    console.log(error);
    res.json({ success: false, serverMsg: "Internal server error" });
  }
};

const addDonation = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  console.log("Started addDonation func in campaign.controller.js file");
  const { donatedBy, campaignId } = req.body;
  const amount = Number(req.body.amount);
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { amountRaised: amount } },
      { new: true }
    );

    if (!updatedCampaign) {
      console.log("Couldnt find campaign from given campaign ID");
      res.json({
        success: false,
        serverMsg: "Failed to update campaign from given CampaignID",
      });
    } else {
      res.json({ success: true, serverMsg: "Campaign updated successfully" });
    }
  } catch (error) {
    console.log(
      "Some error happeend in addDonation func in campaign.controller.js file"
    );
    console.log(error);
    res.json({ success: false, serverMsg: "Internal server error" });
  }
};

const getLoggedInUserCampaigns = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  console.log(
    "Started getLoggedInUserCampaigns func in campaign.controller.js file"
  );
  try {
    console.log("Searching for campaigns");
    const myCampaigns = await Campaign.find({
      createdBy: req.authenticatedUser._id,
    }).populate("createdBy", "-password");

    if (!myCampaigns) {
      console.log("No campaigns found for the query");
      res.json({ success: false, serverMsg: "No campaigns found" });
    } else {
      console.log("Campaigns found; sending success response");
      res.json({ success: true, serverMsg: "Campaigns found", myCampaigns });
    }
  } catch (error) {
    console.log(
      "Some error occured in getLoggedInUserCampaigns in campaign.controller.js file"
    );
    console.error(error);
    res.json({ success: false, serverMsg: "Internal server error" });
  }
};

const deleteOne = async (req, res) => {
  console.log("- - - - - - - - - - - - - - - ");
  console.log("Started deleteOne func in campaign.controller.js file");
  try {
    const { campaignId } = req.body;
    console.log("CampaignID: ", campaignId);
    const result = await Campaign.findByIdAndDelete(campaignId);
    console.log(result);
    if (!result) {
      console.log("Failed to delete document from MongoDB");
      res.json({
        success: false,
        serverMsg: "Failed to delete document from MongoDB",
      });
    } else {
      console.log("Successfully deleted document from MongoDB");
      res.json({
        success: true,
        serverMsg: "Successfully deleted document from MongoDB",
      });
    }
  } catch (error) {
    console.log(
      "Some error occured in deleteOne func in campaign.controller.js file"
    );
    console.error(error);
    res.json({ success: false, serverMsg: "Internal server error" });
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignDetails,
  addDonation,
  getLoggedInUserCampaigns,
  deleteOne,
};
