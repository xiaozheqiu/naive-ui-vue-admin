<template>
  <div>
    <h2>注册</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button type="submit">注册</button>
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
    register() {
      if (this.username && this.password) {
        alert("注册成功！");
        this.$router.push("/login");
      } else {
        alert("请输入用户名和密码");
      }
    },
  },
};
</script>
