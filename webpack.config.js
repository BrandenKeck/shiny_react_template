module.exports = {

  output: {
    // Serve the bundle from /static
    publicPath: '/static/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  externals: {
    'shiny': 'window.Shiny'
  }

}
