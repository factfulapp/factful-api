import Vue from 'vue';
import VTooltip from 'v-tooltip';
import VModal from 'vue-js-modal';

import buildRaven from 'lib/buildRaven';

import router from './router';

import 'components/Root';
import 'components/helpers/ToastContainer';
import 'components/LoadingSpinner';
import 'components/helpers/ZeroDataState';
import 'components/helpers/TextWithSearchHighlight';

import store from 'state/store';

export default function (opts) {
  const user = opts.user;

  store.commit('setUser', user);

  buildRaven({
    ...opts.context.sentry,
    user
  });

  Vue.use(VTooltip);
  Vue.use(VModal, { dialog: true });

  return new Vue({
    store,
    router
  });
}
