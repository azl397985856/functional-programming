module.exports = {
  devtool: "source-map",
  mode: "development",
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      { test: /\.js|jsx$/, use: ["babel-loader?presets[]=react"] },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
