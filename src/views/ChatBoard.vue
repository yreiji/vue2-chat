<template>
    <v-app id="inspire">
        <!--サイドバー-->
        <LeftSidebar />
        <v-main>
            <h1>{{ room ? room.name : '' }}</h1>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col v-for="card in cards" :key="card" cols="12">
                        <v-card>
                            <v-subheader>{{ card }}</v-subheader>

                            <v-list two-line>
                                <template>
                                    <v-list-item v-for="(data, index) in messages" :key="index"> <!--data=messageの各オブジェクト-->
                                        <v-list-item-avatar color="grey darken-1">
                                            <v-img :src="data.photoURL"></v-img>
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <!-- <v-list-item-title>Message {{ n }}</v-list-item-title> -->

                                            <v-list-item-subtitle class="message">
                                                {{ data.message }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-divider v-if="n !== 6" :key="`divider-${index}`" inset></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-textarea v-model="body" append-icon="mdi-comment" class="mx-2" label="メッセージを送信する" rows="3" auto-grow>
            </v-textarea>
            <v-btn class="me-4" type="submit" :disabled="invalid" @click="submit"> <!--invalid:falseなら活性-->
                submit
            </v-btn>

            <v-btn @click="clear">
                clear
            </v-btn>
        </v-main>
    </v-app>
</template>
  
<script>
import firebase from '@/firebase/firebase'
import LeftSidebar from '@/components/layouts/LeftSidebar'

export default {
    components: {
        LeftSidebar
    },
    async created() { // APIなどでデータを取ってきてdataに格納する時などに利用
        console.log("createed call")
        this.roomId = this.$route.query.room_id; // クエリパラメータ取得
        console.log("roomId", this.roomId);

        const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
        //ルームドキュメントを取得
        const roomDoc = await roomRef.get()
        //ルームドキュメントが存在しないならTOPへリダイレクト
        if (!roomDoc.exists) {
            await this.$router.push("/")
        }
        //ルームを取得
        this.room = roomDoc.data()
        console.log("room", this.room)

        //messagesコレクションを取得
        // const snapshot = await roomRef.collection("messages").orderBy("createdAt", "asc").get()
        // snapshot.forEach(doc => { // doc = 1レコード
        //     console.log(doc.data())
        //     this.messages.push(doc.data())
        // });

        // const chatRref = firebase.firestore().collection("chats") // コレクションにアクセス
        // console.log("chatRef", chatRref)
        // const snapshot = await chatRref.get() // awaitした処理が返却されるまで次に行かない
        // console.log("snapshot", snapshot)
        // snapshot.forEach(doc => { // doc = 1レコード
        //     console.log(doc.data())
        //     this.messages.push(doc.data())
        // });
    },
    mounted() {
        //ログイン情報を取得
        this.auth = JSON.parse(sessionStorage.getItem("user"))

        //DBの変更を更新
        const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
        roomRef.collection("messages").orderBy("createdAt", "asc")
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => { //change = 新しいメッセージ
                console.log("new message", change.doc.data())
                this.messages.push(change.doc.data())
            })
        })
    },
    data: () => ({
        messages: [
            // {message: "message 1"},
            // {message: "message 2"},
            // {message: "message 3"},
            // {message: "message 4"},
            // {message: "message 5"},
        ],
        body: '',
        roomId: '',
        room: null,
        cards: ['Today'],
        drawer: null,
        links: [
            ['mdi-inbox-arrow-down', 'Inbox', '/'],
            ['mdi-send', 'Send', '/about'],
            ['mdi-delete', 'Trash', '/about'],
            ['mdi-alert-octagon', 'Spam', 'about'],
        ],
        auth: null,
        // invalid: false,
    }),
    computed: { // dataの値が変更されたときに実行する関数群を書くプロパティ
        invalid() {
            console.log("invalid call", this.body)
            if (!this.body) {
                return true
            }
            return false
        }
    },
    methods: {
        clear() {
            console.log("clear call.")
            this.body = ""
        },
        submit() {
            console.log("submit call.", this.body)
            // this.messages.push({
            //     message: this.body,
            //     name: this.auth.displayName,
            //     photoURL: this.auth.photoURL,
            //     createdAt: firebase.firestore.Timestamp.now()
            // })

            //メッセージをDBに保存
            const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
            roomRef.collection("messages").add({
                message: this.body,
                name: this.auth.displayName,
                photoURL: this.auth.photoURL,
                createdAt: firebase.firestore.Timestamp.now()
            })
            .then(result => {
                console.log("success", result)
                this.body = ""
            })
            .catch(error => {
                console.log("fail", error)
                alert("メッセージの送信に失敗しました")
            })
        }
    },
}
</script>

<style>
.message {
    text-align: left;
}
</style>