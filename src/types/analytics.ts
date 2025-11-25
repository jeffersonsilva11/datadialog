export interface AnalyticsConnection {
  id: string;
  propertyId: string;
  propertyName?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GAProperty {
  id: string;
  name: string;
  displayName?: string;
}
