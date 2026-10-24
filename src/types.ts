export interface FlowerItem {
  id: string;
  name: string;
  symbolism: string;
  color: string;
  secondaryColor: string;
  icon: string;
  priceTag: string;
}

export interface BouquetOption {
  id: string;
  title: string;
  tagline: string;
  description: string;
  themeColor: string;
  ribbonColor: string;
  wrapperColor: string;
  flowers: {
    flowerId: string;
    count: number;
    name: string;
  }[];
  sentiment: string;
  imageHint: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isRedeemed?: boolean;
}

export interface MemoryReason {
  id: string;
  title: string;
  content: string;
  category: string;
  tag: string;
}

export interface UserPersonalization {
  herName: string;
  hisName: string;
  specialDate: string;
  personalCustomNote: string;
}
