<!-- Login.vue -->
<template>
  <div class="auth-container">
    <!-- 登录表单 -->
    <div class="form-container" v-if="isLoginForm">
      <h2 class="form-title">登录</h2>
      <input
        type="text"
        placeholder="用户名"
        class="input"
        v-model="formData.username"
      />
      <input
        type="password"
        placeholder="密码"
        class="input"
        v-model="formData.password"
      />
      <button class="btn" @click="handleLogin">登录</button>
    </div>

    <!-- 注册表单 -->
    <div class="form-container" v-else>
      <h2 class="form-title">注册</h2>
      <input
        type="text"
        placeholder="用户名"
        class="input"
        v-model="formData.username"
      />
      <input
        type="password"
        placeholder="密码"
        class="input"
        v-model="formData.password"
      />
      <input type="email" placeholder="邮箱" class="input" v-model="formData.email" />
      <div class="email-code-container">
          <input type="text" placeholder="邮箱验证码" class="input" v-model="formData.emailCode" />
          <button
            class="btn small-btn"
            :disabled="isCodeButtonDisabled"
            @click="getEmailCode"
            >
            {{ emailButtonText }}
          </button>

        </div>


      <button class="btn" @click="handleRegister">注册</button>
    </div>

    <p class="toggle-text" @click="isLoginForm = !isLoginForm">
      {{ isLoginForm ? '没有账号？点击注册' : '已有账号？点击登录' }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../store/userStore'; // 引入 Pinia store
import axios from 'axios';
import { useRouter } from 'vue-router'; // 导入路由

const router = useRouter(); // 获取 router 实例
const userStore = useUserStore(); // 获取 Pinia store 实例

const isLoginForm = ref(false); // 切换登录和注册表单状态
const formData = ref({
  username: '',
  password: '',
  email: '',
  emailCode: '',
});

// 页面加载时从 localStorage 获取用户信息
onMounted(() => {
  userStore.loadUserFromLocalStorage();
});

const isCodeButtonDisabled = ref(false);
const emailButtonText = ref('获取验证码');
let timerId = null;  


// 定义验证邮箱格式的函数
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// 定义验证验证码格式的函数
const isValidCode = (code) => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
};


// 邮箱验证码
const getEmailCode = async () => {
  if (!formData.value.email) {
    alert('请输入邮箱！');
    return;
  }
  if (timerId) return; // 防止重复触发
  
  try {
    const response = await axios.get('http://localhost:8080/api/email/send-code', {
      params: { email: formData.value.email },
    });
    console.log(response)
    if (response.data=== '验证码已发送，请检查您的邮箱。') {
      alert(`验证码已发送到邮箱：${formData.value.email}`);
    } else {
      alert('验证码发送失败，请重试1111');
    }
  } catch (error) {
    console.error(error);
    alert('请求失败，请稍后再试！');
  }
  
  // 控制按钮倒计时
  isCodeButtonDisabled.value = true;
  let countdown = 30;
  emailButtonText.value = `${countdown}秒后获取`;

  const timer = setInterval(() => {
    countdown--;
    emailButtonText.value = `${countdown}秒后获取`;

    if (countdown === 0) {
      clearInterval(timer);
      emailButtonText.value = '获取验证码';
      isCodeButtonDisabled.value = false;
    }
  }, 1000);
};


// 登录处理逻辑
const handleLogin = async () => {
  if (!formData.value.username || !formData.value.password) {
    alert('请填写用户名和密码');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/api/user/login', {
      username: formData.value.username,
      password: formData.value.password,
    });

    if (response.data && response.data.userId) { 
      console.log(response)
      // 登录成功，存储登录状态
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', formData.value.username);
      // 登录成功后，保存用户信息到 LocalStorage
      localStorage.setItem('userId', response.data.userId);

      // 登录成功后，将用户信息保存到 userStore
      userStore.setUser({
        userId: response.data.userId,
        username: formData.value.username,
        token: response.data.token, // 假设后端返回了 token
      });

      alert('登录成功！');

      router.push('/index'); // 登录成功后跳转到主页
    } else {
      alert('用户名或密码错误！');
    }
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请稍后再试！');
  }
};


// 注册处理逻辑（根据实际 API 修改）
const handleRegister = async () => {
  if (
    !formData.value.username ||
    !formData.value.password ||
    !formData.value.email ||
    !formData.value.emailCode
  ) {
    alert('请完整填写注册信息');
    return;
  } 

// 先验证验证码
  try {
    if (!isValidEmail(formData.value.email)) {
    alert('请输入有效的邮箱地址');
    return;
}
if (!isValidCode(formData.value.emailCode)) {
    alert('请输入有效的验证码');
    return;
}
  const verifyResponse = await axios.post(`http://localhost:8080/api/email/verify-code?email=${formData.value.email}&code=${formData.value.emailCode}`, {
    email: formData.value.email,
    code: formData.value.emailCode,
}, {
    headers: {
        'Content-Type': 'application/json'
    }
});
 console.log(verifyResponse.data)
    if (verifyResponse.data !== 'Registration successful！') {
      alert('验证码错误或已过期！');
      return;
    }   
    const response = await axios.post(`http://localhost:8080/api/user/register?username=${formData.value.username}&password=${formData.value.password}&email=${formData.value.email}`, {
      username: formData.value.username,
      password: formData.value.password,
      email: formData.value.email, 
    });

    if (response.data === 'Successfully registered') { 
      isLoginForm.value = true;
    }  
  } catch (error) {
    console.error('注册失败:', error);
    alert('注册失败，请稍后再试！');
  }
};
</script>

<style scoped>

/* 样式内容，根据需要修改 */
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-container {
  margin-bottom: 20px;
}

.input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.email-code-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px; 
} 

.small-btn { 
  position: absolute; 
  right: 0px;
  top:10px;
  width: 100px; 
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.small-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn:hover {
  background-color: #0056b3;
}

.toggle-text {
  text-align: center;
  color: #007bff;
  cursor: pointer;
}

.toggle-text:hover {
  text-decoration: underline;
}
</style>
