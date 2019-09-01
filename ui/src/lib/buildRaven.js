import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import pick from 'lodash.pick';

let raven = null;

export default function (opts) {
  if (raven) {
    return raven;
  }

  const publicToken = opts.public;

  if (publicToken) {
    const dsn = 'https://fbb6ffbb642841f9bd1e5585772d71c5@sentry.io/1255926';

    raven = Raven.config(dsn);
    raven.addPlugin(RavenVue, Vue);
    raven.install();

    if (opts.user) {
      Raven.setUserContext(pick(opts.user, 'id', 'username', 'name'));
    }
  }
  return raven;
};
