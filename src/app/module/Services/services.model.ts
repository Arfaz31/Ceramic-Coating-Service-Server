import { model, Schema } from 'mongoose';
import { IService } from './services.interface';

const ServiceSchema = new Schema<IService>(
  {
    serviceName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    durationNote: { type: String, required: true },
    features: { type: [String], required: true },
    serviceInludes: { type: [String], required: true },
    processSteps: { type: [String], required: true },
    beforeImage: { type: [String], required: true },
    afterImage: { type: [String], required: true },
    imageGallery: { type: [String], required: true },
    tags: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Service = model<IService>('Service', ServiceSchema);
