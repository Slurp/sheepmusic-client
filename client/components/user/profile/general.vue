<template>
    <section class="user-profile__general">
        <form name="fos_user_profile_form"
              id="fos_user_profile_form"
              :class="{ 'was-validated': hasErrors }"
              v-on:submit.prevent="saveProfile()"
              class="card" novalidate>
            <h4 class="card-header">
                Editing
            </h4>
            <div class="card-body">
                <div class="form-group">
                    <div class="floating-label" :class="{ 'has-value': data.username }">
                        <label>Username:</label>
                        <input v-model="data.username" name="fos_user_profile_form[username]"
                               class="form-control" :class="{ 'is-invalid': hasErrors }"/>
                        <div class="invalid-feedback" v-if="errors.username">
                            {{ errors.username }}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="floating-label" :class="{ 'has-value': data.email }">
                        <label>Email:</label>
                        <input v-model="data.email" type="email" name="fos_user_profile_form[email]"
                               class="form-control" :class="{ 'is-invalid': hasErrors }"/>
                        <div class="invalid-feedback" v-if="errors.email">
                            {{ errors.email }}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="floating-label">
                        <label>Enter password to apply changes:</label>
                        <input type="password" name="fos_user_profile_form[current_password]"
                               class="form-control" :class="{ 'is-invalid': hasErrors }"/>
                        <div class="invalid-feedback" v-if="errors.current_password">
                            {{ errors.current_password }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button type="submit" class="btn  btn-secondary btn-sm" title="Submit">
                    <i class="material-icons">save</i> Save
                </button>
            </div>
        </form>
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
        },
        hasErrors: false,
        errors: {
          username: null,
          email: null,
          current_password: null,
        }
      }
    },
    methods: {
      saveProfile () {
        const url = `/api/user/save/profile`
        const form = new FormData(document.getElementById('fos_user_profile_form'))
        this.hasErrors = false
        this.errors = {
          username: null,
          email: null,
          current_password: null,
        }
        this.axios.post(url, form).then((response) => {
          this.profile = response.data
        }).catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
            if (error.response.status === 400) {
              this.hasErrors = true
              for (let [errorKey, messages] of Object.entries(error.response.data)) {
                this.errors[errorKey] = ''
                for (let message of messages) {
                  this.errors[errorKey] += message + `\n\n`
                }
              }
            }
          }
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
