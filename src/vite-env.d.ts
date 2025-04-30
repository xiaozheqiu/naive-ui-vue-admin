/// <reference types="vite/client" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const vueComponent: DefineComponent<{}, {}, any>;

  export default vueComponent;
}

// 扩展 Window 接口
declare global {
  interface Window {
    $message: import('naive-ui').MessageApiInjection;
    // 如果需要挂载其他 discrete API，也可以在这里添加
    // $notification: import('naive-ui').NotificationApiInjection;
    // $dialog: import('naive-ui').DialogApiInjection;
    // $loadingBar: import('naive-ui').LoadingBarApiInjection;
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
