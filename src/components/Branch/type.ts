interface Nearest {
  items: NearestItem[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}

interface NearestItem {
  id: number;
  address: string;
}

interface NearestProps {
  longitude: number;
  latitude: number;
  offset: number;
  limit: number;
}

interface DetailBranch {
  id: number;
  closingHour: string;
  openingHour: string;
  phone: string;
  status: string;
  streetAddress: string;
  ward: string;
  district: string;
  province: string;
  latitude: 0;
  longitude: 0;
}
