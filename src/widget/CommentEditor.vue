<template>
    <div class="ac-comment-editor">
        <div class="ac-cancel-reply" title="取消回复" default-text="取消回复"
            v-show="isReplying" 
            v-on:click="$emit('cancel-reply')"
        >
            取消回复
        </div>

        <div class="ac-commenter-info" v-show="!$root.$refs.profile || !$root.$refs.profile.isLoggedIn()">
            <input name="nick" type="text" class="ac-input"
                v-bind:placeholder="owner.lang.nick" 
                v-model="formData_nick"
            >
            <div class="ac-commenter-avatar-preview"><img v-show="avatarPreviewing!=''" v-bind:src="getMail()"></div>
            <input name="mail" type="email" class="ac-input" 
                v-bind:placeholder="owner.lang.mail" 
                v-if="mailRequired" 
                v-model="formData_mail"
                v-on:input="onMailInput"
            >
            <input name="website" type="text" class="ac-input" 
                v-bind:placeholder="owner.lang.website" 
                v-if="websiteRequired" 
                v-model="formData_website"
            >
        </div>
        
        <div style="position: relative">
            <textarea id="april-comment-input" 
                class="ac-input" 
                v-bind:placeholder="owner.lang.comment_tips" 
                v-bind:default-placeholder="owner.lang.comment_tips" 
                v-bind:disabled="showSubmitingAnimation"
                v-bind:style="showSubmitingAnimation?'background-color: #f5f5f5;':''"
                v-model="formData_content"
            ></textarea>

            <div class="ac-toolbar">

                <div class="ac-button ac-button-login" title="登录" 
                    v-show="owner.opt.standaloneLoginButton &&(!$root.$refs.profile || !$root.$refs.profile.isLoggedIn())" 
                    v-on:click.prevent="onLogin"
                >
                    <svg t="1622649106122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5128" width="22" height="22"><path d="M512 960A448 448 0 0 1 195.2 195.2a448 448 0 0 1 633.6 633.6A445.056 445.056 0 0 1 512 960z m-96-288a103.488 103.488 0 0 0-96 108.16v64.32a381.472 381.472 0 0 0 384 0v-64A103.424 103.424 0 0 0 608 672z m0-64h192a166.72 166.72 0 0 1 160 169.92v18.88a384 384 0 1 0-512 0v-18.88A166.4 166.4 0 0 1 416 608z m96-64a160 160 0 1 1 160-160 160.192 160.192 0 0 1-160 160z m0-256a96 96 0 1 0 96 96 96 96 0 0 0-96-96z" p-id="5129"></path></svg>
                    登录
                </div>
                
                <div class="ac-button ac-button-preview" title="预览" 
                    v-on:click="previewVisible = !previewVisible"
                    v-show="formData_content"
                >
                    <svg style="margin-right: 4px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17688" width="22" height="22"><path d="M502.390154 935.384615a29.538462 29.538462 0 1 1 0 59.076923H141.430154C79.911385 994.461538 29.538462 946.254769 29.538462 886.153846V137.846154C29.538462 77.745231 79.950769 29.538462 141.390769 29.538462h741.218462c61.44 0 111.852308 48.206769 111.852307 108.307692v300.268308a29.538462 29.538462 0 1 1-59.076923 0V137.846154c0-26.899692-23.355077-49.230769-52.775384-49.230769H141.390769c-29.420308 0-52.775385 22.331077-52.775384 49.230769v748.307692c0 26.899692 23.355077 49.230769 52.775384 49.230769h360.999385z" p-id="17689"></path><path d="M196.923077 216.615385m29.538461 0l374.153847 0q29.538462 0 29.538461 29.538461l0 0q0 29.538462-29.538461 29.538462l-374.153847 0q-29.538462 0-29.538461-29.538462l0 0q0-29.538462 29.538461-29.538461Z" p-id="17690"></path><path d="M649.846154 846.769231a216.615385 216.615385 0 1 0 0-433.230769 216.615385 216.615385 0 0 0 0 433.230769z m0 59.076923a275.692308 275.692308 0 1 1 0-551.384616 275.692308 275.692308 0 0 1 0 551.384616z" p-id="17691"></path><path d="M807.398383 829.479768m20.886847-20.886846l0 0q20.886846-20.886846 41.773692 0l125.321079 125.321079q20.886846 20.886846 0 41.773693l0 0q-20.886846 20.886846-41.773693 0l-125.321078-125.321079q-20.886846-20.886846 0-41.773693Z" p-id="17692"></path></svg>
                    预览
                </div>

                <div class="ac-button ac-button-smilieset" title="表情"
                    v-show="owner.opt.smilieEnabled"
                    v-on:click="onSmilieButtonClick"
                >
                    <svg style="margin-right: 4px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16172" width="22" height="22"><path d="M512 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512zM512 56.888889a455.111111 455.111111 0 1 0 455.111111 455.111111 455.111111 455.111111 0 0 0-455.111111-455.111111zM312.888889 512A85.333333 85.333333 0 1 1 398.222222 426.666667 85.333333 85.333333 0 0 1 312.888889 512z" p-id="16173"></path><path d="M512 768A142.222222 142.222222 0 0 1 369.777778 625.777778a28.444444 28.444444 0 0 1 56.888889 0 85.333333 85.333333 0 0 0 170.666666 0 28.444444 28.444444 0 0 1 56.888889 0A142.222222 142.222222 0 0 1 512 768z" p-id="16174"></path><path d="M782.222222 391.964444l-113.777778 59.733334a29.013333 29.013333 0 0 1-38.684444-10.808889 28.444444 28.444444 0 0 1 10.24-38.684445l113.777778-56.888888a28.444444 28.444444 0 0 1 38.684444 10.24 28.444444 28.444444 0 0 1-10.24 36.408888z" p-id="16175"></path><path d="M640.568889 451.697778l113.777778 56.888889a27.875556 27.875556 0 0 0 38.684444-10.24 27.875556 27.875556 0 0 0-10.24-38.684445l-113.777778-56.888889a28.444444 28.444444 0 0 0-38.684444 10.808889 28.444444 28.444444 0 0 0 10.24 38.115556z" p-id="16176"></path></svg>
                    表情
                </div>

                <div class="ac-button ac-button-comment"
                    v-on:click.left="onComment"
                    v-on:click.right.prevent="!owner.opt.standaloneLoginButton?onLogin():undefined"
                >
                    <!-- 加载动画 -->
                    <div class="ac-submiting-indicator" v-show="showSubmitingAnimation"></div>
                    <svg t="1620919659883" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1971" width="22" height="22"><path d="M224 768A138.666667 138.666667 0 0 1 85.333333 629.333333v-362.666666A138.666667 138.666667 0 0 1 224 128h576A138.666667 138.666667 0 0 1 938.666667 266.666667v362.666666A138.666667 138.666667 0 0 1 800 768h-244.821333L341.333333 928a53.333333 53.333333 0 0 1-85.290666-42.666667V768h-32z m309.930667-64h266.069333a74.666667 74.666667 0 0 0 74.666667-74.666667v-362.666666a74.666667 74.666667 0 0 0-74.666667-74.666667H224A74.666667 74.666667 0 0 0 149.333333 266.666667v362.666666c0 41.216 33.450667 74.666667 74.666667 74.666667h95.957333v160l213.973334-160z" p-id="1972"></path></svg>
                    评论
                </div>
            </div>
        </div>
        
        <div class="ac-panels">
            <div class="ac-preview-panel" v-if="previewVisible && formData_content">
                <div>预览</div>
                <div class="ac-markdown" v-html="formData_content? parseMarkdown(formData_content):''"></div>
            </div>
        </div>

        <smilies-comment
            ref="smiliesComponet"
            v-show="smiliesVisible"
            v-bind:owner="owner"
            v-on:close="onCloseSmiliePanel"
        ></smilies-comment>

        <div class="ac-alert-info" v-show="alertMessage.text!=''">
            <div class="ac-h">
                <div class="ac-text" v-html="alertMessage.text"></div>
                <div>
                    <button type="button" class="ac-button" v-on:click="cbButton1">{{alertMessage.button}}</button>
                    <button type="button" class="ac-button" v-show="alertMessage.button2!=''" v-on:click="cbButton2">{{alertMessage.button2}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import smiliesComponet from './SmilieBox.vue'
import md2html from '../utils/Markdown2Html'
import inserfunc from '../utils/jq-insert.js'
import AprilComment from '..'
import CommentingModel from '../interface/CommentingModel'
const brownies = require('brownies')
const $ = require('jquery')
import crypto from 'crypto'
import { getAvatarByMail } from '../utils/Utils'

export default Vue.extend({
    name: 'comment-editor',
    mounted: function() {
        inserfunc()

        this.smiliesComponet = this.$refs.smiliesComponet

        // load cookies
        if (brownies.cookies.ac_nick)
            this.formData_nick = brownies.cookies.ac_nick
        if (brownies.cookies.ac_website)
            this.formData_website = brownies.cookies.ac_website
        if (brownies.cookies.ac_mail)
        {
            this.formData_mail = brownies.cookies.ac_mail

            // 加载头像预览
            let mailInMd5 = crypto.createHash('md5').update(this.formData_mail).digest('hex')
            this.avatarPreviewing = mailInMd5
        }
    },
    data: () => ({
        smiliesComponet: null,
        formData_nick: '',
        formData_mail: '',
        formData_website: '',
        formData_content: '',
        alertMessage: {
            text: '',
            button: '好的',
            button2: '',
            cb_button1: null,
            cb_button2: null,
        },
        showSubmitingAnimation: false, // 正在提交评论的动画
        previewVisible: false, // 显示预览面板
        smiliesVisible: false, // 显示标签面板
        avatarPreviewing: '' // 头像预览
    }),
    methods: {
        parseMarkdown: function (text: string) {
            return md2html(this.owner.smilieManager.renderAsHtml(text))
        },
        onComment: function () {
            if(!this.checkForm())
                return

            // save cookies
            brownies.cookies.ac_nick = this.formData_nick
            brownies.cookies.ac_mail = this.formData_mail
            brownies.cookies.ac_website = this.formData_website

            // 防止重复提交评论
            if(this.showSubmitingAnimation) {
                this.showAlert('评论正在提交，请等待')
                return
            }

            this.owner.submit({
                nick: this.formData_nick,
                mail: this.formData_mail,
                website: this.formData_website,
                content: this.formData_content,
            } as CommentingModel).then(() => {
                this.showSubmitingAnimation = false
                this.smiliesVisible = false
                this.owner.refresh()
            }).catch(() => {
                this.showSubmitingAnimation = false
                this.smiliesVisible = false
            })

            this.showSubmitingAnimation = true
        },
        onLogin: function() {
            this.$root.$refs.profile.onClick()
        },
        checkForm: function() {
            if (!this.formData_content)  {
                this.showAlert('写点儿什么吧')
                return false
            }

            if(!this.$root.$refs.profile.isLoggedIn())
            {
                if (!this.formData_nick) {
                    this.showAlert('如何称呼您呢?')
                    return false
                }

                if (this.formData_mail && this.mailRequired) {
                    let reg = new RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$', 'g')
                    if (!this.formData_mail.match(reg)) {
                        this.showAlert('邮箱请使用xx@xx.xx格式')
                        return false
                    }
                }

                if (this.formData_website && this.websiteRequired) {
                    let reg = new RegExp('^https?://', 'g')
                    if (!this.formData_website.match(reg))
                    {
                        this.showAlert('网站格式请使用http(s)://开头')
                        return false
                    }
                }
            }

            return true
        },
        onSmilieButtonClick: function() {
            if(this.smiliesVisible) {
                this.smiliesVisible = false
            } else {
                this.smiliesVisible = true
            }
        },
        onCloseSmiliePanel: function() {
            this.onSmilieButtonClick()
        },
        onMailInput: function(e: InputEvent) {
            let mailReg = new RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$', 'g')
            let text = $(e.target as any).val() as string
            if(text.match(mailReg))
            {
                let mailInMd5 = crypto.createHash('md5').update(text).digest('hex')
                this.avatarPreviewing = mailInMd5
            } else {
                this.avatarPreviewing = ''
            }
        },
        getMail: function() {
            return getAvatarByMail(this.owner.opt, this.avatarPreviewing)
        },
        hideAlert: function () {
            this.alertMessage.text = ''
        },
        showAlert: function (message: string, button='OK') {
            this.alertMessage.text = message
        },
        cbButton1: function() {
            if(this.alertMessage.cb_button1)
                this.alertMessage.cb_button1()
            this.hideAlert()
        },
        cbButton2: function() {
            if(this.alertMessage.cb_button2)
                this.alertMessage.cb_button2()
            this.hideAlert()

            this.alertMessage.cb_button2 = null
            this.alertMessage.button2 = ''
        }
    },
    watch: {
        smiliesVisible: function(newV, oldV) {
            if(newV) this.previewVisible = newV
        },

    },
    updated: function() {
        for (const child of this.$children)
            child.$forceUpdate()
    },
    props: {
        owner: {
            type: AprilComment,
            required: true
        },
        isReplying: {
            type: Boolean,
            required: true
        },
        mailRequired: {
            type: Boolean,
            required: true
        },
        websiteRequired: {
            type: Boolean,
            required: true
        }
    },
    components: {
        'smilies-comment': smiliesComponet,
    }
})
</script>


<style lang="scss">
    @import "../index.scss";

    .ac-comment-editor {
        // border-bottom: 1px solid #f0f0f0;
        // border-radius: 4px;
        margin-bottom: 10px;
        // overflow: hidden;
        position: relative;
        padding: 0px 10px;

        .ac-input {
            @extend %april-comment-text;

            border: none;
            resize: none;
            outline: none;
            padding: 5px 5px;
            max-width: 100%;
            font-size: .875em;
            border-radius: 0px;
        }

        .ac-button {
            @extend %april-comment-button;
            padding: 4px 8px; 
            display: inline-flex;
        }

        .ac-cancel-reply {
            @extend %april-comment-button;

            width: 100%;
            background-color: #73ff2b2b;
        }

        .ac-commenter-info {
            display: flex;
            flex-wrap: wrap;
            line-height: 1.75;

            .ac-commenter-avatar-preview {
                width: 45px;
                height: 45px;

                img {
                    width: calc(100% - 2px - 2px);
                    height: calc(100% - 2px - 2px);
                    
                    border-radius: 50%;
                    border: 1px solid #f5f5f5;
                    padding: 2px;
                }
            }

            input {
                min-width: 160px;
                flex-grow: 1;
                border-radius: 0px;

                &:focus {
                    border-bottom: 1px solid #cacaca;
                }
            }
        }

        .ac-toolbar {
            position: absolute;
            right: 15px;
            bottom: 15px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

            &>div:not(:last-child) {
                margin-right: 6px;
            }
        }

        .ac-tool-panel {
            padding: 0px 8px;
            border: 1px solid #efefef;
            border-radius: 4px;

            &:first-child {
                margin-top: 10px;
            }

            &:not(:last-child) {
                margin-bottom: 10px;
            }
        }

        .ac-preview-panel {
            @extend .ac-tool-panel;

            .ac-markdown {
                @extend %april-comment-markdown;
            }
        }

        .ac-alert-info {
            @extend %april-comment-text;

            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            background-color: #4d4d4dc2;
            overflow: auto;

            .ac-h {
                display: flex;
                align-items: center;
                flex-direction: column;
                margin: auto 0px;

                .ac-text {
                    font-size: 1.3rem;
                    margin-bottom: 1rem;
                    text-align: center;
                }
            }

            * {
                color: #ece9e7 !important;
            }
        }


        .ac-submiting-indicator {
            text-align: center;

            &:before {
                content: "";
                display: inline-block;
                width: 15px;
                height: 15px;
                border: 3px solid #a0a0a0;
                border-top-color: transparent;
                border-bottom-color: transparent;
                border-radius: 50%;
                animation: spin 2s infinite linear;
            }

            @keyframes spin
            {
                from { transform: rotate(0deg); }
                to { transform: rotate(1turn); }
            }
        }
    }

    // 输入框
    #april-comment-input {
        width: 100%;
        min-height: 10em;
        font-size: 0.875em;
        margin-top: 0.5rem;
        background: transparent;
        resize: vertical;
        transition: border-color 0.7s ease;
        border: 1px solid #50505017;
        word-break: break-all;
        border-radius: 4px;
        border-bottom-right-radius: 8px;

        &:focus, &:hover, &:focus {
            border: 1px solid #86bb9d;
        }
    }

</style>
