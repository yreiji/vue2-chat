<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Create Room
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Room</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>

              <v-col cols="12">
                <v-text-field v-model="name" label="Room Name*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input v-model="file" truncate-length="15" accept="image/*"></v-file-input>
              </v-col>

            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="onSubmit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup>
import { ref } from 'vue'
import firebase from "@/firebase/firebase"

const dialog = ref(false)
</script>

<script>
export default {
  data: () => ({
    dialog: false,
    name: "",
    file: null
  }),
  methods: {
    async onSubmit() {
      console.log("oonSubmit call", this.name, this.file)
      // this.dialog = false
      let thumbnailUrl = ""
      if (this.file) {
        //CloudStorageへファイルをアップロード
        const filePath = `/roo/${this.file.name}`
        await firebase.storage().ref()
          .child(filePath) //保存先を指定
          .put(this.file)
          .then(async snapshot => {
            thumbnailUrl = await snapshot.ref.getDownnloadURL()
            console.log("thumbnailUrl", thumbnailUrl)
          })
      }

      //roomコレクションにデータを追加
      const roomRef = firebase.firestore().collection("room")
      await roomRef.add({
        name: this.name,
        thumbnailUrl: thumbnailUrl,
        createdAt: firebase.firestore.Timestamp.now()
      })
        .then(result => {
          console.log("success to create room", result)
          this.dialog = false
        })
    }
  }
}
</script>