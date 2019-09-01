import Vue from 'vue';
import VueRouter from 'vue-router';
import store from 'state/store';

import 'components/Root';

import Login from 'components/Auth/Login';
import NotFound from 'components/NotFound';

import DashboardIndexPage from 'components/Dashboard/DashboardIndexPage';
import DashboardFactsPage from 'components/Dashboard/Facts/FactsPage';
import DashboardFactsAdd from 'components/Dashboard/Facts/FactsAdd';
import DashboardCategories from 'components/Dashboard/Categories/CategoriesPage';
import DashboardBackgrounds from 'components/Dashboard/Backgrounds/BackgroundsPage';

Vue.use(VueRouter);

function ensureAuthenticated (to, from, next) {
  if (!store.state.user) {
    return next('/');
  }
  next();
}

function ensureAnonymous (to, from, next) {
  if (store.state.user) {
    return next('/dashboard');
  }
  next();
}

function dashboardRedirect (to, from, next) {
  const route = store.state.user ? '/dashboard/home' : '/';
  return next(route);
}

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Login, beforeEnter: ensureAnonymous },
    { path: '/dashboard', component: null, beforeEnter: dashboardRedirect },
    { path: '/dashboard/home', component: DashboardIndexPage, beforeEnter: ensureAuthenticated },
    { path: '/dashboard/facts', component: DashboardFactsPage, beforeEnter: ensureAuthenticated },
    { path: '/dashboard/facts/new', component: DashboardFactsAdd, beforeEnter: ensureAuthenticated },
    { path: '/dashboard/categories', component: DashboardCategories, beforeEnter: ensureAuthenticated },
    { path: '/dashboard/backgrounds', component: DashboardBackgrounds, beforeEnter: ensureAuthenticated },
    { path: '*', component: NotFound }
  ]
});
