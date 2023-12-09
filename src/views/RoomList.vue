<template>
    <v-app id="inspire">
        <!--サイドバー-->
        <LeftSidebar />
        <v-app-bar app shrink-on-scroll>

            <v-toolbar-title>ルーム一覧</v-toolbar-title>
            <!--モーダル-->
            <CreateRoom />

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-row>
                    <v-col v-for="room in rooms" :key="room.id" cols="4">
                        <router-link :to="{ path: '/chat', query: { room_id: room.id } }"><!--遷移先（パラメータ：ユーザID）-->
                            <v-avatar color="grey lighten-2" size="111"><!--ユーザアイコン-->
                                <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" v-if="!room.thumbnailUrl"></v-img>
                                <v-img :src="room.thumbnail" alt="John" v-if="room.thumbnailUrl"></v-img>
                            </v-avatar>
                        </router-link>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import LeftSidebar from '@/components/layouts/LeftSidebar'
import CreateRoom from '@/components/modal/CreateRoom'
import firebase from "@/firebase/firebase"

export default {
    components: {
        LeftSidebar,
        CreateRoom
    },
    data: () => ({
        rooms: []
    }),
    mounted() {
        this.getRoooms()
    },
    methods: {
        async getRoooms() {
            //roomsを初期化
            this.rooms = []

            //firebaseからroomsコレクションを取得
            const roomRef = firebase.firestore().collection("rooms")
            const snapshot = await roomRef.get()
            console.log("snapshot call", snapshot)

            // コレクションの中からドキュメントを取得
            // snapshot.forEach(doc => {
            //     console.log(doc.data())
            //     this.rooms.push(doc.data())
            // })
            snapshot.docs.map(doc => {
                // const data = {
                //     name: doc.data().name,
                //     thumbnail: doc.data().thumbnail,
                //     createdAt: doc.data().createdAt,
                // }
                const data = {...doc.data()} //スプレッド構文
                data.id = doc.id
                console.log(data)
                this.rooms.push(data)
            })
        }
    }
}
</script>