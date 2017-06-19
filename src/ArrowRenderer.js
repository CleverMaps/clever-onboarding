import style from "./Onboard.css";
import * as d3 from "d3";
import PositionResolver from "./PositionResolver";

/**
 * @class
 * @param {Object} options
 */
export default class ArrowRenderer {
	constructor(options, model) {
		/**
		 * @private 
		 * Onboard options
		 */
		this._options = options;

		/**
		 * @private 
		 * DOM container of this widget
		 */
		this._containerEl = null;	

		/**
		 * @private
		 * true if Onboard has been rendered
		 */
		this._rendered = false;

		this._model = model;
		this._onStartBinding = this._model.on("start", this._onStart.bind(this));
		this._onStepBinding = this._model.on("step", this._onStep.bind(this));
		this._onStopBinding = this._model.on("stop", this._onStop.bind(this));
		this._positionResolver = new PositionResolver();
	}

	getArrowBox(){
		return this._arrowBox;
	}

	/**
	 * @public
	 * Returns whether Onboard has been rendered or not
	 * @returns {boolean} true if Onboard has been rendered
	 */
	isRendered() {
		return this._rendered;
	}

	/**
	 * @public
	 * Render logic of this widget
	 * @param {String|DOMElement} selector selector or DOM element 
	 * @returns {Onboard} returns this widget instance
	 */
	render(selector) {
		// get container element using selector or given element
		this._containerEl = d3.select(selector || document.body);

		this._renderArrow();
		this._rendered = true;

		return this;
	}

	_renderArrow(){
		this._arrowEl = this._containerEl.append("div")
			.attr("class", style["arrow"]+" "+style["arrow-bottom-right"])

		this._arrowBox = this._arrowEl.node().getBoundingClientRect();
	}

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStart() {
		this._arrowEl.style("display", "block");
		return this;
	}	

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStep(step) {
		var firstNode = step.selection.nodes()[0];
		var targetBox = firstNode.getBoundingClientRect();
		var arrowPosition = this._positionResolver.getArrowPosition(targetBox, this._arrowBox);

		this._arrowEl.style("left", arrowPosition.left+"px");
		this._arrowEl.style("top", arrowPosition.top+"px");
		this._arrowEl.attr("class", style["arrow"]+" "+style["arrow-"+arrowPosition.position]);

		return this;
	}	

	/**
	 * @public
	 * @returns {MaskRenderer} 
	 */
	_onStop() {
		this._arrowEl.style("display", "none");
		return this;
	}	

	/**
	 * @public
	 * Destorys Onboard UI  
	 */
	destroy() {
		this._onStartBinding.destroy();
		this._onStepBinding.destroy();
		this._onStopBinding.destroy();

		if (this._arrowEl){
			this._arrowEl.remove();
		}

		return this;
	}
}