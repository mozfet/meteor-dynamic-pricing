Package.describe({
  name: 'mozfet:meteor-dynamic-pricing',
  version: '0.0.1',
  summary: 'Manage discounts and qoute prices to avoid client side tampering. Designed for mozfet:payments, but can also be used with other payment strategies.',
  git: 'https://github.com/mozfet/meteor--dynamic-pricing.git',
  documentation: 'README.md'
});

Npm.depends({
  'moment': '2.22.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.0.1');

  // both
  api.use([
    'ecmascript',
    'mongo'
  ]);

  // server
  api.use([
    'mozfet:meteor-logs@0.3.3',
    'mozfet:materialize-payments@1.0.4'
  ], 'server');
  api.mainModule('./server/credits.js', 'server');

  // client
  api.use([
    'templating@1.3.2',
    'ui@1.0.13'
  ], 'client')
  api.mainModule('./client/credits.js', 'client', {lazy: true});
});

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('mozfet:subscriptions');
//   api.mainModule('subscriptions-tests.js');
// });
