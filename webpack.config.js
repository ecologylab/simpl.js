module.exports = {
  entry: "./build/simpl.js",
  devtool: "source-maps",
  output: {
    path: __dirname + "/build/",
    filename: "simpl.bundle.js",
    libraryTarget: "umd",
    library: "simpl"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          "source-map-loader"
        ],
        enforce: "pre"
      }
    ]
  }
}
