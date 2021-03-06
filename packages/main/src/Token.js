import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import litRender from "@ui5/webcomponents-base/dist/renderer/LitRenderer.js";
import { getTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import {
	isBackSpace,
	isEnter,
	isSpace,
	isDelete,
} from "@ui5/webcomponents-base/dist/Keys.js";
import "@ui5/webcomponents-icons/dist/icons/decline.js";
import "@ui5/webcomponents-icons/dist/icons/sys-cancel.js";
import { fetchI18nBundle, getI18nBundle } from "@ui5/webcomponents-base/dist/i18nBundle.js";
import { TOKEN_ARIA_DELETABLE } from "./generated/i18n/i18n-defaults.js";

import Icon from "./Icon.js";
import TokenTemplate from "./generated/templates/TokenTemplate.lit.js";

// Styles
import styles from "./generated/themes/Token.css.js";

/**
 * @public
 */
const metadata = {
	tag: "ui5-token",
	languageAware: true,
	properties: /** @lends sap.ui.webcomponents.main.Token.prototype */ {

		/**
		 * Defines the text of the token.
		 *
		 * @type {string}
		 * @defaultvalue ""
		 * @public
		 */
		text: { type: String },

		/**
		 * Defines whether the <code>ui5-token</code> is read-only.
		 * <br><br>
		 * <b>Note:</b> A read-only <code>ui5-token</code> can not be deleted or selected,
		 * but still provides visual feedback upon user interaction.
		 *
		 * @type {boolean}
		 * @public
		 */
		readonly: { type: Boolean },

		/**
		 * Set by the tokenizer when a token is in the "more" area (overflowing)
		 * @type {boolean}
		 * @private
		 */
		overflows: { type: Boolean },
	},

	events: /** @lends sap.ui.webcomponents.main.Token.prototype */ {

		/**
		 * Fired when the backspace, delete or close icon of the token is pressed
		 *
		 * @event
		 * @param {boolean} backSpace indicates whether token is deleted by backspace key
		 * @param {boolean} delete indicates whether token is deleted by delete key
		 * @private
		 */
		"delete": {
			detail: {
				"backSpace": { type: Boolean },
				"delete": { type: Boolean },
			},
		},
	},
};

/**
 * @class
 *
 * <h3 class="comment-api-title">Overview</h3>
 *
 * Tokens are small items of information (similar to tags) that mainly serve to visualize previously selected items.
 *
 * <h3>ES6 Module Import</h3>
 *
 * <code>import "@ui5/webcomponents/dist/Token.js";</code>
 * @constructor
 * @author SAP SE
 * @alias sap.ui.webcomponents.main.Token
 * @extends sap.ui.webcomponents.base.UI5Element
 * @tagname ui5-token
 * @since 1.0.0-rc.9
 * @public
 */
class Token extends UI5Element {
	static get metadata() {
		return metadata;
	}

	static get render() {
		return litRender;
	}

	static get template() {
		return TokenTemplate;
	}

	static get styles() {
		return styles;
	}

	constructor() {
		super();

		this.i18nBundle = getI18nBundle("@ui5/webcomponents");
	}

	_select() {
		this.fireEvent("select");
		this.selected = true;
	 }

	 _delete() {
		this.fireEvent("delete");
	 }

	 _keydown(event) {
		const isBS = isBackSpace(event);
		const isD = isDelete(event);

		if (!this.readonly && (isBS || isD)) {
			event.preventDefault();

			this.fireEvent("delete", {
				backSpace: isBS,
				"delete": isD,
			});
		}

		if (isEnter(event) || isSpace(event)) {
			this.fireEvent("select", {});
			this.selected = true;
		}
	}

	get tokenDeletableText() {
		return this.i18nBundle.getText(TOKEN_ARIA_DELETABLE);
	}

	get iconURI() {
		return getTheme() === "sap_fiori_3" ? "decline" : "sys-cancel";
	}

	static get dependencies() {
		return [Icon];
	}

	static async onDefine() {
		await fetchI18nBundle("@ui5/webcomponents");
	}
}

Token.define();

export default Token;
