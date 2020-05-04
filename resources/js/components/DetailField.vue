<template>
    <detail-belongs-to-field
        :resource="resource"
        :resourceName="resourceName"
        :resourceId="resourceId"
        :field="field"
    />
</template>

<script>
export default {
    props: ['resource', 'resourceName', 'resourceId', 'field'],
}
</script>
