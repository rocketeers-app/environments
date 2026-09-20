export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('index.html');

    return { dir: { input: '.', output: '_site' } };
}
