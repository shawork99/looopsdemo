import { Routes } from '@angular/router';
import { NgModel } from '@angular/forms';
import {ComponentLogin}from './component-login/component-login'
import { ComponentSignup } from './component-signup/component-signup';
import { ComponentProfile } from './component-profile/component-profile';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AfterLogin } from './services/after-login';
import { BeforeLogin } from './services/before-login';

import { Create } from './component-profile/create/create';
import { Edit } from './component-profile/edit/edit';
import { Show } from './component-profile/show/show';

export const routes: Routes = [
    {
        path: 'login',
        component : ComponentLogin,
        canActivate : [BeforeLogin]
    },

     {
        path: 'signup',
        component : ComponentSignup,
        canActivate : [BeforeLogin]
    },


     {
        path: 'profile',
        component : ComponentProfile,
        canActivate : [AfterLogin]
    },

    {
        path: 'profile/create',
        component : Create,
        canActivate : [AfterLogin]
    },

    {
        path: 'profile/:postId/edit',
        component : Edit,
        canActivate : [AfterLogin]
    },

      {
        path: 'profile/:postId',
        component : Show,
        canActivate : [AfterLogin]
    },



];
