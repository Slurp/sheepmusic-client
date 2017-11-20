<template>
    <div class="nav-drawer-nav">
        <nav>
            <ul>
                <li>
                    <router-link class="" :to="{name:'recent-albums'}">
                        <i class="material-icons">album</i><span>Albums</span>
                    </router-link>
                </li>
                <li>
                    <router-link class="" :to="{name:'all-artists'}">
                        <i class="material-icons">recent_actors</i><span>Artists</span>
                    </router-link>
                </li>
                <li>
                    <router-link class="" :to="{name:'all-playlists'}">
                        <i class="material-icons">queue_music</i><span>playlists</span>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>

</template>
<script>
  export default {}
</script>
