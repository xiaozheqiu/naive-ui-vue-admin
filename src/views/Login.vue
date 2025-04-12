<template>
  <div>
    <h2>登录</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.username && this.password) {
        // 模拟登录逻辑
        localStorage.setItem("token", "fake-token");
        this.$router.push("/overview");
      } else {
        alert("请输入用户名和密码");
      }
    },
  },
};
</script>
