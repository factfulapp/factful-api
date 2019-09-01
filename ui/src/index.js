import buildVM from './buildVM';

const root = document.getElementById('root');

const user = JSON.parse(root.getAttribute('data-user'));
const context = JSON.parse(root.getAttribute('data-context'));

const vm = buildVM({
  user,
  context
});

vm.$mount('#root');
