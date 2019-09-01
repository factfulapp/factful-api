<template lang="pug">
  .container(:class='{ "nav-open": navOpen }')
    header
      .header-container
        .left
          router-link(to='/').logo Factful App
        .right
          nav.navigation(:class='{ open: navOpen }')
            router-link(to='/dashboard/facts') Facts
            router-link(to='/dashboard/categories') Categories
            router-link(to='/dashboard/backgrounds') Backgrounds
            a(href='javascript://', @click='handleLogout') Logout
      .nav-toggler
        a(
          href='javascript://'
          @click='handleTogglerClick'
          :class='togglerClass'
        )
          i.fa.fa-bars
    section.page.mid
      slot
    the-footer
</template>

<script>
import TheFooter from 'components/TheFooter';
import Toaster from 'lib/toaster';

export default {
  name: 'app-template',
  components: {
    'the-footer': TheFooter
  },
  data: function () {
    return {
      navOpen: false
    };
  },
  computed: {
    togglerClass: function () {
      return {
        toggled: this.navOpen
      };
    }
  },
  methods: {
    handleLogout: function () {
      fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin'
      })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            Toaster.create('info', 'You have been logged out!', 'Yay!');
            this.$store.commit('setUser', null);
            this.$router.push('/');
          } else {
            Toaster.create('danger', 'Something bad happened');
          }
        });
    },

    handleTogglerClick: function () {
      this.navOpen = !this.navOpen;
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/base';
  @import 'src/styles/colors';

  header {
    background: $blue;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    line-height: 1;

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;

      a {
        color: #fff;
      }

      .left {
        padding: 10px 25px;
        font-size: 26px;
        font-weight: 700;
      }

      .right {
        .navigation {
          margin-right: 20px;

          a {
            position: relative;
            display: inline-block;
            padding: 25px 20px;
            margin-right: 5px;

            &:last-child {
              margin-right: 0;
            }

            &:before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 0;
              background: #fff;
              transition: height 250ms ease-in-out;
            }

            &:hover, &.router-link-exact-active {
              &:before {
                height: 4px;
              }
            }
          }
        }
      }
    }

    .nav-toggler {
      position: absolute;
      top: 0;
      right: 0;
      display: none;

      a {
        display: block;
        padding: 15px 20px;
        color: #fff;
        font-size: 25px;

        .nav-open > & {
          background: rgba(0, 0, 0, 0.3);
        }
      }
    }

    @media only screen and ( max-width: 660px ) {
      .header-container {
        display: block;

        .left {
          padding: 15px 25px;
          padding-top: 14px;
        }

        .right {
          .navigation {
            display: none;
            margin-right: 0;

            &.open {
              display: block;
            }

            a {
              display: block;
              padding: 12px 25px;
              margin-right: 0;

              &:before {
                display: none;
              }

              &:hover, &.router-link-exact-active {
                background: rgba(0, 0, 0, 0.3);
              }
            }
          }
        }
      }

      .nav-toggler {
        display: block;
      }
    }
  }
</style>
