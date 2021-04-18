<template>
    <div class="ac-smilie-set-widget">
        <div class="ac-smilie-sets-tab ac-smilies-scrollbar">
            <div class="ac-smilie-set-icon" 
                v-for="(setcontent, setname) in smilies" 
                v-bind:key="setname"
                v-bind:smilie-set="setname" 
                v-bind:class="setname==selectedSmilieSet?'ac-selected':''" 
                v-bind:title="setname"
                v-on:click="selectedSmilieSet=setname"
            >
                <div class="ac-preview" v-bind:style="'background-image: url('+getFirst(setcontent)+')'"></div>
                {{setname}}
            </div>
        </div>

        <div class="ac-smilie-box ac-smilies-scrollbar">
            <div class="ac-smilie-set"
                v-for="(setcontent, setname) in smilies" 
                v-bind:key="setname"
                v-bind:smilie-set="setname" 
                v-bind:style="setname==selectedSmilieSet?'':'display: none'"
            >
                <img class="ac-smilie" 
                    v-for="(smurl, smcode) in smilies[setname]" 
                    v-bind:key="smurl"
                    v-bind:src="smurl" 
                    v-bind:alt="smcode" 
                    v-bind:data-tag="' :'+smcode+': '" 
                    v-on:click.stop="onSmlieClick"
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AprilComment from '..'
const $ = require('jquery')

export default Vue.extend({
    name: 'SmilieBox',
    methods: {
        getFirst: function(obj: any) {
            for (let o in obj)
                return obj[o]
        },
        onSmlieClick: function(e: any) {
            $('#april-comment-input').insert($(e.target).attr('data-tag'))
        },
        defaultSmilieSet: function() {
            for (let o in this.smilies) {
                this.selectedSmilieSet = o
                break
            }
        }
    },
    data: () => ({
        selectedSmilieSet: '',
    }),
    computed: {
        smilies: function() {
            return this.owner.smilieManager.smilies
        }
    },
    props: {
        owner: {
            type: AprilComment,
            required: true
        },
    }
})
</script>


<style lang="scss">
    .ac-smilie-set-widget {
        .ac-smilie-sets-tab {
            width: 100%;
            display: inline-flex;
            /* 	overflow-x: auto; */
            flex-direction: row;
            // border-bottom: 2px solid #61616154;
            user-select: none;
            
            .ac-smilie-set-icon {
                display: inline-flex;
                padding: 2px 4px;
                cursor: pointer;
                margin: 4px;
                opacity: 0.4;
                border: 2px solid #808080;
                border-radius: 6px;
                
                transition: all 0.1s;

                .ac-preview {
                    width: 24px;
                    height: 24px;
                    background-repeat: no-repeat;
                    background-size: contain;
                    /* margin-right: 5px; */
                }
                
                &.ac-selected {
                    opacity: 1 !important;
                    // border-bottom: 3px solid black;
                    // transform: translateY(-4px);
                }
            }


        }

        .ac-smilie-box {
            width: 100%;
            height: 250px;
            overflow-y: auto;

            .ac-smilie-set {
                img {
                    cursor:pointer;
                    margin: 2px;
                    min-width: 28px;
                    max-width: 64px;
                    display: inline-block;
                    box-shadow: unset;
                }
            }
        }
        
    }

    .ac-smilies-scrollbar {
        overflow-y: auto;
        overflow-x: auto;

        &::-webkit-scrollbar {
            width: 14px;
            height: 14px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: #00000059;
        }

        &::-webkit-scrollbar-track {
            border-radius: 4px;
            background: #cccccc6b;
        }

        &:hover::-webkit-scrollbar-thumb {
            background-color: #0000008c;
        }
    }
</style>
