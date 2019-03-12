export default {
    fetchAvailableResources(resourceName, fieldAttribute, params) {
        return Nova.request().get(
            `/nova-api/${resourceName}/associatable/${fieldAttribute}`,
            params
        )
    },

    determineIfSoftDeletes(resourceName) {
        return Nova.request().get(`/nova-api/${resourceName}/soft-deletes`)
    },

    createNewResource(resourceName, fieldAttribute, params){
        return Nova.request().post(`/nova-api/${resourceName}`)
    },

    getFormFields(resourceName){
    	return Nova.request().get(`/nova-api/${resourceName}/creation-fields`)
    }
}
