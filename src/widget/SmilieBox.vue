<template>
    <div class="ac-smilie-set-widget">
        <div class="ac-smilie-set-headbar">
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

            <div class="ac-smilie-set-close-button" v-on:click="onClose">
                <svg t="1620917520533" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997" width="40" height="40"><path d="M512 421.490332 331.092592 240.582924C306.351217 215.841549 265.464551 215.477441 240.470996 240.470996 215.303191 265.638801 215.527553 306.037221 240.582924 331.092592L421.490332 512 240.582925 692.907407C215.84155 717.648782 215.477441 758.535449 240.470996 783.529004 265.638801 808.696809 306.037222 808.472446 331.092593 783.417075L512 602.509668 692.907407 783.417075C717.648782 808.15845 758.535449 808.522559 783.529004 783.529004 808.696809 758.361199 808.472446 717.962778 783.417075 692.907407L602.509668 512 783.417076 331.092592C808.158451 306.351217 808.522559 265.464551 783.529004 240.470996 758.361199 215.303191 717.962779 215.527553 692.907408 240.582924L512 421.490332Z" p-id="1998"></path></svg>
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
        onClose: function() {
            this.$emit('close')
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
        .ac-smilie-set-headbar {
            display: flex;
            flex-direction: row;

            .ac-smilie-sets-tab {
                flex-grow: 1;
                display: inline-flex;
                /*     overflow-x: auto; */
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
                    border-radius: 20px;
                    
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
                        box-shadow: 1px 1px 3px #e0e0e0;
                        // border-bottom: 3px solid black;
                        // transform: translateY(-4px);
                    }
                }
            }

            .ac-smilie-set-close-button {
                width: 35px;
                height: 35px;
                margin: 5px;
                display: flex;
                justify-content: center;
                align-items: center;

                border-radius: 20%;

                &:hover {
                    background-color: #00000059;
                    cursor: pointer;
                }

                svg {
                    opacity: 0.7;
                }
            }
        }

        .ac-smilie-box {
            width: 100%;
            height: 300px;
            overflow-y: auto;
            box-sizing: border-box;

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
