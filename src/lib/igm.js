export function createAstroPlugin(options = {}) {
  console.log(options);

  // Destructure and set default options
  const {
    prefix = 'custom',
    debug = false
  } = options;

  console.log({prefix, debug});

  return {
    // Unique name for the integration
    name: 'astro-custom-plugin',

    // Optional: Hook into Astro's build lifecycle
    hooks: {
      'astro:build:start': (args) => {
        console.log(args);
        if (debug) {
          args.logger.error('Starting build with custom plugin');
        }
      },

      'astro:config:setup': (args) => {
        console.log(args);
        if (debug) {
          args.logger.error('Done build with custom plugin');
          args.logger.error(Object.keys(args));
        }
      },

    }
  }  // return
};  //  function




export function exampleRemarkPlugin(options) {
  console.log('IGM');
  console.log8(options);
  fs.writeFile('igm.txt', 'IGM'+JSON.stringify(options), err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
  // All remark and rehype plugins return a separate function
  return function (tree, file) {
    file.data.astro.frontmatter.customProperty = 'Generated property';
  }
}

export function remarkRehype(destination, options) {
  if (destination && 'run' in destination) {
    /**
     * @type {TransformBridge}
     */
    return async function (tree, file) {
      // Cast because root in -> root out.
      const hastTree = /** @type {HastRoot} */ (
        toHast(tree, {file, ...options})
      )
      await destination.run(hastTree, file)
    }
  }

  /**
   * @type {TransformMutate}
   */
  return function (tree, file) {
    // Cast because root in -> root out.
    // To do: in the future, disallow ` || options` fallback.
    // With `unified-engine`, `destination` can be `undefined` but
    // `options` will be the file set.
    // We should not pass that as `options`.
    return /** @type {HastRoot} */ (
      toHast(tree, {file, ...(destination || options)})
    )
  }
}

export function rehypeRaw(options) {
  /**
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {Root}
   *   New tree.
   */
  return function (tree, file) {
    // Assume root in -> root out.
    console.log(tree);
    
    return tree
  }
}

//import {visit} from 'unist-util-visit'

/** @type {import('unified').Plugin<[], import('hast').Root>} */
export function rehypeCheck() {
  return function transformer(tree,file){
    console.log("   ---   rehypeCheck   ---")
    console.log(`starting ---------------- ${file.history[0]}`)
    /*visit(tree, (node) => {
        console.log(node)
    })*/
    console.log(`finish ----------------`)
  }
}
