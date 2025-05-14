import http from "@/tools/axios";
import type { IMenu, IGetMenuParams } from "./type";

/**
 * 用户注册
 * @param data 注册信息
 * @returns Promise<RegisterResponse>
 */
export const getMenus = (data: IGetMenuParams) => {
  return http.get<{ list: IMenu[], total: number }>("/admin/menus", data);
};

export const getMyMenus = () => {
  return http.get<IMenu[]>("/admin/my-menus");
}