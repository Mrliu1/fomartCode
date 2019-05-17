export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/account/settings/changepwd' },
      // 生产检测服务
      {
        path: '/manufacture',
        name: 'manufacture',
        icon: 'table',
        routes: [
          {
            path: '/manufacture/ExperimentService',
            name: 'ExperimentService',
            icon: 'table',
            routes: [
              {
                path: '/manufacture/ExperimentService/ProcessMethod',
                name: 'ProcessMethod',
                // component: './Process/home',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/manufacture/ExperimentService/ProcessMethod',
                    redirect:
                      '/manufacture/ExperimentService/ProcessMethod/ProcessMethodHome',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/ProcessMethod/ProcessMethodDetail/:id',
                    component:
                      './ExperimentService/ProcessMethod/ProcessMethodDetail',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/ProcessMethod/ProcessMethodAdd',
                    component:
                      './ExperimentService/ProcessMethod/ProcessMethodAdd',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/ProcessMethod/ProcessMethodHome',
                    component:
                      './ExperimentService/ProcessMethod/ProcessMethodHome',
                  },
                ],
              },
              {
                path: '/manufacture/ExperimentService/Process',
                name: 'Process',
                component: './ExperimentService/Process/ProcessHome',
              },
              {
                path: '/manufacture/ExperimentService/Route',
                name: 'Route',
                hideChildrenInMenu: true,
                // component: './ExperimentService/Route/RouteHome',
                routes: [
                  {
                    path: '/manufacture/ExperimentService/Route',
                    redirect:
                      '/manufacture/ExperimentService/Route/RouteHome',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/Route/RouteHome',
                    component:
                      './ExperimentService/Route/RouteHome',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/Route/RouteAdd',
                    component: './ExperimentService/Route/RouteAdd',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/Route/RouteDetail/:id',
                    component:
                      './ExperimentService/Route/RouteDetail',
                  },
                ],
              },
              {
                path: '/manufacture/ExperimentService/Experiment',
                name: 'Experiment',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/manufacture/ExperimentService/Experiment',
                    redirect:
                      '/manufacture/ExperimentService/Experiment/ExperimentHome',
                  },
                  {
                    path: '/manufacture/ExperimentService/Experiment/ExperimentHome',
                    component: './ExperimentService/Experiment/ExperimentHome',
                  },
                  {
                    path: '/manufacture/ExperimentService/Experiment/ExperimentAdd',
                    component: './ExperimentService/Experiment/ExperimentAdd',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/Experiment/ExperimentDetail/:id',
                    component: './ExperimentService/Experiment/ExperimentDetail',
                  },
                ],
              },
              {
                path: '/manufacture/ExperimentService/ExperimentPacket',
                name: 'ExperimentPacket',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/manufacture/ExperimentService/ExperimentPacket',
                    redirect:
                      '/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketHome',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketHome',
                    component: './ExperimentService/ExperimentPacket/ExperimentPacketHome',
                  },
                  {
                    path:
                      '/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketAdd',
                    component: './ExperimentService/ExperimentPacket/ExperimentPacketAdd',
                  },
                  {
                    path: '/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketDetail/:id',
                    component: './ExperimentService/ExperimentPacket/ExperimentPacketDetail',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        hideInMenu: true,
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/changepwd',
              },
              {
                path: '/account/settings/changepwd',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
          {},
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        hideInMenu: true,
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        path: '/:post',
        component: './View/home',
      },
      {
        path: '/:post/:id',
        component: './View/home',
      },
      {
        path: '/:post/:id/:child',
        component: './View/home',
      },
      {
        component: '404',
      },
    ],
  },
];
