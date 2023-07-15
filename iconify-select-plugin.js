document.addEventListener('DOMContentLoaded', function() {
  addIconifyLibrary();
  loadStylesheet();
  attachIconifySelectEventListeners();

  /**
   * Attaches event listeners to the iconify select inputs.
   *
   * @return {void}
   */
  function attachIconifySelectEventListeners() {
    const iconifySelectInputs = document.querySelectorAll('.iconify-open-dialog');

    iconifySelectInputs.forEach(input => {
      input.addEventListener('click', () => {
        openIconifyModal(input.dataset.iconInput, input.dataset.colorInput);
      });
    });
  }

  /**
   * Loads the stylesheet by dynamically creating a link element in the head of the document.
   *
   * @return {void} 
   */
  async function loadStylesheet() {
    const scriptPath = getScriptPath();
    const stylesheetName = scriptPath.replace('.js', '.css').split('?')[0];
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = stylesheetName;
    document.head.appendChild(link);
  }

  /**
   * Returns the path of the script file that includes the 'iconify-select-plugin'.
   *
   * @return {string} The path of the script file that includes the 'iconify-select-plugin', or undefined if not found.
   */
  function getScriptPath() {
    const scripts = document.getElementsByTagName('script');

    for (let i = 0; i < scripts.length; i++) {
      const path = scripts[i].src;
      if (path && path.includes('iconify-select-plugin')) {
        return path;
      }
    }
  }

  /**
   * Adds the Iconify library if it is not already loaded.
   *
   * @return {undefined}
   */
  async function addIconifyLibrary() {
    if (!window.iconify) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@iconify/iconify@2/dist/iconify.min.js';
        script.defer = true;

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
      });
    }
  }

  /**
   * Opens the Iconify modal with the specified icon input and color input.
   *
   * @param {string} iconInput - The icon input to be displayed in the modal.
   * @param {string} colorInput - The color input to be displayed in the modal.
   */
  function openIconifyModal(iconInput, colorInput) {
    const modalWrapper = document.createElement('div');
    const modalHtml = `
      <dialog class="iconify-modal" data-icon_input="${iconInput}" data-color_input="${colorInput}">
        <form method="dialog">
          <button class="iconify-close-button" type="button">X</button>
          <input type="text" class="iconify-search-input" placeholder="E.g. 'error'">
          <input type="color" class="iconify-color-input" value="#070707">
          <button type="submit" class="iconify-search-button">🔍</button>
        </form>
        <div class="iconify-modal-icons"></div>
      </dialog>
    `;
    modalWrapper.innerHTML = modalHtml;

    const dialog = modalWrapper.querySelector('.iconify-modal');
    const closeButton = modalWrapper.querySelector('.iconify-close-button');
    const form = modalWrapper.querySelector('form');
    const searchInput = modalWrapper.querySelector('.iconify-search-input');
    const searchColor = modalWrapper.querySelector('.iconify-color-input');

    closeButton.addEventListener('click', () => {
      dialog.close();
      dialog.remove();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      searchIcons(searchInput.value, searchColor.value);
    });

    document.body.appendChild(modalWrapper);

    dialog.showModal();
  }

  /**
   * Retrieves icons from the API based on a search query and populates the modal with the icons.
   *
   * @param {string} query - The search query for icons.
   * @param {string} color - The color of the icons.
   * @return {void} 
   */
  async function searchIcons(query, color) {
    const apiUrl = `https://api.iconify.design/search?query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(apiUrl);
      const { icons } = await response.json();

      populateModalWithIcons(icons, color);
    } catch (error) {
      console.error('Error retrieving icons:', error);
    }
  }

  /**
   * Populates the modal with icons.
   *
   * @param {Array} icons - The array of icons to populate the modal with.
   * @param {string} color - The color of the icons.
   */
  function populateModalWithIcons(icons, color) {
    const iconsContainer = document.querySelector('.iconify-modal-icons');
    iconsContainer.innerHTML = '';

    icons.forEach(icon => {
      const iconElement = document.createElement('div');
      iconElement.classList.add('iconify-modal-icon');

      iconElement.innerHTML = `
        <span class="iconify" data-width="30" data-icon="${icon}" data-inline="false" style="color: ${color};"></span>
        <span class="iconify-name">${icon}</span>
      `;
      iconElement.addEventListener('click', () => {
        selectIcon(icon, color);
      });

      iconsContainer.appendChild(iconElement);
    });
  }

  /**
   * Selects an icon and sets its code and color.
   *
   * @param {string} iconCode - The code of the icon to select.
   * @param {string} colorCode - The color code to set for the icon.
   */
  function selectIcon(iconCode, colorCode) {
    const dialog = document.querySelector('.iconify-modal');
    const iconifySelectInput = document.querySelector(`.${dialog.dataset.icon_input}`);
    const iconifyColorInput = document.querySelector(`.${dialog.dataset.color_input}`);

    iconifySelectInput.value = iconCode;
    iconifyColorInput.value = rgbToHex(colorCode);

    dialog?.close();
    dialog?.remove();
  }

  /**
   * Converts an RGB color value to its corresponding hexadecimal representation.
   *
   * @param {string} rgbColor - The RGB color value to convert.
   * @return {string} The hexadecimal representation of the RGB color value.
   */
  function rgbToHex(rgbColor) {
    const match = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
      const [, r, g, b] = match;
      const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
      return `#${hex.toUpperCase}`;
    }

    return rgbColor;
  }
});
