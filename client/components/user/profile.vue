<template>
    <article class="user-profile">
        <h1 class="user-profile__title">
            Your profile
        </h1>

        <ul class="nav nav-tabs" id="list-tab" role="tablist">
            <li class="nav-item">
                <a class="nav-link active " id="list-profile-list" data-toggle="list" href="#list-profile"
                   role="tab" aria-controls="profile">Profile</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="list-LastFM-list" data-toggle="list" href="#list-LastFM" role="tab"
                   aria-controls="LastFM">LastFM</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="list-settings-list" data-toggle="list" href="#list-settings" role="tab"
                   aria-controls="settings">Settings</a>
            </li>
        </ul>

        <div class="tab-content" id="nav-tabContent" v-if="profile">
            <div class="tab-pane fade show active" id="list-profile" role="tabpanel"
                 aria-labelledby="list-profile-list">
                <profile-general :userProfile=userProfile></profile-general>
            </div>
            <div class="tab-pane fade" id="list-LastFM" v-if="profile.last_fm" role="tabpanel" aria-labelledby="list-LastFM-list">
                <profile-lastfm :lastfm=profile.last_fm></profile-lastfm>
            </div>
            <div class="tab-pane fade" id="list-settings" v-if="profile.settings" role="tabpanel" aria-labelledby="list-settings-list">
                <profile-settings :settings=profile.settings></profile-settings>
            </div>
        </div>

    </article>
</template>

<script>
  import profileGeneral from './profile/general'
  import profileLastfm from './profile/lastfm'
  import profileSettings from './profile/settings'

  export default {
    name: 'user-profile',
    components: {
      profileGeneral,
      profileLastfm,
      profileSettings
    },
    data () {
      return {
        profile: null
      }
    },
    created () {
      this.getProfile()
    },
    beforeDestroy () {
      this.profile = null
      delete this.profile
    },
    methods: {
      getProfile () {
        this.axios.get(`/api/user/profile`).then((response) => {
          console.log(response)
          this.profile = response.data
        }, (err) => {
          console.log(err)
        })
      }
    },
    computed: {
      userProfile () {
        if (this.profile) {
          return this.profile
        }
        return null
      },
    }
  }
</script>
