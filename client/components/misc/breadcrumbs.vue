<template>
    <ol class="breadcrumb breadcrumb-fixed">
        <li class="breadcrumb-item active" v-if="artist">
            {{ artist.name }}
        </li>
        <li class="breadcrumb-item" v-else-if="album && album.album">
           <router-link to="/">
                {{ album.artist.name }}
           </router-link>
        </li>
        <li class="breadcrumb-item active" v-if="album && album.album">
            {{ album.album.name }}
        </li>
    </ol>
</template>
<script>
  export default {
    props: [
      'album',
      'artist'
    ]
  }
</script>