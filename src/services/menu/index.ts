import http from "@/tools/axios";
import type { IMenu, IGetMenuParams } from "./type";

/**
 * 用户注册
 * @param data 注册信息
 * @returns Promise<RegisterResponse>
 */
export const getMenus = (data: IGetMenuParams) => {
  return http.get<IMenu[]>("/admin/menus", data);
};

/**
 * 创建菜单
 * @param data 菜单信息
 * @returns Promise<IMenu>
 */
export const createMenu = (data: IMenu) => {
  return http.post("/admin/menus", data);
};

/**
 * 更新菜单
 * @param data 菜单信息
 * @returns Promise<IMenu>
 */
export const updateMenu = (data: IMenu) => {
  return http.patch(`/admin/menus/${data.id}`, data);
};

export const getMyMenus = () => {
  return http.get<IMenu[]>("/admin/my-menus");
};

export const deleteMenus = (id: number) => {
  return http.delete(`/admin/menus/${id}`);
};
