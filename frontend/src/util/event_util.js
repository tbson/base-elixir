export default class EventUtil {
    static get event() {
        return {
            /**
             * listen.
             *
             * @param {string} eventName
             * @param {function} callback
             * @returns {void}
             */
            listen: (eventName, callback) => {
                window.document.addEventListener(eventName, callback, false);
            },

            /**
             * remove.
             *
             * @param {string} eventName
             * @param {function} callback
             * @returns {void}
             */
            remove: (eventName, callback) => {
                window.document.removeEventListener(eventName, callback, false);
            },

            /**
             * dispatch.
             *
             * @param {string} eventName
             * @param {Object | boolean | string | number} detail
             * @returns {void}
             */
            dispatch: (eventName, detail) => {
                const event = new CustomEvent(eventName, { detail });
                window.document.dispatchEvent(event);
            }
        };
    }

    /**
     * toggleGlobalLoading.
     *
     * @param {boolean} spinning
     * @returns {void}
     */
    static toggleGlobalLoading(spinning = true) {
        EventUtil.event.dispatch("TOGGLE_SPINNER", spinning);
    }
}
