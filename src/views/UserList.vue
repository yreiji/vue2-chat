<template>
    <v-app id="inspire">
        <!--サイドバー-->
        <LeftSidebar />
        <v-app-bar app shrink-on-scroll>

            <v-toolbar-title>ユーザ一覧</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-row>
                    <v-col v-for="n in 24" :key="n" cols="4">
                        <router-link :to="{ path: '/chat', query: { user_id: n } }"><!--遷移先（パラメータ：ユーザID）-->
                            <v-avatar color="grey lighten-2" size="111"></v-avatar> <!--ユーザアイコン-->
                        </router-link>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import LeftSidebar from '@/components/layouts/LeftSidebar'

export default {
    components: {
        LeftSidebar
    },
}
</script>