<template>
    <article class="user-profile">
        <h1 class="user-profile__title">
            Your profile
        </h1>
        <div class="user-profile__tabs">
            <div class="col col__left">
                <div class="list-group" id="list-tab" role="tablist">
                    <a class="list-group-item list-group-item-action active " id="list-profile-list" data-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</a>
                    <a class="list-group-item list-group-item-action" id="list-LastFM-list" data-toggle="list" href="#list-LastFM" role="tab" aria-controls="LastFM">LastFM</a>
                    <a class="list-group-item list-group-item-action" id="list-settings-list" data-toggle="list" href="#list-settings" role="tab" aria-controls="settings">Settings</a>
                </div>
            </div>
            <div class="col col__right">
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                        <profile-general :userProfile=userProfile></profile-general>
                    </div>
                    <div class="tab-pane fade" id="list-LastFM" role="tabpanel" aria-labelledby="list-LastFM-list">
                        <profile-lastfm :lastfm=userProfile.last_fm></profile-lastfm>
                    </div>
                    <div class="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list">
                        <profile-settings :settings=userProfile.settings></profile-settings>
                    </div>
                </div>
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
    beforeDestroy() {
      this.profile = null
      delete this.profile
    },
    methods: {
      getProfile () {
        this.axios.get(`app_dev.php/api/user/profile`).then((response) => {
          console.log(response);
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
