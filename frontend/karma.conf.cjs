// Configuración de Karma: corre las pruebas de la carpeta test/ con Jasmine
const coverage = process.env.COVERAGE === "true";

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [
      { pattern: "test/**/*.spec.js", watched: false },
      { pattern: "test/**/*.spec.jsx", watched: false },
    ],
    preprocessors: {
      "test/**/*.spec.js": ["webpack"],
      "test/**/*.spec.jsx": ["webpack"],
    },

    // Webpack + Babel convierten el JSX para que el navegador lo entienda
    webpack: {
      mode: "development",
      devtool: false,
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            // El proyecto es "type: module": permite importar sin escribir .js
            resolve: { fullySpecified: false },
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // Solo al pedir cobertura, marca el código de src/ para medirlo
                plugins: coverage ? [["istanbul", { include: ["src/**"] }]] : [],
              },
            },
          },
        ],
      },
    },

    reporters: coverage ? ["progress", "coverage"] : ["progress"],
    coverageReporter: {
      dir: "coverage",
      reporters: [{ type: "html" }, { type: "text-summary" }],
    },

    browsers: ["ChromeHeadless"],
    singleRun: true,
  });
};
