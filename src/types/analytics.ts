export interface AnalyticsConnection {
  id: string;
  propertyId: string;
  propertyName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GAProperty {
  id: string;
  name: string;
  displayName?: string;
}
