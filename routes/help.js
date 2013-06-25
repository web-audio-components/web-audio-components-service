module.exports = {
  message : 'Welcome to the Web Audio Components Service',
  routes : [
    {
      verb: 'GET',
      route: '/components',
      description: 'Returns an array of all audio components'
    },
    {
      verb: 'GET',
      route: '/components?q=QUERY',
      description: 'Returns an array of components that match QUERY'
    },
    {
      verb: 'GET',
      route: '/components/:owner/:repo',
      description: 'Returns the component that matches the owner/repo name'
    },
    {
      verb: 'GET',
      route: '/components/:owner/:repo/script.js',
      description: 'Returns the corresponding component\'s script'
    },
    {
      verb: 'GET',
      route: '/components/:owner/:repo/build.js',
      description: 'Returns the corresponding component\'s built script'
    }
  ]
};
