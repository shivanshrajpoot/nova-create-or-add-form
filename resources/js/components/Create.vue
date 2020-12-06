<template>
    <loading-view :loading="loading">
        <div class="outer-form" style="border: 1px solid #f4f7fa; border-radius: .5rem;">
            <div class="header" style="padding: 1rem; border-bottom: 1px solid #f4f7fa;">
                <button @click="closeForm" type="button" class="float-right"><span class="">&times;</span></button>
                <h3 class="mb-0 bg-dark">{{__('New')}} {{ singularName }}</h3>
            </div>
            <card class="overflow-hidden">
                <form v-if="fields" @submit.prevent="createResource" autocomplete="off">
                    <!-- Validation Errors -->
                    <validation-errors :errors="validationErrors"/>
                    <!-- Fields -->
                    <div v-for="(field, index) in fields.fields" :key="index">
                        <component
                            :is="'form-' + field.component"
                            :errors="validationErrors"
                            :resource-name="resourceName"
                            :field="field"
                            :via-resource="viaResource"
                            :via-resource-id="viaResourceId"
                            :via-relationship="viaRelationship"
                        />
                    </div>

                    <!-- Create Button -->
                    <div class="bg-30 flex px-8 py-4">
                        <button @click="closeForm" dusk="cancel-button" type="button" class="btn btn-default btn-danger">
                            {{__('Cancel')}}
                        </button>

                        <button dusk="create-button" class="btn btn-default btn-primary ml-2">
                            {{__('Create')}} {{ singularName }}
                        </button>
                    </div>
                </form>
            </card>
        </div>
    </loading-view>
</template>

<script>
import { Errors, Minimum, InteractsWithResourceInformation } from 'laravel-nova'

export default {
    mixins: [InteractsWithResourceInformation],

    props: {
        resourceName: {
            type: String,
            required: true,
        },
        viaResource: {
            default: '',
        },
        viaResourceId: {
            default: '',
        },
        viaRelationship: {
            default: '',
        },
        field: {
            type: Object,
            required: true
        },
        parent: {
            type: Object,
            required: true
        },
    },

    data: () => ({
        relationResponse: null,
        loading: true,
        fields: [],
        validationErrors: new Errors(),
    }),

    async created() {
        // If this create is via a relation index, then let's grab the field
        // and use the label for that as the one we use for the title and buttons
        if (this.isRelation) {
            const { data } = await Nova.request(
                '/nova-api/' + this.viaResource + '/field/' + this.viaRelationship
            )
            this.relationResponse = data
        }

        this.getFields()
    },

    methods: {
        /**
         * Get the available fields for the resource.
         */
        async getFields() {
            this.fields = []
            let resourceUri = _.kebabCase(this.field.resourceName)
            const { data: fields } = await Nova.request().get(
                `/nova-api/${resourceUri}/creation-fields`
            )

            this.fields = fields
            this.loading = false
        },

        /**
         * Create a new resource instance using the provided data.
         */
        async createResource() {
            try {
                const response = await this.createRequest()

                this.$toasted.show(
                    this.__('The :resource was created!', {
                        resource: this.field.singularLabel.toLowerCase(),
                    }),
                    { type: 'success' }
                )

                this.$emit('hide-form')
                var value = response.data['id']
                var display = response.data.resource[this.field.title]
                this.$emit('select-created', {value:value, display:display})


            } catch (error) {
                if (error.response.status == 422) {
                    this.validationErrors = new Errors(error.response.data.errors)
                }
            }
        },

        /**
         * Send a create request for this resource
         */
        createRequest() {
            return Nova.request().post(
                `/nova-api/${this.field.resourceName}`,
                this.createResourceFormData()
            )
        },

        /**
         * Create the form data for creating the resource.
         */
        createResourceFormData() {
            return _.tap(new FormData(), formData => {
                
                _.each(this.fields.fields, field => {
                    field.fill(formData)
                })

                formData.append('viaResource', this.viaResource)
                formData.append('viaResourceId', this.viaResourceId)
                formData.append('viaRelationship', this.viaRelationship)
            })
        },

        closeForm(){
            this.$emit('hide-form')
        }
    },

    computed: {
        singularName() {

            return this.field.singularLabel
        },

        isRelation() {
            return Boolean(this.viaResourceId && this.viaRelationship)
        },
    },
}
</script>
