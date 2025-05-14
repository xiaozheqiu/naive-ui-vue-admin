export interface IMenu {
  id: number;
  name: string;
  icon: string;
  order: number;
  permission: string;
  component: string;
  status: number; // 1 for enabled, 0 for disabled
  createdAt?: string;
  children?: IMenu[];
}

export interface IGetMenuParams {
  page?: number;
  pageSize?: number;
  menuName?: string;
  status?: number;
}
