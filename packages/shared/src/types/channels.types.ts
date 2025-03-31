export interface ChannelType {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
