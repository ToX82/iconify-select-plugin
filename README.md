# Iconify Select Plugin

Iconify Select Plugin is a tiny JavaScript module that enhances icon selection experience.

It seamlessly integrates with the [iconify.design](https://iconify.design) library to provide a user-friendly interface for effortless searching and selecting icons.
The module is designed to be extremely easy to use. Simply load the plugin's JavaScript file, and it will dynamically load its stylesheet and the necessary Iconify library.

The plugin offers efficient searching through an API, making it simple to find and select the perfect icon for your project.

Feel free to adjust and customize the description to fit your specific preferences and style.

## Where can I find the demo?

Check it out [here](https://tox82.github.io/iconify-select-plugin/).

## How does it work?

To use Iconify Select Plugin, add the following script tag to your webpage:

    <script src="https://cdn.jsdelivr.net/npm/iconify-select-plugin@1/iconify-select-plugin.min.js"></script>

Next, add an HTML element that loads the iconify-select-plugin, specifying the data-icon-input and data-color-input parameters.
These parameters refer to the classes of two separate inputs where the module will write the icon code and color of your selection.

    <button class="iconify-open-dialog" data-icon-input="iconify-select" data-color-input="iconify-color">Find an icon!</button>
    <input type="text" class="iconify-select">
    <input type="text" class="iconify-color">