const express = require("express");
const campaignRouter = express.Router();

const authenticate = require("../middlewares/authentication.middleware");
const {
  createCampaign,
  getAllCampaigns,
  getCampaignDetails,
  addDonation,
  getUserCampaigns,
  deleteOne,
  getAllCampaignsInCategory,
  getFeaturedCampaigns,
} = require("../controllers/campaign.controller");

campaignRouter.post("/create", authenticate, createCampaign);
campaignRouter.get("/get-all-campaigns", getAllCampaigns);
campaignRouter.get("/featured-campaigns", getFeaturedCampaigns);
campaignRouter.get("/single/:campaignId", getCampaignDetails);
campaignRouter.post("/add-donation", authenticate, addDonation);
campaignRouter.get("/user-campaigns", authenticate, getUserCampaigns);
campaignRouter.delete("/delete/:campaignId", authenticate, deleteOne);
campaignRouter.get("/category/:category", getAllCampaignsInCategory);

module.exports = campaignRouter;