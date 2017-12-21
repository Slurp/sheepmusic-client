<template>
    <section class="user-profile__general">
        <div class="card-flip" :class="{ hover: inEditMode }">
            <div class="flip">
                <div class="front">
                    <div class="card">
                        <h4 class="card-header">Profile settings
                            <div class="card-actions">
                                <a class="btn btn-outline-primary" v-on:click.stop.prevent="editMode" title="edit">
                                    <i class="material-icons">mode_edit</i>
                                </a>
                            </div>
                        </h4>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Username:</strong>{{ userProfile.user_name }}</li>
                            <li class="list-group-item"><strong>Email:</strong>{{ userProfile.email }}</li>
                        </ul>
                    </div>
                </div>
                <div class="back">
                    <!-- back content -->
                    <form v-on:submit.prevent="login()" class="card">
                        <h4 class="card-header">Editing
                            <div class="card-actions">
                                <a class="btn btn-outline-secondary" v-on:click.stop.prevent="editMode" title="cancel">
                                    <i class="material-icons">cancel</i>
                                </a>
                            </div>
                        </h4>

                        <div class="card-body">
                            <div class="form-group">
                                <div class="floating-label" :class="{ 'has-value': data.username }">
                                    <label class="col-form-label">Username:</label>
                                    <input v-model="data.username" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="floating-label" :class="{ 'has-value': data.email }">
                                    <label class="col-form-label">Email:</label>
                                    <input v-model="data.email" type="email" class="form-control"/>
                                </div>
                            </div>
                        </div>
                        <div class="card-actions">
                            <a class="btn btn-float btn-secondary btn-sm" v-on:click.stop.prevent="editMode" title="cancel">
                                <i class="material-icons">save</i>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- End Card Flip -->
    </section>
</template>

<script>
  export default {
    name: 'user-profile-general',
    props: ['userProfile'],
    data () {
      return {
        inEditMode: false,
        data: {
          username: this.userProfile.user_name,
          email: this.userProfile.email,
        }
      }
    },
    methods: {
      saveProfile () {
        this.axios.get(`app_dev.php/api/user/profile`).then((response) => {
          console.log(response);
          this.profile = response.data
        }, (err) => {
          console.log(err)
        })
      },
      editMode () {
        this.inEditMode = !this.inEditMode
      }
    },
  }
</script>

<style>
</style>
