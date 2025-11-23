const esbuild = require("esbuild");

const options = {
  entryPoints: ["src/content.ts", "src/popup.ts", "src/background.ts"],
  outdir: "dist",
  bundle: true,
  format: "iife",
  target: ["chrome110"],
  sourcemap: false,
  minify: false,
};

async function build() {
  // Watch mode
  if (process.argv.includes("--watch")) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    console.log("Watching for changes...");
  }

  // Normal build
  else {
    await esbuild.build(options);
    console.log("Build completed!");
  }
}

build();
