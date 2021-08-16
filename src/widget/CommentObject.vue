<template>
    <div class="ac-comment-object" 
        v-bind:id="comment.id"
        v-bind:layer="layer"
    >
        <div class="ac-comment-frame">
            <img class="ac-comment-avatar" 
                v-bind:src="comment.avatar"
                v-bind:class="layer>0? 'ac-comment-avatar-smaller':''"
                v-bind:style="comment.website? 'cursor: pointer;':''"
                v-bind:onclick="comment.website? 'window.open(\''+comment.website+'\', \'_blank\')':''"
                v-bind:title="comment.nick"
            >

            <div class="ac-comment-board">
                <div class="ac-comment-info">
                    <a class="ac-nick" rel="nofollow" 
                        v-bind:target="comment.website? '_blank':''"
                        v-bind:href="comment.website? comment.website:'javascript:void(0)'" 
                        v-bind:title="comment.website"
                        v-bind:class="comment.website? 'ac-nick-with-link':''"
                    >{{comment.nick}}</a>

                    <span class="ac-badge-author" style="margin: 0;" v-if="comment.isauthor">{{owner.lang.author}}</span>
                    <div class="ac-commenter-ua">
                        <span class="ac-browser" v-bind:title="comment.os">{{comment.browser}}</span>
                        <span class="ac-os" v-if="false">{{comment.os}}</span>
                    </div>
                    <br/>
                    <span class="ac-time" v-bind:title="parseDatetime(comment.time, true)">{{parseDatetime(comment.time, false)}}</span>
                    <span class="ac-reply-button"
                        v-on:click="$emit('reply', $event)"
                        v-bind:comment-id="comment.id"
                        v-bind:comment-root-id="comment.rootId"
                        v-bind:nick="comment.nick"
                    >回复</span>
                </div>

                <div class="ac-comment-content" v-html="parseMarkdown(comment.content)"></div>

                <div class="ac-reply-wrapper" v-bind:comment-id="comment.id"></div>
            </div>
        </div>

        <div class="ac-replies">
            <comment-object
                v-for="cmt in comment.replies"
                v-bind:key="cmt.id"
                v-bind:owner="owner"
                v-bind:comment="cmt"
                v-bind:layer="layer + 1"
                v-bind:class="indent(cmt.nick)? 'ac-replies-indent':''"
                v-on:reply="$emit('reply', $event)"
            ></comment-object>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AprilComment from '../april-comment';
import md2html from '../utils/Markdown2Html'
const moment = require('moment');
require('moment/locale/zh-cn');

moment.locale('zh-cn')

export default Vue.extend({
    name: 'comment-object',
    methods: {
        // 判断评论是否需要缩进
        indent: function(childNick: any) {
            let hasParent = !!this.$parent.$options._parentVnode;

            if (hasParent) {
                let reg = new RegExp('vue\\-component\\-\\d+\\-', 'g')
                let parentComponentTag = this.$parent.$options._parentVnode.tag.replace(reg, '')

                if (parentComponentTag=='comment-object') // 如果父组件和本组件都是comment-object组件
                    hasParent = true
                else
                    hasParent = false
            }
            
            let parentNick = hasParent? this.$parent.comment.nick:null
            let selfNick = this.comment.nick

            if (hasParent) {
                if (parentNick == childNick) // 判断父评论和孙评论是否为同一个人
                    return false
            }

            if (hasParent && selfNick == childNick) // 自己回复自己(父评论和子评论是否为同一人)，但顶层评论无论如何都不需要缩进
                return false
            
            if (hasParent) {
                if (parentNick == selfNick && selfNick != childNick) // 判断父评论和本评论是同一个人，但是子评论又是另外一个人（这是考虑到了连续评论的情况）
                    return false
            }

            return true
        },
        parseMarkdown: function (text: string) {
            return md2html(this.owner.smilieManager.renderAsHtml(text))
        },
        parseDatetime: function(timestamp: number, formal: boolean) {
            let mom = moment(timestamp * 1000)
            if(formal)
                return mom.format('YYYY-MM-DD HH:mm')
            return mom.calendar(null, {
                sameDay: '[今天] HH:mm',
                nextDay: '[明天] HH:mm',
                nextWeek: 'dddd',
                lastDay: '[昨天] HH:mm',
                lastWeek: 'YYYY-MM-DD HH:mm',
                sameElse: 'YYYY-MM-DD HH:mm'
            })
        }
        
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
        comment: {
            type: Object, // instance of CommentModel
            required: true
        },
        layer: {
            type: Number,
            required: false,
            default: 0
        }
    }
})
</script>

<style lang="scss">
    @import "../index.scss";

    .ac-comment-object {
        display: flex;
        flex-direction: column;

        .ac-comment-frame {
            display: flex;
            flex-direction: row;

            .ac-comment-avatar {
                width: 45px;
                height: 45px;
                flex-shrink: 0;
                border-radius: 50%;
                margin-right: 12px;
                border: 1px solid #f5f5f5;
                padding: 2px;

                &.ac-comment-avatar-smaller {
                    width: 35px;
                    height: 35px;
                }
            }

            .ac-comment-board {
                flex-grow: 1;
                width: 100%;
                max-width: calc(100% - 62px);

                .ac-comment-info {
                    .ac-nick {
                        @extend %april-comment-text;

                        transition: all 0.2s;
                        cursor: unset;
                        color: #1abc9c;
                        font-size: 1em !important;
                        font-weight: bold;

                        &.ac-nick-with-link {
                            cursor: pointer;

                            &:hover {
                                color: #ee9d25;
                            }
                        }
                    }
                    
                    .ac-badge-author {
                        color: #03acca;
                        background-color: #c3f3fb;
                        border-radius: 4px;
                        padding: 3px;
                        text-align: center;
                        vertical-align: baseline;
                        white-space: nowrap;
                        font-size: 12px;
                        font-weight: 600;
                        line-height: 1;
                        display: inline-block;
                    }

                    .ac-commenter-ua {
                        display: inline;
                        float: right;
                    }

                    .ac-browser, .ac-os, .ac-time {
                        @extend %april-comment-text;
                        font-size: 0.75rem !important;
                        color: #b3b3b3;
                    }

                    .ac-reply-button {
                        @extend %april-comment-text;
                        font-size: 14px;
                        // color: #aa8f70;
                        margin-left: 4px;
                        border-radius: 4px;
                        padding: 0px 2px;
                        cursor: pointer;

                        &:hover {
                            // color: #38985a;
                            // background-color: #fff684;
                            text-decoration: underline;
                        }
                    }
                }

                .ac-comment-content {
                    @extend %april-comment-text;
                    @extend %april-comment-markdown;
                    font-size: 16px;
                    max-height: 400px;
                    word-break: break-word;
                    overflow-x: auto;
                }
            }
        }

        .ac-replies {
            .ac-replies-indent {
                padding-left: 66px
            }
        }

        // &[layer="0"] .ac-replies {
        //     max-height: 400px;
        //     overflow: auto;
        // }
        
    }

    // 评论分割线
    .ac-all-comments > div:not(.anim-comment-list-leave-active)~.ac-comment-object:not(:first-child) > .ac-comment-frame > .ac-comment-board {
        border-top: 1px solid #e5e9ef;
        padding-top: 14px;
    }

    // 分割线下面的评论头像要有一些margin-top
    .ac-all-comments > div:not(.anim-comment-list-leave-active)~.ac-comment-object:not(:first-child) > .ac-comment-frame > .ac-comment-avatar {
        margin-top: 14px;
    }

</style>
