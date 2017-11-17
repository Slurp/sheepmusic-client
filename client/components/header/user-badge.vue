<template>
    <span class="profile" id="userBadge">
        <span class="view-profile control" @click="loadProfileView">
            <img class="avatar" :src="state.current.avatar" alt="Avatar"></img>
            <span class="name">{{ state.current.name }}</span>
        </span>

        <a class="logout" @click.prevent="logout"><i class="fa fa-sign-out control"></i></a>
    </span>
</template>

<script>

</script>

<style>

</style>
