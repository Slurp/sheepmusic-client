<template>
    <div aria-hidden="true" class="navdrawer navdrawer-permanent navdrawer-permanent-clipped" id="doc_navdrawer"
         tabindex="-1">
        <div class="navdrawer-content">
            <div class="d-flex flex-column doc-navdrawer-body">
                <nav class="navdrawer-nav">
                    <router-link class="nav-item nav-link" :to="{name:'recent-albums'}">
                        <strong><i class="material-icons">album</i></strong>
                    </router-link>
                    <router-link class="nav-item nav-link" :to="{name:'all-artists'}">
                        <strong><i class="material-icons">recent_actors</i></strong>
                    </router-link>

                </nav>
            </div>
        </div>
    </div>
</template>
<script>
  export default {}
</script>
