export interface IMenu {
  id?: number;
  name?: string;
  icon?: string;
  order?: number;
  permission?: string;
  status?: number; // 1 for enabled, 0 for disabled
  createdAt?: string;
  path?: string;
  parentId?: number;
  orderNo?: number;
  children?: IMenu[];
  type?: "directory" | "menu" | "button"; // 0 for directory, 1 for menu, 2 for button
  show?: boolean;
}

export interface IGetMenuParams {
  page?: number;
  pageSize?: number;
  menuName?: string;
  status?: number;
}
