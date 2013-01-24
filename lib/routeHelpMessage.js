module.exports = {
  message : 'Welcome to the Web Audio Components Service',
  routes : [
    {
      route: 'GET /components',
      description: 'Returns an array of all audio components'
    },
    {
      route: 'GET /components?q=QUERY',
      description: 'Returns an array of components that match QUERY'
    },
    {
      route: 'GET /components/:owner/:repo',
      description: 'Returns the component that matches the owner/repo name'
    },
    {
      route: 'GET /components/:owner/:repo/script.js',
      description: 'Returns the corresponding component\'s script'
    },
    {
      route: 'GET /components/:owner/:repo/build.js',
      description: 'Returns the corresponding component\'s built script'
    }
  ]
};
