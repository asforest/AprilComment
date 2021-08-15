<template>
    <div class="ac-profile" v-show="isLoggedIn()">
        <div class="ac-profile-log-out" title="退出登录" 
            v-on:click="onLogout" 
        >
            <svg class="vicon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M568.569 512l170.267-170.267c15.556-15.556 15.556-41.012 0-56.569s-41.012-15.556-56.569 0L512 455.431 341.733 285.165c-15.556-15.556-41.012-15.556-56.569 0s-15.556 41.012 0 56.569L455.431 512 285.165 682.267c-15.556 15.556-15.556 41.012 0 56.569 15.556 15.556 41.012 15.556 56.569 0L512 568.569l170.267 170.267c15.556 15.556 41.012 15.556 56.569 0 15.556-15.556 15.556-41.012 0-56.569L568.569 512z"></path></svg>
        </div>
        <img class="ac-profile-avatar" title="点击进入管理页面"
            v-bind:src="avatar"
            v-bind:alter="avatar"
            v-on:click="onClick"
        />
        <div class="ac-profile-info">
            <span class="ac-profile-info-text">{{nick}}</span>
            <span class="ac-profile-info-text" style="font-size: 12px;">{{type}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AprilComment from '..';
import LoginInfo from '../interface/LoginInfo'
import { getAvatarByMail } from '../utils/Utils';

export default Vue.extend({
    name: 'profile',
    mounted: function() {
        try {
            this.userinfo = JSON.parse((localStorage.getItem('WALINE_USER') || sessionStorage.getItem('WALINE_USER')) as string) || {};
        } catch(e) {}
    },
    data: () => ({
        userinfo: {} as LoginInfo
    }),
    computed: {
        avatar: function() {
            return this.isLoggedIn()? getAvatarByMail(this.owner.opt, this.userinfo.mailMd5):''
        },
        nick: function() {
            if(this.isLoggedIn())
                return this.userinfo['display_name']
            return 'display_name'
        },
        type: function() {
            if(this.isLoggedIn())
                return this.userinfo['type']
            return 'type'
        }
    },
    methods: {
        isLoggedIn: function() {
            return 'token' in this.userinfo && this.userinfo['token']
        },
        onClick: function() {
            if(!this.isLoggedIn())
                this.onLogin()
            else
                this.onProfile()
        },
        onProfile: function() {
            const lang = 'zh-CN'
            const width = 800
            const height = 800
            const left = (window.innerWidth - width) / 2
            const top = (window.innerHeight - height) / 2
            const handler = window.open(this.owner.opt.api + '/ui/profile?lng=' + encodeURIComponent(lang), '_blank', `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`) as Window
            handler.postMessage({type: 'TOKEN', data: this.userinfo.token}, '*');
            window.addEventListener('message', ({data}) => {
                if(!data || data.type !== 'profile')
                    return
                const userInfo = {...this.userinfo, ...data};
                this.userinfo = userInfo
                [localStorage as any, sessionStorage as any].filter((store: any) => store.getItem('WALINE_USER')).forEach((store: any) => 
                    store.setItem('WALINE_USER', JSON.stringify(userInfo))
                )
            })
        },
        onLogin: function() {
            const lang = 'zh-CN'
            const width = 450
            const height = 450
            const left = (window.innerWidth - width) / 2
            const top = (window.innerHeight - height) / 2
            const handler = window.open(this.owner.opt.api + '/ui/login?lng=' + encodeURIComponent(lang), '_blank', `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`) as Window
            handler.postMessage({type: 'TOKEN', data: null}, '*')
            window.addEventListener('message', ({data}) => {
                if(!data || data.type !== 'userInfo')
                    return
                if(data.data.token) {
                    handler.close()
                    this.userinfo = data.data;
                    (data.data.remember ? localStorage : sessionStorage).setItem('WALINE_USER', JSON.stringify(data.data))
                }
            })
        },
        onLogout: function() {
            this.userinfo = {}
            localStorage.setItem('WALINE_USER', '');
            sessionStorage.setItem('WALINE_USER', '');
        }
    },
    props: {
        owner: {
            type: AprilComment,
            required: true
        }
    }
})
</script>

<style lang="scss">
    .ac-profile {
        position: relative;
        display: flex;
        margin: 0px 8px;
        
        .ac-profile-log-out {
            position: absolute;
            cursor: pointer;
            left: 35px;
            top: 5;
            background: #FFF;
            line-height: 0;
            font-size: 14px;
            border: 1px solid #f5f5f5;
            border-radius: 50%;
        }

        .ac-profile-avatar {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid #f5f5f5;
            padding: 2px;
            margin-right: 12px;
        }

        .ac-profile-info {
            font-family: var(--font-common);
            font-weight: 500;
            text-decoration: none;
            cursor: unset;
            color: #1abc9c;
            font-size: 16px;
            display: inline-flex;
            flex-direction: column;
        }

    }
    

</style>