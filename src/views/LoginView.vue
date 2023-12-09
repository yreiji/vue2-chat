<template>
    <v-app>
        <div class="login-box">
            <v-card class="login-form">
                <v-card-title class="login-title">Login</v-card-title>
                <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
                <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn> <!---toプロップスで遷移先を指定-->

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password"></v-text-field> <!--type=passwordは入力値が黒丸になる-->

                    <v-btn color="success" class="login-btn" @click="submit" :disabled="isValid"> <!--isValidがtrueなら非活性-->
                        LOGIN
                    </v-btn>
                    <v-btn>CLEAR</v-btn>

                    <v-alert dense text type="success" class="success-message" v-if="message">
                        {{ message }}
                    </v-alert>
                    <v-alert dense outlined type="error" class="error-message" v-if="errorMessage">
                        {{ errorMessage }}
                    </v-alert>
                </v-form>
            </v-card>
        </div>
    </v-app>
</template>
  
<script>
import firebase from "@/firebase/firebase"

export default {
    data: () => ({
        valid: true,
        name: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        email: '',
        emailRules: [
            v => !!v || 'メールアドレスを入力してください', //必須チェック
            v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です', //形式チェック
        ],
        password: '',
        message: '',
        errorMessage: ''
    }),
    mounted() {
        if (localStorage.message) {
            this.message = localStorage.message //localStorege.messageに格納されたメッセージを表示
            localStorage.message = ''
        }
    },
    computed: {
        isValid() {
            console.log("isValid", this.valid);
            return !this.valid; //validationがfalseならtrueを返す→Loginボタンを非活性にする
        }
    },
    methods: {
        validate() {
            this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        submit() {
            console.log("submit call")
            firebase.auth()
                //ログイン処理
                .signInWithEmailAndPassword(this.email, this.password)
                //成功時
                .then((result) => {
                    console.log("success")
                    console.log("user", result.user)

                    //セッション管理
                    const auth = {
                        displayName: result.user.displayName,
                        email: result.user.email,
                        uid: result.user.uid,
                        refreshToken: result.user.refreshToken,
                        photoURL: result.user.photoURL
                    }
                    sessionStorage.setItem('user', JSON.stringify(auth)) //セッションに格納するのは文字列でないといけない

                    //TOP画面にリダイレクト
                    this.$router.push('/')
                })
                //失敗時
                .catch((error) => {
                    console.log("fail", error)
                    //エラーメッセージ表示
                    this.errorMessage = "ログインに失敗しました"
                })
        }
    },
}
</script>

<style>
.login-box {
    width: 50%;
    margin: 0 auto;
    padding: 30px;
}

.login-form {
    margin: 150px;
    padding: 30px;
}

.login-title {
    display: inline-block
}

.login-btn {
    margin-right: 20px;
}

.error-message {
    margin-top: 20ex;
}

.success-message {
    margin-top: 20px;
}
</style>