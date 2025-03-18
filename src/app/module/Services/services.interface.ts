export interface IService {
  id?: string;
  serviceName: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: string;
  durationNote: string;
  features: string[];
  serviceInludes: string[];
  processSteps: string[];
  beforeImage: string[];
  afterImage: string[];
  imageGallery: string[];
  tags?: string[];
  isDeleted: boolean;
}
