<template>
    <div class="modal" id="playlistModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                </div>
                <div class="modal-body">
                    <form v-on:submit.prevent="save()">
                        <div class="form-group">
                            <label class="col-form-label">Name:</label>
                            <input v-model="playlistName" class="form-control" placeholder="new playlist"/>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-secondary float-md-right">save</button>
                        </div>
                        <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'playlist-edit',
    data () {
      return {
        formName: this.$store.getters['playlist/name'],
        error: null
      }
    },
    computed: {
      playlistName () {
        return this.formName = this.$store.getters['playlist/name']
      },
    },
    methods: {
      save () {
        this.$store.dispatch('playlist/savePlaylist', this.formName).then(() => {
          $('#exampleModal').modal('toggle')
        }, (err) => {
          this.error = err
        })

      }
    }
  }
</script>
