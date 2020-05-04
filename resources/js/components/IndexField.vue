<template>
    <index-belongs-to-field :resourceName="resourceName" :field="field" />
</template>

<script>
export default {
    props: ['resourceName', 'field'],
}
</script>
