/**
 * Core Schema for the Dynamic Portfolio System.
 * This represents the "Chameleon" strategy: data structured to be 
 * reconfigured instantly by the AI based on client intent.
 */

import { Schema, model } from 'mongoose';

const AssetSchema = new Schema({
  originalUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  aiGeneratedTags: [String],
  embeddingVector: [Number], // For semantic search
  metadata: {
    style: String,
    softwareUsed: [String],
    hoursSpent: Number,
    licenseType: String
  }
});

const PortfolioSchema = new Schema({
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', index: true },
  baseSettings: {
    name: String,
    bio: String,
    socials: [String]
  },
  assets: [AssetSchema],
  automationRules: {
    autoWatermark: { type: Boolean, default: true },
    allowAiInquiry: { type: Boolean, default: true }
  },
  dynamicViews: [{
    clientIndustry: String,
    selectedAssetIds: [Schema.Types.ObjectId],
    customTheme: String,
    viewCount: Number
  }]
});

export const Portfolio = model('Portfolio', PortfolioSchema);