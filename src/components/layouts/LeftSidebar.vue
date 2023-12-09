<template>
    <v-navigation-drawer v-model="drawer" app>
        <!--ユーザプロフィール-->
        <v-sheet color="grey lighten-4" class="pa-4">
            <v-avatar color="indigo">
                <input type="file" ref="fileInput" style="display: none;" accept="image/jpeg, image/jpg, image/png"
                    @change="updateIcon">
                <v-icon dark v-if="!photoUrl" @click="changeIcon">mdi-account-circle</v-icon>
                <img :src="photoUrl" v-if="photoUrl" @click="changeIcon">
            </v-avatar>
            <div class="username">{{ auth && auth.displayName }}</div>
        </v-sheet>

        <v-divider></v-divider>

        <v-list>
            <!--サイドメニュー群-->
            <v-list-item v-for="[icon, text, to] in links" :key="icon" :to="to" link>
                <v-list-item-icon>
                    <v-icon>{{ icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ text }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <!--ログアウトメニュー-->
            <v-list-item @click="logout">
                <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import firebase from "@/firebase/firebase"
export default {
    mounted() {
        this.auth = JSON.parse(sessionStorage.getItem("user"))
        this.photoUrl = this.auth.photoURL
    },
    data: () => ({
        drawer: null,
        links: [
            ['mdi-inbox-arrow-down', 'Inbox', '/'],
            ['mdi-send', 'Send', '/about'],
            ['mdi-delete', 'Trash', '/about'],
            ['mdi-alert-octagon', 'Spam', 'about'],
        ],
        auth: null,
        photoUrl: "",
    }),
    methods: {
        logout() {
            console.log("logout call")
            //ログアウト処理
            firebase.auth().signOut()
                //成功時
                .then(() => {
                    localStorage.message = "ログアウトに成功しました"
                    this.$router.push("/login")
                })
                //失敗時
                .catch((error) => {
                    console.log(error)
                })
        },
        changeIcon() {
            console.log("changeIcon call")
            this.$refs.fileInput.click() //ウィンドウが開いてファイル選択できる
        },
        updateIcon() {
            console.log("updateIcon call")
            //セッションが切れていればローカルストレージのユーザ情報は削除し、再ログインを促す
            const user = this.getAuth()
            if(!user) {
                sessionStorage.removeItem("user")
                this.$router.push("/login")
            }

            //ファイル情報を取得
            const file = this.$refs.fileInput.files[0]
            const filePath = `/user/${file.name}` //CloudStorage上に保存するPATH
            console.log(file)

            //CloudStorageへファイルをアップロード
            firebase.storage().ref()
                .child(filePath) //保存先を指定
                .put(file)
                //成功時
                .then(async snapshot => {
                    // console.log("snapshot", snapshot)

                    //画像URLを取得
                    const photoUrl = await snapshot.ref.getDownloadURL()
                    console.log("photoUrl", photoUrl)

                    //firebaseのユーザ情報を取得
                    return firebase.auth().onAuthStateChanged((user) => {
                        if(user) {
                            //photoURLというプロパティに画像URLを設定
                            user.updateProfile({
                                photoURL: photoUrl
                            })

                            //セッション情報を更新
                            this.auth.photoURL = photoUrl
                            sessionStorage.setItem("user", JSON.stringify(this.auth))

                            this.photoUrl = photoUrl
                        }
                    })
                })
        },
        getAuth() {
            //firebaseのユーザを取得
            return firebase.auth().onAuthStateChanged((user) => {
                return user
            })
        }
    }
}
</script>