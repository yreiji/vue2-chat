<template>
    <v-app>
        <div class="login-box">
            <v-card class="login-form">
                <v-card-title class="login-title">Sign Up
                </v-card-title>
                <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
                <v-btn text color="light-blue" to="login">ログイン画面はこちら</v-btn>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="name" :rules="nameRules" label="UseName" required></v-text-field> <!--requiredは必須-->
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password"></v-text-field><!--type=passwordは入力値が黒丸になる-->

                    <v-btn color="success" class="login-btn" @click="submit" :disabled="isValid"> <!--isValidがtrueなら非活性-->
                        SIGN UP
                    </v-btn>
                    <v-btn>CLEAR</v-btn>

                    <!--エラーメッセージ-->
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
            v => !!v || '名前を入力してください',
            v => (v && v.length <= 10) || '名前は10文字以内で入力してください',
        ],
        email: '',
        emailRules: [
            v => !!v || 'メールアドレスを入力してください', //必須チェック
            v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です', //形式チェック
        ],
        password: '',
        errorMessage: ''
    }),
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
                //ユーザ情報新規作成(firebaseの認証機能の一つ)
                .createUserWithEmailAndPassword(this.email, this.password)
                //成功時
                .then(async (result) => {
                    console.log("success", result)
                    await result.user.updateProfile(
                        {displayName: this.name}
                    )
                    console.log("update user", result.user)
                    //ブラウザのローカスストレージに成功メッセージを保存→LoginView.vueから取得できるように
                    localStorage.message = "新規作成に成功しました"
                    //ログイン画面にリダイレクト
                    this.$router.push("/login")
                })
                //失敗時
                .catch((error) => {
                    console.log("fail", error)
                    //エラーメッセージを表示
                    this.errorMessage = "ユーザの新規作成に失敗しました"
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
    margin-top: 20px;
}
</style>